import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
const Banner = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
    };
  
    return (
<div>
      {/* Full-width container */}
      <div className="">
        <div className="w-[100%]">
          {/* Slider */}
          <Slider {...settings}>
            
            <div className="flex flex-col justify-center h-[500px] bg-gradient-to-r from-[#007BFF] to-[#F5F5F5]">
              <div className="flex flex-col *:flex *:flex-col md:pl-16 md:py-[120px] mb:py-[57px]">
                <div>
                  <span className="text-[#030303] text-base tracking-[4px]">
                    Dịch vụ
                  </span>
                  <strong className="text-[64px] w-[664px] font-medium leading-[70.4px] tracking-[-3.4px] my-4 text-white">
                    Tổ chức sự kiện theo yêu cầu
                  </strong>
                </div>
                <div className="mt-[20px]">
                  <span className="flex items-center w-[356px] justify-between gap-x-[22px]">
                    Get 25% off
                  </span>
                  <a className="bg-[#6C757D] mt-11 text-lg w-[185px] grid place-items-center h-[64px] rounded-[100px]" href="#">
                    Tạo sự kiện
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center h-[500px]">
              <img
                src="../../public/banner.png"
                alt="Slide 1"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Slide 2 with img */}
            <div className="flex items-center justify-center h-[500px]">
              <img
                src="https://example.com/image2.jpg"
                alt="Slide 2"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Slide 3 with img */}
            <div className="flex items-center justify-center h-[500px]">
              <img
                src="https://example.com/image3.jpg"
                alt="Slide 3"
                className="object-cover w-full h-full"
              />
            </div>
          </Slider>
        </div>
      </div>
    </div>
    );
  };

export default Banner
