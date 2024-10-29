import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const Banner = () => {
  const slides = [
    {
      type: "text",
      content: (
        <div className="lg:h-[600px] h-[300px] pl-16 flex flex-col md:flex-row items-center bg-gradient-to-r from-[#007BFF] to-[#F5F5F5] px-4 py-16">
          <div className="md:w-1/2">
            <p className="text-yellow-500 text-base tracking-[4px] mb-2">
              DỊCH VỤ
            </p>
            <h1 className="lg:text-[64px] md:text-5xl font-medium mb-4 text-white">
              TỔ CHỨC SỰ KIỆN THEO YÊU CẦU
            </h1>
            <div className="flex items-center mb-6">
              <p className="mr-4">Get 25% off</p>
              <span className="mx-2">|</span>
              <p>Free Shipping</p>
            </div>
            <button className="bg-[#6C757D] text-white py-2 px-6 rounded-full">
              Chi tiết sự kiện
            </button>
          </div>
        </div>
      ),
    },
    {
      type: "image",
      src: "https://p-vn.ipricegroup.com/trends-article/cong-nghe-det-adidas-climacool-va-adidas-climachill-medium.jpg",
      alt: "Slide 1",
    },
    {
      type: "image",
      src: "https://example.com/image2.jpg",
      alt: "Slide 2",
    },
    {
      type: "image",
      src: "https://example.com/image3.jpg",
      alt: "Slide 3",
    },
  ];

  return (
    <div className="w-full mt-36 mb-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, pauseOnMouseEnter: false }}
        loop={true}
        allowTouchMove={true}
        className="lg:h-[600px] h-[300px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {slide.type === "text" ? (
              slide.content
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-[300px] lg:h-[600px] max-h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
