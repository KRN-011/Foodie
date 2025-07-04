import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/userContext';

const Login = () => {

    // Navigation
    const navigate = useNavigate();

    // User Context
    const { login } = useUser();

    // State Variables
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Form Submission Handler
    const onSubmit = async (data: any) => {
        try {
            await login(data);
            navigate('/');
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center flex-1 flex-col gap-5 px-5" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <div className='flex flex-col items-center justify-center h-full gap-5 w-full'>
                <motion.form
                    className="p-8 rounded shadow-md w-full max-w-sm"
                    style={{ backgroundColor: 'var(--color-white)' }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Login</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                            style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)' }}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.email.message as string}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                            style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', backgroundColor: 'var(--color-light)' }}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.password.message as string}</p>}
                    </div>
                    <button type="submit" className="w-full py-2 rounded font-semibold cursor-pointer transition-colors" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--color-white)', fontFamily: 'var(--font-saira)' }}>Login</button>
                </motion.form>
                <div className="flex items-center justify-center">
                    <p className="text-sm text-center" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>Don't have an account? <Link to="/register" className="text-dark relative before:content-[''] before:absolute before:w-0 before:h-[1px] before:bg-dark before:left-0 before:bottom-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full">Register</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
