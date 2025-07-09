import { useEffect, useRef, useState } from "react";
import FadeInView from "../FadeInView";
import LoadingSpinner from "../LoadingSpinner";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    FAILED: 'Failed',
    PAID: 'Paid',
};

const LiveOrdersListing = ({ orders }: { orders: any[] }) => {

    const targetRef = useRef(null);

    const navigate = useNavigate();
    const [liveOrders, setLiveOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        setLoading(true);
        try {
            const filterLiveOrders = orders.filter((order) =>
                order.status === "PENDING" ||
                order.status === "CONFIRMED" ||
                order.status === "PREPARING" ||
                order.status === "OUT_FOR_DELIVERY"
            );
            setLiveOrders(filterLiveOrders);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [orders]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["30% start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);  
    const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <FadeInView>
            {loading ? (
                <div className="flex flex-col items-center justify-center text-center py-24 md:py-40">
                    <LoadingSpinner />
                </div>
            ) : liveOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center my-3">
                    <div className="bg-[var(--color-white)] rounded-xl shadow-md p-4 flex flex-col py-12 md:py-16 w-full">
                        <h1 className="text-2xl font-bold mb-2 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>
                            No live orders
                        </h1>
                        <p className="text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>
                            No live orders at the moment
                        </p>
                    </div>
                </div>
            ) : (
                <motion.div
                    ref={targetRef}
                    className="bg-gradient-to-r from-[var(--color-primary)] from-60% via-[var(--color-quaternary)] via-70% to-[var(--color-tertiary)] to-80% rounded-3xl p-2"
                    style={{
                        scale,
                        y,
                    }}
                >
                    <div className="flex flex-col gap-4 w-full bg-[var(--color-white)] rounded-3xl shadow-md p-4">
                        <AnimatePresence>
                            {liveOrders.map(order => {
                                const total = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
                                return (
                                    <motion.div
                                        key={order.id}
                                        className="bg-[var(--color-white)] rounded-xl shadow-md p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg border border-[var(--color-light)]"
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => navigate(`/order-confirmed/${order.orderId}`)}
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
                                        <div className="text-xs text-[var(--color-muted)] truncate" style={{ fontFamily: 'var(--font-saira)' }}>
                                            {order.address ? `${order.address.address}${order.address.area ? ', ' + order.address.area : ''}${order.address.landmark ? ', ' + order.address.landmark : ''}${order.address.houseNumber ? ', ' + order.address.houseNumber : ''}` : 'Address not found'}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Total: ₹{total}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </FadeInView>
    );
};

export default LiveOrdersListing;
