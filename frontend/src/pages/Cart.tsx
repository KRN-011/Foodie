import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import { clearCart, getCart, updateCartItemQuantity } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../contexts/cartContext';
import FadeInView from '../components/FadeInView';

function debounce(fn: (...args: any[]) => void, ms: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

const Cart = () => {
    const { isAuthenticated, isLoading } = useUser();
    const { refreshCart } = useCart()
    const [cart, setCart] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchCart = async () => {
            try {
                const response = await getCart();
                if (response.success) {
                    setCart(response.cart.cartItems);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchCart();
    }, [isAuthenticated, navigate, isLoading]);

    const debouncedUpdateQty = useCallback(
        debounce(async (id: number, newQty: number) => {
            await updateCartItemQuantity(id, newQty);
            setCart(prev =>
                newQty === 0
                    ? prev.filter(item => item.id !== id)
                    : prev.map(item =>
                        item.id === id ? { ...item, quantity: newQty } : item
                    )
            );
            refreshCart()
        }, 400),
        []
    );

    const handleDecrement = (id: number) => {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        if (item.quantity > 1) {
            setCart(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );
            debouncedUpdateQty(id, item.quantity - 1);
        } else if (item.quantity === 1) {
            setCart(prev => prev.filter(item => item.id !== id));
            debouncedUpdateQty(id, 0);
        }
    };

    const handleIncrement = (id: number) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
        const item = cart.find(item => item.id === id);
        if (item) {
            debouncedUpdateQty(id, item.quantity + 1);
        }
    };

    const total = cart?.reduce((sum, item) => sum + item?.product?.price * item.quantity, 0).toFixed(2);

    if (isLoading) {
        return <LoadingSpinner />
    }

    const handleClearCart = async () => {
        try {
            const response = await clearCart();
            if (response.success) {
                setCart([]);
                refreshCart();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex-1 flex flex-col w-full items-center justify-center px-2">
            {cart?.length === 0 ? (
                <motion.div
                    className="flex flex-col items-center justify-center text-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <FaShoppingCart className="text-6xl text-[var(--color-tertiary)] mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold mb-2 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>
                        Oops! Your cart is feeling lonely.
                    </h2>
                    <p className="mb-6 text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>
                        Add some delicious food to make it happy!
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
                <FadeInView className='w-full max-w-2xl bg-[var(--color-white)] rounded-xl shadow-lg p-4 my-8'>
                    <div className=''>
                        <motion.div
                            className="w-full rounded-xl flex flex-col gap-4"
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <h2 className="text-xl font-bold text-center mb-2 text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                Your Cart
                            </h2>
                            <div className='w-full flex flex-col'>
                                <AnimatePresence mode='popLayout'>
                                    {cart?.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.25, delay: idx * 0.05 }}
                                            exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                                            layout="position"
                                            className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-light)] transition-colors"
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.name}
                                                className="w-14 h-14 rounded-lg object-cover border-2 border-[var(--color-tertiary)]"
                                                style={{ backgroundColor: 'var(--color-light)' }}
                                            />
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm md:text-base text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>{item?.product?.name}</div>
                                                <div className="text-xs md:text-sm text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>₹{item?.product?.price.toFixed(2)}</div>
                                            </div>
                                            <div className="flex items-center gap-1 xs:gap-2">
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-1 xs:p-2 rounded-full bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors duration-300 cursor-pointer"
                                                    onClick={() => handleDecrement(item.id)}
                                                >
                                                    <FaMinus size={12} />
                                                </motion.button>
                                                <span className="w-6 text-center font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>{item.quantity}</span>
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-1 xs:p-2 rounded-full bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors duration-300 cursor-pointer"
                                                    onClick={() => handleIncrement(item.id)}
                                                >
                                                    <FaPlus size={12} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="flex justify-between items-center mt-4 border-t pt-4 border-[var(--color-light)]">
                                <span className="font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>Total</span>
                                <span className="text-base xs:text-lg font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>₹{total}</span>
                            </div>
                            <div className='flex flex-col md:flex-row gap-3'>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-2 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold shadow hover:bg-[var(--color-dark)] transition-colors duration-300 cursor-pointer"
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                    onClick={() => handleClearCart()}
                                >
                                    Clear Cart
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-2 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold shadow hover:bg-[var(--color-dark)] transition-colors duration-300 cursor-pointer"
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </FadeInView>
            )}
        </div>
    );
};

export default Cart;
