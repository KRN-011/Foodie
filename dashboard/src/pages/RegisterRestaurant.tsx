import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { registerRestaurant } from '../services/apiService';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const RegisterRestaurant = () => {
    // Navigation
    const navigate = useNavigate();

    // State Variables
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState('');
    const [logoLoading, setLogoLoading] = useState(false);
    const [logoError, setLogoError] = useState('');

    // Form Submission Handler
    const onSubmit = async (data: any) => {
        try {
            if (!logoUrl) {
                setLogoError('Logo is required');
                return;
            }
            const payload = {
                ...data,
                logo: logoUrl,
            };
            const response = await registerRestaurant(payload);
            if (response.success) {
                toast.success(response.message);
                navigate('/login');
            }
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
            console.error(error);
        }
    };

    // Cloudinary upload logic (ref: AddProductMenu.tsx)
    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoLoading(true);
        setLogoError('');
        try {
            const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
            const response = await axios.post(url, formData);
            setLogoUrl(response.data.secure_url);
        } catch (err) {
            setLogoError('Logo upload failed');
        } finally {
            setLogoLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen flex-col gap-5 px-2 bg-secondary">
            <motion.form
                className="p-4 sm:p-8 rounded shadow-md w-full max-w-sm bg-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-dark font-saira">Register Restaurant</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 text-dark font-saira">Restaurant Name:</label>
                    <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-tertiary font-saira bg-light"
                    />
                    {errors.name && <p className="text-error text-sm mt-1">{errors.name.message as string}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Description:</label>
                    <textarea
                        id="description"
                        {...register('description', { required: 'Description is required' })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                        style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)' }}
                        rows={2}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.description.message as string}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Logo:</label>
                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer bg-[var(--color-light)] py-4">
                        <span className="text-md text-[var(--color-tertiary)]">{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                        {logoLoading && <span className="loader mt-2"></span>}
                        {logoUrl && !logoLoading && <img src={logoUrl} alt="logo preview" className="w-16 h-16 object-cover rounded mt-2" />}
                    </label>
                    {logoError && <span className="text-[var(--color-error)] text-xs mt-1 block">{logoError}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-dark font-saira">Email:</label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-tertiary font-saira bg-light"
                    />
                    {errors.email && <p className="text-error text-sm mt-1">{errors.email.message as string}</p>}
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-dark font-saira">Password:</label>
                    <input
                        type="password"
                        id="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-tertiary font-saira bg-light"
                    />
                    {errors.password && <p className="text-error text-sm mt-1">{errors.password.message as string}</p>}
                </div>
                <button type="submit" className="w-full py-2 rounded font-semibold cursor-pointer transition-colors bg-tertiary text-white font-saira">Register</button>
                <div className="flex items-center justify-center mt-5">
                    <p className="text-sm text-center" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Already have an account? <Link to="/login" className="text-dark relative before:content-[''] before:absolute before:w-0 before:h-[1px] before:bg-dark before:left-0 before:bottom-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full">Login</Link></p>
                </div>
            </motion.form>
            {/* Loader CSS for logo upload */}
            <style>{`
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
            `}</style>
        </div>
    );
};

export default RegisterRestaurant; 