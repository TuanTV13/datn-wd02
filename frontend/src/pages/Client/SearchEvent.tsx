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
import { fetchEventsByProvince } from "../../api_service/ClientEvent";
import { Checkbox, Empty, notification } from "antd";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchEvent = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { categories, fetchEventsByCategory } = useContext(CategoryCT);
  const { events, setEvents, provinces } = useContext(EventCT);
  const [categoryId, setCategoryId] = useState<any[]>([]);
  // Function to toggle category menu
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Function to toggle location menu
  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const navigate = useNavigate();
  const handleCategoryClick = async (id: number | string) => {
    await fetchEventsByCategory(id);
    navigate(`/event-category/${id}`);
  };

  const [filteredEvents, setFilteredEvents] = useState(events); // Sự kiện đã lọc
  const location = useLocation();
  const [start_time, setStart_time] = useState(""); // Ngày bắt đầu
  const [end_time, setEnd_time] = useState(""); // Ngày kết thúc

  const fetchEventsByDate = async (startTime: string, endTime: string) => {
    try {
      console.log("Calling API with:", { startTime, endTime }); // Debug
      const response = await api.post("/clients/events/filter", {
        start_time: startTime,
        end_time: endTime,
      });
      console.log("API Response:", response);
      setFilteredEvents(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (categoryId.length > 0) {
      setFilteredEvents([
        ...allEvents.filter((v) => categoryId.includes(v.category_id)),
      ]);
    } else {
      if (allEvents) {
        setFilteredEvents([...allEvents]);
      }
    }
  }, [categoryId]);

  const handleApplyFilters = () => {
    if (start_time && end_time) {
      const params = new URLSearchParams(location.search);
      params.delete("query");
      params.delete("province");
      params.set("start_time", start_time);
      params.set("end_time", end_time);
      navigate(`?${params.toString()}`);
      fetchEventsByDate(start_time, end_time); // Lấy sự kiện theo khoảng thời gian đã chọn
    } else {
      notification.error({
        message: "Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!",
      });
    }
  };
  // Lấy query params từ URL khi tải trang
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const startTime = params.get("start_time");
    const endTime = params.get("end_time");
    const province = params.get("province");
    if (startTime && endTime) {
      setStart_time(startTime);
      setEnd_time(endTime);
      fetchEventsByDate(startTime, endTime);
    }
    if (province) {
      fetchEventsByProvince(province).then((data) => setFilteredEvents(data));
    }
  }, [location.search]);

  const clearFilters = () => {
    navigate("/event-list");
    setStart_time("");
    setEnd_time("");
    setFilteredEvents(events);
  };
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc danh mục dựa trên giá trị của ô input
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedProvince, setSelectedProvince] = useState(null);
  const handleProvinceClick = async (Inputlocation: any) => {
    setSelectedProvince(Inputlocation);
    const params = new URLSearchParams(location.search);
    params.delete("query");
    params.delete("start_time");
    params.delete("end_time");
    params.set("province", Inputlocation);
    navigate(`?${params.toString()}`);
    try {
      const data = await fetchEventsByProvince(Inputlocation);
      setFilteredEvents(data); // Cập nhật danh sách sự kiện
    } catch (err) {
      setFilteredEvents([]); // Xóa danh sách sự kiện cũ
    }
  };
  const [Inputlocation, setLocation] = useState("");

  const filteredProvince = provinces.filter((item) =>
    item.name.toLowerCase().includes(Inputlocation.toLowerCase())
  );

  // Search
  const query = useQuery();
  const searchTerm = query.get("query") || "";

  useEffect(() => {
    if (searchTerm) {
      api
        .post("/clients/events/search", { name: searchTerm }) // Gửi request với từ khóa
        .then((response) => {
          setFilteredEvents(response.data.data.data);
          setAllEvents(response.data.data.data); // Lưu lại tất cả sự kiện ban đầu
        })
        .catch((err) => {
          console.log(
            err.response?.data?.message || "Đã xảy ra lỗi khi tìm kiếm sự kiện"
          );
        });
    }
  }, [searchTerm]);

  const [allEvents, setAllEvents] = useState(events);
  useEffect(() => {
    // Khi trang tải lại, lấy lại sự kiện ban đầu
    setFilteredEvents(events); // Hiển thị tất cả sự kiện khi chưa có bộ lọc
  }, [events]);

  const stripHtmlTags = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const [totalPages, setTotalPages] = useState(Math.ceil(events.length / 5));
  useEffect(() => {
    setTotalPages(Math.ceil(filteredEvents?.length / 5)); // Cập nhật lại tổng số trang khi có sự kiện lọc
  }, [filteredEvents]);
  const eventsPerPage = 5; // Số sự kiện trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Tính các sự kiện cần hiển thị dựa trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Hàm xử lý thay đổi trang
  const handlePageChange = (direction: any) => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === "prev" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };
  return (
    <div className="lg:mx-10 mt-36 ">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* <!-- Sidebar --> */}
        <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-2xl p-6 border h-fit border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Bộ lọc</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer text-xl font-semibold text-gray-700 hover:text-blue-600 transition-colors"
              onClick={toggleCategory}
            >
              Danh mục
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {isCategoryOpen && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.id}
                      className="px-2 py-1 hover:bg-blue-50 rounded cursor-pointer text-gray-600 hover:text-blue-600"
                      // onClick={() => handleCategoryClick(category.id)}
                    >
                      <Checkbox
                        onChange={(e) => {
                          e.target.checked
                            ? setCategoryId([...categoryId, category.id])
                            : setCategoryId([
                                ...categoryId.filter((v) => v !== category.id),
                              ]);
                        }}
                      />
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer text-xl font-semibold text-gray-700 hover:text-blue-600 transition-colors"
              onClick={toggleLocation}
            >
              Địa điểm
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform ${
                  isLocationOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {isLocationOpen && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm địa điểm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={Inputlocation}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {filteredProvince.map((province) => (
                    <li
                      key={province.id}
                      className={`px-2 py-1 rounded cursor-pointer ${
                        selectedProvince === province.name
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={() => handleProvinceClick(province.name)}
                    >
                      {province.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Từ ngày:</label>
                <input
                  type="date"
                  value={start_time}
                  onChange={(e) => setStart_time(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Đến ngày:</label>
                <input
                  type="date"
                  value={end_time}
                  onChange={(e) => setEnd_time(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Áp dụng
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Main Content --> */}
        <div className="w-full lg:w-3/4 p-4">
          <div className="mb-4">
            <h2 className="text-3xl font-semibold text-[#007BFF]">
              Kết quả tìm kiếm liên quan đến "{searchTerm}"
            </h2>
          </div>
          <div className="border-b-[1px] border-gray-300 mb-4"></div>

          <div className="space-y-4">
            {currentEvents?.length > 0 ? (
              currentEvents?.map((item) => (
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
                    <div className="lg:flex">
                      <div className="flex flex-col justify-between lg:w-2/3">
                        <h3 className="text-lg font-semibold hover:text-[#007BFF] cursor-pointer line-clamp-1">
                          <Link to={`/event-detail/${item.id}`}>
                            {item.name}
                          </Link>
                        </h3>
                        <div className="flex items-center text-gray-600 mb-1 mt-1">
                          <i className="fas fa-clock mr-2"></i>
                          Thời gian bắt đầu: {item.start_time}
                        </div>
                        <div className="flex items-center text-gray-600 mb-1 mt-1">
                          <i className="fas fa-clock mr-2"></i>
                          Thời gian kết thúc: {item.end_time}
                        </div>
                        <div className="flex items-center text-gray-600 mb-1 mt-1 line-clamp-1">
                          <i className="fa-solid fa-user mr-2"></i>
                          Diễn giả:
                          {item.speakers?.length > 0 ? (
                            item.speakers?.map((speaker, index) => (
                              <span className="ml-1 ">
                                {speaker.name}
                                {index < item.speakers.length - 1 && " , "}
                              </span>
                            ))
                          ) : (
                            <span className="ml-1">Không có diễn giả</span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600 mb-1 mt-1">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          Địa điểm: {item.location}
                        </div>
                        <div
                          className={`flex items-center text-gray-600 mb-1 line-clamp-1`}
                        >
                          Mô tả: {stripHtmlTags(item.description)}
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
              <p className="text-gray-600">
                <Empty />{" "}
              </p>
            )}
            {currentEvents?.length && (
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
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchEvent;
