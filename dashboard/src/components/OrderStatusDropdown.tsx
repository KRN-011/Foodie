import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateOrderStatus } from '../services/apiService';

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PREPARING', label: 'Preparing' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'PAID', label: 'Paid' },
];

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-200 text-yellow-800',
    CONFIRMED: 'bg-blue-200 text-blue-800',
    PREPARING: 'bg-orange-200 text-orange-800',
    OUT_FOR_DELIVERY: 'bg-purple-200 text-purple-800',
    DELIVERED: 'bg-green-200 text-green-800',
    CANCELLED: 'bg-red-200 text-red-800',
    FAILED: 'bg-red-200 text-red-800',
    PAID: 'bg-green-200 text-green-800',
};

export default function OrderStatusDropdown({ orderId, value, onChange }: { orderId: string, value: string, onChange?: (newStatus: string) => void }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // When opening, decide direction
    useLayoutEffect(() => {
        if (open && buttonRef.current && dropdownRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current.offsetHeight;
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setOpenDirection('up');
            } else {
                setOpenDirection('down');
            }
        }
    }, [open]);

    const handleSelect = async (newStatus: string) => {
        if (newStatus === status) {
            setOpen(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await updateOrderStatus(orderId, newStatus);
            setStatus(newStatus);
            setOpen(false);
            if (onChange) onChange(newStatus);
        } catch (e) {
            setError('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const selected = STATUS_OPTIONS.find(opt => opt.value === status);

    return (
        <div className="inline-block w-36 text-left relative">
            <button
                type="button"
                ref={buttonRef}
                className={`w-full px-2 py-1 rounded text-xs font-bold flex items-center justify-between border ${statusColors[status] || 'bg-gray-200 text-gray-800'} ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !loading && setOpen(o => !o)}
                disabled={loading}
            >
                <span>{selected?.label || status}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: openDirection === 'down' ? -8 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: openDirection === 'down' ? -8 : 8 }}
                        className={`absolute left-0 right-0 z-40 bg-white border border-gray-200 rounded shadow-lg mt-1 ${openDirection === 'up' ? 'mb-1' : ''}`}
                        style={openDirection === 'up' ? { bottom: '100%', top: 'auto' } : { top: '100%', bottom: 'auto' }}
                    >
                        <div className="flex flex-col">
                            {STATUS_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`text-left px-3 py-2 text-xs hover:bg-tertiary hover:text-white transition-colors ${status === opt.value ? 'font-bold text-tertiary' : ''}`}
                                    onClick={() => handleSelect(opt.value)}
                                    disabled={loading}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
        </div>
    );
} 