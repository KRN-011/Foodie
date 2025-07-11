import { useState, useEffect, useRef } from "react";
import { PiHamburger, PiHouse } from "react-icons/pi";
import { CiCircleList } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { LuHotel } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";

const SIDEBAR_WIDTH = 256; 

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonActive, setButtonActive] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { logout } = useUser();
    const navigate = useNavigate();

    // Handle button fade after 1s of inactivity
    useEffect(() => {
        if (buttonActive) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setButtonActive(false), 1000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [buttonActive]);

    // When menu opens, make button visible
    useEffect(() => {
        if (isOpen) setButtonActive(true);
    }, [isOpen]);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
        setButtonActive(true);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <>
            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: -SIDEBAR_WIDTH }}
                        animate={{ x: 0 }}
                        exit={{ x: -SIDEBAR_WIDTH }}
                        transition={{ ease: "easeInOut" }}
                        className="fixed top-0 left-0 h-full z-[98] flex flex-col"
                    >
                        <div className="h-11/12 w-64 bg-tertiary rounded-r-3xl my-auto shadow-lg flex flex-col justify-center gap-4">
                            <Link to="/" onClick={() => setIsOpen(false)}>
                                <div className="flex items-end justify-start gap-5 px-10">
                                    <motion.div className="flex items-center justify-center">
                                        <PiHouse size={25} className="text-white" />
                                    </motion.div>
                                    <span className="text-white text-xl font-medium">Home</span>
                                </div>
                            </Link>
                            <Link to="/orders" onClick={() => setIsOpen(false)}>
                                <div className="flex items-end justify-start gap-5 px-10">
                                    <motion.div className="flex items-center justify-center">
                                        <CiCircleList size={30} className="text-white" />
                                    </motion.div>
                                    <span className="text-white text-xl font-medium">Orders</span>
                                </div>
                            </Link>
                            <Link to="/products" onClick={() => setIsOpen(false)}>
                                <div className="flex items-end justify-start gap-5 px-10">
                                    <motion.div className="flex items-center justify-center">
                                        <AiOutlineProduct size={30} className="text-white" />
                                    </motion.div>
                                    <span className="text-white text-xl font-medium">Products</span>
                                </div>
                            </Link>
                            <Link to="/users" onClick={() => setIsOpen(false)}>
                                <div className="flex items-end justify-start gap-5 px-10">
                                    <motion.div className="flex items-center justify-center">
                                        <FaRegUser size={30} className="text-white" />
                                    </motion.div>
                                    <span className="text-white text-xl font-medium">Users</span>
                                </div>
                            </Link>
                            <Link to="/restaurants" onClick={() => setIsOpen(false)}>
                                <div className="flex items-end justify-start gap-5 px-10">
                                    <motion.div className="flex items-center justify-center">
                                        <LuHotel size={30} className="text-white" />
                                    </motion.div>
                                    <span className="text-white text-xl font-medium">Restaurants</span>
                                </div>
                            </Link>
                            <Link to="/logout" onClick={handleLogout}>
                                <div className="flex items-end justify-start gap-5 px-10">
                                    <motion.div className="flex items-center justify-center">
                                        <IoIosLogOut size={30} className="text-red-500" />
                                    </motion.div>
                                    <span className="text-red-500 text-xl font-medium">Logout</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Hamburger button, moves with sidebar and fades out after 1s */}
            <motion.div
                className="fixed top-20 z-[99] cursor-pointer"
                style={{ left: isOpen ? SIDEBAR_WIDTH : 0 }}
                animate={{ left: isOpen ? SIDEBAR_WIDTH : 0, opacity: buttonActive ? 1 : 0.5 }}
                transition={{ ease: "easeInOut" }}
                onClick={handleButtonClick}
            >
                <div className="bg-tertiary rounded-r-full text-white p-4 w-fit h-fit hamburger-before">
                    <PiHamburger size={24} className="animate-pulse" />
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
