import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import { useState } from 'react';

const Login = () => {
    // Navigation
    const navigate = useNavigate();

    // User Context
    const { login } = useUser();

    // State Variables
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [role, setRole] = useState<'ADMIN' | 'RESTAURANT'>('ADMIN');

    // Form Submission Handler
    const onSubmit = async (data: any) => {
        try {
            await login({ ...data, role });
            navigate('/');
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className='flex flex-col items-center justify-center w-full max-w-md gap-5'>
                <motion.form
                    className="p-6 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-sm"
                    style={{ backgroundColor: 'var(--color-white)' }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-center" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>
                            Login as
                        </h2>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value as 'ADMIN' | 'RESTAURANT')}
                            className="ml-0 sm:ml-2 px-2 py-1 rounded border focus:outline-none focus:ring-2 text-sm sm:text-base"
                            style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)', color: 'var(--color-dark)' }}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="RESTAURANT">RESTAURANT</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm sm:text-base" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm sm:text-base"
                            style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)' }}
                        />
                        {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.email.message as string}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm sm:text-base" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-sm sm:text-base"
                            style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)' }}
                        />
                        {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.password.message as string}</p>}
                    </div>
                    <button type="submit" className="w-full py-2 rounded font-semibold cursor-pointer transition-colors text-sm sm:text-base" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--color-white)', fontFamily: 'var(--font-saira)' }}>Login</button>
                    <div className="flex items-center justify-center mt-5">
                        <p className="text-xs sm:text-sm text-center" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Don't have an account? <Link to="/register" className="text-dark relative before:content-[''] before:absolute before:w-0 before:h-[1px] before:bg-dark before:left-0 before:bottom-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full">Register</Link></p>
                    </div>
                </motion.form>
            </div>
        </div>
    )
}

export default Login; 