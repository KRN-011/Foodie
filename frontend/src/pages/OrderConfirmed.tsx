import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { getOrderById } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';

// Store location (example: Ahmedabad)
const STORE_LOCATION = { lat: 23.130136211382286, lng: 72.55088920735426 };

function Routing({ from, to }: { from: { lat: number; lng: number }, to: { lat: number; lng: number } }) {
    const map = useMap();
    const routingControlRef = useRef<any>(null);

    useEffect(() => {
        if (!map) return;
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        // @ts-ignore
        routingControlRef.current = L.Routing.control({
            waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
            lineOptions: { styles: [{ color: '#333333', weight: 5 }] },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false,
            routeWhileDragging: false,
            createMarker: (i, wp) => {
                return L.marker(wp.latLng, {
                    icon: L.icon({
                        iconUrl: i === 0
                            ? '/images/map/shops.png' // Store icon
                            : '/images/map/placeholder.png', // User icon
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                    }),
                });
            },
        }).addTo(map);

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [from, to, map]);

    return null;
}

const OrderConfirmed = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // get order id from url
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getOrderById(orderId || '');
                if (res.success && res.order) {
                    setOrder(res.order);
                } else {
                    setOrder(null);
                    setError('No orders found.');
                }
            } catch (e) {
                setError('Failed to fetch order.');
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-secondary)]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-secondary)]">
                <div className="text-lg text-[var(--color-error)] font-bold">{error || 'Order not found.'}</div>
                <button
                    className="mt-6 w-full max-w-xs py-3 rounded-xl bg-[var(--color-tertiary)] text-[var(--color-white)] font-bold text-lg shadow-lg hover:bg-[var(--color-dark)] transition-colors"
                    style={{ fontFamily: 'var(--font-saira)' }}
                    onClick={() => navigate('/menu')}
                >
                    Go to Menu
                </button>
            </div>
        );
    }

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
    };

    // User location from order address
    const userLocation = {
        lat: order.address.latitude,
        lng: order.address.longitude,
    };

    // Order summary
    const orderSummary = {
        orderId: order.orderId,
        total: order.payment?.amount || 0,
        items: order.items.map((item: any) => ({
            name: item.product?.name || 'Product',
            qty: item.quantity,
            price: item.price,
        })),
        address: `${order.address.houseNumber ? order.address.houseNumber + ', ' : ''}${order.address.address}${order.address.area ? ', ' + order.address.area : ''}${order.address.city ? ', ' + order.address.city : ''}${order.address.state ? ', ' + order.address.state : ''}${order.address.country ? ', ' + order.address.country : ''}${order.address.postalCode ? ', ' + order.address.postalCode : ''}`,
    };

    return (
        <AnimatePresence>
            <motion.div
                className="flex flex-col flex-1 bg-[var(--color-secondary)] py-10"
            >
                <div className='max-w-4xl mx-auto w-full px-5'>
                    {/* Map Section */}
                    <motion.div
                        className="w-full h-96 sm:h-[500px] rounded-3xl overflow-hidden border border-[var(--color-dark)]"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={0}
                    >
                        <MapContainer
                            center={[
                                (STORE_LOCATION.lat + userLocation.lat) / 2,
                                (STORE_LOCATION.lng + userLocation.lng) / 2,
                            ] as [number, number]}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ width: '100%', height: '100%', zIndex: 1 }}
                            className='no-double-tap-selection'
                        >
                            <TileLayer
                                attribution={"© OpenStreetMap contributors"}
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Routing from={STORE_LOCATION} to={userLocation} />
                        </MapContainer>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        className="flex flex-col gap-4 bg-[var(--color-white)] rounded-3xl shadow-lg my-10 p-10 z-10 relative"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={1}
                    >
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                Order Confirmed!
                            </h2>
                            <p className="text-sm text-[var(--color-muted)] mt-1" style={{ fontFamily: 'var(--font-saira)' }}>
                                Your food is on its way. Track your delivery below.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex xs:flex-row flex-col justify-between text-[var(--color-dark)] font-semibold">
                                <span>Order ID:</span>
                                <span>{orderSummary.orderId}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                {orderSummary.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-[var(--color-tertiary)]">
                                        <span>{item.name} x{item.qty}</span>
                                        <span>₹{item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between font-bold text-[var(--color-dark)] border-t border-[var(--color-light)] pt-2 mt-2">
                                <span>Total</span>
                                <span>₹{orderSummary.total}</span>
                            </div>
                            <div className="text-xs text-[var(--color-muted)] mt-2">
                                Delivery Address: {orderSummary.address}
                            </div>
                        </div>
                    </motion.div>

                    {/* Go to Menu Button */}
                    <motion.div
                        className="flex-1 flex flex-col justify-end items-center mt-8"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={2}
                    >
                        <button
                            className="w-full max-w-xs py-3 rounded-xl bg-[var(--color-tertiary)] text-[var(--color-white)] font-bold text-lg shadow-lg hover:bg-[var(--color-dark)] transition-colors cursor-pointer"
                            style={{ fontFamily: 'var(--font-saira)' }}
                            onClick={() => navigate('/menu')}
                        >
                            Go to Menu
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderConfirmed;
