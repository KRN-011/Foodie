import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface ProductTableProps {
    products: any[];
    onEdit?: (product: any) => void;
    onDelete?: (product: any) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
    const [imageDropdown, setImageDropdown] = useState<number | null>(null);
    const [restaurantDropdown, setRestaurantDropdown] = useState<number | null>(null);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [enlargedLogo, setEnlargedLogo] = useState<string | null>(null);
    const [actionMenu, setActionMenu] = useState<number | null>(null);

    return (
        <div className="w-full absolute min-w-[700px] overflow-x-auto no-scrollbar h-full">
            <table className="w-full text-sm md:text-base bg-[var(--color-white)] rounded-xl">
                <thead>
                    <tr className="bg-[var(--color-secondary)] text-[var(--color-dark)]">
                        <th className="p-2">#</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Price (₹)</th>
                        <th className="p-2">Images</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Restaurants</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.length > 0 && (
                            <>
                                {products.map((product, idx) => (
                                    <tr key={product.id} className="border-b last:border-none hover:bg-[var(--color-secondary)] transition-colors">
                                        <td className="p-2 text-center">{idx + 1}</td>
                                        <td className="p-2 text-center">{product.name}</td>
                                        <td className="p-2 text-center">{product.price.toFixed(2)}</td>
                                        <td className="p-2 text-center relative">
                                            <button
                                                className="underline text-[var(--color-tertiary)] cursor-pointer"
                                                onClick={() => setImageDropdown(imageDropdown === idx ? null : idx)}
                                            >
                                                {product.images?.length || 0} images
                                            </button>
                                            <AnimatePresence>
                                                {imageDropdown === idx && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute left-1/2 -translate-x-1/2 z-20 bg-[var(--color-white)] border rounded shadow p-2 mt-2 flex flex-wrap gap-2 min-w-[100px] justify-center min-h-[100px]"
                                                    >
                                                        {product.images?.map((img: string, i: number) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt={`product-img-${i}`}
                                                                className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-105 transition"
                                                                onClick={() => setEnlargedImage(img)}
                                                            />
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                        <td className="p-2 text-center">{product.category?.name || '-'}</td>
                                        <td className="p-2 text-center relative">
                                            <button
                                                className="underline text-[var(--color-tertiary)] cursor-pointer"
                                                onClick={() => setRestaurantDropdown(restaurantDropdown === idx ? null : idx)}
                                            >
                                                {product?.restaurants ? product?.restaurants?.length : 0} restaurant{product?.restaurants?.length !== 1 ? 's' : ''}
                                            </button>
                                            <AnimatePresence>
                                                {restaurantDropdown === idx && product.restaurants && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute left-1/2 -translate-x-1/2 z-20 bg-[var(--color-white)] border rounded shadow p-2 mt-2 flex flex-col gap-2 min-w-[150px] justify-center min-h-[50px]"
                                                    >
                                                        {product.restaurants.length === 0 && <span className="text-xs text-[var(--color-muted)]">No restaurants</span>}
                                                        {product.restaurants.map((rest: any, rIdx: number) => (
                                                            <div key={rest.id || rIdx} className="flex items-center gap-2">
                                                                {rest.restaurantProfile?.logo && (
                                                                    <img
                                                                        src={rest.restaurantProfile.logo}
                                                                        alt={rest.restaurantProfile.name}
                                                                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                                                        onClick={() => setEnlargedLogo(rest.restaurantProfile.logo)}
                                                                    />
                                                                )}
                                                                <span>{rest.restaurantProfile?.name || rest.email}</span>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                        <td className="p-2 text-center">
                                            <span className="px-2 py-1 rounded text-xs font-semibold"
                                                style={{
                                                    backgroundColor:
                                                        product.status === 'ACTIVE'
                                                            ? 'var(--color-quaternary)'
                                                            : product.status === 'INACTIVE'
                                                                ? 'var(--color-muted)'
                                                                : 'var(--color-error)',
                                                    color: 'var(--color-white)',
                                                }}
                                            >
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="p-2 text-center relative">
                                            <button
                                                className="p-1 rounded-full hover:bg-[var(--color-light)]"
                                                onClick={() => setActionMenu(actionMenu === idx ? null : idx)}
                                            >
                                                <BsThreeDotsVertical size={18} />
                                            </button>
                                            <AnimatePresence>
                                                {actionMenu === idx && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 8 }}
                                                        transition={{ duration: 0.18 }}
                                                        className="absolute right-0 z-30 mt-2 w-32 bg-[var(--color-white)] border border-[var(--color-light)] rounded shadow-lg flex flex-col"
                                                    >
                                                        <button
                                                            className="px-4 py-2 text-left hover:bg-[var(--color-tertiary)] hover:text-white transition-colors"
                                                            onClick={() => { setActionMenu(null); onEdit && onEdit(product); }}
                                                            style={{ fontFamily: 'var(--font-saira)' }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 text-left hover:bg-[var(--color-error)] hover:text-white transition-colors"
                                                            onClick={() => { setActionMenu(null); onDelete && onDelete(product); }}
                                                            style={{ fontFamily: 'var(--font-saira)' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )
                    }
                </tbody>
            </table>

            {/* Enlarged Image Modal */}
            <AnimatePresence>
                {enlargedImage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEnlargedImage(null)}
                    >
                        <motion.img
                            src={enlargedImage}
                            alt="enlarged"
                            className="max-w-[90vw] max-h-[80vh] rounded shadow-lg bg-white"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                        />
                        <button
                            className="absolute top-4 right-4 bg-[var(--color-error)] text-white rounded-full p-2 text-lg"
                            onClick={() => setEnlargedImage(null)}
                        >
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enlarged Logo Modal */}
            <AnimatePresence>
                {enlargedLogo && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEnlargedLogo(null)}
                    >
                        <motion.img
                            src={enlargedLogo}
                            alt="enlarged-logo"
                            className="max-w-[90vw] max-h-[80vh] rounded-full shadow-lg bg-white"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                        />
                        <button
                            className="absolute top-4 right-4 bg-[var(--color-error)] text-white rounded-full p-2 text-lg"
                            onClick={() => setEnlargedLogo(null)}
                        >
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductTable; 