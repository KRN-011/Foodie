import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import FadeInView from "../FadeInView";
import LoadingSpinner from "../LoadingSpinner";
import { FaTimes, FaUtensils } from "react-icons/fa";
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


const AllOrdersListing = ({ orders, openSummary, addressMap, statusLabels, closeSummary, summaryOpen }: { orders: any[], openSummary: (order: any) => void, addressMap: any, statusLabels: any, closeSummary: () => void, summaryOpen: any }) => {

    const navigate = useNavigate();

    // state variables
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // filter orders that have status PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY
    useEffect(() => {
        setLoading(true);
        try {
            // orders without status PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY
            setAllOrders(orders.filter((order: any) => !['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status)));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [orders])

    // card component
    function AnimatedOrderCard({ order, openSummary, addressMap, statusLabels }: any) {
        const targetRef = useRef<HTMLDivElement>(null);

        // 1. Leaving at the top (shrink and move up)
        const { scrollYProgress: leaveProgress } = useScroll({
            target: targetRef,
            offset: ["start start", "end start"] 
        });
        const leaveY = useTransform(leaveProgress, [0, 1], [0, -100]);
        const leaveScale = useTransform(leaveProgress, [0, 1], [1, 0.9]);

        // 2. Entering from the bottom (expand and move down)
        const { scrollYProgress: enterProgress } = useScroll({
            target: targetRef,
            offset: ["start end", "end end"] 
        });
        const enterY = useTransform(enterProgress, [0, 1], [100, 0]);
        const enterScale = useTransform(enterProgress, [0, 1], [0.9, 1]);

        // 3. Combine the effects
        const y = useTransform([leaveY, enterY], ([l, e]: any) => l + e);
        const scale = useTransform([leaveScale, enterScale], ([l, e]: any) => l * e);

        const addr = addressMap[order.addressId];
        const total = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        return (
            <motion.div
                ref={targetRef}
                key={order.id}
                className="bg-[var(--color-white)] rounded-xl shadow-md p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg border border-[var(--color-light)]"
                whileHover={{ scale: 1.01 }}
                onClick={() => openSummary(order)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ scale, y }}
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
    }

    return (
        <div>
            <FadeInView>
                {/* Orders List or Empty State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center text-center py-24 md:py-40">
                        <LoadingSpinner />
                    </div>
                ) : allOrders.length === 0 ? (
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
                        {allOrders?.map(order => (
                            <AnimatedOrderCard
                                key={order.id}
                                order={order}
                                openSummary={openSummary}
                                addressMap={addressMap}
                                statusLabels={statusLabels}
                            />
                        ))}
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
    )
}

export default AllOrdersListing
