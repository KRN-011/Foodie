import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaShoppingCart } from 'react-icons/fa';
import { useUser } from '../contexts/userContext';
import LoadingSpinner from './LoadingSpinner';
import { useCart } from '../contexts/cartContext';
import { useMediaQuery } from 'react-responsive'
import { useOrder } from '../contexts/orderContext';
import { MdOutlineNewReleases } from "react-icons/md";

const Navbar = () => {

    // refs
    const lastY = useRef(0);

    const [menuOpen, setMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const [isHidden, setIsHidden] = React.useState(false);

    const islt768 = useMediaQuery({ query: "(max-width: 768px)" })
    const islt640 = useMediaQuery({ query: "(max-width: 640px)" })

    // navbar auto close animation on scroll
    useMotionValueEvent(scrollY, "change", (y) => {
        const diff = y - lastY.current;
        if (Math.abs(diff) > 5) {
            setIsHidden(diff > 0 && y > 60);
        }
        lastY.current = y;
    })

    const navbarVariants = {
        hidden: {
            y: "-100%",
            width: islt640 ? '70%' : islt768 ? '50%' : '30%',
            opacity: 1,
            backgroundColor: '#A5B68D',
            transition: {
                y: {
                    delay: 0.1,
                    ease: "circOut"
                },
                width: {
                    duration: 0.2
                },
            }
        },
        visible: {
            y: 0,
            width: '100%',
            opacity: 1,
            backgroundColor: '#ffffff',
            transition: {
                y: {
                    delay: 0.1,
                    ease: "backOut"
                },
                width: {
                    duration: 0.2
                },
                backgroundColor: {
                    duration: 0.2
                }
            }
        }
    }

    // get user from context
    const { isAuthenticated, logout, isLoading } = useUser();
    const { cartCount } = useCart();
    const { isLiveOrderExists } = useOrder();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const navLinks = [
        { name: 'Home', to: '/' },
        { name: 'Menu', to: '/menu' },
        { name: 'Orders', to: '/orders' },
    ];

    if (isLoading) {
        return (
            <div className='w-full sticky my-5 top-3 z-50 rounded-3xl mx-auto'>
                <LoadingSpinner />
            </div>
        )
    }


    return (
        <motion.nav
            variants={navbarVariants}
            initial={{ y: "20%", opacity: 0 }}
            animate={isHidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => {
                if (isHidden) {
                    setIsHidden(false);
                }
            }}
            className={`w-full sticky my-5 top-3 z-50 bg-[var(--color-white)] shadow-md rounded-3xl mx-auto ${isHidden ? "cursor-pointer" : ""}`}
        >
            <motion.div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
                animate={{ opacity: isHidden ? 0 : 1 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    {/* <img src="/logo192.png" alt="Logo" className="w-8 h-8" /> */}
                    <span className="text-lg font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Foodie</span>
                </Link>
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <motion.div
                            key={link.name}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link
                                to={link.to}
                                className={`text-[var(--color-dark)] font-semibold px-2 py-1 rounded relative transition-colors ${location.pathname === link.to ? 'bg-[var(--color-tertiary)] text-[var(--color-white)]' : 'hover:bg-[var(--color-light)]'}`}
                                style={{ fontFamily: 'var(--font-saira)' }}
                            >
                                {link.name}
                                {link.name === 'Orders' && isLiveOrderExists() && (
                                    <span className="absolute top-[-20%] right-[-10%] bg-[var(--color-error)] text-[var(--color-white)] rounded-full flex items-center justify-center text-xs">
                                        <MdOutlineNewReleases size={17}/>
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>
                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors relative" style={{ fontFamily: 'var(--font-saira)' }}>
                                <FaShoppingCart /> Cart
                                {cartCount > 0 && (
                                    <span className="absolute top-[-25%] right-[-10%] bg-[var(--color-error)] text-[var(--color-white)] rounded-full py-0.5 px-1 flex items-center justify-center text-xs">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-error)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors"
                                style={{ fontFamily: 'var(--font-saira)' }}
                            >
                                <FaSignOutAlt /> Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }}>
                                <FaSignInAlt /> Login
                            </Link>
                            <Link to="/register" className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] font-semibold hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }}>
                                <FaUserPlus /> Register
                            </Link>
                        </>
                    )}
                </div>
                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 rounded bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                    <FaBars className="text-[var(--color-dark)]" />
                </button>
            </motion.div>
            {/* Mobile Menu */}
            <AnimatePresence mode='wait'>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-[var(--color-white)] shadow-lg px-4 py-2 pb-8 rounded-b-3xl flex flex-col gap-2 overflow-hidden"
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className={`text-[var(--color-dark)] font-semibold px-2 py-1 rounded transition-colors ${location.pathname === link.to ? 'bg-[var(--color-tertiary)] text-[var(--color-white)]' : 'hover:bg-[var(--color-light)]'}`}
                                style={{ fontFamily: 'var(--font-saira)' }}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 mt-2">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/cart" className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }}>
                                        <FaShoppingCart /> Cart
                                    </Link>
                                    <button
                                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                                        className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-error)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors"
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }} onClick={() => setMenuOpen(false)}>
                                        <FaSignInAlt /> Login
                                    </Link>
                                    <Link to="/register" className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] font-semibold hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors" style={{ fontFamily: 'var(--font-saira)' }} onClick={() => setMenuOpen(false)}>
                                        <FaUserPlus /> Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar; 