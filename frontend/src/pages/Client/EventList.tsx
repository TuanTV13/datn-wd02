import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventCT } from "../../Contexts/ClientEventContext";
import { CategoryCT } from "../../Contexts/CategoryContext";

const EventListing = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { categories, fetchEventsByCategory } = useContext(CategoryCT);
  const { events } = useContext(EventCT);

  // Function to toggle category menu
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Function to toggle location menu
  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const eventsPerPage = 3; // Số sự kiện trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Tính tổng số trang
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Tính các sự kiện cần hiển thị dựa trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === "prev" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };
  const navigate = useNavigate();
  const handleCategoryClick = async (categoryId: number | string) => {
    await fetchEventsByCategory(categoryId); // Fetch events by category
    navigate(`/event-category/${categoryId}`); // Navigate to the category page
  };

  return (
    <div className="w-full lg:py-10 py-4 border pb-[199px] mt-36">
      <div className="lg:container lg:mx-auto lg:w-[1315px] mb:w-full grid lg:grid-cols-[304px_978px] mb:grid-cols-[100%] *:w-full justify-between">
        <div className="lg:block hidden py-3 mt-0.5">
          <span className="lg:text-xl tracking-[-0.4px] ml-8">Filters</span>
          <section className="flex flex-col pt-[47px] pb-4 ml-8">
            <div
              className="cursor-pointer text-base tracking-[1px]"
              onClick={toggleCategory}
            >
              DANH MỤC
              {/* Show or hide category submenu */}
              {isCategoryOpen && (
                <ul className="mt-2 ml-4">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <Link to={``} className="text-[#9D9EA2]">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="flex flex-col pb-4 ml-8">
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

          <section className="flex flex-col pr-7 pb-6 border-b">
            <span className="text-[#717378] text-xs tracking-[1px] ml-8">
              THỜI GIAN
            </span>
            <div className="flex justify-between *:px-2.5 my-3 *:py-1 *:bg-[#F4F4F4] *:rounded-[100px] *:text-xs">
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

          <section className="flex flex-col py-6">
            <span className="text-base tracking-[1px] ml-8">HÌNH THỨC</span>
            <ul className="*:gap-y-3 *:gap-x-3.5 *:tracking-[1px] pt-1 pb-1.5 *:flex *:items-center *:my-[9px] border-b ml-10">
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

          <button className="bg-[#F3FBF4] rounded-[100px] text-[14px] leading-[21px] text-[#007BFF] mt-3 h-10 px-8 ml-20">
            Clear Filters
          </button>
        </div>

        <div className="w-full flex flex-col mb:items-center lg:items-start">
          <div className="mb:w-[342px] lg:w-full flex  items-center lg:pb-6 mb:pb-4">
            <strong className="lg:text-2xl mb:text-base font-normal ml-3">
              Danh sách sự kiện
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
                        <li className="">
                          <Link to={""}>Danh mục con 1</Link>
                        </li>
                        <li className="">
                          <Link to={""}>Danh mục con 1</Link>
                        </li>
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
                        <li className="">
                          <Link to={""}>Hà Nội</Link>
                        </li>
                        <li className="">
                          <Link to={""}>Đà Nẵng</Link>
                        </li>
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
              {currentEvents.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row h-auto md:h-[250px]"
                >
                  <div className="w-full md:w-1/3 ">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className=" rounded-[50px]"
                    />
                  </div>
                  <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-4">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="text-gray-600 mt-2">
                      Thời gian: {item.start_time} <br />
                      Địa điểm: {item.location}
                    </p>
                    <p
                      className={`text-gray-600 mt-4 ${
                        showFullDescription ? "" : "line-clamp-1"
                      }`}
                    >
                      Mô tả: {item.description}
                    </p>
                    {!showFullDescription && (
                      <Link to={`/event-detail/${item.id}`} className="text-blue-500 mt-2">
                        Xem thêm
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-gray-600 rounded-l-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
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
                      d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                    />
                  </svg>
                </button>
                <span className="px-2 py-1 border border-gray-600 text-gray-700 rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-gray-600 rounded-r-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventListing;
