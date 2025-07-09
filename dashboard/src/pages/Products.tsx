import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductTable from '../components/ProductTable';
import AddProductMenu from '../components/AddProductMenu';
import { getAllProducts, getAllCategories, getAllRestaurants, deleteProduct } from '../services/apiService';
import { useUser } from '../contexts/userContext';
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<any | null>(null);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    // get user context
    const { user, isAuthenticated, isAdmin } = useUser();

    const fetchAll = async () => {
        setLoading(true);
        try {
            let prods, cats, rests;
            if (isAdmin) {
                [prods, cats, rests] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                    getAllRestaurants(),
                ]);
            } else {
                [prods, cats] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                ]);
                rests = { data: [] };
            }
            setProducts(prods.products || []);
            setCategories(cats.categories || []);
            setRestaurants(rests.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Edit handler
    const handleEdit = (product: any) => {
        setEditProduct(product);
        setAddOpen(true);
    };

    // Delete handler
    const handleDelete = (product: any) => {
        setDeleteProductId(product.id);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!deleteProductId) return;
        setDeleting(true);
        try {
            await deleteProduct(deleteProductId);
            toast.success('Product deleted');
            setDeleteProductId(null);
            fetchAll();
        } catch {
            toast.error('Failed to delete product');
        } finally {
            setDeleting(false);
        }
    };

    // Close edit modal
    const handleCloseEdit = () => {
        setEditProduct(null);
        setAddOpen(false);
    };

    return (
        <motion.div
            className="flex-1 flex flex-col p-2 sm:p-6 w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--font-saira)', overflowX: 'unset' }}
        >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                <h1 className="text-2xl font-bold text-[var(--color-dark)] sm:max-md:ml-13">Products</h1>
                <button
                    className="px-4 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold shadow hover:bg-[var(--color-quaternary)] transition cursor-pointer"
                    onClick={() => { setAddOpen(true); setEditProduct(null); }}
                >
                    + Add Product
                </button>
            </div>
            <div className="mb-4 w-full flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-3 py-2 rounded border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: 'var(--color-tertiary)', background: 'var(--color-light)', color: 'var(--color-dark)' }}
                />
            </div>
            <div className='w-full relative h-full overflow-x-auto flex-1 flex flex-col border border-[var(--color-tertiary)]'>
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-[var(--color-muted)]">Loading...</div>
                ) : (
                    <div className="w-full">
                        <ProductTable
                            products={filteredProducts}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>
            <AddProductMenu
                open={addOpen}
                onClose={handleCloseEdit}
                onSave={fetchAll}
                categories={categories}
                restaurants={restaurants}
                refetchProducts={fetchAll}
                isAdmin={isAdmin}
                editProduct={editProduct}
            />
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteProductId && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-4 relative"
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                        >
                            <h3 className="text-lg font-bold mb-2 text-dark">Delete Product?</h3>
                            <p className="text-muted">Are you sure you want to delete this product? This action cannot be undone.</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="flex-1 py-2 rounded bg-muted text-white font-semibold cursor-pointer"
                                    onClick={() => setDeleteProductId(null)}
                                    disabled={deleting}
                                >Cancel</button>
                                <button
                                    className="flex-1 py-2 rounded bg-error text-white font-semibold cursor-pointer"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                >{deleting ? 'Deleting...' : 'Delete'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Products;
