import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Select, Modal } from 'antd';
import { getEvents, deleteEvent } from '../../../api_service/event';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const EventList = () => {
  const [list, setList] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [viewType, setViewType] = useState("grid"); // "grid" or "table"
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10); // Số lượng sự kiện hiển thị trên mỗi trang
const [searchStatus, setSearchStatus] = useState('');
const [searchStartDate, setSearchStartDate] = useState('');
const [searchEndDate, setSearchEndDate] = useState('');
const [searchTimeRange, setSearchTimeRange] = useState([]); // Thay thế cho searchStartDate và searchEndDate

const paginatedEvents = filteredEvents.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
useEffect(() => {
  const filtered = list.filter((event) => {
    const matchesName = event.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = searchCategory ? event.category_id === searchCategory : true;
    const matchesStatus = searchStatus ? event.status === searchStatus : true;

    // Lọc theo khoảng thời gian
    const matchesTime =
      (!searchTimeRange.length ||
        (new Date(event.start_time) >= searchTimeRange[0] &&
         new Date(event.end_time) <= searchTimeRange[1]));

    return matchesName && matchesCategory && matchesStatus && matchesTime;
  });
  setFilteredEvents(filtered);
}, [searchName, searchCategory, searchStatus, searchTimeRange, list]);

  const handleToggleView = () => {
    setViewType((prev) => (prev === "grid" ? "table" : "grid"));
  };
  useEffect(() => {
    const filtered = list.filter((event) => {
      const matchesName = event.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesCategory = searchCategory ? event.category_id === searchCategory : true;
      const matchesStatus = searchStatus ? event.status === searchStatus : true;
      const matchesTime =
        (!searchStartDate || new Date(event.start_time) >= new Date(searchStartDate)) &&
        (!searchEndDate || new Date(event.end_time) <= new Date(searchEndDate));
  
      return matchesName && matchesCategory && matchesStatus && matchesTime;
    });
    setFilteredEvents(filtered);
  }, [searchName, searchCategory, searchStatus, searchStartDate, searchEndDate, list]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        if (response && Array.isArray(response.data)) {
          setList(response.data);
          setFilteredEvents(response.data);
        } else {
          console.error('Dữ liệu trả về không phải là mảng:', response);
          setList([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sự kiện:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/categories/');
        if (response && response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = list.filter((event) => {
      const matchesName = event.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesCategory = searchCategory
        ? event.category_id === searchCategory
        : true;
      return matchesName && matchesCategory;
    });
    setFilteredEvents(filtered);
  }, [searchName, searchCategory, list]);

  const onDelete = async (id) => {
    setDeletingEventId(id);
    setConfirmModalIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvent(deletingEventId);
      const updatedList = list.filter((event) => event.id !== deletingEventId);
      setList(updatedList);
      setFilteredEvents(updatedList);
      toast.success('Xóa sự kiện thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      toast.error('Xóa sự kiện không thành công!');
    }
    setDeletingEventId(null);
    setConfirmModalIsOpen(false);
  };

  const handleCancelDelete = () => {
    setDeletingEventId(null);
    setConfirmModalIsOpen(false);
  };

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 'confirmed':
        return { text: 'Đang chuẩn bị', bgColor: 'bg-yellow-500', color:'bg-yellow-500' };
      case 'checkin':
        return { text: 'Đang check-in', bgColor: 'bg-green-500',color:'bg-green-500' };
      case 'ongoing':
        return { text: 'Đang diễn ra', bgColor: 'bg-blue-500',color:'bg-blue-500' };
      case 'completed':
        return { text: 'Đã kết thúc', bgColor: 'bg-gray-500',color: 'bg-gray-500'};
      case 'canceled':
        return { text: 'Đã hủy', bgColor: 'bg-red-500',color: 'bg-red-500'};
        case 'pending':
        return { text: 'Đang chờ xác nhận', bgColor: 'bg-gray-300',color: 'bg-gray-300'};
      default:
        return { text: 'Trạng thái không xác định', bgColor: 'bg-grey-300',color:'bg-grey-500' };
    }
  };
  
  

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Danh sách sự kiện</h2>
        <button
  className="btn btn-secondary px-3 py-1 rounded-md text-sm font-medium shadow hover:bg-secondary-dark transition-colors"
  onClick={handleToggleView}
>
  {viewType === "grid" ? "Hiển thị dạng bảng" : "Hiển thị dạng lưới"}
</button>
<br />
<br />
        <hr />
        <br />

        <div className="flex gap-4 mb-6">
  <Select
    placeholder="Chọn danh mục"
    className="flex-1 h-10 border rounded-lg  focus:ring focus:ring-blue-300"
    value={searchCategory}
    onChange={(value) => setSearchCategory(value)}
    allowClear
    showSearch
    filterOption={(input, option) =>
      input && option?.label.toLowerCase().includes(input.toLowerCase())
    }
    options={categories.map((category) => ({
      label: category.name,
      value: category.id,
    }))}
    notFoundContent={searchCategory ? "Không tìm thấy danh mục" : null}
    onDropdownVisibleChange={(open) => {
      if (!searchCategory) {
        open = false;
      }
    }}
    dropdownRender={(menu) => (
      <div>
        <div style={{ maxHeight: 100, overflowY: "auto" }}>{menu}</div>
      </div>
    )}
  />
  <Select
    placeholder="Chọn trạng thái"
    className="flex-1 h-10 border rounded-lg  focus:ring focus:ring-blue-300"
    value={searchStatus}
    onChange={(value) => setSearchStatus(value)}
    allowClear
    options={[
      { label: "Đang chuẩn bị", value: "confirmed" },
      { label: "Đang check-in", value: "checkin" },
      { label: "Đang diễn ra", value: "ongoing" },
      { label: "Đã kết thúc", value: "completed" },
      { label: "Đã hủy", value: "canceled" },
      { label: "Đang chờ xác nhận", value: "pending" },
    ]}
  />
  <RangePicker
    className="flex-1 h-10 border rounded-lg px-3 focus:ring focus:ring-blue-300"
    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
    onChange={(dates) =>
      setSearchTimeRange(dates ? [dates[0].toDate(), dates[1].toDate()] : [])
    }
  />
  <Input
    placeholder="Tìm kiếm sự kiện theo tên"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    className="flex-1 h-10 border rounded-lg px-3 focus:ring focus:ring-blue-300"
  />
</div>

        {viewType === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 text-center">
          {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
               className="relative flex flex-col bg-white p-6 rounded-md shadow-lg cursor-pointer border-2 border-gray-50 hover:border-black transition-colors duration-300 w-full max-w-[300px] mx-auto"
              >
                <div
                  className={`absolute top-2 left-2 ${getStatusColor(event.status).color} text-white px-3 py-1 text-sm rounded-br-md z-10`}
                >
                  {getStatusColor(event.status).text}
                </div>
                <div className="icons absolute top-2 right-2 p-2 text-right z-10">
                  <Link to={`/admin/update-event/${event.id}`}>
                    <i className="fas fa-pencil-alt mx-3 text-gray-600"></i>
                  </Link>
                  <i
                    className="fas fa-trash-alt text-red-600 cursor-pointer"
                    onClick={() => onDelete(event.id)}
                  ></i>
                </div>
                <img
                  src={event.thumbnail}
                  className="w-full h-[150px] rounded-lg shadow-lg object-cover mt-4"
                  alt={event.name}
                />
                <h2 className="text-xl font-semibold mb-2 truncate max-w-full">{event.name}</h2>
                <p className="text-gray-600 mb-2">Loại hình: {event.event_type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</p>
                <p className="text-green-500 mb-2">
                  {event.status === 'ongoing'
                    ? `Đang diễn ra từ ${new Date(event.start_time).toLocaleDateString()}`
                    : event.status === 'confirmed' &'checkin'
                    ? `Sẽ diễn ra vào ${new Date(event.start_time).toLocaleDateString()}`
                    : `Sự kiện đã kết thúc vào ${new Date(event.end_time).toLocaleDateString()}`}
                </p>
                {event.event_type === 'online' && (
                  <a
                    href={event.link_online}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mb-2 block"
                  >
                    Tham gia Online
                  </a>
                )}
                <div className="flex-grow"></div>
                <div className="flex justify-center mt-auto">
                  <Link to={`/admin/detail-event/${event.id}`}>
                    <button className="btn btn-info bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">Không có sự kiện nào.</p>
          )}
        </div>
        ) : (
          <div className="">
     <table className="min-w-full table-auto border-collapse">
  <thead>
    <tr className="bg-gray-300 text-gray-700">
      <th className="px-4 py-2 border">#</th>
      <th className="px-4 py-2 border">Tên</th>
      <th className="px-4 py-2 border">Loại hình</th>
      <th className="px-4 py-2 border">Ngày bắt đầu</th>
      <th className="px-4 py-2 border">Ngày kết thúc</th>
      <th className="px-4 py-2 border">Trạng thái</th>
      <th className="px-4 py-2 border">Thao tác</th>
    </tr>
  </thead>
  <tbody>
    {paginatedEvents.map((event, index) => (
      <tr
        key={event.id}
        className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition duration-150"
      >
        {/* Số thứ tự */}
        <td className="px-4 py-2 border">{index + 1}</td>

        {/* Tên sự kiện */}
        <td className="px-4 py-2 border relative group">
          {/* Tên rút gọn */}
          {event.name.length > 40 ? `${event.name.slice(0, 40)}...` : event.name}

          
        </td>

        {/* Loại hình sự kiện */}
        <td className="px-4 py-2 border">{event.event_type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</td>

        {/* Ngày bắt đầu */}
        <td className="px-4 py-2 border">{event.start_time}</td>

        {/* Ngày kết thúc */}
        <td className="px-4 py-2 border">{event.end_time}</td>

        {/* Trạng thái */}
        <td className="px-4 py-2 border">
          <span
            className={`py-1 px-3 rounded text-white ${
              getStatusColor(event.status).color
            }`}
          >
            {getStatusColor(event.status).text}
          </span>
        </td>

        {/* Thao tác */}
        <td className="px-4 py-2 border">
          {/* Xem chi tiết */}
          <Link to={`/admin/event-detail/${event.id}`}>
            <i className="fas fa-eye mx-3 text-blue-600 cursor-pointer"></i>
          </Link>

          {/* Chỉnh sửa */}
          <Link to={`/admin/update-event/${event.id}`}>
            <i className="fas fa-pencil-alt mx-3 text-gray-600"></i>
          </Link>

          {/* Xóa */}
          <i
            className="fas fa-trash-alt text-red-600 cursor-pointer"
            onClick={() => onDelete(event.id)}
          ></i>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
        

        )}
       <Pagination
    current={currentPage}
    pageSize={pageSize}
    total={filteredEvents.length}
    onChange={(page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    }}
    showSizeChanger
    pageSizeOptions={['5', '10', '20']}
    className="mt-4 text-center"
  />
      </div>

      {/* Modal xóa sự kiện */}
      <Modal
        title="Xác nhận xóa"
        open={confirmModalIsOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <p>Bạn có chắc chắn muốn xóa sự kiện này?</p>
      </Modal>
    </div>
  );
};

export default EventList;
