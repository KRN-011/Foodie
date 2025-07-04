import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaShoppingCart } from 'react-icons/fa';
import { useUser } from '../contexts/userContext';
import LoadingSpinner from './LoadingSpinner';
import { useCart } from '../contexts/cartContext';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // get user from context
    const { isAuthenticated, logout, isLoading } = useUser();
    const { cartCount } = useCart();

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
        return <LoadingSpinner />
    }

    return (
        <nav className="w-full bg-[var(--color-white)] shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
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
                                className={`text-[var(--color-dark)] font-semibold px-2 py-1 rounded transition-colors ${location.pathname === link.to ? 'bg-[var(--color-tertiary)] text-[var(--color-white)]' : 'hover:bg-[var(--color-light)]'}`}
                                style={{ fontFamily: 'var(--font-saira)' }}
                            >
                                {link.name}
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
            </div>
            {/* Mobile Menu */}
            <AnimatePresence mode='wait'>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-[var(--color-white)] shadow-lg px-4 py-2 flex flex-col gap-2 overflow-hidden"
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
        </nav>
    );
};

export default Navbar; 