import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '../contexts/userContext';
import { useForm } from 'react-hook-form';

const Login = () => {

    // login from user context
    const { login } = useUser();

    const [role, setRole] = useState<'ADMIN' | 'RESTAURANT'>('ADMIN');
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    // handle role change
    const handleRoleChange = (role: 'ADMIN' | 'RESTAURANT') => {
        setRole(role);
    }

    // react-hook-form form state
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: form
    });

    // handle login
    const handleLogin = async (data: any) => {
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
            <motion.div
                initial={{
                    backgroundColor: '#A5B68D'
                }}
                animate={{
                    backgroundColor: role === 'ADMIN' ? '#A5B68D' : '#ffffff'
                }}
                transition={{
                    duration: 0.3
                }}
                className='relative w-full max-w-lg h-full max-h-[58vh] flex flex-col items-center rounded-3xl md:hidden'>
                <AnimatePresence>
                    {
                        role !== 'ADMIN' && (
                            <motion.div
                                key='admin'
                                initial={{
                                    height: 0
                                }}
                                animate={{
                                    height: 40
                                }}
                                exit={{
                                    height: 0
                                }}
                                transition={{
                                    duration: 0.3
                                }}
                                className='absolute z-10 bottom-[100%] flex flex-col items-center justify-center text-white font-bold text-lg bg-tertiary w-full max-w-3/4 rounded-t-3xl' onClick={() => handleRoleChange('ADMIN')}
                            >
                                <motion.div
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={role === 'RESTAURANT' ? {
                                        opacity: 1
                                    } : {
                                        opacity: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        transition: {
                                            delay: 0
                                        }
                                    }}
                                    transition={{
                                        delay: 0.2
                                    }}
                                >Log in as Admin</motion.div>
                            </motion.div>
                        )
                    }
                    {
                        role !== 'RESTAURANT' && (
                            <motion.div
                                key='restaurant'
                                initial={{
                                    height: 0

                                }}
                                animate={{
                                    height: 40
                                }}
                                exit={{
                                    height: 0
                                }}
                                transition={{
                                    duration: 0.3
                                }}
                                className='absolute top-[100%] flex flex-col items-center justify-center text-tertiary font-bold text-lg bg-white w-full max-w-3/4 rounded-b-3xl' onClick={() => handleRoleChange('RESTAURANT')}
                            >
                                <motion.div
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={role === 'ADMIN' ? {
                                        opacity: 1
                                    } : {
                                        opacity: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        transition: {
                                            delay: 0
                                        }
                                    }}
                                    transition={{
                                        delay: 0.2
                                    }}
                                >Log in as Restaurant</motion.div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
                <div className='flex flex-col items-center justify-center w-full h-full px-4 gap-5'>
                    {
                        role === 'ADMIN' && (
                            <div className='flex flex-col items-center justify-center w-full h-full gap-4 text-white'>
                                <h1 className='text-2xl font-bold mb-7'>Admin Login</h1>
                                <form onSubmit={handleSubmit(handleLogin)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                                    <div className='flex flex-col w-full gap-1'>
                                        <label htmlFor="email" className='self-start font-bold'>Email : </label>
                                        <input type="email" placeholder='Email' id='email' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-white transition-all duration-300 text-white' {...register('email')} />
                                    </div>
                                    <div className='flex flex-col w-full gap-1'>
                                        <label htmlFor="password" className='self-start font-bold'>Password : </label>
                                        <input type="password" placeholder='Password' id='password' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-white transition-all duration-300 text-white' {...register('password')} />
                                    </div>
                                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                    {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                    <button type='submit' className='w-full max-w-3/4  h-10 rounded-md bg-white text-tertiary font-bold mt-3 cursor-pointer'>Login</button>
                                </form>
                            </div>
                        )
                    }
                    {
                        role === 'RESTAURANT' && (
                            <div className='flex flex-col items-center justify-center w-full h-full gap-4 text-tertiary'>
                                <h1 className='text-2xl font-bold mb-7'>Restaurant Login</h1>
                                <form onSubmit={handleSubmit(handleLogin)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                                    <div className='flex flex-col w-full gap-1'>
                                        <label htmlFor="email" className='self-start font-bold'>Email : </label>
                                        <input type="email" placeholder='Email' id='email' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-tertiary transition-all duration-300 text-tertiary' {...register('email')} />
                                    </div>
                                    <div className='flex flex-col w-full gap-1'>
                                        <label htmlFor="password" className='self-start font-bold'>Password : </label>
                                        <input type="password" placeholder='Password' id='password' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-tertiary transition-all duration-300 text-tertiary' {...register('password')} />
                                    </div>
                                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                    {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                    <button type='submit' className='w-full max-w-3/4 h-10 rounded-md bg-tertiary text-white font-bold mt-3 cursor-pointer'>Login</button>
                                </form>
                            </div>
                        )
                    }
                </div>
            </motion.div>

            {/* desktop login */}
            <motion.div
                className='hidden md:flex flex-col items-center justify-center w-full h-full'
            >
                <motion.div
                    initial={{ backgroundColor: '#A5B68D' }}
                    animate={{ backgroundColor: role === 'ADMIN' ? '#A5B68D' : '#ffffff' }}
                    transition={{ duration: 0.3 }}
                    className='relative h-full max-h-3/5 w-full max-w-3xl rounded-3xl  flex flex-col items-center justify-center overflow-hidden'
                >
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
                    >
                        <AnimatePresence>
                            {
                                role === 'ADMIN' ? (
                                    <motion.div
                                        key='admin'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className='w-full h-full flex flex-col items-center justify-center gap-3'
                                    >
                                        <h1 className='text-2xl font-bold text-tertiary'>Admin Login</h1>
                                        <p className='text-tertiary font-normal text-xs'>Click here to login as restaurant</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='restaurant'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
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
                    <AnimatePresence>
                        {
                            role === 'ADMIN' ? (
                                <motion.div
                                    key='admin'
                                    initial={{ x: role === 'ADMIN' ? '-100%' : 0 }}
                                    animate={{ x: role === 'ADMIN' ? 0 : '-100%' }}
                                    transition={{ duration: 0.3 }}
                                    className='w-full h-full flex flex-col items-start justify-center px-10'
                                >
                                    <div className='w-[50%] h-full flex flex-col items-start justify-center '>
                                        <form onSubmit={handleSubmit(handleLogin)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="email" className='self-start font-bold text-white'>Email : </label>
                                                <input type="email" placeholder='Email' id='email' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-white transition-all duration-300 text-white' {...register('email')} />
                                            </div>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="password" className='self-start font-bold text-white'>Password : </label>
                                                <input type="password" placeholder='Password' id='password' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-white transition-all duration-300 text-white' {...register('password')} />
                                            </div>
                                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                            <button type='submit' className='w-full max-w-3/4 h-10 rounded-md bg-white text-tertiary font-bold mt-3 cursor-pointer'>Login</button>
                                        </form>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key='restaurant'
                                    initial={{ x: role === 'RESTAURANT' ? '100%' : 0 }}
                                    animate={{ x: role === 'RESTAURANT' ? 0 : '100%' }}
                                    transition={{ duration: 0.3 }}
                                    className='w-full h-full flex flex-col items-end justify-center px-10'
                                >
                                    <div className='w-[50%] h-full flex flex-col items-start justify-center '>
                                        <form onSubmit={handleSubmit(handleLogin)} className='w-full max-w-sm flex flex-col items-center justify-center gap-4'>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="email" className='self-start font-bold text-tertiary'>Email : </label>
                                                <input type="email" placeholder='Email' id='email' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-tertiary transition-all duration-300 text-tertiary' {...register('email')} />
                                            </div>
                                            <div className='flex flex-col w-full gap-1'>
                                                <label htmlFor="password" className='self-start font-bold text-tertiary'>Password : </label>
                                                <input type="password" placeholder='Password' id='password' className='w-full h-10 rounded-md border border-quaternary p-2 focus:outline-none focus:border-tertiary transition-all duration-300 text-tertiary' {...register('password')} />
                                            </div>
                                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                            <button type='submit' className='w-full max-w-3/4 h-10 rounded-md bg-tertiary text-white font-bold mt-3 cursor-pointer'>Login</button>
                                        </form>
                                    </div>
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Login; 