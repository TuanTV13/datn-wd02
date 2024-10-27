import React, { useState } from "react";

const CategoryEven = () => {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  //   Dữ liệu tạm thời
  const events = [
    {
      id: 1,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 2,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 3,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 4,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 5,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 6,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 7,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
    {
      id: 8,
      location: "Hà Nội",
      title: "Vietnam Motor show 2024 - triển lãm ô tô vn  ",
      date: "09:00 - 23/10/2024",
      visitors: "16.6k",
    },
  ];
  return (
    <div className="mt-36">
      <h1 className="text-3xl font-bold lg:ml-36 border-b-2 border-gray-300 lg:mr-36 pb-2">Danh mục sự kiện</h1>

      <div className="lg:w-[1200px] mx-auto sm:w-[95vw] mb:w-[342px] flex flex-col lg:mt-[10px] lg:pt-4 mb:pt-[39px]">
        <p className="lg:text-[25px] mb:text-[28px] lg:leading-[30px] mb:leading-[40px]">
          Danh mục a
        </p>
        <div className="grid lg:pt-8 lg:pb-[15px] mb:pb-[61px] lg:grid-cols-4 gap-y-8 mb:gap-y-4 mx-6">
          {events.slice(0, showAll ? events.length : 4).map((event) => (
            <div
              key={event.id}
              className="w-full h-auto mb-4 lg:w-[250px] lg:h-[280px] border border-gray-400 rounded-lg p-2 xm:mt-3"
            >
              <div className="w-full h-[120px] bg-gray-200 mb-2">
                <img src="" alt="" />
              </div>
              <div className="text-xs text-gray-700 mb-2">
                <p>{event.location}</p>
                <p>{event.title}</p>
                <p className="text-gray-500 pt-4">Vào cổng tự do</p>
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
                  <span>{event.date}</span>
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
                  <span>{event.visitors}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={toggleShowAll}
            className="p-2 bg-blue-500 text-white rounded-lg w-40"
          >
            {showAll ? "Ẩn bớt" : "Xem thêm..."}
          </button>
        </div>
        <div className="w-full border-t border-gray-300 mt-4"></div>
      </div>

      <div className="lg:w-[1200px] mx-auto sm:w-[95vw] mb:w-[342px] flex flex-col lg:mt-[40px] lg:pt-4 mb:pt-[39px]">
        <p className="lg:text-[25px] mb:text-[28px] lg:leading-[30px] mb:leading-[40px]">
          Danh mục b
        </p>
        <div className="grid lg:pt-8 lg:pb-[15px] mb:pb-[61px] lg:grid-cols-4 gap-y-8 mb:gap-y-4 mx-6">
          {events.slice(0, showAll ? events.length : 4).map((event) => (
            <div
              key={event.id}
              className="w-full h-auto mb-4 lg:w-[250px] lg:h-[280px] border border-gray-400 rounded-lg p-2 xm:mt-3"
            >
              <div className="w-full h-[120px] bg-gray-200 mb-2">
                <img src="" alt="" />
              </div>
              <div className="text-xs text-gray-700 mb-2">
                <p>{event.location}</p>
                <p>{event.title}</p>
                <p className="text-gray-500 pt-4">Vào cổng tự do</p>
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
                  <span>{event.date}</span>
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
                  <span>{event.visitors}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={toggleShowAll}
            className="p-2 bg-blue-500 text-white rounded-lg w-40"
          >
            {showAll ? "Ẩn bớt" : "Xem thêm..."}
          </button>
        </div>
        <div className="w-full border-t border-gray-300 mt-4"></div>
      </div>

      <div className="lg:w-[1200px] mx-auto sm:w-[95vw] mb:w-[342px] flex flex-col lg:mt-[40px] lg:pt-4 mb:pt-[39px]">
        <p className="lg:text-[25px] mb:text-[28px] lg:leading-[30px] mb:leading-[40px]">
          Danh mục c
        </p>
        <div className="grid lg:pt-8 lg:pb-[15px] mb:pb-[61px] lg:grid-cols-4 gap-y-8 mb:gap-y-4 mx-6">
          {events.slice(0, showAll ? events.length : 4).map((event) => (
            <div
              key={event.id}
              className="w-full h-auto mb-4 lg:w-[250px] lg:h-[280px] border border-gray-400 rounded-lg p-2 xm:mt-3"
            >
              <div className="w-full h-[120px] bg-gray-200 mb-2">
                <img src="" alt="" />
              </div>
              <div className="text-xs text-gray-700 mb-2">
                <p>{event.location}</p>
                <p>{event.title}</p>
                <p className="text-gray-500 pt-4">Vào cổng tự do</p>
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
                  <span>{event.date}</span>
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
                  <span>{event.visitors}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={toggleShowAll}
            className="p-2 bg-blue-500 text-white rounded-lg w-40"
          >
            {showAll ? "Ẩn bớt" : "Xem thêm..."}
          </button>
        </div>
        <div className="w-full border-t border-gray-300 mt-4"></div>
      </div>
    </div>
  );
};

export default CategoryEven;