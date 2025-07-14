import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { IoMdCloseCircle, IoMdSearch } from 'react-icons/io'
import LoadingSkeleton from '../LoadingSkeleton'
import { getAllRestaurants } from '../../services/apiService'
import CustomDropdown from '../CustomDropdown';
import { getAllCategories } from '../../services/apiService';
import { IoIosArrowDown } from "react-icons/io";
import { deleteProduct } from '../../services/apiService';

// Product details modal
const ProductDetailsModal = ({ open, onclose, product, onDelete }: { open: boolean, onclose: () => void, product: any, onDelete: () => void }) => {

    const [productDetails, setProductDetails] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (open) {
            setProductDetails(product);
        }
    }, [open, product]);

    if (!productDetails) return null;

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
                        <div className='bg-white max-h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-lg p-6 w-full max-w-md mx-2 flex flex-col gap-4 relative'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-xl font-bold'>Product Details</h3>
                                <button type="button" className="text-3xl text-[var(--color-error)] cursor-pointer" onClick={onclose}><IoMdCloseCircle size={25} /></button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Name:</span>
                                    <span>{productDetails.name}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Price:</span>
                                    <span>₹{productDetails.price}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Description:</span>
                                    <span>{productDetails.description}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Ingredients:</span>
                                    <span>{productDetails.ingredients && productDetails.ingredients.length > 0 ? productDetails.ingredients.join(', ') : 'N/A'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Category:</span>
                                    <div className="flex items-center gap-2">
                                        {productDetails.category && productDetails.category.image && (
                                            <img src={productDetails.category.image} alt={productDetails.category.name} className="w-8 h-8 rounded-full" />
                                        )}
                                        <span>{productDetails.category ? productDetails.category.name : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Images:</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {productDetails.images && productDetails.images.length > 0 ? productDetails.images.map((img: string, idx: number) => (
                                            <img key={idx} src={img} alt={productDetails.name} className="w-14 h-14 object-cover rounded" />
                                        )) : 'N/A'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Status:</span>
                                    <span>{productDetails.status}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Featured:</span>
                                    <span>{productDetails.featured ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">Restaurants:</span>
                                    <span>{productDetails.restaurants && productDetails.restaurants.length > 0 ? productDetails.restaurants.map((r: any) => r.restaurantProfile?.name || r.email).join(', ') : 'N/A'}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mt-4 py-2 rounded bg-[var(--color-error)] text-white font-semibold cursor-pointer"
                                onClick={async () => {
                                    setDeleting(true);
                                    await onDelete();
                                    setDeleting(false);
                                }}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete Product'}
                            </button>
                        </div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}

const DeleteProductDashboardModal = ({ open, onClose, products }: { open: boolean, onClose: () => void, products: any[] }) => {

    const [allProducts, setAllProducts] = useState(products);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(allProducts);
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [pendingRestaurant, setPendingRestaurant] = useState<any>(null);
    const [pendingCategory, setPendingCategory] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [productDetailsModalOpen, setProductDetailsModalOpen] = useState(false);

    const fetchRestaurants = useCallback(async () => {
        const response = await getAllRestaurants();
        if (response.success) {
            setRestaurants(response.data);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        const response = await getAllCategories();
        if (response.success) {
            setCategories(response.categories || []);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchRestaurants();
            fetchCategories();
        }
    }, [fetchRestaurants, fetchCategories, open]);

    useEffect(() => {
        setAllProducts(products.filter((product: any) => product.status !== 'DELETED').sort((a: any, b: any) => a.name.localeCompare(b.name)));
    }, [products]);

    useEffect(() => {
        if (search === '') {
            setFilteredProducts(allProducts);
        } else {
            setFilteredProducts(
                allProducts.filter((product: any) =>
                    product.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [allProducts, search]);

    // Add filtering by selectedRestaurant and selectedCategory
    useEffect(() => {
        let filtered = allProducts;
        if (selectedRestaurant) {
            filtered = filtered.filter((product: any) =>
                product.restaurants && product.restaurants.some((r: any) => r.id === selectedRestaurant)
            );
        }
        if (selectedCategory) {
            filtered = filtered.filter((product: any) =>
                product.category && (product.category.id === selectedCategory)
            );
        }
        if (search === '') {
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(
                filtered.filter((product: any) =>
                    product.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [allProducts, search, selectedRestaurant, selectedCategory]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    // close function for product details modal
    const closeProductDetailsModal = () => {
        setSelectedProduct(null);
        setProductDetailsModalOpen(false);
    }

    const handleDeleteProduct = async () => {
        if (selectedProduct && selectedProduct.id) {
            await deleteProduct(selectedProduct.id);
            closeProductDetailsModal();
            // Optionally refetch products or call a prop to do so
        }
    }

    return ReactDOM.createPortal(
        <AnimatePresence>
            {
                open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
                        >
                            <div className='bg-white max-h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-lg p-6 w-full max-w-md mx-2 flex flex-col gap-4 relative'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-xl font-bold'>Delete Product</h3>
                                    <button type="button" className="text-3xl text-[var(--color-error)] cursor-pointer" onClick={onClose}><IoMdCloseCircle size={25} /></button>
                                </div>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className='flex flex-col gap-2 bg-light border rounded-xl p-2'
                                >
                                    <div onClick={() => setFiltersExpanded(!filtersExpanded)} className='flex items-center px-4 justify-between cursor-pointer'>
                                        <p className='text-base font-bold'>Filters</p>
                                        <button type="button" className="text-3xl cursor-pointer"><IoIosArrowDown size={25} /></button>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {filtersExpanded && (
                                            <motion.div
                                                key="filters-content"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto', transition: { opacity: { delay: 0.3 } } }}
                                                exit={{ opacity: 0, height: 0, transition: { height: { delay: 0.2 } } }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <input type="text" placeholder='Search' className='w-full rounded-xl p-1 bg-white mb-3' onChange={handleSearch} />
                                                <CustomDropdown
                                                    label="Restaurant"
                                                    value={pendingRestaurant}
                                                    onChange={setPendingRestaurant}
                                                    options={restaurants.map((rest: any) => ({ value: rest.id, label: rest.restaurantProfile?.name || rest.email }))}
                                                    placeholder="Select Restaurant"
                                                    searchable
                                                />
                                                <CustomDropdown
                                                    label="Category"
                                                    value={pendingCategory}
                                                    onChange={setPendingCategory}
                                                    options={categories.map((cat: any) => ({ value: cat.id, label: cat.name }))}
                                                    placeholder="Select Category"
                                                    searchable
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        className="flex-1 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedRestaurant(pendingRestaurant);
                                                            setSelectedCategory(pendingCategory);
                                                        }}
                                                    >
                                                        Save Filters
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="flex-1 py-2 rounded bg-[var(--color-muted)] text-white font-semibold cursor-pointer"
                                                        onClick={() => {
                                                            setPendingRestaurant(null);
                                                            setSelectedRestaurant(null);
                                                            setPendingCategory(null);
                                                            setSelectedCategory(null);
                                                            setSearch('');
                                                        }}
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                {
                                    // Show skeletons if loading (no products and not searching)
                                    products.length === 0 && search === '' ? (
                                        <div className='flex flex-col gap-2 w-full min-h-[200px] items-center justify-center'>
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <LoadingSkeleton key={idx} className='w-full h-10' />
                                            ))}
                                        </div>
                                    )
                                        // Show product list if there are filtered products
                                        : filteredProducts.length > 0 ? (
                                            <div className='flex flex-col gap-2'>
                                                {filteredProducts.map((product) => (
                                                    <div key={product.id} className='flex items-center justify-between bg-light rounded-xl p-2' onClick={() => {
                                                        setSelectedProduct(product);
                                                        setProductDetailsModalOpen(true);
                                                    }}>
                                                        <div className='flex items-center gap-2 max-w-4/5'>
                                                            <p className='text-sm font-medium'>{product.name}</p>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <img src={product.images[0]} alt={product.name} className='w-10 h-10 rounded-full' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                            // Show "No products found" if there are products but search yields nothing
                                            : products.length > 0 && filteredProducts.length === 0 ? (
                                                <div className='flex flex-col gap-2 w-full min-h-[200px] items-center justify-center'>
                                                    <p className='text-sm font-medium'>No products found</p>
                                                </div>
                                            )
                                                // Show "No products available" if there are no products at all
                                                : (
                                                    <div className='flex flex-col gap-2 w-full min-h-[200px] items-center justify-center'>
                                                        <p className='text-sm font-medium'>No products available</p>
                                                    </div>
                                                )
                                }
                            </div>
                        </motion.div>

                        {/* product details modal */}
                        <ProductDetailsModal open={productDetailsModalOpen} onclose={closeProductDetailsModal} product={selectedProduct} onDelete={handleDeleteProduct} />
                    </>
                )
            }
        </AnimatePresence>,
        document.body
    )
}

export default DeleteProductDashboardModal
