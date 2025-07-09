import CategoryScroll from '../components/Home/CategoryScroll';
import ImageHeroSection from '../components/Home/ImageHeroSection';
import FeaturedFoodScroll from '../components/Home/FeaturedFoodScroll';

const Home = () => {
    
    return (
        <div className='flex flex-col flex-1'>
            <div className="font-sans flex flex-col flex-1 ">
                {/* Category Bar */}
                {/* <CategoryScroll /> */}

                {/* Hero Section */}
                <ImageHeroSection />

                {/* Featured Foods */}
                <FeaturedFoodScroll />
            </div>
        </div>
    );
};

export default Home;
