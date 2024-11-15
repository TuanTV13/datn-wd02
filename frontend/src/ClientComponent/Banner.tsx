import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { HomeCT } from "../Contexts/HomeContext";
import { Events } from "../interfaces/Event";
import { Link } from "react-router-dom";

interface SlideType {
  type: "image" | "text";
  src?: string; 
  alt?: string;
  content?: JSX.Element;
}
const Banner = () => {
  const {headerEvents} = useContext(HomeCT)
  const slides: SlideType[] = [
    {
      type: "text",
      content: (
        <div className="lg:h-[600px] h-[300px] pl-16 flex flex-col md:flex-row items-center bg-gradient-to-r from-[#007BFF] to-[#F5F5F5] px-4 py-16"
        style={{
          backgroundImage: `url(${headerEvents[0]?.thumbnail})`, // Dùng ảnh làm background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        >
          <div className="md:w-1/2">
            <p className="text-[#007BFF] text-base tracking-[4px] mb-2">
            {headerEvents[0]?.category_name || ""}
            </p>
            <h1 className="lg:text-[64px] md:text-5xl font-medium mb-4 text-white">
              {headerEvents[0]?.name}
            </h1>
            {/* <div className="flex items-center mb-6">
              <p className="mr-4">Get 25% off</p>
              <span className="mx-2">|</span>
              <p>Free Shipping</p>
            </div> */}
            <Link to={`/event-detail/${headerEvents[0]?.id}`} className="bg-[#6C757D] text-white py-2 px-6 rounded-full">
              Chi tiết sự kiện
            </Link>
          </div>
        </div>
      ),
    },
    ...headerEvents?.map((event: Events) => ({
      type: "image",
      src: event.thumbnail,
      alt: event.name,
    })),
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
        {slides?.map((slide, index) => (
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
