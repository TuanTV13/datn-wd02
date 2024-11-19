import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventCT } from "../../Contexts/ClientEventContext";
import { CategoryCT } from "../../Contexts/CategoryContext";

const EventListing = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

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

  const [filter, setFilter] = useState("");

  const navigate = useNavigate();
  const handleCategoryClick = async (categoryId: number | string) => {
    await fetchEventsByCategory(categoryId); // Fetch events by category
    navigate(`/event-category/${categoryId}`); // Navigate to the category page
  };

  const cities = [...new Set(events.map((event) => event.location))];

  // Hàm xử lý thay đổi thành phố
  const handleLocationChange = (city: string) => {
    setFilter(city); // Cập nhật filter theo thành phố đã chọn
  };
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc
  // Lọc sự kiện theo thành phố và khoảng thời gian
  //  const filteredEvents = events.filter((event) => {
  //   const eventStartDate = new Date(event.start_time); // Ngày bắt đầu của sự kiện

  //   // Kiểm tra nếu có bộ lọc thành phố
  //   const isLocationMatch = filter
  //     ? event.location.toLowerCase() === filter.toLowerCase()
  //     : true;

  //   // Kiểm tra nếu ngày bắt đầu sự kiện nằm trong khoảng thời gian
  //   const isDateMatch =
  //     (!startDate || eventStartDate >= new Date(startDate)) &&
  //     (!endDate || eventStartDate <= new Date(endDate));

  //   return isLocationMatch && isDateMatch;
  // });
  const [applyFilter, setApplyFilter] = useState(false); // Trạng thái để kiểm tra khi bấm nút Apply
  const [filteredEvents, setFilteredEvents] = useState(events); // Sự kiện đã lọc

  // Lọc sự kiện theo thành phố ngay khi người dùng nhập
  useEffect(() => {
    const filteredByCity = filter
      ? events.filter((event) =>
          event.location.toLowerCase().includes(filter.toLowerCase())
        )
      : events;

    setFilteredEvents(filteredByCity);
  }, [filter, events]);

  // Hàm áp dụng bộ lọc ngày
  useEffect(() => {
    if (!applyFilter) return; // Nếu chưa bấm nút Apply thì không lọc

    // Lọc sự kiện khi startDate hoặc endDate thay đổi
    const filteredByDate = events.filter((event) => {
      const eventStartDate = new Date(event.start_time); // Ngày bắt đầu của sự kiện
      const start = new Date(startDate); // Ngày bắt đầu lọc
      const end = new Date(endDate); // Ngày kết thúc lọc

      return (
        (!startDate || eventStartDate >= start) &&
        (!endDate || eventStartDate <= end)
      );
    });

    // Cập nhật sự kiện đã lọc
    setFilteredEvents(filteredByDate);
  }, [applyFilter, startDate, endDate, events]); // Theo dõi thay đổi của applyFilter, startDate, endDate và events

  const handleApplyFilters = () => {
    setApplyFilter(true); // Đánh dấu là bấm nút Apply
  };

  const clearFilters = () => {
    setFilter("");
    navigate("/event-list");
  };
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc danh mục dựa trên giá trị của ô input
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [locationQuery, setLocationQuery] = useState("");

  // Lọc danh sách thành phố dựa trên giá trị input
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(locationQuery.toLowerCase())
  );

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

                {/* Danh sách danh mục chỉ hiển thị khi ô input không rỗng */}
                {searchQuery.trim() !== "" && (
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
                )}
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
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />

                {/* Danh sách địa điểm chỉ hiển thị khi input không rỗng */}
                {locationQuery.trim() !== "" && (
                  <ul className="ml-2 text-gray-400 lg:text-base">
                    {filteredCities.map((city, index) => (
                      <li
                        key={index}
                        className="cursor-pointer hover:text-[#007BFF]"
                        onClick={() => handleLocationChange(city)}
                      >
                        {city}
                      </li>
                    ))}
                    {filteredCities.length === 0 && (
                      <li className="text-gray-500">Không tìm thấy địa điểm</li>
                    )}
                  </ul>
                )}
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
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </label>
            <label className="flex flex-col space-y-2 mt-4">
              <span className="text-lg">Đến ngày:</span>
              <input
                type="date"
                className="cursor-pointer mt-1 mb-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
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
              <h2 className="text-3xl font-semibold">Danh sách sự kiện</h2>
            </div>
          </div>
          <div className="border-b-[1px] border-gray-300 mb-4"></div>
          {/* <!-- Items --> */}
          <div className="space-y-4 ">
            {filteredEvents.map((item) => (
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
                        <Link to={`/event-detail/${item.id}`}>{item.name}</Link>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventListing;
