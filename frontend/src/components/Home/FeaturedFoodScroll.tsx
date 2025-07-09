import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaUtensils } from 'react-icons/fa'
import { getAllProducts } from '../../services/apiService';
import { Link } from 'react-router-dom';
import CustomCarousel from '../../lib/CustomCarousel'
import Slider from 'react-slick';

const FeaturedFoodScroll = () => {
    const featuredRef = useRef<HTMLDivElement>(null);
    const SliderRef = useRef<Slider>(null);

    const [featuredFoods, setFeaturedFoods] = useState<any[]>([]);

    useEffect(() => {
        const fetchFeaturedFoods = async () => {
            const response = await getAllProducts();
            if (response.success) {
                setFeaturedFoods(response.products.filter((product: any) => product.featured));
            }
        };
        fetchFeaturedFoods();
    }, []);

    // settings for carousel
    const carouselSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        draggable: true,
        easing: 'linear',
        lazyLoad: false
    }

    return (
        <div className="w-full bg-[var(--color-white)] p-4 min-[860px]:p-8 pb-0 my-5 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg min-[860px]:text-xl md:text-2xl font-bold text-[var(--color-tertiary)]" style={{ fontFamily: 'var(--font-saira)' }}>Featured Foods</h2>
                <div className="flex gap-2">
                    <button
                        className="p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors duration-300 cursor-pointer text-[var(--color-tertiary)] hover:text-[var(--color-white)]"
                        onClick={() => SliderRef.current?.slickPrev()}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        className="p-2 rounded-full bg-[var(--color-light)] hover:bg-[var(--color-tertiary)] transition-colors duration-300 cursor-pointer text-[var(--color-tertiary)] hover:text-[var(--color-white)]"
                        onClick={() => SliderRef.current?.slickNext()}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
            <div
                ref={featuredRef}
                className="flex gap-6 py-5 px-2 scroll-smooth max-w-full relative"
            >
                {
                    featuredFoods?.length > 0 ? (
                        <>
                            <CustomCarousel props={{ ref: SliderRef, settings: carouselSettings }}>
                                {featuredFoods?.map((food) => (
                                    <motion.div
                                        key={food?.name}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="relative min-w-[200px] max-w-[200px] min-[460px]:min-w-[160px] min-[460px]:max-w-[160px] min-[860px]:min-w-[220px] min-[860px]:max-w-[220px] bg-[var(--color-white)] rounded-xl shadow-lg overflow-hidden cursor-pointer m-2 h-full"
                                    >
                                        <Link to={`/menu?redirect=true&from=HomeFeatured&search=${food?.name}`} className='w-full h-full'>
                                            <img
                                                src={food?.images[0]}
                                                alt={food?.name}
                                                className="w-full h-40 object-cover"
                                                style={{ backgroundColor: 'var(--color-light)' }}
                                            />
                                            <div className="p-3">
                                                <h3 className="min-[860px]:text-base text-sm font-semibold text-[var(--color-dark)] mb-1" style={{ fontFamily: 'var(--font-saira)' }}>{food?.name}</h3>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </CustomCarousel>
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
