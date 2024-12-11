import { useState, useEffect } from "react";
import { addEvent, fetchCategories } from "../../../api_service/event";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../api_service/location";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";
import axiosInstance from "../../../axios";
import AddDiscountCode from "../Voucher/AddDiscountCode";
import AddTicket from "../Tickets/AddTicket";

const { Option } = Select;

const AddEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category_id: "",
    province_name: "",
    district_name: "",
    ward_name: "",
    name: "",
    link_online: "abc",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    event_type: "",
    thumbnail: null,
  });

  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketForm, setIsTicketForm] = useState(true);
  const [eventId, setEventId] = useState(undefined);
  useEffect(() => {
    fetchCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Lỗi khi lấy danh mục. Vui lòng thử lại!");
      });

    fetchProvinces()
      .then((response) => setProvinces(response.data.data))
      .catch((error) => {
        console.error("Lỗi khi lấy tỉnh:", error);
        toast.error("Lỗi khi lấy tỉnh. Vui lòng thử lại!");
      });
  }, []);

  const handleProvinceChange = (provinceName) => {
    const province = provinces.find((p) => p.name === provinceName);
    setFormData({
      ...formData,
      province_name: provinceName,
      province_id: province.code,
      district_name: "",
      ward_name: "",
    });
    fetchDistricts(province.code)
      .then((response) => setDistricts(response.data.data))
      .catch((error) => {
        console.error("Lỗi khi lấy huyện:", error);
        toast.error("Lỗi khi lấy huyện. Vui lòng thử lại!");
      });
  };

  const handleDistrictChange = (districtName) => {
    const district = districts.find((d) => d.name === districtName);
    setFormData({
      ...formData,
      district_name: districtName,
      district_id: district.code,
      ward_name: "",
    });
    fetchWards(district.code)
      .then((response) => setWards(response.data.data))
      .catch((error) => {
        console.error("Lỗi khi lấy xã:", error);
        toast.error("Lỗi khi lấy xã. Vui lòng thử lại!");
      });
  };

  const handleWardChange = (wardName) => {
    const ward = wards.find((w) => w.name === wardName);
    setFormData({ ...formData, ward_name: wardName, ward_id: ward.code });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "province_name") {
        const province = provinces.find((p) => p.name === value);
        dataToSubmit.append("province", province ? province.name : "");
      } else if (key === "district_name") {
        const district = districts.find((d) => d.name === value);
        dataToSubmit.append("district", district ? district.name : "");
      } else if (key === "ward_name") {
        const ward = wards.find((w) => w.name === value);
        dataToSubmit.append("ward", ward ? ward.name : "");
      } else {
        dataToSubmit.append(key, value || "");
      }
    });

    addEvent(dataToSubmit)
      .then((res) => {
        setEventId(res.id);
        toast.success("Thêm sự kiện thành công!");
        setIsModalOpen(true); // Mở modal sau khi lưu sự kiện thành công
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((message) => {
            toast.error(message);
          });
        } else {
          console.error("Lỗi khi thêm sự kiện:", error);
          toast.error(error.message);
        }
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Thêm sự kiện mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Danh mục và Tỉnh */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Tên sự kiện:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tỉnh:</label>
            <select
              value={formData.province_name}
              onChange={(e) => handleProvinceChange(e.target.value)}
              required
              className="form-control"
            >
              <option value="">Chọn tỉnh</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Huyện và Xã */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Danh mục:</label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              required
              className="form-control"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Huyện:</label>
            <select
              value={formData.district_name}
              onChange={(e) => handleDistrictChange(e.target.value)}
              required
              className="form-control"
            >
              <option value="">Chọn huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tên sự kiện và Mô tả */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Thời gian bắt đầu:</label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Xã:</label>
            <select
              value={formData.ward_name}
              onChange={(e) => handleWardChange(e.target.value)}
              required
              className="form-control"
            >
              <option value="">Chọn xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thời gian bắt đầu và Thời gian kết thúc */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Thời gian kết thúc:</label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Địa điểm:</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              className="form-control"
            />
          </div>
        </div>

        {/* Địa điểm và Loại sự kiện */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Ảnh sự kiện:</label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.files[0] })
              }
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Loại sự kiện:</label>
            <select
              value={formData.event_type}
              onChange={(e) =>
                setFormData({ ...formData, event_type: e.target.value })
              }
              required
              className="form-control"
            >
              <option value="">Chọn loại sự kiện</option>
              <option value="online">Trực tuyến</option>
              <option value="offline">Trực tiếp</option>
            </select>
          </div>
        </div>

        {/* Ảnh sự kiện */}

        <div className="form-group">
          <label className="form-label">Mô tả:</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            className="form-control"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            Lưu sự kiện
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/event-list")}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
          >
            Quay lại danh sách
          </button>
        </div>
      </form>
      <ToastContainer />

      <Modal
        title="Thêm vé hoặc voucher"
        width={1000}
        visible={isModalOpen}
        // onCancel={() => {
        //   setIsModalOpen(false);
        //   navigate("/admin/detail-event/" + eventId);
        // }}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(false);
              navigate("/admin/detail-event/" + eventId);
            }}
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="flex justify-center gap-3">
          {" "}
          <Button
            key="ticket"
            onClick={() => {
              setIsTicketForm(true);
            }}
          >
            Thêm vé
          </Button>
          <Button
            key="voucher"
            onClick={() => {
              setIsTicketForm(false);
            }}
          >
            Thêm voucher
          </Button>
        </div>
        {isTicketForm ? (
          <AddTicket eventId={eventId} />
        ) : (
          <AddDiscountCode eventId={eventId} />
        )}
      </Modal>
    </div>
  );
};

export default AddEvent;
