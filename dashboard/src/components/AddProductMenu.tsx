import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addProduct, createCategory, updateProduct } from '../services/apiService';
import { IoMdCloseCircle } from "react-icons/io";
import axios from 'axios';

const PRODUCT_STATUS = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DELETED', label: 'Deleted' },
];

function CustomDropdown({ label, value, onChange, options, placeholder = 'Select', searchable = false, multi = false, error, onAddNew, isAdmin }: any) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const filtered = options.filter((opt: any) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );
    const handleSelect = (opt: any) => {
        if (multi) {
            if (value.includes(opt.value)) {
                onChange(value.filter((v: any) => v !== opt.value));
            } else {
                onChange([...value, opt.value]);
            }
        } else {
            onChange(opt.value);
            setOpen(false);
        }
    };
    return (
        <div className="mb-4 w-full relative">
            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>{label}</label>
            <div
                className="w-full px-3 py-2 border rounded bg-[var(--color-light)] flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', color: 'var(--color-dark)' }}
                onClick={() => setOpen(o => !o)}
                tabIndex={0}
            >
                <span className="truncate text-sm">
                    {multi
                        ? (options.filter((opt: any) => value.includes(opt.value)).map((opt: any) => opt.label).join(', ') || placeholder)
                        : (options.find((opt: any) => opt.value === value)?.label || placeholder)}
                </span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute left-0 right-0 z-40 bg-[var(--color-white)] border border-[var(--color-light)] rounded shadow-lg mt-1 max-h-48 overflow-y-auto"
                    >
                        <div className="p-2">
                            {searchable && (
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)] mb-2"
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                {filtered.map((opt: any) => (
                                    <button
                                        key={opt.value}
                                        className={`text-left px-2 py-1 rounded hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors ${multi && value.includes(opt.value) ? 'font-bold text-[var(--color-tertiary)]' : (!multi && value === opt.value ? 'font-bold text-[var(--color-tertiary)]' : '')}`}
                                        onClick={() => handleSelect(opt)}
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                        type="button"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                                <>
                                    {
                                        filtered.length === 0 && (
                                            <span className="text-xs text-[var(--color-muted)] px-2">No options found</span>
                                        )
                                    }
                                    {onAddNew && isAdmin && (
                                        <button
                                            type="button"
                                            className="mt-2 px-2 py-1 bg-[var(--color-tertiary)] text-white rounded text-xs hover:bg-[var(--color-quaternary)] cursor-pointer"
                                            onClick={() => { setOpen(false); onAddNew(); }}
                                        >
                                            + Add new category
                                        </button>
                                    )}
                                </>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <span className="text-[var(--color-error)] text-xs mt-1 block">{error}</span>}
        </div>
    );
}

const AddProductMenu = ({ open, onClose, onSave, categories, restaurants, refetchProducts, isAdmin, editProduct }: any) => {
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        restaurants: [],
        images: [],
        status: 'ACTIVE',
        ingredients: [],
        featured: false,
    });
    const [imageFiles, setImageFiles] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageUploading, setImageUploading] = useState<number>(0);
    const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', image: null, imageUrl: '', loading: false, error: '' });
    const [categoryList, setCategoryList] = useState([...categories]);
    const [ingredientInput, setIngredientInput] = useState('');

    useEffect(() => {
        setCategoryList([...categories]);
    }, [categories]);

    // Prefill form if editing
    useEffect(() => {
        if (editProduct) {
            setForm({
                name: editProduct.name || '',
                price: editProduct.price?.toString() || '',
                description: editProduct.description || '',
                categoryId: editProduct.categoryId || editProduct.category?.id || '',
                restaurants: editProduct.restaurants ? editProduct.restaurants.map((r: any) => r.id) : [],
                images: editProduct.images || [],
                status: editProduct.status || 'ACTIVE',
                ingredients: editProduct.ingredients || [],
                featured: !!editProduct.featured,
            });
            setImageUrls(editProduct.images || []);
        } else {
            setForm({
                name: '',
                price: '',
                description: '',
                categoryId: '',
                restaurants: [],
                images: [],
                status: 'ACTIVE',
                ingredients: [],
                featured: false,
            });
            setImageUrls([]);
        }
    }, [editProduct, open]);

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleDropdown = (key: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleMultiSelect = (value: any) => {
        setForm((prev: any) => ({ ...prev, restaurants: value }));
    };

    const handleImageUpload = async (e: any) => {
        const files = Array.from(e.target.files || []);
        const startIdx = imageFiles.length;
        setImageFiles((prev) => [...prev, ...files]);
        const newUploading = files.map((_, i) => startIdx + i);
        setUploadingIndexes((prev) => [...prev, ...newUploading]);
        setImageUploading((prev) => prev + files.length);
        const uploadPromises = files.map(async (file, i) => {
            const idx = startIdx + i;
            const url = await uploadToCloudinary(file);
            setUploadingIndexes((prev) => prev.filter((v) => v !== idx));
            setImageUploading((prev) => prev - 1);
            return url;
        });
        const urls = await Promise.all(uploadPromises);
        setImageUrls((prev) => [...prev, ...urls]);
        setForm((prev: any) => ({ ...prev, images: [...prev.images, ...urls] }));
    };

    const removeImage = (idx: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== idx));
        setImageUrls((prev) => prev.filter((_, i) => i !== idx));
        setForm((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== idx) }));
        setUploadingIndexes((prev) => prev.filter((v) => v !== idx));
    };

    const validate = () => {
        const errs: any = {};
        if (!form.name) errs.name = 'Name required';
        if (!form.price) errs.price = 'Price required';
        if (!form.description) errs.description = 'Description required';
        if (!form.categoryId) errs.categoryId = 'Category required';
        if (isAdmin && !form.restaurants.length) errs.restaurants = 'Select at least one restaurant';
        if (!form.status) errs.status = 'Status required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // upload images to cloudinary
    const uploadToCloudinary = async (file: any) => {
        try {
            const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
            const response = await axios.post(url, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return null;
        }
    }

    // Handle ingredient input (comma separated)
    const handleIngredientInput = (e: any) => {
        const value = e.target.value;
        // If comma is present, split and add
        if (value.includes(',')) {
            const parts = value.split(',').map((v: string) => v.trim()).filter(Boolean);
            setForm((prev: any) => ({ ...prev, ingredients: [...prev.ingredients, ...parts] }));
            setIngredientInput('');
        } else {
            setIngredientInput(value);
        }
    };

    // Add on Enter (for mobile, allow comma or enter)
    const handleIngredientKeyDown = (e: any) => {
        if ((e.key === 'Enter' || e.key === ',') && ingredientInput.trim()) {
            setForm((prev: any) => ({ ...prev, ingredients: [...prev.ingredients, ingredientInput.trim()] }));
            setIngredientInput('');
            e.preventDefault();
        }
    };

    // Remove ingredient
    const removeIngredient = (idx: number) => {
        setForm((prev: any) => ({ ...prev, ingredients: prev.ingredients.filter((_: any, i: number) => i !== idx) }));
    };

    // handle submit
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                images: imageUrls,
                ingredients: form.ingredients,
                restaurants: form.restaurants,
            };
            if (editProduct && editProduct.id) {
                await updateProduct(editProduct.id, payload);
            } else {
                await addProduct(payload);
            }
            setLoading(false);
            onSave && onSave();
            refetchProducts && refetchProducts();
            onClose();
        } catch (err) {
            setLoading(false);
            setErrors({ api: 'Failed to save product' });
        }
    };

    // Add Category Handlers
    const handleNewCategoryImage = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setNewCategory((prev) => ({ ...prev, loading: true, error: '' }));
        try {
            const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
            const response = await axios.post(url, formData);
            setNewCategory((prev) => ({ ...prev, image: file, imageUrl: response.data.secure_url, loading: false }));
        } catch (err) {
            setNewCategory((prev) => ({ ...prev, loading: false, error: 'Image upload failed' }));
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name || !newCategory.imageUrl) {
            setNewCategory((prev) => ({ ...prev, error: 'Name and image required' }));
            return;
        }
        setNewCategory((prev) => ({ ...prev, loading: true, error: '' }));
        try {
            await createCategory({ name: newCategory.name, image: newCategory.imageUrl });
            setShowAddCategory(false);
            setNewCategory({ name: '', image: null, imageUrl: '', loading: false, error: '' });
            if (typeof onSave === 'function') onSave();
        } catch (err) {
            setNewCategory((prev) => ({ ...prev, loading: false, error: 'Failed to create category' }));
        }
    };

    /* Add CSS spinner for image upload */
    const style = document.createElement('style');
    style.innerHTML = `
    .loader {
        border: 3px solid #f3f3f3;
        border-top: 3px solid var(--color-tertiary);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    if (typeof window !== 'undefined' && !document.getElementById('add-product-menu-loader-style')) {
        style.id = 'add-product-menu-loader-style';
        document.head.appendChild(style);
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Add Category Popup */}
                    {showAddCategory && (
                        <motion.div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
                            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-4 relative">
                                <button type="button" className="absolute top-2 right-2 text-2xl text-[var(--color-error)]" onClick={() => setShowAddCategory(false)}><IoMdCloseCircle size={22} /></button>
                                <h3 className="text-lg font-bold mb-2">Add New Category</h3>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm"
                                />
                                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer bg-[var(--color-light)] py-4">
                                    <span className="text-md text-[var(--color-tertiary)]">{newCategory.imageUrl ? 'Change Image' : 'Upload Image'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleNewCategoryImage} />
                                    {newCategory.imageUrl && <img src={newCategory.imageUrl} alt="preview" className="w-16 h-16 object-cover rounded mt-2" />}
                                </label>
                                {newCategory.error && <span className="text-[var(--color-error)] text-xs">{newCategory.error}</span>}
                                <div className="flex gap-2 mt-2">
                                    <button type="button" className="flex-1 py-2 rounded bg-[var(--color-muted)] text-white font-semibold cursor-pointer" onClick={() => setShowAddCategory(false)}>Cancel</button>
                                    <button type="button" className="flex-1 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold cursor-pointer" onClick={handleCreateCategory} disabled={newCategory.loading}>{newCategory.loading ? 'Creating...' : 'Create'}</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {/* Main Product Form */}
                    <motion.form
                        className="bg-[var(--color-white)] max-h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-lg p-6 w-full max-w-md mx-2 flex flex-col gap-4 relative"
                        initial={{ scale: 0.9, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        onSubmit={handleSubmit}
                        style={{ fontFamily: 'var(--font-saira)' }}
                    >
                        <button type="button" className="absolute top-6 right-6 text-3xl text-[var(--color-error)] cursor-pointer" onClick={onClose}><IoMdCloseCircle size={25} /></button>
                        <h2 className="text-xl font-bold mb-2 text-[var(--color-dark)]">Add Product</h2>
                        <div className="mb-4 w-full">
                            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleInput}
                                placeholder="Name"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm"
                                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)', color: 'var(--color-dark)' }}
                            />
                            {errors.name && <span className="text-[var(--color-error)] text-xs mt-1 block">{errors.name}</span>}
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Price</label>
                            <input
                                name="price"
                                value={form.price}
                                onChange={handleInput}
                                placeholder="Price"
                                type="number"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm"
                                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)', color: 'var(--color-dark)' }}
                            />
                            {errors.price && <span className="text-[var(--color-error)] text-xs mt-1 block">{errors.price}</span>}
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleInput}
                                placeholder="Description"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm"
                                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)', color: 'var(--color-dark)' }}
                            />
                            {errors.description && <span className="text-[var(--color-error)] text-xs mt-1 block">{errors.description}</span>}
                        </div>
                        <CustomDropdown
                            label="Category"
                            value={form.categoryId}
                            onChange={(val: any) => handleDropdown('categoryId', val)}
                            options={categoryList.map((cat: any) => ({ value: cat.id, label: cat.name }))}
                            placeholder="Select Category"
                            searchable
                            error={errors.categoryId}
                            onAddNew={() => setShowAddCategory(true)}
                            isAdmin={isAdmin}
                        />
                        {
                            isAdmin && (
                                <CustomDropdown
                                    label="Restaurants"
                                    value={form.restaurants}
                                    onChange={(val: any) => setForm(prev => ({ ...prev, restaurants: val }))}
                                    options={restaurants.map((rest: any) => ({ value: rest.id, label: rest.restaurantProfile?.name || rest.email }))}
                                    placeholder="Select Restaurants"
                                    searchable
                                    multi
                                    error={errors.restaurants}
                                />
                            )
                        }
                        <div className="mb-4 w-full">
                            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Images</label>
                            <div className="flex flex-wrap gap-2 items-center">
                                {imageUrls.map((url, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={url} alt="preview" className="w-14 h-14 object-cover rounded" />
                                        <button type="button" className="absolute -top-2 -right-2 bg-[var(--color-error)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => removeImage(idx)}>&times;</button>
                                        {uploadingIndexes.includes(idx) && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded">
                                                <span className="loader"></span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {Array.from({ length: imageUploading - uploadingIndexes.length }).map((_, i) => (
                                    <div key={`uploading-${i}`} className="w-14 h-14 flex items-center justify-center border-2 border-dashed rounded bg-[var(--color-light)] relative">
                                        <span className="loader"></span>
                                    </div>
                                ))}
                                <label className="w-14 h-14 flex items-center justify-center border-2 border-dashed rounded cursor-pointer bg-[var(--color-light)]">
                                    <span className="text-2xl text-[var(--color-tertiary)]">+</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Ingredients</label>
                            <div className="flex flex-wrap gap-2 items-center bg-[var(--color-light)] rounded px-2 py-2 min-h-[44px] max-h-24 overflow-y-auto no-scrollbar">
                                <AnimatePresence initial={false}>
                                    {form.ingredients.map((ingredient: string, idx: number) => (
                                        <motion.div
                                            key={ingredient + idx}
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{
                                                scale: 0.8,
                                                opacity: 0,
                                                position: 'absolute', // This removes the chip from the flex flow during exit
                                            }}
                                            transition={{ type: 'spring', duration: 0.2 }}
                                            className="flex items-center bg-[var(--color-tertiary)] text-[var(--color-white)] rounded-full px-3 py-1 text-xs font-medium mr-1 mb-1 shadow-sm"
                                            style={{ fontFamily: 'var(--font-saira)' }}
                                        >
                                            <span>{ingredient}</span>
                                            <button
                                                type="button"
                                                className="ml-2 text-[var(--color-white)] hover:text-[var(--color-error)] focus:outline-none"
                                                onClick={() => removeIngredient(idx)}
                                                aria-label={`Remove ${ingredient}`}
                                            >
                                                &times;
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <input
                                    type="text"
                                    value={ingredientInput}
                                    onChange={handleIngredientInput}
                                    onKeyDown={handleIngredientKeyDown}
                                    placeholder={form.ingredients.length > 0 ? '' : 'Add ingredients, comma separated'}
                                    className="flex-1 min-w-[120px] px-2 py-1 border-none bg-transparent focus:outline-none text-sm text-[var(--color-dark)]"
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                />
                            </div>
                        </div>
                        <CustomDropdown
                            label="Status"
                            value={form.status}
                            onChange={(val: any) => handleDropdown('status', val)}
                            options={PRODUCT_STATUS}
                            placeholder="Select Status"
                            error={errors.status}
                        />
                        <div className="mb-4 w-full flex items-center gap-3">
                            <label className="text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>
                                Featured
                            </label>
                            <button
                                type="button"
                                className={`relative w-12 h-6 flex items-center  rounded-full transition-colors duration-200 p-1 ${form.featured ? 'bg-[var(--color-tertiary)] justify-end' : 'bg-[var(--color-light)] justify-start'}`}
                                onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                                aria-pressed={form.featured}
                            >
                                <span
                                    className={`absolute w-5 h-5 bg-white rounded-full transform transition-transform duration-200`}
                                />
                            </button>
                            <span className="text-xs text-[var(--color-muted)]">{form.featured ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="button" className="flex-1 py-2 rounded bg-[var(--color-muted)] text-white font-semibold cursor-pointer" onClick={onClose}>Cancel</button>
                            <button type="submit" className="flex-1 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold cursor-pointer" disabled={loading || imageUploading > 0}>{loading ? 'Saving...' : imageUploading > 0 ? 'Uploading Images...' : 'Save'}</button>
                        </div>
                        {errors.api && <span className="text-[var(--color-error)] text-xs">{errors.api}</span>}
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddProductMenu; 