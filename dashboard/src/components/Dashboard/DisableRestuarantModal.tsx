import { AnimatePresence, motion } from 'framer-motion'
import { IoMdCloseCircle, IoMdTrash } from 'react-icons/io'
import { useState, useEffect } from 'react'
import { deleteRestaurantById } from '../../services/apiService';

const DisableRestuarantModal = ({ open, onClose, restaurants }: { open: boolean, onClose: () => void, restaurants: any[] }) => {
    const [restaurantList, setRestaurantList] = useState<any[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            setRestaurantList(restaurants.filter((rest: any) => rest.deleted === false));
        } else {
            setRestaurantList([]);
        }
    }, [open, restaurants]);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteRestaurantById(id);
            setRestaurantList(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            // Optionally show error toast
        }
        setDeletingId(null);
        setConfirmId(null);
    };

    return (
        <AnimatePresence>
            {
                open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
                    >
                        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                            <div className='bg-white max-h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-lg p-6 w-full max-w-md mx-2 flex flex-col gap-4 relative'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-xl font-bold'>Disable Restaurant</h3>
                                    <button type="button" className="text-3xl text-[var(--color-error)] cursor-pointer" onClick={onClose}><IoMdCloseCircle size={25} /></button>
                                </div>
                                <div className='flex flex-col gap-2 mt-4'>
                                    {restaurantList.length === 0 && <span className='text-center text-gray-500'>No restaurants found.</span>}
                                    {restaurantList.map((rest: any) => (
                                        <div key={rest.id} className='flex items-center justify-between bg-light rounded-xl p-2'>
                                            <span className='text-base'>{rest.restaurantProfile?.name || rest.email}</span>
                                            <button
                                                type="button"
                                                className='text-2xl text-[var(--color-error)] hover:text-red-700 cursor-pointer flex items-center justify-center'
                                                onClick={() => setConfirmId(rest.id)}
                                                disabled={deletingId === rest.id}
                                            >
                                                {deletingId === rest.id ? 'Deleting...' : <IoMdTrash size={22} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Confirmation Modal */}
                        <AnimatePresence>
                            {confirmId !== null && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
                                >
                                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-4 relative">
                                        <button type="button" className="absolute top-2 right-2 text-2xl text-[var(--color-error)]" onClick={() => setConfirmId(null)}><IoMdCloseCircle size={22} /></button>
                                        <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
                                        <p>Are you sure you want to delete this restaurant?</p>
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                type="button"
                                                className="flex-1 py-2 rounded bg-[var(--color-muted)] text-white font-semibold cursor-pointer"
                                                onClick={() => setConfirmId(null)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="flex-1 py-2 rounded bg-[var(--color-error)] text-white font-semibold cursor-pointer"
                                                onClick={() => handleDelete(confirmId)}
                                                disabled={deletingId === confirmId}
                                            >
                                                {deletingId === confirmId ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}

export default DisableRestuarantModal
