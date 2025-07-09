import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/userContext';
import { createAddress, getAllAddresses, updateAddress, deleteAddress, getCart, createRazorpayOrder, verifyRazorpayOrder, createOrder, getAddressDetailsByLatLong } from '../services/apiService';
import { FaPlus, FaMapMarkerAlt, FaEdit, FaCheckCircle, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/cartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useOrder } from '../contexts/orderContext';

declare global {
    interface Window {
        Razorpay: any;
    }
}

// Address type
interface Address {
    id: number;
    address: string;
    houseNumber?: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}

const addressModalVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

const Checkout = () => {
    const { isAuthenticated, isLoading, user } = useUser();
    const { refreshCart } = useCart();
    const { refreshOrders } = useOrder();
    const [cart, setCart] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<number>(0);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
        address: '',
        houseNumber: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
    });
    const [addressLoading, setAddressLoading] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');
    const [paying, setPaying] = useState(false);
    const [editAddressId, setEditAddressId] = useState<number | null>(null);
    const navigate = useNavigate();

    // Fetch cart and addresses on mount
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated && !isLoading) {
                navigate('/login');
                return;
            }
            if (!isAuthenticated) return;
            setAddressLoading(true);
            try {
                const cartRes = await getCart();
                if (cartRes.success) setCart(cartRes.cart.cartItems);
                const addressesRes = await getAllAddresses();
                setAddresses((addressesRes?.addresses as Address[]) || []);
                setSelectedAddress(0);
            } catch (e) {
                setCart([]);
                setAddresses([]);
            } finally {
                setAddressLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, [isAuthenticated, isLoading]);

    // Handle address form change
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    // Open modal for edit
    const handleEditAddress = (addr: Address) => {
        setAddressForm({
            address: addr.address,
            houseNumber: addr.houseNumber || '',
            area: addr.area,
            landmark: addr.landmark || '',
            city: addr.city || '',
            state: addr.state || '',
            country: addr.country || '',
            postalCode: addr.postalCode || '',
            latitude: addr.latitude,
            longitude: addr.longitude,
        });
        setEditAddressId(addr.id);
        setShowAddressModal(true);
    };

    // Save address (create or update)
    const handleSaveAddress = async () => {
        setAddressLoading(true);
        try {
            setShowAddressModal(false);
            setAddressForm({ address: '', houseNumber: '', area: '', landmark: '', city: '', state: '', country: '', postalCode: '', latitude: undefined, longitude: undefined });
            if (editAddressId) {
                await updateAddress(editAddressId, addressForm);
            } else {
                await createAddress({ ...addressForm });
            }
            // Refetch all addresses
            const addressesRes = await getAllAddresses();
            setAddresses((addressesRes?.addresses as Address[]) || []);
            setEditAddressId(null);
            setSelectedAddress(0);
        } finally {
            setAddressLoading(false);
        }
    };

    // Delete address
    const handleDeleteAddress = async (id: number) => {
        setAddressLoading(true);
        try {
            await deleteAddress(id);
            const addressesRes = await getAllAddresses();
            setAddresses((addressesRes?.addresses as Address[]) || []);
            setSelectedAddress(0);
        } finally {
            setAddressLoading(false);
        }
    };

    // Order total
    const total = cart?.reduce((sum, item) => sum + item?.product?.price * item.quantity, 0) || 0;

    // Handle pay now
    const handlePayNow = async () => {
        setPaying(true);
        if (paymentMethod === 'COD') {
            setPaying(true);
            const orderData = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                paymentMethod: 'COD',
                addressId: addresses[selectedAddress].id,
                amount: total,
                orderId: `ORD_${Date.now()}`,
            };
            try {
                await createOrder(orderData);
                setPaying(false);
                navigate(`/order-confirmed/${orderData.orderId}`);
            } catch (e) {
                setPaying(false);
                // handle error
            }
            return;
        }

        // Razorpay integration
        try {
            const response = await createRazorpayOrder(total);

            if (response.success) {
                const { order } = response;
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: 'INR',
                    name: 'Foodie',
                    description: 'Order Payment',
                    image: '/images/logo.png',
                    order_id: order.id,
                    handler: async (response: any) => {

                        // verify razorpay order
                        const verifyResponse = await verifyRazorpayOrder({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: order.id,
                            razorpay_signature: response.razorpay_signature,
                        })

                        if (verifyResponse.success) {
                            // For PREPAID (after payment success)
                            const orderData = {
                                items: cart.map(item => ({
                                    productId: item.product.id,
                                    quantity: item.quantity,
                                    price: item.product.price,
                                })),
                                paymentMethod: 'PREPAID',
                                status: 'CONFIRMED',
                                addressId: addresses[selectedAddress].id,
                                amount: total,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                orderId: `ORD_${Date.now()}`,
                            };
                            try {
                                await createOrder(orderData);
                                refreshCart();
                                refreshOrders();
                                setPaying(false);
                                navigate(`/order-confirmed/${orderData.orderId}`);
                            } catch (e) {
                                setPaying(false);
                                // handle error
                            }
                        } else {
                            setPaying(false);
                        }
                    },
                    prefill: {
                        email: user?.email,
                    },
                    theme: {
                        color: '#A5B68D',
                    },
                }
                const rzp1 = new window.Razorpay(options as any);
                rzp1.open();
            }
        } catch (error) {
            console.error("Error creating razorpay order:", error);
            setPaying(false);
        }
    };

    // handle use my location
    const handleUseMyLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setAddressLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await getAddressDetailsByLatLong(latitude, longitude);
                    if (response.address) {
                        setAddressForm({
                            address:
                                response.address.building ||
                                response.address.road ||
                                response.address.pedestrian ||
                                response.address.footway ||
                                response.address.path ||
                                response.address.cycleway ||
                                response.address.construction ||
                                '',
                            houseNumber: response.address.house_number || '',
                            area:
                                response.address.neighbourhood ||
                                response.address.suburb ||
                                response.address.village ||
                                response.address.town ||
                                response.address.city ||
                                response.address.county ||
                                '',
                            landmark:
                                response.address.attraction ||
                                response.address.public_building ||
                                response.address.mall ||
                                response.address.theatre ||
                                response.address.hotel ||
                                response.address.place_of_worship ||
                                response.address.landmark ||
                                '',
                            city: response.address.city || response.address.town || response.address.village || '',
                            state: response.address.state || '',
                            country: response.address.country || '',
                            postalCode: response.address.postcode || '',
                            latitude,
                            longitude,
                        });
                    }
                } catch (error) {
                    console.error("Error getting location:", error);
                } finally {
                    setAddressLoading(false);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                setAddressLoading(false);
            }
        )
    }

    if (isLoading) return <LoadingSpinner />;

    // UI
    return (
        <div className="flex flex-col flex-1 bg-[var(--color-secondary)] px-2 py-4 font-sans">
            <div className='max-w-3xl mx-auto'>
                {/* Title & Subtext */}
                <motion.div
                    className="mb-4 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    custom={0}
                >
                    <h1 className="text-2xl font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Checkout</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1" style={{ fontFamily: 'var(--font-saira)' }}>
                        Almost there! Confirm your address, review your order, and get ready to feast.
                    </p>
                </motion.div>

                {/* Address Section */}
                <motion.div
                    className="bg-[var(--color-white)] rounded-xl shadow-md p-4 mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    custom={1}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>Delivery Address</span>
                        <button
                            className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] text-xs font-semibold hover:bg-[var(--color-dark)] transition-colors cursor-pointer"
                            onClick={() => setShowAddressModal(true)}
                        >
                            <FaPlus /> Add Address
                        </button>
                    </div>
                    {addressLoading ? (
                        <div className="text-center text-[var(--color-muted)] py-4">Loading addresses...</div>
                    ) : addresses.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-4">
                            <span className="text-[var(--color-muted)]">No address found.</span>
                        </div>
                    ) : (Array.isArray(addresses) && addresses.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {addresses.map((addr: Address, idx: number) => (
                                <motion.div
                                    key={addr.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${selectedAddress === idx ? 'border-[var(--color-tertiary)] bg-[var(--color-light)]' : 'border-[var(--color-light)] bg-transparent'}`}
                                    onClick={() => setSelectedAddress(idx)}
                                    whileHover={{ scale: 1.01 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <FaMapMarkerAlt className="text-[var(--color-tertiary)]" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-[var(--color-dark)] text-sm">{addr.address}</div>
                                        <div className="text-xs text-[var(--color-muted)]">{addr.area}{addr.landmark ? `, ${addr.landmark}` : ''}{addr.houseNumber ? `, ${addr.houseNumber}` : ''}</div>
                                    </div>
                                    {selectedAddress === idx && <FaCheckCircle className="text-[var(--color-tertiary)]" />}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        className="ml-2 p-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-quaternary)] transition-colors"
                                        onClick={e => { e.stopPropagation(); handleEditAddress(addr); }}
                                    >
                                        <FaEdit size={14} className='cursor-pointer' />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        className="ml-1 p-1 rounded bg-[var(--color-light)] text-[var(--color-error)] hover:bg-[var(--color-quaternary)] transition-colors"
                                        onClick={e => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                    >
                                        <FaTrash size={14} className='text-red-500 cursor-pointer' />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    ) : null)}
                </motion.div>

                {/* Address Modal */}
                <AnimatePresence>
                    {showAddressModal && (
                        <motion.div
                            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 bg-opacity-30"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={addressModalVariants}
                        >
                            <motion.div
                                className="bg-[var(--color-white)] rounded-xl shadow-lg p-6 w-full max-w-sm mx-2"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className="text-lg font-bold mb-4 text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>{editAddressId ? 'Edit Address' : 'Add Delivery Address'}</h3>
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="button"
                                        className="py-2 px-3 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold shadow hover:bg-[var(--color-quaternary)] transition-colors cursor-pointer"
                                        onClick={handleUseMyLocation}
                                        disabled={addressLoading}
                                    >
                                        Use my location
                                    </button>
                                    <div className='text-center text-[var(--color-muted)] text-sm font-semibold flex items-center justify-center gap-2 my-3'>
                                        <div className='w-1/3 border-t border-[var(--color-muted)]' />
                                        <div className='text-xs text-[var(--color-muted)]'>OR</div>
                                        <div className='w-1/3 border-t border-[var(--color-muted)]' />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street Address / Building Name"
                                        value={addressForm.address}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="landmark"
                                        placeholder="Landmark (optional)"
                                        value={addressForm.landmark}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="area"
                                        placeholder="Area / Neighbourhood / Locality"
                                        value={addressForm.area}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="houseNumber"
                                        placeholder="Flat / House Number"
                                        value={addressForm.houseNumber}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={addressForm.city}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={addressForm.state}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        value={addressForm.country}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        value={addressForm.postalCode}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    />
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <button
                                        className="flex-1 py-2 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold shadow hover:bg-[var(--color-dark)] transition-colors"
                                        onClick={handleSaveAddress}
                                        disabled={addressLoading || !addressForm.address || !addressForm.area}
                                        style={{ opacity: addressLoading || !addressForm.address || !addressForm.area ? 0.7 : 1 }}
                                    >
                                        {addressLoading ? 'Saving...' : (editAddressId ? 'Update' : 'Save')}
                                    </button>
                                    <button
                                        className="flex-1 py-2 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] font-semibold shadow hover:bg-[var(--color-quaternary)] transition-colors"
                                        onClick={() => { setShowAddressModal(false); setEditAddressId(null); setAddressForm({ address: '', houseNumber: '', area: '', landmark: '', city: '', state: '', country: '', postalCode: '', latitude: undefined, longitude: undefined }); }}
                                        disabled={addressLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Order Summary */}
                <motion.div
                    className="bg-[var(--color-white)] rounded-xl shadow-md p-4 mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    custom={2}
                >
                    <div className="font-semibold text-[var(--color-dark)] mb-2" style={{ fontFamily: 'var(--font-saira)' }}>Order Summary</div>
                    {cart.length === 0 ? (
                        <div className="text-center text-[var(--color-muted)] py-4">Your cart is empty.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {cart.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-light)] transition-colors"
                                    whileHover={{ scale: 1.01 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                >
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-12 h-12 rounded-lg object-cover border-2 border-[var(--color-tertiary)]"
                                        style={{ backgroundColor: 'var(--color-light)' }}
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>{item.product.name}</div>
                                        <div className="text-xs text-[var(--color-muted)]">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-bold text-[var(--color-tertiary)] text-sm" style={{ fontFamily: 'var(--font-saira)' }}>₹{item.product.price * item.quantity}</div>
                                </motion.div>
                            ))}
                            <div className="flex justify-between items-center mt-4 border-t pt-4 border-[var(--color-light)]">
                                <span className="font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>Total</span>
                                <span className="text-base xs:text-lg font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>₹{total}</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Payment Method */}
                <motion.div
                    className="bg-[var(--color-white)] rounded-xl shadow-md p-4 mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    custom={3}
                >
                    <div className="font-semibold text-[var(--color-dark)] mb-2" style={{ fontFamily: 'var(--font-saira)' }}>Payment Method</div>
                    <div className="flex gap-3">
                        <button
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border font-semibold transition-colors cursor-pointer ${paymentMethod === 'PREPAID' ? 'bg-[var(--color-tertiary)] text-[var(--color-white)] border-[var(--color-tertiary)]' : 'bg-[var(--color-light)] text-[var(--color-tertiary)] border-[var(--color-light)]'}`}
                            onClick={() => setPaymentMethod('PREPAID')}
                        >
                            <FaCreditCard /> Prepaid
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border font-semibold transition-colors cursor-pointer ${paymentMethod === 'COD' ? 'bg-[var(--color-tertiary)] text-[var(--color-white)] border-[var(--color-tertiary)]' : 'bg-[var(--color-light)] text-[var(--color-tertiary)] border-[var(--color-light)]'}`}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            <FaMoneyBillWave /> Cash on Delivery
                        </button>
                    </div>
                </motion.div>

                {/* Pay Now Button */}
                <motion.div
                    className="mt-4"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    custom={4}
                >
                    <button
                        className="w-full py-3 rounded-xl bg-[var(--color-tertiary)] text-[var(--color-white)] font-bold text-lg shadow-lg hover:bg-[var(--color-dark)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        style={{ fontFamily: 'var(--font-saira)' }}
                        onClick={handlePayNow}
                        disabled={paying || cart.length === 0 || addresses.length === 0}
                    >
                        {paying ? (
                            <span>Processing...</span>
                        ) : paymentMethod === 'PREPAID' ? (
                            <>
                                <FaCreditCard /> Pay Securely & Place Order
                            </>
                        ) : (
                            <>
                                <FaMoneyBillWave /> Place Order (COD)
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;
