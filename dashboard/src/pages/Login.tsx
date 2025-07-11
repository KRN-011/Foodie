import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/userContext';
import { useForm } from 'react-hook-form';
import MobileLoginForm from '../components/Login/MobileLoginForm';

const Login = () => {
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
        <div className="flex z-0 flex-1 flex-col items-center justify-center bg-secondary px-5">
            {/* mobile login */}
            <MobileLoginForm />

            {/* desktop login (refactored for smooth animation) */}
            <motion.div
                className='hidden md:flex flex-col items-center justify-center w-full h-full'
            >
                <motion.div
                    initial={{ backgroundColor: '#A5B68D' }}
                    animate={{ backgroundColor: role === 'ADMIN' ? '#A5B68D' : '#ffffff' }}
                    transition={{ duration: 0.3 }}
                    className='relative h-full max-h-3/5 w-full max-w-3xl rounded-3xl flex flex-col items-center justify-center overflow-hidden'
                >
                    {/* Role switcher */}
                    <motion.div
                        initial={{ left: role !== 'ADMIN' ? '3%' : '57%', backgroundColor: role === 'ADMIN' ? '#ffffff' : '#A5B68D' }}
                        animate={{ left: role !== 'ADMIN' ? '3%' : '57%', backgroundColor: role === 'ADMIN' ? '#ffffff' : '#A5B68D' }}
                        transition={{ duration: 0.3 }}
                        className='absolute w-2/5 h-11/12 rounded-3xl bg-tertiary cursor-pointer'
                        onClick={() => {
                            if (role === 'ADMIN') {
                                handleRoleChange('RESTAURANT')
                            } else {
                                handleRoleChange('ADMIN')
                            }
                        }}
                        style={{ zIndex: 3 }}
                    >
                        <AnimatePresence mode="wait">
                            {
                                role === 'ADMIN' ? (
                                    <motion.div
                                        key='admin-switcher'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='w-full h-full flex flex-col items-center justify-center gap-3'
                                    >
                                        <h1 className='text-2xl font-bold text-tertiary'>Admin Login</h1>
                                        <p className='text-tertiary font-normal text-xs'>Click here to login as restaurant</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='restaurant-switcher'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='w-full h-full flex flex-col items-center justify-center gap-3'
                                    >
                                        <h1 className='text-2xl font-bold text-white'>Restaurant Login</h1>
                                        <p className='text-white font-normal text-xs'>Click here to login as admin</p>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </motion.div>
                    {/* Animated form area */}
                    <div className="w-full h-full flex flex-row items-center justify-center relative">
                        <AnimatePresence mode="wait">
                            {role === 'ADMIN' ? (
                                <motion.div
                                    key="admin-form"
                                    initial={{ x: -400, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 400, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut", opacity: { ease: "backOut" } }}
                                    className="w-[55%] h-full flex flex-col items-center justify-center px-10 absolute left-0 top-0"
                                    style={{ zIndex: 2 }}
                                >
                                    <div className='w-full flex flex-col items-start justify-center '>
                                        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="desktop-email" className='self-start font-bold text-white'>Email : </label>
                                                <input type="email" placeholder='Email' id='desktop-email' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-white transition-all duration-300 text-white' {...register('email')} />
                                            </div>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="desktop-password" className='self-start font-bold text-white'>Password : </label>
                                                <input type="password" placeholder='Password' id='desktop-password' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-white transition-all duration-300 text-white' {...register('password')} />
                                            </div>
                                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                            <button type='submit' className='w-full max-w-3/4 h-10 rounded-md bg-white text-tertiary font-bold mt-3 cursor-pointer'>Login</button>
                                        </form>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="restaurant-form"
                                    initial={{ x: 400, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -400, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut", opacity: { ease: "backOut" } }}
                                    className="w-[55%] h-full flex flex-col items-center justify-center px-10 absolute right-0 top-0"
                                    style={{ zIndex: 2 }}
                                >
                                    <div className='w-full flex flex-col items-start justify-center '>
                                        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="desktop-email" className='self-start font-bold text-tertiary'>Email : </label>
                                                <input type="email" placeholder='Email' id='desktop-email' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-tertiary transition-all duration-300 text-tertiary' {...register('email')} />
                                            </div>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="desktop-password" className='self-start font-bold text-tertiary'>Password : </label>
                                                <input type="password" placeholder='Password' id='desktop-password' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-tertiary transition-all duration-300 text-tertiary' {...register('password')} />
                                            </div>
                                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                            <button type='submit' className='w-full max-w-3/4 h-10 rounded-md bg-tertiary text-white font-bold mt-3 cursor-pointer'>Login</button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Login; 