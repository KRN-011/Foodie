import React, { useEffect, useState } from 'react';
import WelcomeBanner from '../components/WelcomeBanner';
import ProductSummary from '../components/ProductSummary';
import AdminList from '../components/AdminList';
import RestaurantList from '../components/RestaurantList';
import AuditLogList from '../components/AuditLogList';
import OrderList from '../components/OrderList';
import {
    getAllRestaurants,
    getProductsByRestaurantId,
    getOrdersByRestaurantId,
    getAllAdmins,
    getAllAuditLogs,
} from '../services/apiService';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/userContext';

const Dashboard = () => {
    const { user, isAdmin, isRestaurant, isLoading } = useUser();
    const [products, setProducts] = useState<any[]>([]);
    const [admins, setAdmins] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    console.log(user);
    

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const fetchData = async () => {
            try {
                if (isRestaurant) {
                    const [productsRes, ordersRes] = await Promise.all([
                        getProductsByRestaurantId(user.id),
                        getOrdersByRestaurantId(user.id),
                    ]);
                    setProducts(productsRes.data || []);
                    setOrders(ordersRes.data || []);
                }
                if (isAdmin) {
                    const [adminsRes, restaurantsRes, auditLogsRes] = await Promise.all([
                        getAllAdmins(),
                        getAllRestaurants(),
                        getAllAuditLogs(),
                    ]);
                    setAdmins(adminsRes.data.data || []);
                    setRestaurants(restaurantsRes.data.data || []);
                    setAuditLogs(auditLogsRes.data.data || []);
                }
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isAdmin, isRestaurant]);

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-[var(--color-light)]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[var(--color-tertiary)] text-xl font-bold font-saira"
                >
                    Loading Dashboard...
                </motion.div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="w-full h-screen overflow-y-auto custom-scrollbar bg-[var(--color-light)] p-2 md:p-6 flex flex-col gap-4">
            <WelcomeBanner user={{ name: user.restaurantProfile?.name || user.email, role: user.role }} />
            {isRestaurant && <ProductSummary products={products} />}
            {isAdmin && (
                <>
                    <ProductSummary products={restaurants.flatMap(r => r.products || [])} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminList admins={admins} />
                        <RestaurantList restaurants={restaurants} />
                    </div>
                    <AuditLogList auditLogs={auditLogs} />
                </>
            )}
            {isRestaurant && <OrderList orders={orders} />}
        </div>
    );
};

export default Dashboard;
