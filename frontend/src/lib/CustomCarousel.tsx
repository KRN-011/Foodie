import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomCarousel = ({ children, props }: { children: React.ReactNode, props: any }) => {

    const { settings, ref, ...rest } = props;

    return (
        <div className='w-full h-full'>
            <Slider {...settings} ref={ref} {...rest} style={{ height: '100%' }}>
                {children}
            </Slider>
        </div>
    )
}

export default CustomCarousel
