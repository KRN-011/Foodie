import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useUser } from '../../contexts/userContext';
import { motion, AnimatePresence } from 'framer-motion';

const MobileLoginForm = () => {
    // login from user context
    const { login } = useUser();
    const [role, setRole] = useState<'ADMIN' | 'RESTAURANT'>('ADMIN');

    // handle role change
    const handleRoleChange = (role: 'ADMIN' | 'RESTAURANT') => {
        setRole(role);
    }

    // react-hook-form form state
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    // handle login
    const onSubmit = async (data: any) => {
        console.log('Login form rendered:', data);
        const newData = {
            ...data,
            role: role
        }
        try {
            await login(newData);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <motion.div
            initial={{ backgroundColor: '#A5B68D' }}
            animate={{ backgroundColor: role === 'ADMIN' ? '#A5B68D' : '#ffffff' }}
            transition={{ duration: 0.3 }}
            className='relative w-full max-w-lg h-full max-h-[58vh] flex flex-col items-center rounded-3xl md:hidden'>
            <AnimatePresence>
                {role !== 'ADMIN' && (
                    <motion.div
                        key='admin'
                        initial={{ height: 0 }}
                        animate={{ height: 40 }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className='absolute z-10 bottom-[100%] flex flex-col items-center justify-center text-white font-bold text-lg bg-tertiary w-full max-w-3/4 rounded-t-3xl'
                        onClick={() => handleRoleChange('ADMIN')}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={role === 'RESTAURANT' ? { opacity: 1 } : { opacity: 0 }}
                            exit={{ opacity: 0, transition: { delay: 0 } }}
                            transition={{ delay: 0.2 }}
                        >Log in as Admin</motion.div>
                    </motion.div>
                )}
                {role !== 'RESTAURANT' && (
                    <motion.div
                        key='restaurant'
                        initial={{ height: 0 }}
                        animate={{ height: 40 }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className='absolute top-[100%] flex flex-col items-center justify-center text-tertiary font-bold text-lg bg-white w-full max-w-3/4 rounded-b-3xl'
                        onClick={() => handleRoleChange('RESTAURANT')}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={role === 'ADMIN' ? { opacity: 1 } : { opacity: 0 }}
                            exit={{ opacity: 0, transition: { delay: 0 } }}
                            transition={{ delay: 0.2 }}
                        >Log in as Restaurant</motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='flex flex-col items-center justify-center w-full h-full px-4 gap-5'>
                <div className={`flex flex-col items-center justify-center w-full h-full gap-4 ${role === 'ADMIN' ? 'text-white' : 'text-tertiary'}`}>
                    <h1 className='text-2xl font-bold mb-7'>{role === 'ADMIN' ? 'Admin Login' : 'Restaurant Login'}</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                        <div className='flex flex-col w-full gap-1'>
                            <label htmlFor="mobile-email" className='self-start font-bold'>Email : </label>
                            <input
                                type="email"
                                placeholder='Email'
                                id='mobile-email'
                                className={`w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none ${role === 'ADMIN' ? 'focus:border-white text-white' : 'focus:border-tertiary text-tertiary'} transition-all duration-300`}
                                {...register('email', { required: 'Email is required' })}
                            />
                        </div>
                        <div className='flex flex-col w-full gap-1'>
                            <label htmlFor="mobile-password" className='self-start font-bold'>Password : </label>
                            <input
                                type="password"
                                placeholder='Password'
                                id='mobile-password'
                                className={`w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none ${role === 'ADMIN' ? 'focus:border-white text-white' : 'focus:border-tertiary text-tertiary'} transition-all duration-300`}
                                {...register('password', { required: 'Password is required' })}
                            />
                        </div>
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                        <button type='submit' className={`w-full max-w-3/4 h-10 rounded-md font-bold mt-3 cursor-pointer ${role === 'ADMIN' ? 'bg-white text-tertiary' : 'bg-tertiary text-white'}`}>Login</button>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

export default MobileLoginForm
