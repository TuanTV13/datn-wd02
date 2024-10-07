import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'

const Banner = () => {
    const slides = [
        {
            type: 'text',
            content: (
                <div className="flex flex-col justify-center h-[500px] bg-gradient-to-r from-[#007BFF] to-[#F5F5F5]">
                    <div className="flex flex-col md:pl-16 md:py-[120px] mb:py-[57px]">
                        <span className="text-[#030303] text-base tracking-[4px]">Dịch vụ</span>
                        <strong className="text-[64px] w-[664px] font-medium leading-[70.4px] tracking-[-3.4px] my-4 text-white">
                            Tổ chức sự kiện theo yêu cầu
                        </strong>
                        <div className="mt-[20px]">
                            <span className="flex items-center w-[356px] justify-between gap-x-[22px]">Get 25% off</span>
                            <a className="bg-[#6C757D] mt-11 text-lg w-[185px] grid place-items-center h-[64px] rounded-[100px]" href="#">
                                Tạo sự kiện
                            </a>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            type: 'image',
            src: '../../public/banner.png',
            alt: 'Slide 1',
        },
        {
            type: 'image',
            src: 'https://example.com/image2.jpg',
            alt: 'Slide 2',
        },
        {
            type: 'image',
            src: 'https://example.com/image3.jpg',
            alt: 'Slide 3',
        },
    ]

    return (
        <div className="relative w-full h-screen">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                allowTouchMove={true} 
                className="w-full h-[90%]"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        {slide.type === 'text' ? (
                            slide.content
                        ) : (
                            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Banner
