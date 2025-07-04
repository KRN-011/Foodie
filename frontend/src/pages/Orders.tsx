import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes, FaShoppingCart, FaUtensils } from 'react-icons/fa';
import { useUser } from '../contexts/userContext';
import { getOrdersByUserId, getAllAddresses } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import FadeInView from '../components/FadeInView';

const statusColors: Record<string, string> = {
    PENDING: 'bg-[var(--color-muted)] text-white',
    CONFIRMED: 'bg-[var(--color-tertiary)] text-white',
    DELIVERED: 'bg-[var(--color-success)] text-white',
    CANCELLED: 'bg-[var(--color-error)] text-white',
    PAID: 'bg-[var(--color-tertiary)] text-white',
    FAILED: 'bg-[var(--color-error)] text-white',
};

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
                    getAllAddresses(),
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
            <div className='w-full max-w-2xl mx-auto'>
                {/* Title & Filter */}
                <div className="flex items-center justify-between mb-4 mt-2">
                    <h1 className="text-xl xs:text-2xl font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Your Orders</h1>
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

                <FadeInView>
                    {/* Orders List or Empty State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center text-center py-24 md:py-40">
                            <LoadingSpinner />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <motion.div
                            className="flex flex-col items-center justify-center text-center py-24 md:py-40"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <FaUtensils className="text-6xl text-[var(--color-tertiary)] mb-4 animate-bounce" />
                            <h2 className="text-2xl font-bold mb-2 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                No orders yet! Your food journey awaits.
                            </h2>
                            <p className="mb-6 text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                Hungry? Start exploring the menu and place your first order!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold shadow hover:bg-[var(--color-dark)] transition-colors"
                                style={{ fontFamily: 'var(--font-saira)' }}
                                onClick={() => navigate('/menu')}
                            >
                                Go to Menu
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-4 w-full">
                            {filteredOrders.map(order => {
                                const addr = addressMap[order.addressId];
                                const total = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
                                return (
                                    <motion.div
                                        key={order.id}
                                        className="bg-[var(--color-white)] rounded-xl shadow-md p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg  border border-[var(--color-light)]"
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => openSummary(order)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        layout
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>Order #{order.orderId}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[order.status] || 'bg-[var(--color-muted)] text-white'}`} style={{ fontFamily: 'var(--font-saira)' }}>{statusLabels[order.status] || order.status}</span>
                                        </div>
                                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-0">
                                            <span className="font-semibold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>{order.receiverName}</span>
                                            <span className="text-xs text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-[var(--color-muted)] truncate" style={{ fontFamily: 'var(--font-saira)' }}>{addr ? `${addr.address}${addr.area ? ', ' + addr.area : ''}${addr.landmark ? ', ' + addr.landmark : ''}${addr.houseNumber ? ', ' + addr.houseNumber : ''}` : 'Address not found'}</div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Total: ₹{total}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </FadeInView>

                {/* Order Summary Modal */}
                <AnimatePresence>
                    {summaryOpen.open && summaryOpen.order && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-[var(--color-white)] rounded-xl shadow-lg p-6 w-full max-w-md mx-2 relative"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button className="absolute top-3 right-3 p-1 rounded hover:bg-[var(--color-light)]" onClick={closeSummary}><FaTimes /></button>
                                <h3 className="text-lg font-bold mb-2 text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Order Summary</h3>
                                <div className="flex flex-col gap-2 mb-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[var(--color-muted)]">Order #{summaryOpen.order.orderId}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[summaryOpen.order.status] || 'bg-[var(--color-muted)] text-white'}`}>{statusLabels[summaryOpen.order.status] || summaryOpen.order.status}</span>
                                    </div>
                                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-0">
                                        <span className="font-semibold text-[var(--color-dark)]">{summaryOpen.order.receiverName}</span>
                                        <span className="text-xs text-[var(--color-muted)]">{new Date(summaryOpen.order.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-[var(--color-muted)]">{addressMap[summaryOpen.order.addressId] ? `${addressMap[summaryOpen.order.addressId].address}${addressMap[summaryOpen.order.addressId].area ? ', ' + addressMap[summaryOpen.order.addressId].area : ''}${addressMap[summaryOpen.order.addressId].landmark ? ', ' + addressMap[summaryOpen.order.addressId].landmark : ''}${addressMap[summaryOpen.order.addressId].houseNumber ? ', ' + addressMap[summaryOpen.order.addressId].houseNumber : ''}` : 'Address not found'}</div>
                                </div>
                                {/* Payment */}
                                <div className="mb-2">
                                    <div className="font-semibold text-[var(--color-dark)] mb-1">Payment</div>
                                    <div className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">
                                        <span>Method: <span className="font-bold text-[var(--color-tertiary)]">{summaryOpen.order.payment?.method}</span></span>
                                        <span>Amount: ₹{summaryOpen.order.payment?.amount}</span>
                                        {summaryOpen.order.payment?.razorpayOrderId && <span>Razorpay Order ID: {summaryOpen.order.payment.razorpayOrderId}</span>}
                                        {summaryOpen.order.payment?.razorpayPaymentId && <span>Razorpay Payment ID: {summaryOpen.order.payment.razorpayPaymentId}</span>}
                                    </div>
                                </div>
                                {/* Items */}
                                <div className="mb-2">
                                    <div className="font-semibold text-[var(--color-dark)] mb-1">Items</div>
                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                        {summaryOpen.order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-light)]">
                                                {/* If product info is available, show image and name */}
                                                {item.product?.images?.[0] && (
                                                    <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 rounded object-cover border-2 border-[var(--color-tertiary)]" style={{ backgroundColor: 'var(--color-light)' }} />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-semibold text-sm text-[var(--color-dark)]">{item.product?.name || 'Product'}</div>
                                                    <div className="text-xs text-[var(--color-muted)]">Qty: {item.quantity}</div>
                                                </div>
                                                <div className="font-bold text-[var(--color-tertiary)] text-sm">₹{item.price * item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-4 border-t pt-4 border-[var(--color-light)]">
                                        <span className="font-bold text-[var(--color-dark)]">Total</span>
                                        <span className="text-base xs:text-lg font-bold text-[var(--color-tertiary)]">₹{summaryOpen.order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Orders;
