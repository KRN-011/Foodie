import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAllCategories } from '../../services/apiService';
import { useUser } from '../../contexts/userContext';
import FadeInView from '../FadeInView';
import CustomCarousel from '../../lib/CustomCarousel';
import Slider from 'react-slick';

interface CategoryScrollProps {
    onCategoryClick?: (cat: string) => void;
    selectedCategory?: string | null;
}

const CategoryScroll: React.FC<CategoryScrollProps> = ({ onCategoryClick, selectedCategory }) => {
    const categoryRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const SliderRef = useRef<Slider>(null);

    const { isAuthenticated } = useUser();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllCategories();
            setCategories(response.categories);
        };
        fetchCategories();
    }, []);

    // settings for carousel
    const carouselSettings = {
        infinite: false,
        slidesToScroll: 1,
        variableWidth: true,
        draggable: true,
    }

    return (
        <>
            {
                isAuthenticated && (
                    <div>
                        {
                            categories?.length > 0 && (
                                <FadeInView>
                                    <motion.div
                                        className="relative py-4 bg-[var(--color-white)] shadow-sm flex items-center my-4 rounded-3xl overflow-hidden"
                                    >
                                        <button
                                            className="absolute left-5 z-10 p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors cursor-pointer duration-300 "
                                            onClick={() => SliderRef.current?.slickPrev()}
                                        >
                                            <FaChevronLeft className="text-[var(--color-tertiary)] hover:text-[var(--color-white)]" />
                                        </button>
                                        <div
                                            ref={categoryRef}
                                            className="relative flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth px-14"
                                        >
                                            <div className='absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[var(--color-white)] via-[var(--color-white)]/80 to-transparent' />
                                            <CustomCarousel
                                                props={{ ref: SliderRef, settings: carouselSettings }}
                                            >
                                                {categories.map((cat) => (
                                                    <motion.div
                                                        key={cat.name}
                                                        whileHover={{ scale: 1.08 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        className={`flex flex-col items-center min-w-[80px] py-3 my-2 cursor-pointer z-0 ${selectedCategory === cat.name ? 'bg-[var(--color-tertiary)] bg-opacity-20 rounded-lg' : ''}`}
                                                        onClick={() => onCategoryClick && onCategoryClick(cat.name)}
                                                    >
                                                        <img
                                                            src={cat.image}
                                                            alt={cat.name}
                                                            className={`w-14 h-14 shadow-lg rounded-full object-cover border-2 ${selectedCategory === cat.name ? 'border-[var(--color-dark)]' : 'border-[var(--color-tertiary)]'} shadow-md mb-1 mx-auto`}
                                                            style={{ backgroundColor: 'var(--color-light)' }}
                                                        />
                                                        <div className={`text-xs font-semibold text-center mx-auto ${selectedCategory === cat.name ? 'text-[var(--color-light)]' : 'text-[var(--color-dark)]'}`} style={{ fontFamily: 'var(--font-saira)' }}>{cat.name}</div>
                                                    </motion.div>
                                                ))}
                                            </CustomCarousel>
                                            <div className='absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[var(--color-white)] via-[var(--color-white)]/80 to-transparent' />
                                        </div>
                                        <button
                                            className="absolute right-5 z-10 p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors cursor-pointer duration-300"
                                            onClick={() => SliderRef.current?.slickNext()}
                                        >
                                            <FaChevronRight className="text-[var(--color-tertiary)] hover:text-[var(--color-white)]" />
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
