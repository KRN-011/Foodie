import { motion } from 'framer-motion'
import FadeInView from '../FadeInView'

const ImageHeroSection = () => {
    return (
        <FadeInView>
            <div className="relative w-full h-[80vh] flex items-center justify-center rounded-3xl overflow-hidden">
            <img
                src="/images/hero/restaurant-hero.jpg"
                alt="Hero"
                className="w-full h-full object-cover brightness-50 shadow-lg"
            />
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-white)] text-center drop-shadow-lg" style={{ fontFamily: 'var(--font-saira)' }}>
                    Satisfy Your Cravings, Fast & Fresh!
                </h1>
                <p className="mt-4 text-lg md:text-2xl text-[var(--color-light)] text-center max-w-xl" style={{ fontFamily: 'var(--font-saira)' }}>
                    Discover the best food from your favorite restaurants delivered to your doorstep.
                </p>
            </motion.div>
        </div>
        </FadeInView>
    )
}

export default ImageHeroSection
