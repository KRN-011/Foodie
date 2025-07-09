import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { useUser } from '../contexts/userContext';
import { getOrdersByUserId, getAllAddressesIncludeDeleted } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { socket } from '../lib/socket';
import LiveOrdersListing from '../components/Orders/LiveOrdersListing';
import AllOrdersListing from '../components/Orders/AllOrdersListing';
import { useOrder } from '../contexts/orderContext';



const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    PAID: 'Paid',
    FAILED: 'Failed',
};

const Orders = () => {
    const { isAuthenticated, isLoading } = useUser();
    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState<{ open: boolean; order: any | null }>({ open: false, order: null });
    const [filters, setFilters] = useState({ from: '', to: '', status: '', addressId: '' });
    const [pendingFilters, setPendingFilters] = useState(filters);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { refreshOrders } = useOrder();
    
    // socket listeners
    useEffect(() => {
        socket.on("orderStatusUpdated", (data: any) => {
            console.log("Order status updated: ", data);
            setOrders(prevOrders => prevOrders.map(order => order.orderId === data.orderId ? { ...order, status: data.newStatus } : order));
            refreshOrders();
        });

        // cleanup
        return () => {
            socket.off("orderStatusUpdated");
        }
    }, [])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ordersRes, addressesRes] = await Promise.all([
                    getOrdersByUserId(),
                    getAllAddressesIncludeDeleted(),
                ]);
                setOrders(ordersRes.orders || []);
                setAddresses(addressesRes.addresses || []);
            } catch {
                setOrders([]);
                setAddresses([]);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated) fetchData();
    }, [isAuthenticated, isLoading, navigate]);

    // Filtering logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            let pass = true;
            if (filters.from) pass = pass && new Date(order.createdAt) >= new Date(filters.from);
            if (filters.to) pass = pass && new Date(order.createdAt) <= new Date(filters.to + 'T23:59:59');
            if (filters.status) pass = pass && order.status === filters.status;
            if (filters.addressId) pass = pass && String(order.addressId) === String(filters.addressId);
            return pass;
        });
    }, [orders, filters]);

    // Address lookup
    const addressMap = useMemo(() => {
        const map: Record<string, any> = {};
        addresses.forEach(addr => { map[addr.id] = addr; });
        return map;
    }, [addresses]);

    // Filter modal handlers
    const openFilter = () => { setPendingFilters(filters); setFilterOpen(true); };
    const closeFilter = () => setFilterOpen(false);
    const saveFilters = () => { setFilters(pendingFilters); setFilterOpen(false); };
    const resetFilters = () => { setPendingFilters({ from: '', to: '', status: '', addressId: '' }); setFilters({ from: '', to: '', status: '', addressId: '' }); setFilterOpen(false); };

    // Order summary modal handlers
    const openSummary = (order: any) => setSummaryOpen({ open: true, order });
    const closeSummary = () => setSummaryOpen({ open: false, order: null });

    // UI
    return (
        <div className="flex flex-col flex-1 bg-[var(--color-secondary)] px-2 py-4 font-sans">

            {/* Live Orders */}
            <div className='w-full max-w-2xl mx-auto'>
                {/* Title & Filter */}
                <div className="flex items-center justify-between mb-4 mt-2">
                    <h1 className="text-xl xs:text-2xl font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Live Orders</h1>
                </div>
                {/* Main section */}
                <div>
                    <LiveOrdersListing orders={orders} />
                </div>
            </div>

            <div className='max-w-2xl w-full mx-auto h-[1px] bg-[var(--color-light)] my-10' />

            {/* Orders History */}
            <div className='w-full max-w-2xl mx-auto'>
                {/* Title & Filter */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-xl xs:text-2xl font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Orders History</h1>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-[var(--color-tertiary)] text-[var(--color-white)] shadow hover:bg-[var(--color-dark)] transition-colors"
                        onClick={openFilter}
                        aria-label="Show filters"
                    >
                        <FaFilter />
                    </motion.button>
                </div>

                {/* Filter Modal */}
                <AnimatePresence>
                    {filterOpen && (
                        <motion.div
                            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 bg-opacity-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-[var(--color-white)] rounded-xl shadow-lg p-6 w-full max-w-sm mx-2 relative"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button className="absolute top-3 right-3 p-1 rounded hover:bg-[var(--color-light)]" onClick={closeFilter}><FaTimes /></button>
                                <h3 className="text-lg font-bold mb-4 text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Filter Orders</h3>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs text-[var(--color-muted)]">From Date</label>
                                    <input type="date" value={pendingFilters.from} onChange={e => setPendingFilters(f => ({ ...f, from: e.target.value }))} className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]" style={{ fontFamily: 'var(--font-saira)' }} />
                                    <label className="text-xs text-[var(--color-muted)]">To Date</label>
                                    <input type="date" value={pendingFilters.to} onChange={e => setPendingFilters(f => ({ ...f, to: e.target.value }))} className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]" style={{ fontFamily: 'var(--font-saira)' }} />
                                    <label className="text-xs text-[var(--color-muted)]">Status</label>
                                    <select value={pendingFilters.status} onChange={e => setPendingFilters(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                        <option value="">All</option>
                                        {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                    <label className="text-xs text-[var(--color-muted)]">Address</label>
                                    <select value={pendingFilters.addressId} onChange={e => setPendingFilters(f => ({ ...f, addressId: e.target.value }))} className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                        <option value="">All</option>
                                        {addresses.map(addr => <option key={addr.id} value={addr.id}>{addr.address}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-2 mt-6 justify-end">
                                    <button className="px-4 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }} onClick={saveFilters}>Save</button>
                                    <button className="px-4 py-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] font-semibold hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }} onClick={resetFilters}>Reset</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    <AllOrdersListing orders={filteredOrders} openSummary={openSummary} addressMap={addressMap} statusLabels={statusLabels} closeSummary={closeSummary} summaryOpen={summaryOpen} />
                </div>
            </div>
        </div>
    );
};

export default Orders;
