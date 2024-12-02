import React, { useContext, useEffect, useState } from "react";
import { CategoryCT } from "../../Contexts/CategoryContext";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { EventCT } from "../../Contexts/ClientEventContext";
import api from "../../api_service/api";
import { fetchEventsByProvince } from "../../api_service/ClientEvent";

const CategoryEven = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const { categories, fetchEventsByCategory, events, setEvents } =
    useContext(CategoryCT);
  const { provinces } = useContext(EventCT);

  // Function to toggle category menu
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Function to toggle location menu
  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
  };
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();
  const handleCategoryClick = async (id: number | string) => {
    await fetchEventsByCategory(id);
    console.log(events);
    navigate(`/event-category/${id}`);
  };

  // const [filteredEvents, setEvents] = useState(events); // Sự kiện đã lọc
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
      setEvents(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplyFilters = () => {
    if (start_time && end_time) {
      const params = new URLSearchParams(location.search);
      params.delete("province");
      params.delete("query");
      params.set("start_time", start_time);
      params.set("end_time", end_time);
      navigate(`?${params.toString()}`);
      fetchEventsByDate(start_time, end_time); // Lấy sự kiện theo khoảng thời gian đã chọn
    } else {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!");
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
      fetchEventsByProvince(province).then((data) => setEvents(data));
    }
  }, [location.search]);

  const clearFilters = () => {
    navigate("/event-list");
    setStart_time("");
    setEnd_time("");
    setEvents(events);
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
      setEvents(data); // Cập nhật danh sách sự kiện
    } catch (err) {
      setEvents([]); // Xóa danh sách sự kiện cũ
    }
  };
  const [Inputlocation, setLocation] = useState("");

  const filteredProvince = provinces.filter((item) =>
    item.name.toLowerCase().includes(Inputlocation.toLowerCase())
  );

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    fetchEventsByCategory(id!);
  }, []);

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ul className="ml-2 text-gray-400 lg:text-base">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.id}
                      className="cursor-pointer hover:text-[#007BFF]"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </li>
                  ))}
                  {filteredCategories.length === 0 && (
                    <li className="text-gray-500">Không tìm thấy danh mục</li>
                  )}
                </ul>
              </>
            )}
          </div>

          <div className="mb-9 ">
            <div
              className="flex justify-between lg:text-2xl font-medium mb-1 hover:text-[#007BFF] cursor-pointer"
              onClick={toggleLocation}
            >
              Địa điểm
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
                  id="location"
                  className="mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm địa điểm..."
                  value={Inputlocation}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <ul
                  className="ml-2 text-gray-400 lg:text-base overflow-y-auto"
                  style={{ maxHeight: "150px" }}
                >
                  {filteredProvince?.map((province) => (
                    <li
                      onClick={() => handleProvinceClick(province.name)}
                      key={province.id}
                      className={`cursor-pointer hover:text-[#007BFF] ${
                        selectedProvince === province.name
                          ? "text-blue-500 font-semibold"
                          : ""
                      }`}
                    >
                      {province.name}
                    </li>
                  ))}
                  {filteredProvince.length === 0 && (
                    <li className="text-gray-500">
                      Không tìm thấy tỉnh/thành phố
                    </li>
                  )}
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
                id="start_time"
                value={start_time}
                onChange={(e) => setStart_time(e.target.value)}
                className="cursor-pointer mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-2 mt-4">
              <span className="text-lg">Đến ngày:</span>
              <input
                type="date"
                id="end_time"
                value={end_time}
                onChange={(e) => setEnd_time(e.target.value)}
                className="cursor-pointer mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <button
              onClick={handleApplyFilters}
              className="mt-4 px-4 py-2 rounded-md bg-[#007BFF] text-[#ffff] hover:bg-blue-200 hover:text-[#007BFF]"
            >
              Apply
            </button>
            <button
              className="mt-4 ml-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
        {/* <!-- Main Content --> */}
        <div className="w-full lg:w-3/4 p-4">
          <div className=" mb-4 ">
            <div className="flex justify-between space-x-2  items-center">
              <h2 className="text-3xl font-semibold">
                Danh mục: {events.length > 0 && events[0]?.category?.name}
              </h2>
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
              <p className="text-center text-gray-500 mt-4">
                Không tìm thấy sự kiện nào phù hợp.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEven;
