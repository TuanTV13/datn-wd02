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
  const slides: SlideType[] = headerEvents?.map((event: Events) => ({
    type: "text",
    content: (
      <div
  className="lg:h-[600px] h-[300px] pl-16 flex flex-col md:flex-row items-center bg-gradient-to-r from-[#007BFF] to-[#F5F5F5] px-4 py-16 relative"
  style={{
    backgroundImage: `url(${event.thumbnail})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Lớp phủ nền mờ */}
  {/* <div className="absolute inset-0 bg-black/40"></div> */}

  <div className="md:w-1/2 lg:ml-10 relative z-10">
  <h1
    className="lg:text-[40px] md:text-5xl font-medium mb-4 text-white bg-black/50 px-4 py-2 rounded-lg"
    style={{
      backgroundImage: "linear-gradient(90deg, #8E44AD, #1ABC9C, #E74C3C, #F1C40F, #3498DB)",
      backgroundSize: "300% 300%",
    }}
  >
    {event.name}
  </h1>
  <div className="flex justify-center md:justify-start lg:ml-5">
    <Link
      to={`/event-detail/${event.id}`}
      className="bg-gradient-to-r from-[#0D6EFD] to-[#6610F2] text-white py-2 px-6 rounded-full hover:bg-gradient-to-r hover:from-[#6610F2] hover:to-[#0DCAF0] shadow-lg"
    >
      Chi tiết sự kiện
    </Link>
  </div>
</div>

</div>

    ),
  }));
  

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
