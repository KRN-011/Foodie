import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { useUser } from '../contexts/userContext';
import { getAllOrders, getOrdersByRestaurantId } from '../services/apiService';

const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    PAID: 'Paid',
    FAILED: 'Failed',
};
const statusColors: Record<string, string> = {
    PENDING: 'bg-[var(--color-muted)] text-white',
    CONFIRMED: 'bg-[var(--color-tertiary)] text-white',
    DELIVERED: 'bg-[var(--color-success)] text-white',
    CANCELLED: 'bg-[var(--color-error)] text-white',
    PAID: 'bg-[var(--color-tertiary)] text-white',
    FAILED: 'bg-[var(--color-error)] text-white',
};
const paymentMethods = [
    { value: '', label: 'All' },
    { value: 'PREPAID', label: 'Prepaid' },
    { value: 'COD', label: 'Cash on Delivery' },
];

const Orders = () => {
    const { user, isAdmin, isRestaurant, isLoading } = useUser();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ from: '', to: '', status: '', paymentMethod: '', min: '', max: '' });
    const [pendingFilters, setPendingFilters] = useState(filters);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                console.log(user);
                let res;
                if (isAdmin) {
                    res = await getAllOrders();
                    setOrders(res.orders || res.data || []);
                } else if (isRestaurant && user?.restaurantId) {
                    res = await getOrdersByRestaurantId(user.restaurantId);
                    setOrders(res.orders || res.data || []);
                } else {
                    setOrders([]);
                }
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        if (!isLoading && (isAdmin || isRestaurant)) fetchOrders();
    }, [isAdmin, isRestaurant, user, isLoading]);

    // Filtering logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            let pass = true;
            if (filters.from) pass = pass && new Date(order.createdAt) >= new Date(filters.from);
            if (filters.to) pass = pass && new Date(order.createdAt) <= new Date(filters.to + 'T23:59:59');
            if (filters.status) pass = pass && order.status === filters.status;
            if (filters.paymentMethod) pass = pass && order.paymentMethod === filters.paymentMethod;
            if (filters.min) pass = pass && Number(order.payment.amount) >= Number(filters.min);
            if (filters.max) pass = pass && Number(order.payment.amount) <= Number(filters.max);
            return pass;
        });
    }, [orders, filters]);

    // Modal handlers
    const openFilter = () => { setPendingFilters(filters); setFilterOpen(true); };
    const closeFilter = () => setFilterOpen(false);
    const saveFilters = () => { setFilters(pendingFilters); setFilterOpen(false); };
    const resetFilters = () => { setPendingFilters({ from: '', to: '', status: '', paymentMethod: '', min: '', max: '' }); setFilters({ from: '', to: '', status: '', paymentMethod: '', min: '', max: '' }); setFilterOpen(false); };

    console.log(orders);


    return (
        <div className="relative w-full max-w-4xl mx-auto flex flex-col flex-1 bg-[var(--color-white)] min-h-screen px-2 py-4 font-sans">
            <div className="w-full absolute">
                {/* Title & Filter */}
                <div className="flex items-center justify-between mb-4 mt-2 px-5">
                    <h1 className="text-xl xs:text-2xl font-bold text-[var(--color-tertiary)] max-md:pl-10" style={{ fontFamily: 'var(--font-saira)' }}>Orders</h1>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-[var(--color-tertiary)] text-[var(--color-white)] shadow hover:bg-[var(--color-dark)] transition-colors cursor-pointer"
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
                                    <CustomDropdown
                                        label="Status"
                                        value={pendingFilters.status}
                                        onChange={(val: string) => setPendingFilters(f => ({ ...f, status: val }))}
                                        options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                                        placeholder="All"
                                    />
                                    <CustomDropdown
                                        label="Payment Method"
                                        value={pendingFilters.paymentMethod}
                                        onChange={(val: string) => setPendingFilters(f => ({ ...f, paymentMethod: val }))}
                                        options={paymentMethods}
                                        placeholder="All"
                                    />
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs text-[var(--color-muted)]">Price Above</label>
                                            <input type="number" min="0" value={pendingFilters.min} onChange={e => setPendingFilters(f => ({ ...f, min: e.target.value }))} className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)] w-full" style={{ fontFamily: 'var(--font-saira)' }} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-[var(--color-muted)]">Price Below</label>
                                            <input type="number" min="0" value={pendingFilters.max} onChange={e => setPendingFilters(f => ({ ...f, max: e.target.value }))} className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)] w-full" style={{ fontFamily: 'var(--font-saira)' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-6 justify-end">
                                    <button className="px-4 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }} onClick={saveFilters}>Save</button>
                                    <button className="px-4 py-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] font-semibold hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }} onClick={resetFilters}>Reset</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Orders Table */}
                <div className="overflow-x-auto mx-4 border border-[var(--color-tertiary)] bg-[var(--color-white)] shadow-md ">
                    <table className="min-w-[600px] w-full text-sm text-left" style={{ fontFamily: 'var(--font-saira)' }}>
                        <thead>
                            <tr className="bg-[var(--color-secondary)] text-center">
                                <th className="p-3 font-bold">#</th>
                                <th className="p-3 font-bold">Order ID</th>
                                <th className="p-3 font-bold">Total</th>
                                <th className="p-3 font-bold">Method</th>
                                <th className="p-3 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence initial={false}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-[var(--color-muted)]">Loading...</td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-[var(--color-muted)]">No orders found.</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, idx) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-b last:border-none hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
                                        >
                                            <td className="p-3 text-center">{idx + 1}</td>
                                            <td className="p-3 text-center">{order.orderId}</td>
                                            <td className="p-3 text-center">₹ {Number(order.payment.amount).toFixed(2)}</td>
                                            <td className="p-3 text-center">{order.payment.method === 'PREPAID' ? 'Prepaid' : order.payment.method === 'COD' ? 'Cash on Delivery' : '-'}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[order.status] || 'bg-[var(--color-muted)] text-white'}`}>{statusLabels[order.status] || order.status}</span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Local CustomDropdown for Orders page (same design as AddProductMenu)
function CustomDropdown({ label, value, onChange, options, placeholder = 'Select', searchable = false, multi = false, error }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    searchable?: boolean;
    multi?: boolean;
    error?: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
    // Close dropdown on outside click
    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [open]);
    const handleSelect = (opt: { value: string; label: string }) => {
        onChange(opt.value);
        setOpen(false);
    };
    return (
        <div className="mb-2 w-full relative" ref={ref}>
            <label className="block mb-1 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>{label}</label>
            <div
                className="w-full px-3 py-2 border rounded bg-[var(--color-light)] flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', color: 'var(--color-dark)' }}
                onClick={() => setOpen(o => !o)}
                tabIndex={0}
            >
                <span className="truncate text-sm">
                    {options.find(opt => opt.value === value)?.label || placeholder}
                </span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute left-0 right-0 z-40 bg-[var(--color-white)] border border-[var(--color-light)] rounded shadow-lg mt-1 max-h-48 overflow-y-auto"
                    >
                        <div className="p-2">
                            {searchable && (
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)] mb-2"
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                {filtered.map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`text-left px-2 py-1 rounded hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors ${value === opt.value ? 'font-bold text-[var(--color-tertiary)]' : ''}`}
                                        onClick={() => handleSelect(opt)}
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                        type="button"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                                {filtered.length === 0 && (
                                    <span className="text-xs text-[var(--color-muted)] px-2">No options found</span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <span className="text-[var(--color-error)] text-xs mt-1 block">{error}</span>}
        </div>
    );
}

export default Orders;
