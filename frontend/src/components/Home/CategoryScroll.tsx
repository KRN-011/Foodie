import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAllCategories } from '../../services/apiService';
import { useUser } from '../../contexts/userContext';
import FadeInView from '../FadeInView';

interface CategoryScrollProps {
    onCategoryClick?: (cat: string) => void;
    selectedCategory?: string | null;
}

const CategoryScroll: React.FC<CategoryScrollProps> = ({ onCategoryClick, selectedCategory }) => {
    const categoryRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<any[]>([]);

    const { isAuthenticated, user } = useUser();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllCategories();
            setCategories(response.categories);
        };
        fetchCategories();
    }, []);


    const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
        if (ref.current) {
            ref.current.scrollBy({
                left: dir === 'left' ? -200 : 200,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            {
                isAuthenticated && (
                    <div>
                        {
                            categories?.length > 0 && (
                                <FadeInView>
                                    <motion.div
                                        className="relative py-4 bg-[var(--color-white)] shadow-sm flex items-center m-4"
                                    >
                                        <button
                                            className="absolute left-2 z-10 p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors"
                                            onClick={() => scroll(categoryRef, 'left')}
                                        >
                                            <FaChevronLeft className="text-[var(--color-dark)]" />
                                        </button>
                                        <div
                                            ref={categoryRef}
                                            className="flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar px-10 scroll-smooth"
                                        >
                                            {categories.map((cat, idx) => (
                                                <motion.div
                                                    key={cat.name}
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={`flex flex-col items-center min-w-[80px] py-3 my-2 cursor-pointer ${selectedCategory === cat.name ? 'bg-[var(--color-tertiary)] bg-opacity-20 rounded-lg' : ''}`}
                                                    onClick={() => onCategoryClick && onCategoryClick(cat.name)}
                                                >
                                                    <img
                                                        src={cat.image}
                                                        alt={cat.name}
                                                        className={`w-14 h-14 shadow-lg rounded-full object-cover border-2 ${selectedCategory === cat.name ? 'border-[var(--color-dark)]' : 'border-[var(--color-tertiary)]'} shadow-md mb-1`}
                                                        style={{ backgroundColor: 'var(--color-light)' }}
                                                    />
                                                    <span className={`text-xs font-semibold ${selectedCategory === cat.name ? 'text-[var(--color-light)]' : 'text-[var(--color-dark)]'}`} style={{ fontFamily: 'var(--font-saira)' }}>{cat.name}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <button
                                            className="absolute right-2 z-10 p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors"
                                            onClick={() => scroll(categoryRef, 'right')}
                                        >
                                            <FaChevronRight className="text-[var(--color-dark)]" />
                                        </button>
                                    </motion.div>
                                </FadeInView>
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

export default CategoryScroll
