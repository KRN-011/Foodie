import { useCallback, useEffect, useRef, useState } from 'react'
import { socket } from '../lib/socket'
import { SOCKET_EVENTS } from '../constants/socketEvents'

// Components
import WelcomeBoard from '../components/Dashboard/WelcomeBoard'
import { useUser } from '../contexts/userContext'
import TopStatesCard from '../components/Dashboard/TopStatesCard'
import { getAllCategories, getAllProducts, getAllRestaurants, getTopStates } from '../services/apiService'
import QuickActionsCardContainer from '../components/Dashboard/QuickActionsCardContainer'
import { AnimatePresence, motion } from 'framer-motion'
import AddProductMenu from '../components/AddProductMenu'
import DeleteProductDashboardModal from '../components/Dashboard/DeleteProductDashboardModal'
import DisableRestuarantModal from '../components/Dashboard/DisableRestuarantModal'
import EditUserModal from '../components/Dashboard/EditUserModal'

const Dashboard = () => {

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const { user, isAdmin } = useUser()

    const [editProduct, setEditProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [topStates, setTopStates] = useState<any>(null);
    const [stateLoading, setStateLoading] = useState(false);
    const [productModelOpen, setProductModelOpen] = useState(false);
    const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
    const [disableRestuarantModalOpen, setDisableRestuarantModalOpen] = useState(false);
    const [editUserModalOpen, setEditUserModalOpen] = useState(false);
    const fetchTopStates = useCallback(async () => {
        setStateLoading(true);
        try {
            const response = await getTopStates();

            if (response.success) {
                setTopStates(response.data);
            }

            // simulate a delay of 1 second
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            console.log(error);
        } finally {
            setStateLoading(false);
        }
    }, [])

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            let prods, cats, rests;
            if (isAdmin) {
                [prods, cats, rests] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                    getAllRestaurants(),
                ]);
            } else {
                [prods, cats] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                ]);
                rests = { data: [] };
            }
            setProducts(prods.products || []);
            setCategories(cats.categories || []);
            setRestaurants(rests.data || []);
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    const handleRealtimeUpdates = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchAll();
            fetchTopStates();
        }, 300);
    }, [fetchAll, fetchTopStates]);

    const handleProductModelOpen = () => {
        setProductModelOpen(true);
    }

    const handleProductDeleteModalOpen = () => {
        setDeleteProductModalOpen(true);
    }

    const handleDisableRestuarantModalOpen = () => {
        setDisableRestuarantModalOpen(true);
    }

    const handleDisableRestuarantModalClose = () => {
        setDisableRestuarantModalOpen(false);
    }

    const handleEditUserModalOpen = () => {
        setEditUserModalOpen(true);
    }

    const handleEditUserModalClose = () => {
        setEditUserModalOpen(false);
    }

    useEffect(() => {
        fetchAll();
        fetchTopStates();
    }, [fetchAll, fetchTopStates]);

    useEffect(() => {
        socket.on(SOCKET_EVENTS.ACTIVE_PRODUCTS, handleRealtimeUpdates);
        socket.on(SOCKET_EVENTS.CURRENT_ACTIVE_RESTAURANTS, handleRealtimeUpdates);
        socket.on(SOCKET_EVENTS.ACTIVE_USERS, handleRealtimeUpdates);
        socket.on(SOCKET_EVENTS.ORDERS_IN_LAST_24_HOURS, handleRealtimeUpdates);
        socket.on(SOCKET_EVENTS.TOTAL_REVENUE_IN_LAST_24_HOURS, handleRealtimeUpdates);
        socket.on(SOCKET_EVENTS.CANCELLED_FAILED_ORDERS_IN_LAST_24_HOURS, handleRealtimeUpdates);

        return () => {
            socket.off(SOCKET_EVENTS.ACTIVE_PRODUCTS, handleRealtimeUpdates);
            socket.off(SOCKET_EVENTS.CURRENT_ACTIVE_RESTAURANTS, handleRealtimeUpdates);
            socket.off(SOCKET_EVENTS.ACTIVE_USERS, handleRealtimeUpdates);
            socket.off(SOCKET_EVENTS.ORDERS_IN_LAST_24_HOURS, handleRealtimeUpdates);
            socket.off(SOCKET_EVENTS.TOTAL_REVENUE_IN_LAST_24_HOURS, handleRealtimeUpdates);
            socket.off(SOCKET_EVENTS.CANCELLED_FAILED_ORDERS_IN_LAST_24_HOURS, handleRealtimeUpdates);
            if (debounceRef.current) clearTimeout(debounceRef.current);
        }
    }, [handleRealtimeUpdates])

    // Close edit modal
    const handleCloseEdit = () => {
        setEditProduct(null);
        setProductModelOpen(false);
    };

    const handleProductDeleteModalClose = () => {
        setDeleteProductModalOpen(false);
    }

    return (
        <div className="w-full h-screen overflow-y-auto custom-scrollbar bg-[var(--color-light)] p-3 md:p-6 flex flex-col gap-3 relative">
            {/* Mobile View */}
            <div className='md:hidden flex flex-col gap-3'>
                <motion.div
                    initial={{ opacity: 0, translateY: -40, rotateX: 60 }}
                    animate={{ opacity: 1, translateY: 0, rotateX: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className='flex items-center justify-between bg-quaternary rounded-3xl p-4 max-md:max-w-xl max-md:mx-auto'
                >
                    <WelcomeBoard user={user} />
                </motion.div>
                <div className='flex flex-col gap-4 max-md:max-w-xl max-md:mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, translateY: -40, rotateX: 60 }}
                        animate={{ opacity: 1, translateY: 0, rotateX: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className='flex items-start justify-center bg-quaternary rounded-3xl p-4'
                    >
                        {topStates && <TopStatesCard topStates={topStates} stateLoading={stateLoading} fetchTopStates={fetchTopStates} />}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, translateY: -40, rotateX: 60 }}
                        animate={{ opacity: 1, translateY: 0, rotateX: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className='flex items-start justify-center bg-quaternary rounded-3xl p-4'
                    >
                        <QuickActionsCardContainer handleProductModelOpen={handleProductModelOpen} handleProductDeleteModalOpen={handleProductDeleteModalOpen} handleDisableRestuarantModalOpen={handleDisableRestuarantModalOpen} handleEditUserModalOpen={handleEditUserModalOpen} />
                    </motion.div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AddProductMenu
                open={productModelOpen}
                onClose={handleCloseEdit}
                onSave={handleCloseEdit}
                categories={categories}
                restaurants={restaurants}
                refetchProducts={fetchAll}
                isAdmin={isAdmin}
                editProduct={editProduct}
            />

            {/* Delete Product Modal */}
            <DeleteProductDashboardModal
                open={deleteProductModalOpen}
                onClose={handleProductDeleteModalClose}
                products={products}
            />

            {/* Disable Restuarant Modal */}
            <DisableRestuarantModal
                open={disableRestuarantModalOpen}
                onClose={handleDisableRestuarantModalClose}
                restaurants={restaurants}
            />

            {/* Edit User Modal */}
            <EditUserModal
                open={editUserModalOpen}
                onClose={handleEditUserModalClose}
                onSave={handleEditUserModalClose}
            />
        </div>
    )
}

export default Dashboard
