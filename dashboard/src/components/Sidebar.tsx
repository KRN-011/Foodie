import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiHamburgerDuotone } from "react-icons/pi";
import { GiKnifeFork } from "react-icons/gi";
import { IoMdHome, IoMdExit } from "react-icons/io";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { FaHotel } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';

const sidebarLinks = [
    { label: 'Dashboard', icon: <IoMdHome size={25} />, href: '/', access: 'all' },
    { label: 'Orders', icon: <FaShoppingCart size={20} />, href: '/orders', access: 'all' },
    { label: 'Products', icon: <AiFillProduct size={20} />, href: '/products', access: 'all' },
    { label: 'Profile', icon: <FaUser size={20} />, href: '/profile', access: 'restaurant' },
    { label: 'All Users', icon: <HiUserGroup size={20} />, href: '/users', access: 'admin' },
];

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const { logout, isAdmin, isLoading } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    // Sidebar content
    const sidebarContent = (
        <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:static top-0 left-0 h-screen w-64 z-40 flex flex-col gap-4 p-6 shadow-lg md:shadow-none"
            style={{ backgroundColor: 'var(--color-secondary)', fontFamily: 'var(--font-saira)' }}
        >
            <nav className="flex flex-col gap-4 mt-20">
                {sidebarLinks.filter(link => link.access === 'all' || (link.access === 'admin' && isAdmin) || (link.access === 'restaurant' && !isAdmin)).map(link => (
                    <div className='flex items-center gap-3'>
                        <Link
                            key={link.label}
                            to={link.href}
                            className="flex items-center w-full gap-3 px-3 py-2 rounded transition-colors text-base font-medium"
                            style={{ color: 'var(--color-dark)', backgroundColor: 'var(--color-light)' }}
                        >
                            <span className="text-lg">{link.icon}</span>
                            {link.label}
                        </Link>
                    </div>
                ))}
                <motion.button
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center gap-3 py-2 px-3 rounded transition-colors text-base font-medium bg-[var(--color-light)] text-[var(--color-error)] cursor-pointer' onClick={() => handleLogout()}>
                    <IoMdExit size={20} />
                    Logout
                </motion.button>
            </nav>
        </motion.aside>
    );

    if (isLoading) {
        return null;
    }

    return (
        <>
            {/* Hamburger for mobile */}
            <button
                className="fixed top-6 left-6 z-50 md:hidden p-2 rounded focus:outline-none"
                style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--color-white)' }}
                onClick={() => setOpen(o => !o)}
                aria-label={open ? 'Close sidebar' : 'Open sidebar'}
            >
                <AnimatePresence mode='wait'>
                    {open ? (
                        <motion.div
                            key='close'
                            initial={{ rotate: 180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GiKnifeFork size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='open'
                            initial={{ rotate: 180, opacity: 0 }}
                            animate={{ rotate: 360, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PiHamburgerDuotone size={20} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Overlay for mobile when sidebar is open */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpen(false)}
                        style={{ backdropFilter: 'brightness(0.7)' }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar for mobile (slide in/out) */}
            <AnimatePresence>
                {open && (
                    <div className="md:hidden">
                        {sidebarContent}
                    </div>
                )}
            </AnimatePresence>

            {/* Sidebar always visible on md+ screens */}
            <div className="hidden md:block h-screen">
                <aside
                    className="static h-full w-64 z-40 flex flex-col gap-4 p-6 shadow-none"
                    style={{ backgroundColor: 'var(--color-secondary)', fontFamily: 'var(--font-saira)' }}
                >
                    <nav className="flex flex-col gap-4">
                        {sidebarLinks.filter(link => link.access === 'all' || (link.access === 'admin' && isAdmin) || (link.access === 'restaurant' && !isAdmin)).map(link => (
                            <motion.div
                                key={link.label}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={link.href}
                                    className="flex items-center gap-3 px-3 py-2 rounded transition-colors text-base font-medium"
                                    style={{ color: 'var(--color-dark)', backgroundColor: 'var(--color-light)' }}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.button
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center gap-3 py-2 px-3 rounded transition-colors text-base font-medium bg-[var(--color-light)] text-[var(--color-error)] cursor-pointer' onClick={() => handleLogout()}>
                            <IoMdExit size={20} />
                            Logout
                        </motion.button>
                    </nav>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
