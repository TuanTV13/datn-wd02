import { useState, useEffect } from "react";
import { addEvent, fetchCategories } from "../../../api_service/event";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "../../../api_service/location";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Select } from "antd";
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
    link_online: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    event_type: "",
    thumbnail: null,
    thumbnailUrl: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      thumbnail: file,
      thumbnailUrl: URL.createObjectURL(file), // Tạo URL tạm thời để hiển thị ảnh
    });
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      thumbnail: null,
      thumbnailUrl: '',
    });
  };


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
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Tên sự kiện:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-control"
              placeholder="Vui lòng nhập tên sự kiện"

            />
          </div>
        </div>
        {/* Ảnh và Loại sự kiện */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Danh mục:</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
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
            <label className="form-label text-xl font-semibold mb-2">Loại sự kiện:</label>
            <select
              value={formData.event_type}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  event_type: value,
                  link_online: value === "online" ? formData.link_online : "",
                });
              }}
              required
              className="form-control"
            >
              <option value="">Chọn loại sự kiện</option>
              <option value="online">Trực tuyến</option>
              <option value="offline">Trực tiếp</option>
            </select>
          </div>
        </div>
        {/* Link sự kiện cho loại trực tuyến */}
        {formData.event_type === "online" && (
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Link sự kiện:</label>
            <input
              placeholder="Nhập url online sự kiện"
              type="url"
              name="link_online"
              value={formData.link_online}
              onChange={(e) => setFormData({ ...formData, link_online: e.target.value })}
              className="form-control"
              required
            />
          </div>
        )}
        {/* Huyện và Xã + Địa điểm */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Tỉnh:</label>
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

          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Huyện:</label>
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

        {/* Xã và Địa điểm */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Xã:</label>
            <select
              value={formData.ward_name}
              onChange={(e) => handleWardChange(e.target.value)}
              required
              className="form-control"
            >
              <option value="">Chọn xã</option>
              {wards?.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Địa điểm:</label>
            <input
              placeholder="Nhập địa điểm cụ thể"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="form-control"
            />
          </div>
        </div>

        {/* Các trường khác */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Thời gian bắt đầu:</label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2">Thời gian kết thúc:</label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label text-xl font-semibold mb-2">Ảnh sự kiện:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control"
            accept="image/*"
          />

          {/* Hiển thị ảnh và đường dẫn nếu ảnh được chọn */}
          {formData.thumbnail && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={formData.thumbnailUrl}
                alt="Thumbnail Preview"
                className="w-48 h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-sm text-gray-500">{formData.thumbnail.name}</p>
              <p className="text-sm text-gray-500">{formData.thumbnailUrl}</p>

              {/* Nút xóa */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Xóa ảnh
              </button>
            </div>
          )}
        </div>



        {/* Mô tả sự kiện */}
        <div className="form-group">
          <label className="form-label text-xl font-semibold mb-2">Mô tả:</label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="5" // Số dòng hiển thị ban đầu của textarea
              className="form-control p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg resize-none"
              placeholder="Nhập mô tả chi tiết về sự kiện..."
            />
            <div className="absolute right-2 top-2 text-gray-500 text-xs">{formData.description.length}/1000</div>
          </div>
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
