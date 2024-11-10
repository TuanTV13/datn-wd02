import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { HomeCT } from "../../Contexts/HomeContext";

const ItemEven = () => {
  // const [showAll, setShowAll] = useState(false);
  // const toggleShowAll = () => {
  //   setShowAll(!showAll);
  // };
  const [filter, setFilter] = useState("Mới nhất");
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const { upcomingEvents, featuredEvents, topRatedEvents } = useContext(HomeCT);
  // Hàm lọc sự kiện theo tên thành phố hoặc bộ lọc
  const filteredEvents = upcomingEvents.filter((event) => {
    // Chuyển đổi giá trị bộ lọc và location của sự kiện thành chữ thường để so sánh không phân biệt hoa thường
    const normalizedLocation = event.location.toLowerCase();
    const normalizedFilter = filter.toLowerCase();

    if (normalizedFilter === "mới nhất") {
      return true; // Hiển thị tất cả sự kiện khi chọn "Mới nhất"
    } else if (normalizedFilter === "hà nội") {
      return normalizedLocation === "hà nội";
    } else if (normalizedFilter === "hồ chí minh") {
      return normalizedLocation === "hồ chí minh";
    }
    return true;
  });
  return (
    <div>
      {/* 1 */}
      <div className="lg:w-[1200px] mx-auto sm:w-[95vw] mb:w-[342px] flex flex-col lg:mt-[10px] lg:pt-12 mb:pt-[39px]">
        <strong className="lg:text-[30px] mb:text-[32px] lg:leading-[30px] mb:leading-[40px] ml-2">
          SỰ KIỆN SẮP DIỄN RA
        </strong>

        <div className="flex lg:mt-6">
          <div className="overflow-x-auto w-full">
            <ul className="flex space-x-4 w-max px-4 mb-4 mt-4">
              <li
                className={`px-4 py-2 ${
                  filter === "Mới nhất"
                    ? "bg-gray-100"
                    : "hover:text-[#6C757D] hover:bg-[#F2F6F4]"
                } rounded-full border whitespace-nowrap`}
                onClick={() => setFilter("Mới nhất")}
              >
                <Link to={""}>Mới nhất</Link>
              </li>
              <li
                className={`px-4 py-2 ${
                  filter === "Hà Nội"
                    ? "bg-gray-100"
                    : "hover:text-[#6C757D] hover:bg-[#F2F6F4]"
                } rounded-full border-gray-300 border whitespace-nowrap`}
                onClick={() => setFilter("Hà Nội")}
              >
                <Link to={""}>Hà Nội</Link>
              </li>
              <li
                className={`px-4 py-2 ${
                  filter === "Hồ Chí Minh"
                    ? "bg-gray-100"
                    : "hover:text-[#6C757D] hover:bg-[#F2F6F4]"
                } rounded-full border-gray-300 border whitespace-nowrap`}
                onClick={() => setFilter("Hồ Chí Minh")}
              >
                <Link to={""}>Hồ Chí Minh</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid lg:pt-8 lg:pb-[50px] mb:pb-[61px] lg:grid-cols-4 gap-y-8 mb:gap-y-4 mx-12 mt-4">
          {filteredEvents
            .slice(0, showUpcoming ? filteredEvents.length : 4)
            .map((event) => (
              <div
                key={event.id}
                className="w-full h-auto mb-4 lg:w-[250px] lg:h-[280px] border border-gray-400 rounded-lg p-2 xm:mt-3"
              >
                <div className="w-full h-[120px] bg-gray-200 mb-2">
                  <img
                    src={event.thumbnail || ""}
                    alt={event.name}
                    className="h-[120px] w-full"
                  />
                </div>
                <div className="text-xs text-gray-700 mb-2">
                  <p>{event.location}</p>
                  <p>{event.name}</p>
                  <p className="text-gray-500 pt-4">Vào cổng tự do</p>
                </div>
                <div className="flex lg:flex-row justify-between items-center text-xs text-gray-600 border-t pt-5">
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 4h10M5 7v14h14V7M5 11h14"
                      />
                    </svg>
                    <span>{event.start_time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                    <span>{event.max_attendees}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="p-2 bg-blue-500 text-white rounded-lg w-40"
          >
            {showUpcoming ? "Ẩn bớt sự kiện" : "Xem tất cả sự kiện"}
          </button>
        </div>
      </div>

      {/* 2 */}
      <div className="lg:w-[1200px] mx-auto sm:w-full mb:w-full flex flex-col lg:mt-[10px] lg:pt-12 mb:pt-[39px] mt-4 mb-4">
        <strong className="lg:text-[30px] mb:text-[32px] lg:leading-[30px] mb:leading-[40px] xm:mt-5 ml-2">
          SỰ KIỆN NỔI BẬT
        </strong>

        <div className="grid lg:pt-16 lg:pb-[50px] mb:pb-[61px] lg:grid-cols-[250px_250px_250px_250px_250px] gap-y-8 mb:gap-y-4 mx-12 md:grid-cols-2 mt-4">
          {featuredEvents
            .slice(0, showFeatured ? featuredEvents.length : 5)
            .map((event) => (
              <div
                key={event.id}
                className="w-full h-auto mb-4 lg:w-[200px] lg:h-[270px] border border-gray-400 rounded-lg p-2 xm:mt-3"
              >
                <div className="w-full h-[120px] bg-gray-200 mb-2">
                  <img
                    src={event.thumbnail || ""}
                    alt={event.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-xs text-gray-700 mb-2">
                  <p className="pt-4">{event.location}</p>
                  <p>{event.name}</p>
                  <p className="text-gray-500 pt-3">Vào cổng tự do</p>
                </div>
                <div className="flex lg:flex-row justify-between items-center text-xs text-gray-600 border-t pt-5">
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 4h10M5 7v14h14V7M5 11h14"
                      />
                    </svg>
                    <span>{event.start_time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                    <span>{event.max_attendees}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowFeatured(!showFeatured)}
            className="p-2 bg-blue-500 text-white rounded-lg w-40"
          >
            {showFeatured ? "Ẩn bớt sự kiện" : "Xem tất cả sự kiện"}
          </button>
        </div>
      </div>

      {/* 3 */}
      <div className="lg:w-[1200px] mx-auto sm:w-full mb:w-full flex flex-col lg:mt-[10px] lg:pt-12 mb:pt-[39px] mt-4 mb-4">
        <strong className="lg:text-[30px] mb:text-[32px] lg:leading-[30px] mb:leading-[40px] xm:mt-5 ml-2">
          SỰ KIỆN ĐƯỢC ĐÁNH GIÁ CAO
        </strong>

        <div className="grid lg:pt-16 lg:pb-[50px] mb:pb-[61px] lg:grid-cols-4 gap-y-8 mb:gap-y-4 mx-12 mt-4">
          {/* <!-- item1 --> */}
          {topRatedEvents?.map((event) => (
            <div
              key={event.id}
              className="w-full h-auto mb-4 lg:w-[250px] lg:h-[280px] border border-gray-400 rounded-lg p-2 xm:mt-3"
            >
              <div className="w-full h-[120px] bg-gray-200 mb-2">
                <img src={event.thumbnail || ""} alt={event.name} />
              </div>
              <div className="text-xs text-gray-700 mb-2">
                <p>{event.location}</p>
                <p>{event.name}</p>
                <p className="text-gray-500 pt-3">Vào cổng tự do</p>
              </div>
              <div className="flex  lg:flex-row justify-between items-center text-xs text-gray-600 border-t pt-5">
                <div className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 4h10M5 7v14h14V7M5 11h14"
                    />
                  </svg>
                  <span>{event.start_time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                  <span>{event.max_attendees}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemEven;
