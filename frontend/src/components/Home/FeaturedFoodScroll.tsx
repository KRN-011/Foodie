import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaStar, FaUtensils } from 'react-icons/fa'
import { getAllProducts } from '../../services/apiService';
import { Link } from 'react-router-dom';

const FeaturedFoodScroll = () => {
    const featuredRef = useRef<HTMLDivElement>(null);
    const [featuredFoods, setFeaturedFoods] = useState<any[]>([]);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
        if (ref.current) {
            ref.current.scrollBy({
                left: dir === 'left' ? -200 : 200,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const fetchFeaturedFoods = async () => {
            const response = await getAllProducts();
            if (response.success) {
                setFeaturedFoods(response.products.filter((product: any) => product.featured));
            }
        };
        fetchFeaturedFoods();
    }, []);

    return (
        <div className="w-full px-2 md:px-8 mt-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>Featured Foods</h2>
                <div className="flex gap-2">
                    <button
                        className="p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors"
                        onClick={() => scroll(featuredRef, 'left')}
                    >
                        <FaChevronLeft className="text-[var(--color-dark)]" />
                    </button>
                    <button
                        className="p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors"
                        onClick={() => scroll(featuredRef, 'right')}
                    >
                        <FaChevronRight className="text-[var(--color-dark)]" />
                    </button>
                </div>
            </div>
            <div
                ref={featuredRef}
                className="flex gap-6 overflow-x-auto no-scrollbar py-5 px-2 scroll-smooth"
            >
                {
                    featuredFoods?.length > 0 ? (
                        <>
                            {featuredFoods?.map((food, idx) => (
                                <motion.div
                                    key={food?.name}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="relative min-w-[220px] max-w-[220px] bg-[var(--color-white)] rounded-xl shadow-lg overflow-hidden cursor-pointer"
                                >
                                    <Link to={`/menu?redirect=true&from=HomeFeatured&search=${food?.name}`} className='w-full h-full'>
                                        <img
                                            src={food?.images[0]}
                                            alt={food?.name}
                                            className="w-full h-40 object-cover"
                                            style={{ backgroundColor: 'var(--color-light)' }}
                                        />
                                        <div className="p-3">
                                            <h3 className="text-base font-semibold text-[var(--color-dark)] mb-1" style={{ fontFamily: 'var(--font-saira)' }}>{food?.name}</h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center w-full py-20 md:py-10">
                            <FaUtensils className="text-4xl md:text-6xl text-[var(--color-tertiary)] mb-4 animate-bounce" />
                            <h2 className="text-xl md:text-2xl font-bold mb-2 text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-saira)' }}>
                                No featured foods found.
                            </h2>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default FeaturedFoodScroll
