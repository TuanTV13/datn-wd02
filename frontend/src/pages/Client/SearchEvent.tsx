import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { EventCT } from "../../Contexts/ClientEventContext";
import { CategoryCT } from "../../Contexts/CategoryContext";
import api from "../../api_service/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchEvent = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { categories, fetchEventsByCategory } = useContext(CategoryCT);
  const { events, setEvents } = useContext(EventCT);

  // Function to toggle category menu
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Function to toggle location menu
  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const navigate = useNavigate();
  const handleCategoryClick = async (categoryId: number | string) => {
    await fetchEventsByCategory(categoryId); // Fetch events by category
    navigate(`/event-category/${categoryId}`); // Navigate to the category page
  };

  // Search
  const query = useQuery();
  const searchTerm = query.get("query") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true); // Hiển thị loading trước khi gọi API
      api
        .post("/clients/events/search", { name: searchTerm }) // Gửi request với từ khóa
        .then((response) => {
          console.log(response.data);
          setEvents(response.data.data.data || []); // Cập nhật danh sách sự kiện
          setLoading(false); // Tắt loading
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || "Đã xảy ra lỗi khi tìm kiếm sự kiện"
          ); // Hiển thị lỗi từ API hoặc lỗi mặc định
          setLoading(false); // Tắt loading
        });
    }
  }, [searchTerm]);
  return (
    <div className="lg:mx-10 mt-36">
      <div className="flex flex-col lg:flex-row">
        {/* <!-- Sidebar --> */}
        <div className="w-full lg:w-1/4 p-4 bg-white rounded-[30px]  mb-4 lg:mb-0 border">
          <h2 className="text-4xl font-semibold mb-4">Bộ lọc</h2>
          <div className="mb-9 ">
            <div
              className="flex justify-between lg:text-2xl font-medium mb-1 hover:text-[#007BFF] cursor-pointer"
              onClick={toggleCategory}
            >
              Danh mục
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
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            {isCategoryOpen && (
              <>
                {/* Ô input */}
                <input
                  type="text"
                  className="mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm danh mục..."
                />

                <ul className="ml-2 text-gray-400 lg:text-base">
                  <li className="cursor-pointer hover:text-[#007BFF]">
                    Danh mục 1
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="mb-9 ">
            <div
              className="flex justify-between lg:text-2xl font-medium mb-1 hover:text-[#007BFF] cursor-pointer"
              onClick={toggleLocation}
            >
              Địa điểm tổ chức
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
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            {isLocationOpen && (
              <>
                {/* Ô input */}
                <input
                  type="text"
                  className="mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm địa điểm..."
                />

                <ul className="ml-2 text-gray-400 lg:text-base">
                  <li className="cursor-pointer hover:text-[#007BFF]">
                    Hà nội
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* Bộ lọc ngày */}
          <div className="mb-9">
            <label className="flex flex-col space-y-2">
              <span className="text-lg">Từ ngày:</span>
              <input
                type="date"
                className="cursor-pointer mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-2 mt-4">
              <span className="text-lg">Đến ngày:</span>
              <input
                type="date"
                className="cursor-pointer mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <button className="mt-4 px-4 py-2 rounded-md bg-[#007BFF] text-[#ffff] hover:bg-blue-200 hover:text-[#007BFF]">
              Apply
            </button>
            <button className="mt-4 ml-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
              Clear
            </button>
          </div>
        </div>
        {/* <!-- Main Content --> */}
        <div className="w-full lg:w-3/4 p-4">
          <div className=" mb-4 ">
            <div className="flex justify-between space-x-2  items-center">
              <h2 className="text-3xl font-semibold">
                Kết quả tìm kiếm liên quan đến "{searchTerm}"
              </h2>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
          <div className="border-b-[1px] border-gray-300 mb-4"></div>
          {/* <!-- Items --> */}
          <div className="space-y-4 ">
            {events.length > 0 ? (
              events.map((item) => (
                <div className="bg-white p-4 rounded-[20px] shadow flex flex-col lg:flex-row border hover:border-[#007BFF]">
                  <div className="w-full lg:w-1/3 relative mb-4 lg:mb-0 overflow-hidden">
                    <Link to={`/event-detail/${item.id}`}>
                      <img
                        alt={item.name}
                        className="rounded-[20px] h-[180px] w-full object-cover transition-all duration-300 hover:rounded-none hover:scale-110"
                        src={item.thumbnail}
                      />
                    </Link>
                  </div>
                  <div className="w-full lg:w-2/3 pl-5 flex flex-col justify-between">
                    <div className="mt-2 lg:flex">
                      <div className="flex flex-col justify-between lg:w-2/3">
                        <h3 className="text-lg font-semibold hover:text-[#007BFF] cursor-pointer">
                          <Link to={`/event-detail/${item.id}`}>
                            {item.name}
                          </Link>
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2 mt-1">
                          <i className="fas fa-clock mr-2"></i>
                          Thời gian bắt đầu: {item.start_time}
                        </div>
                        <div className="flex items-center text-gray-600 mb-2 mt-1">
                          <i className="fas fa-clock mr-2"></i>
                          Thời gian kết thúc: {item.end_time}
                        </div>
                        <div className="flex items-center text-gray-600 mb-2 mt-1">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          Địa điểm: {item.location}
                        </div>
                        <div
                          className={`flex items-center text-gray-600 mb-2 line-clamp-1`}
                        >
                          Mô tả: {item.description}
                        </div>

                        <Link
                          to={`/event-detail/${item.id}`}
                          className="text-blue-500 "
                        >
                          Xem thêm
                        </Link>
                      </div>

                      <div className="lg:ml-5 lg:mt-28">
                        <button className="w-[100%] mr-2 px-8 py-3 border rounded-[20px] text-blue-500 border-blue-500 hover:bg-[#007BFF] hover:text-white">
                          <Link to={`/event-detail/${item.id}`}>
                            Xem chi tiết
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy sự kiện nào phù hợp.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchEvent;
