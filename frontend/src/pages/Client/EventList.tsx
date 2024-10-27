import React, { useState } from "react";
import { Link } from "react-router-dom";

const EventListing = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Function to toggle category menu
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Function to toggle location menu
  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
  };
  return (
    <div className="w-full lg:py-10 py-4 border pb-[199px] mt-36">
      <div className="lg:container lg:mx-auto lg:w-[1315px] mb:w-full grid lg:grid-cols-[304px_978px] mb:grid-cols-[100%] *:w-full justify-between">
        <div className="lg:block hidden py-3 mt-0.5 bg-gray-100 rounded-[50px]">
          <span className="lg:text-xl tracking-[-0.4px] ml-8">Filters</span>
          <section className="flex flex-col pt-[47px] pb-4 items-center">
            <div
              className="cursor-pointer mt-2 text-base tracking-[1px]"
              onClick={toggleCategory}
            >
              DANH MỤC
              {/* Show or hide category submenu */}
              {isCategoryOpen && (
                <ul className="mt-2 ml-4">
                  <li className="">
                    <Link to={""} className=" text-[#9D9EA2]">
                      Danh mục 1
                    </Link>
                  </li>
                  <li>
                    <Link to={""} className="text-[#9D9EA2]">
                      Danh mục 2
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </section>

          <section className="flex flex-col pb-4 items-center">
            <div
              className="cursor-pointer mt-2 text-base tracking-[1px]"
              onClick={toggleLocation}
            >
              ĐỊA ĐIỂM
              {/* Show or hide location submenu */}
              {isLocationOpen && (
                <ul className="mt-2 ml-4">
                  <li className="">
                    <Link to={""} className=" text-[#9D9EA2]">
                      Hà Nội
                    </Link>
                  </li>
                  <li>
                    <Link to={""} className="text-[#9D9EA2]">
                      Đà Nẵng
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </section>

          <section className="flex flex-col pr-7 pb-6 border-b items-center">
            <span className="text-[#717378] text-xs tracking-[1px]">
              THỜI GIAN
            </span>
            <div className="flex justify-between *:px-2.5 my-5 *:py-1 *:bg-[#F4F4F4] *:rounded-[100px] *:text-xs ml-7">
              <input
                type="date"
                className=" px-4 py-2 border border-gray-300 rounded-lg w-32"
                placeholder="Từ ngày"
              />
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
              <input
                type="date"
                className=" px-4 py-2 border border-gray-300 rounded-lg w-32"
                placeholder="Đến ngày"
              />
            </div>
            <button className="w-[103px] mt-6 h-[40px] rounded-[1000px] bg-[#007BFF] text-white">
              Apply
            </button>
          </section>

          <section className="flex flex-col py-6 items-center">
          <span className="text-base tracking-[1px]">HÌNH THỨC</span>
            <ul className="*:gap-y-3 *:gap-x-3.5 *:tracking-[1px] pt-2.5 pb-1.5 *:flex *:items-center *:my-[9px] border-b ml-5">
              <li className="">
                <Link to={""} className=" text-[#9D9EA2]">
                  Online
                </Link>
              </li>
              <li>
                <Link to={""} className="text-[#9D9EA2]">
                  Offline
                </Link>
              </li>
            </ul>
          </section>
          
          <button className="bg-[#F3FBF4] rounded-[100px] text-[14px] leading-[21px] text-[#007BFF] mt-5 h-10 px-8 ml-20">
            Clear Filters
          </button>
        </div>

        <div className="w-full flex flex-col mb:items-center lg:items-start">
          <div className="mb:w-[342px] lg:w-full flex  items-center lg:pb-6 mb:pb-4">
            <strong className="lg:text-2xl mb:text-base font-normal ml-3">
              Kết quả tìm kiếm:{" "}
            </strong>
            <div className="flex gap-x-[10px] ml-28">
              <div className="relative lg:hidden group w-[78px] flex place-items-center gap-x-2 h-[34px] border rounded-[100px] px-3 cursor-pointer border-gray-300 text-gray-700 text-xs tracking-[-0.5px]">
                Filter{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-chevron-down group-hover:rotate-180 duration-300"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <ul className="absolute hidden group-hover:block top-full bg-white shadow-xl p-3 *:mb-3 *:mx-2 *:whitespace-nowrap left-0 columns-1 *:duration-300">
                  <li
                    className="hover:text-[#007BFF] cursor-pointer"
                    onClick={toggleCategory}
                  >
                    Danh mục
                    {isCategoryOpen && (
                      <ul className="pl-4 mt-2">
                        <li className=""><Link to={""}>Danh mục con 1</Link></li>
                        <li className=""><Link to={""}>Danh mục con 1</Link></li>
                      </ul>
                    )}
                  </li>
                  <li
                    className="hover:text-[#007BFF] cursor-pointer"
                    onClick={toggleLocation}
                  >
                    Địa điểm
                    {isLocationOpen && (
                      <ul className="pl-4 mt-2">
                        <li className=""><Link to={""}>Hà Nội</Link></li>
                        <li className=""><Link to={""}>Đà Nẵng</Link></li>
                      </ul>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:w-[1000px] mb:w-[342px] lg:mt-9 lg:pb-8 mb:pb-6 mb:mt-6">
            <div className="w-full p-4 space-y-6">
              {/* Event Card 1 */}
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row h-auto md:h-[250px]">
                <div className="w-full md:w-1/3 bg-gray-300 rounded-[50px] h-[200px] md:h-full">
                  <img src="" alt="" />
                </div>
                <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-4">
                  <h2 className="text-xl font-bold">Những thành phố mơ màng</h2>
                  <p className="text-gray-600 mt-2">
                    Thời gian: 01/01/2023 <br />
                    Địa điểm: Công viên Yên Sở, Hoàng Mai, Hà Nội, Quận Hoàng
                    Mai, Thành Phố Hà Nội
                  </p>
                  <p className="text-gray-600 mt-4">
                    Mô tả: Đây là một sự kiện âm nhạc ngoài trời đặc biệt, nơi
                    bạn có thể thưởng thức các màn trình diễn tuyệt vời của
                    những nghệ sĩ hàng đầu trong khung cảnh thiên nhiên tuyệt
                    đẹp. Với những hoạt động thú vị và chương trình giải trí
                    phong phú, sự kiện này chắc chắn sẽ là một ngày đáng nhớ cho
                    tất cả mọi người tham dự.
                  </p>
                </div>
              </div>

              {/* Event Card 2 */}
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row h-auto md:h-[250px]">
                <div className="w-full md:w-1/3 bg-gray-300 rounded-[50px] h-[200px] md:h-full">
                  <img src="" alt="" />
                </div>
                <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-4">
                  <h2 className="text-xl font-bold">Những thành phố mơ màng</h2>
                  <p className="text-gray-600 mt-2">
                    Thời gian: 04/04/2023 <br />
                    Địa điểm: Công viên Yên Sở, Hoàng Mai, Hà Nội, Quận Hoàng
                    Mai, Thành Phố Hà Nội
                  </p>
                  <p className="text-gray-600 mt-4">
                    Mô tả: Sự kiện này hứa hẹn sẽ mang đến cho bạn những khoảnh
                    khắc thư giãn và giải trí tuyệt vời với các hoạt động nghệ
                    thuật đường phố và khu vui chơi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventListing;
