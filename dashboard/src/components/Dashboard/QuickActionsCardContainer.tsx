import { IoMdAdd } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { MdDomainDisabled } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

const QuickActionsCardContainer = ({ handleProductModelOpen, handleProductDeleteModalOpen, handleDisableRestuarantModalOpen, handleEditUserModalOpen }: { handleProductModelOpen: () => void, handleProductDeleteModalOpen: () => void, handleDisableRestuarantModalOpen: () => void, handleEditUserModalOpen: () => void }) => {

    const [quickActionClicked, setQuickActionClicked] = useState({
        addProduct: false,
        editProduct: false,
        deleteProduct: false,
        disableRestaurant: false,
        editUser: false,
    });

    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-2 min-[500px]:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    className="flex flex-col gap-2 items-center justify-start"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileTap={{ scale: 0.9, border: "1px solid black" }}
                        className="bg-light rounded-full w-20 h-20 flex items-center justify-center"
                        onClick={() => {
                            setQuickActionClicked({ ...quickActionClicked, addProduct: true });
                            handleProductModelOpen();
                        }}
                    >
                        <IoMdAdd size={25} />
                    </motion.div>
                    <div className="text-sm font-medium text-center my-auto">
                        Add Product
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1 }}
                    className="flex flex-col gap-2 items-center justify-start"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileTap={{ scale: 0.9, border: "1px solid black" }}
                        className="bg-light rounded-full w-20 h-20 flex items-center justify-center"
                        onClick={() => {
                            setQuickActionClicked({ ...quickActionClicked, deleteProduct: true });
                            handleProductDeleteModalOpen();
                        }}
                    >
                        <MdOutlineDelete size={25} />
                    </motion.div>
                    <div className="text-sm font-medium text-center my-auto">
                        Delete Product
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                    className="flex flex-col gap-2 items-center justify-start"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileTap={{ scale: 0.9, border: "1px solid black" }}
                        className="bg-light rounded-full w-20 h-20 flex items-center justify-center"
                        onClick={() => {
                            setQuickActionClicked({ ...quickActionClicked, disableRestaurant: true });
                            handleDisableRestuarantModalOpen();
                        }}
                    >
                        <MdDomainDisabled size={25} />
                    </motion.div>
                    <div className="text-sm font-medium text-center leading-tight max-w-11/12 my-auto">
                        Disable Restaurant
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="flex flex-col gap-2 items-center justify-start"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileTap={{ scale: 0.9, border: "1px solid black" }}
                        className="bg-light rounded-full w-20 h-20 flex items-center justify-center"
                        onClick={() => {
                            setQuickActionClicked({ ...quickActionClicked, editUser: true });
                            handleEditUserModalOpen();
                        }}
                    >
                        <FaUserEdit size={25} />
                    </motion.div>
                    <div className="text-sm font-medium text-center my-auto">
                        Edit User
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default QuickActionsCardContainer
