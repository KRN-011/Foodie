import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryScroll from '../components/Home/CategoryScroll';
import { addToCart, getAllProducts, getCart, updateCartItemQuantity } from '../services/apiService';
import { FaSearch, FaFilter, FaStar, FaTimes, FaUtensils, FaCartPlus, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/cartContext';
import { useLocation } from 'react-router-dom';
import FadeInView from '../components/FadeInView';

const filtersDefault = { priceMin: '', priceMax: '', rating: '', ratingType: 'above', ingredient: '', featured: false };

// Custom IngredientDropdown component
const IngredientDropdown = React.memo(function IngredientDropdown({
    value, onChange, options, placeholder = 'All', label = 'Ingredient'
}: {
    value: string,
    onChange: (val: string) => void,
    options: string[],
    placeholder?: string,
    label?: string
}) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const filtered = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="relative w-full">
            <label className="text-xs text-[var(--color-muted)]">{label}</label>
            <div
                className="w-full px-2 py-1 rounded border border-[var(--color-light)] bg-[var(--color-light)] flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(o => !o)}
            >
                <span className="truncate text-sm" style={{ fontFamily: 'var(--font-saira)' }}>{value || placeholder}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <AnimatePresence mode='wait'>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute left-0 right-0 z-40 bg-[var(--color-white)] border border-[var(--color-light)] rounded shadow-lg mt-1 max-h-48 overflow-y-auto"
                    >
                        <div className="p-2">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search ingredient..."
                                className="w-full px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)] mb-2"
                                style={{ fontFamily: 'var(--font-saira)' }}
                            />
                            <div className="flex flex-col gap-1">
                                <button
                                    className={`text-left px-2 py-1 rounded hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors ${!value ? 'font-bold text-[var(--color-tertiary)]' : ''}`}
                                    onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                >
                                    {placeholder}
                                </button>
                                {filtered.length === 0 && <span className="text-xs text-[var(--color-muted)] px-2">No ingredients found</span>}
                                {filtered.map(opt => (
                                    <button
                                        key={opt}
                                        className={`text-left px-2 py-1 rounded hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors ${value === opt ? 'font-bold text-[var(--color-tertiary)]' : ''}`}
                                        onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

// Move FilterMenu outside Menu to avoid re-creation
const FilterMenu = React.memo(function FilterMenu({
    pendingFilters,
    onChange,
    onSave,
    onReset,
    onClose,
    filtersDefault,
    allIngredients
}: {
    pendingFilters: any,
    onChange: (key: string, value: any) => void,
    onSave: () => void,
    onReset: () => void,
    onClose: () => void,
    filtersDefault: any,
    allIngredients: string[]
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-72 sm:w-96 bg-[var(--color-white)] rounded-xl shadow-lg p-4 flex flex-col gap-4 border border-[var(--color-light)]"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Filters</span>
                <button onClick={onClose} className="p-1 rounded hover:bg-[var(--color-light)]"><FaTimes /></button>
            </div>
            {/* Price Range */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-muted)]">Price Range (₹)</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={pendingFilters.priceMin}
                        min={0}
                        onChange={e => onChange('priceMin', e.target.value)}
                        className="w-16 px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                    />
                    <span className="text-[var(--color-muted)]">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={pendingFilters.priceMax}
                        min={0}
                        onChange={e => onChange('priceMax', e.target.value)}
                        className="w-16 px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                    />
                </div>
            </div>
            {/* Ingredients Dropdown */}
            <IngredientDropdown
                value={pendingFilters.ingredient}
                onChange={val => onChange('ingredient', val)}
                options={allIngredients}
                placeholder="All"
                label="Ingredient"
            />
            {/* Rating Filter */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-muted)]">Rating</label>
                <div className="flex gap-2 items-center">
                    <select
                        value={pendingFilters.ratingType}
                        onChange={e => onChange('ratingType', e.target.value)}
                        className="px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                    >
                        <option value="above">Above</option>
                        <option value="below">Below</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Rating"
                        value={pendingFilters.rating}
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={e => onChange('rating', e.target.value)}
                        className="w-24 px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                    />
                </div>
            </div>
            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
                <label className="text-xs text-[var(--color-muted)]">Featured</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={pendingFilters.featured}
                        onChange={e => onChange('featured', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--color-light)] not-checked:ring-1 not-checked:ring-[var(--color-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--color-tertiary)] transition-colors duration-300"></div>
                    <div className="absolute left-1 top-1 bg-[var(--color-tertiary)] peer-checked:bg-[var(--color-white)] transition-all duration-300 w-4 h-4 rounded-full peer-checked:translate-x-5"></div>
                </label>
            </div>
            {/* Save and Reset Buttons */}
            <div className="flex gap-2 mt-2 justify-end">
                <button
                    className="px-4 py-1 rounded bg-[var(--color-tertiary)] text-[var(--color-white)] font-semibold hover:bg-[var(--color-dark)] transition-colors"
                    style={{ fontFamily: 'var(--font-saira)' }}
                    onClick={onSave}
                >
                    Save
                </button>
                <button
                    className="px-4 py-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] font-semibold hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors"
                    style={{ fontFamily: 'var(--font-saira)' }}
                    onClick={onReset}
                >
                    Reset
                </button>
            </div>
        </motion.div>
    );
});

const Menu = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('menuFilters');
        return saved ? JSON.parse(saved) : filtersDefault;
    });
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [pendingFilters, setPendingFilters] = useState(filters);
    const [showSearch, setShowSearch] = useState(false);

    const { refreshCart } = useCart();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');
    const from = searchParams.get('from');
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        if (redirect) {
            setSearch(searchQuery || '');
            setShowSearch(true);
        }
    }, [redirect, searchQuery]);

    useEffect(() => {
        if (showFilter) setPendingFilters(filters);
    }, [showFilter, filters]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getAllProducts();
                if (response.success) {
                    setProducts(response.products);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCart();
                if (response.success) {
                    setCart(response.cart.cartItems);
                }
            } catch (error) {
                setCart([]);
            }
        };
        fetchCart();
    }, []);

    // Get all unique categories from products
    const categories = useMemo(() => {
        const cats = new Set(products.map((p) => p.category?.name));
        return Array.from(cats).filter(Boolean);
    }, [products]);

    // Get all unique ingredients from products
    const allIngredients = useMemo(() => {
        const set = new Set<string>();
        products.forEach(p => p.ingredients?.forEach((i: string) => set.add(i)));
        return Array.from(set);
    }, [products]);

    // Filtered products based on search, filter, and category
    const filteredProducts = useMemo(() => {
        let items = [...products];
        if (selectedCategory) {
            items = items.filter((p) => p.category?.name === selectedCategory);
        }
        if (search) {
            items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (filters.priceMin) {
            items = items.filter((p) => p.price >= Number(filters.priceMin));
        }
        if (filters.priceMax) {
            items = items.filter((p) => p.price <= Number(filters.priceMax));
        }
        if (filters.rating) {
            items = items.filter((p) =>
                filters.ratingType === 'above'
                    ? p.rating >= Number(filters.rating)
                    : p.rating <= Number(filters.rating)
            );
        }
        if (filters.ingredient) {
            items = items.filter((p) => p.ingredients?.some((i: string) => i.toLowerCase().includes(filters.ingredient.toLowerCase())));
        }
        if (filters.featured) {
            items = items.filter((p) => p.featured === true);
        }
        return items;
    }, [products, selectedCategory, search, filters]);

    // Group products by category name for vertical scroll
    const groupedByCategory = useMemo(() => {
        const groups: Record<string, any[]> = {};
        products.forEach((p) => {
            const catName = p.category?.name || 'Uncategorized';
            if (!groups[catName]) groups[catName] = [];
            groups[catName].push(p);
        });
        return groups;
    }, [products]);

    // Handle category click from CategoryScroll
    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat === selectedCategory ? null : cat);
    };

    // Memoize handlers for stable references
    const handlePendingFilterChange = useCallback((key: string, value: any) => {
        setPendingFilters((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const handleSaveFilters = useCallback(() => {
        setFilters(pendingFilters);
        localStorage.setItem('menuFilters', JSON.stringify(pendingFilters));
        setShowFilter(false);
    }, [pendingFilters]);

    const handleResetFilters = useCallback(() => {
        setPendingFilters(filtersDefault);
        setFilters(filtersDefault);
        localStorage.removeItem('menuFilters');
        setShowFilter(false);
    }, []);

    const handleCloseFilter = useCallback(() => setShowFilter(false), []);

    // handle add to cart
    const handleAddToCart = async (item: any) => {
        const response = await addToCart(item.id, 1);
        if (response.success) {
            refreshCart();
            toast.success('Item added to cart');
            // refetch cart
            const cartRes = await getCart();
            if (cartRes.success) setCart(cartRes.cart.cartItems);
        } else {
            toast.error('Failed to add item to cart');
        }
    };

    // handle increment
    const handleIncrement = async (cartItem: any) => {
        const response = await updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);
        if (response.success) {
            setCart((prev) => prev.map(item => item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item));
        }
    };

    // handle decrement
    const handleDecrement = async (cartItem: any) => {
        if (cartItem.quantity === 1) {
            // Remove from cart
            const response = await updateCartItemQuantity(cartItem.id, 0);
            if (response.success) {
                setCart((prev) => prev.filter(item => item.id !== cartItem.id));
                refreshCart();
            }
        } else {
            const response = await updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);
            if (response.success) {
                setCart((prev) => prev.map(item => item.id === cartItem.id ? { ...item, quantity: item.quantity - 1 } : item));
            }
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-[var(--color-secondary)] font-sans">
            {/* Category Scroll at top */}
            <CategoryScroll onCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />

            {/* Search and Filter Icon */}
            <FadeInView className='z-10'>
                <motion.div
                    // initial={{ opacity: 0, y: 40 }}
                    // animate={{ opacity: 1, y: 0 }}
                    // transition={{ duration: 0.2, ease: 'easeOut', y: { delay: 0, duration: 0.2 }, opacity: { delay: 0, duration: 0.2 } }}
                    className="flex items-center gap-3 mx-4 mt-4 mb-6 justify-end"
                >
                    <div className="flex-1 flex items-center gap-4 justify-end min-h-12 md:max-w-3/4 lg:max-w-1/4">
                        <div onClick={() => setShowSearch(v => !v)} className='bg-[var(--color-tertiary)] p-2 rounded-full cursor-pointer'>
                            <AnimatePresence mode='wait'>
                                {
                                    showSearch ? (
                                        <motion.div
                                            key='close'
                                            initial={{ opacity: 0, rotate: 45 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: 45 }}
                                            transition={{ duration: 0.2, ease: 'easeOut', opacity: { delay: 0, duration: 0.2 }, rotate: { delay: 0, duration: 0.2 } }}
                                        >
                                            <FaTimes className='text-[var(--color-white)]' />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key='open'
                                            initial={{ opacity: 0, rotate: -45 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: -45 }}
                                            transition={{ duration: 0.2, ease: 'easeOut', opacity: { delay: 0, duration: 0.2 }, rotate: { delay: 0, duration: 0.2 } }}
                                        >
                                            <FaSearch className='text-[var(--color-white)]' />
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </div>
                        <AnimatePresence mode='wait'>
                            {
                                showSearch && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: '100%' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeOut', opacity: { delay: 0, duration: 0.2 }, width: { delay: 0, duration: 0.2 }}}
                                        className="z-30 w-full bg-[var(--color-white)] rounded-xl shadow-lg flex flex-col border border-[var(--color-light)] overflow-hidden"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search food..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)]"
                                        />
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>

                    </div>
                    <div className="relative">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full bg-[var(--color-tertiary)] text-[var(--color-white)] shadow hover:bg-[var(--color-dark)] transition-colors"
                            onClick={() => setShowFilter(v => !v)}
                            aria-label="Show filters"
                        >
                            <FaFilter />
                        </motion.button>
                        <AnimatePresence>
                            {showFilter && (
                                <FilterMenu
                                    pendingFilters={pendingFilters}
                                    onChange={handlePendingFilterChange}
                                    onSave={handleSaveFilters}
                                    onReset={handleResetFilters}
                                    onClose={handleCloseFilter}
                                    filtersDefault={filtersDefault}
                                    allIngredients={allIngredients}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </FadeInView>

            {/* Menu Items */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-[var(--color-tertiary)] text-lg font-bold"></span>
                </div>
            ) : (
                <FadeInView>
                    <div className="flex flex-col gap-8">
                        {/* If no category selected, show all categories vertically */}
                        {!selectedCategory && !search && !filters.priceMin && !filters.priceMax && !filters.rating && !filters.ingredient && !filters.featured ? (
                            categories.map(cat => (
                                <div key={cat} className="mb-4">
                                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[var(--color-tertiary)] z-0" style={{ fontFamily: 'var(--font-saira)' }}>{cat}</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2 z-0 custom-scrollbar">
                                        {groupedByCategory[cat]?.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0 }}
                                                // animate={{ opacity: 1 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ duration: 0.2, ease: 'easeOut', opacity: { delay: index * 0.1 + 0.2, duration: 0.2 } }}
                                                whileHover={{ scale: 1.01 }}
                                                className="min-w-[220px] flex flex-col justify-between max-w-[220px] m-2 bg-[var(--color-white)] rounded-xl shadow-lg overflow-hidden cursor-pointer"
                                            >
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-40 object-cover"
                                                    style={{ backgroundColor: 'var(--color-light)' }}
                                                />

                                                <div className="p-3">
                                                    <h3 className="text-base font-semibold text-[var(--color-dark)] mb-1" style={{ fontFamily: 'var(--font-saira)' }}>{item.name}</h3>
                                                    <div className="text-xs text-[var(--color-muted)] mb-1">₹{item.price}</div>
                                                    <div className="text-xs text-[var(--color-muted)]">{item.ingredients?.join(', ')}</div>
                                                </div>
                                                {(() => {
                                                    const cartItem = cart.find(ci => ci.product?.id === item.id);
                                                    if (cartItem) {
                                                        return (
                                                            <div className='w-full flex justify-end items-end'>
                                                                <div className="w-fit bg-[var(--color-tertiary)] text-[var(--color-white)] px-2 py-1 rounded flex items-center gap-1 mb-2 mr-2 shadow-md animate-fade-in">
                                                                    <button
                                                                        className="p-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-quaternary)] transition-all duration-300 cursor-pointer hover:text-[var(--color-white)]"
                                                                        onClick={() => handleDecrement(cartItem)}
                                                                    >
                                                                        <FaMinus size={12} />
                                                                    </button>
                                                                    <span className="mx-2 font-bold">{cartItem.quantity}</span>
                                                                    <button
                                                                        className="p-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-quaternary)] transition-all duration-300 cursor-pointer hover:text-[var(--color-white)]"
                                                                        onClick={() => handleIncrement(cartItem)}
                                                                    >
                                                                        <FaPlus size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className='flex justify-end items-end'>
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="mb-2 mr-2 bg-[var(--color-tertiary)] text-[var(--color-white)] px-3 py-2 rounded flex items-center shadow-md animate-fade-in"
                                                                    onClick={() => handleAddToCart(item)}
                                                                >
                                                                    <FaCartPlus />
                                                                </motion.div>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // If category or filter/search is active, show filtered items only
                            <div className="flex flex-wrap gap-4">
                                {filteredProducts.length === 0 ? (
                                    <motion.div
                                        className="flex flex-col items-center justify-center text-center w-full py-24 md:py-40"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    >
                                        <FaUtensils className="text-6xl text-[var(--color-tertiary)] mb-4 animate-bounce" />
                                        <h2 className="text-2xl font-bold mb-2 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                            Oops! No delicious food found.
                                        </h2>
                                        <p className="mb-6 text-[var(--color-muted)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                            Try adjusting your search or filter to discover more tasty options!
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="text-lg font-bold mb-2 text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Filtered Items</div>
                                        <div className='flex flex-wrap gap-4'>
                                            {
                                                filteredProducts.map((item, index) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, y: 40 * index }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, ease: 'easeOut', y: { delay: index * 0.1 + 0.2, duration: 0.2 }, opacity: { delay: index * 0.1 + 0.2, duration: 0.2 } }}
                                                        whileHover={{ scale: 1.04 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        className="relative min-w-[220px] max-w-[220px] my-2 bg-[var(--color-white)] rounded-xl shadow-lg overflow-hidden cursor-pointer z-0"
                                                    >
                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            className="w-full h-40 object-cover"
                                                            style={{ backgroundColor: 'var(--color-light)' }}
                                                        />
                                                        {(() => {
                                                            const cartItem = cart.find(ci => ci.product?.id === item.id);
                                                            if (cartItem) {
                                                                return (
                                                                    <div className="absolute bottom-2 right-2 bg-[var(--color-tertiary)] text-[var(--color-white)] px-2 py-1 rounded flex items-center gap-1 shadow-md animate-fade-in">
                                                                        <button
                                                                            className="p-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)]"
                                                                            onClick={() => handleDecrement(cartItem)}
                                                                        >
                                                                            <FaMinus size={12} />
                                                                        </button>
                                                                        <span className="mx-2 font-bold">{cartItem.quantity}</span>
                                                                        <button
                                                                            className="p-1 rounded bg-[var(--color-light)] text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)]"
                                                                            onClick={() => handleIncrement(cartItem)}
                                                                        >
                                                                            <FaPlus size={12} />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className="absolute bottom-2 right-2 bg-[var(--color-tertiary)] text-[var(--color-white)] px-2 py-1 rounded flex items-center gap-1 shadow-md animate-fade-in"
                                                                        onClick={() => handleAddToCart(item)}
                                                                    >
                                                                        <FaCartPlus />
                                                                    </motion.div>
                                                                );
                                                            }
                                                        })()}
                                                        <div className="p-3">
                                                            <h3 className="text-base font-semibold text-[var(--color-dark)] mb-1" style={{ fontFamily: 'var(--font-saira)' }}>{item.name}</h3>
                                                            <div className="text-xs text-[var(--color-muted)] mb-1">₹{item.price}</div>
                                                            <div className="text-xs text-[var(--color-muted)]">{item.ingredients?.join(', ')}</div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </FadeInView>
            )}
        </div>
    );
};

export default Menu;
