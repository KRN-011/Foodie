import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({
    className = '',
    style = {},
}: {
    className?: string;
    style?: React.CSSProperties;
}) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full min-w-0 min-h-0 flex-shrink-0 bg-light/90 rounded-3xl animate-pulse ${className}`}
        style={{ ...style }}
        aria-busy="true"
        aria-label="Loading"
    />
);

export default LoadingSkeleton;