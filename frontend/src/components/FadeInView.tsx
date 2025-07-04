import React from 'react'
import { motion } from 'framer-motion'

const FadeInView = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.2, ease: 'easeOut', y: { delay, duration: 0.2 }, opacity: { delay, duration: 0.2 }, filter: { delay, duration: 0.2 } }}
        className={className}
    >
        {children}
    </motion.div>
  )
}

export default FadeInView
