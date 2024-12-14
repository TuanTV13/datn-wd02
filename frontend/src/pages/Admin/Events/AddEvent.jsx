import { useState, useEffect } from "react";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';  // Import CSS của Quill
import ReactQuill from 'react-quill';
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
    speakers: [{ name: '', email: '', phone: '', image_url: '', speaker_image: null }],
  });
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Tạo đối tượng FormData để gửi ảnh lên server
        const formData = new FormData();
        formData.append('file', file);
        console.log(file);
  
        // Gọi API để tải ảnh lên
        const response = await fetch('http://127.0.0.1:8000/api/v1/upload', {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
        console.log('API Response:', result);  // Kiểm tra xem có trả về image_url không
  
        if (result.url) {
          // Cập nhật tất cả các diễn giả trong formData với URL ảnh trả về
          setFormData((prevFormData) => ({
            ...prevFormData,
            speakers: prevFormData.speakers.map((speaker) => ({
              ...speaker,
              image_url: result.url,  // Lưu URL ảnh cho tất cả các diễn giả
              speaker_image: file,    // Lưu thông tin file ảnh cho tất cả các diễn giả
            })),
          }));
        } else {
          console.error("Không thể tải ảnh lên.", result.url);
        }
      } catch (error) {
        console.error('Lỗi khi tải ảnh lên:', error);
      }
    }
  };
  
  

  const handleDeleteImage = () => {
    // Xóa ảnh đã chọn và URL ảnh
    setSpeaker((prevSpeaker) => ({
      ...prevSpeaker,
      image_url: '',
      speaker_image: null,
    }));
  };

  const handleAddSpeaker = () => {
    setFormData(prevData => {
      // Thêm một đối tượng diễn giả mới vào mảng speakers
      const updatedSpeakers = [...prevData.speakers, { name: '', email: '', phone: '', image_url: '', speaker_image: null }];
      return { ...prevData, speakers: updatedSpeakers };
    });
  };

  // Hàm để thay đổi thông tin diễn giả
  const handleSpeakerChange = (index, key, value) => {
    // Cập nhật mảng diễn giả
    const updatedSpeakers = [...formData.speakers];
    updatedSpeakers[index] = { ...updatedSpeakers[index], [key]: value };

    setFormData(prevState => ({
      ...prevState,
      speakers: updatedSpeakers,
    }));
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote'],
      [{ 'align': [] }],
    ],
  };

  const handleChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleRemoveSpeaker = (index) => {
    const updatedSpeakers = formData.speakers.filter((_, i) => i !== index);
    setFormData({ ...formData, speakers: updatedSpeakers });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      thumbnail: file,
      thumbnailUrl: URL.createObjectURL(file),
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketForm, setIsTicketForm] = useState(true);
  const [eventId, setEventId] = useState(undefined);
  useEffect(() => {
    fetchCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => {
        toast.error("Lỗi khi lấy danh mục. Vui lòng thử lại!");
      });

    fetchProvinces()
      .then((response) => setProvinces(response.data.data))
      .catch((error) => {
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

    // Kiểm tra xem formData.speakers có phải là mảng không, nếu không sẽ gán thành mảng trống
    const speakers = Array.isArray(formData.speakers) ? formData.speakers : [];

    // Chuyển mảng speakers thành chuỗi JSON
    const speakersData = JSON.stringify(
      speakers.map(speaker => ({
        name: speaker.name,
        email: speaker.email,
        phone: speaker.phone,
        image_url: speaker.image_url,
      }))
    );

    // Duyệt qua formData và thêm các giá trị vào FormData
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

    // Thêm speakersData dưới dạng JSON vào FormData
    dataToSubmit.append("speakers", speakersData);

    // Gửi yêu cầu API
    addEvent(dataToSubmit)
      .then((res) => {
        console.log("Response from API:", res);
        if (res && res.id) {
          setEventId(res.id);
          toast.success("Thêm sự kiện thành công!");
          setIsModalOpen(true);
        } else {
          console.error("Không có id trong phản hồi từ API");
        }
      })
      .catch((error) => {
        console.error("API Error:", error.response ? error.response : error);
        if (error.errors ) {
          const errors = error.errors;
        
          // Lặp qua từng lỗi trong errors
          Object.values(errors).forEach((messages) => {
            // Nếu lỗi là một mảng, lặp qua từng phần tử của mảng
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                toast.error(msg); // Hiển thị từng thông báo lỗi
              });
            } else {
              // Nếu lỗi không phải là mảng, hiển thị trực tiếp
              toast.error(messages);
            }
          });
        } else {
          toast.error("Có lỗi xảy ra khi thêm sự kiện.");
        }
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-4xl font-bold mb-3 text-left">Thêm sự kiện mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Danh mục và Tỉnh */}
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Tên sự kiện: <span className="text-red-500">*</span>
            </label></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              placeholder="Vui lòng nhập tên sự kiện"

            />
          </div>
        </div>
        {/* Ảnh và Loại sự kiện */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Danh mục: <span className="text-red-500">*</span>
            </label></label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
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
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Loại sự kiện: <span className="text-red-500">*</span>
            </label></label>
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
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Link online sự kiện: <span className="text-red-500">*</span>
            </label></label>
            <input
              placeholder="Nhập url online sự kiện"
              type="url"
              name="link_online"
              value={formData.link_online}
              onChange={(e) => setFormData({ ...formData, link_online: e.target.value })}
              className="form-control"
            />
          </div>
        )}
        {/* Huyện và Xã + Địa điểm */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Tỉnh: <span className="text-red-500">*</span>
            </label></label>
            <select
              value={formData.province_name}
              onChange={(e) => handleProvinceChange(e.target.value)}
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
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Huyện: <span className="text-red-500">*</span>
            </label></label>
            <select
              value={formData.district_name}
              onChange={(e) => handleDistrictChange(e.target.value)}
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
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Xã: <span className="text-red-500">*</span>
            </label></label>
            <select
              value={formData.ward_name}
              onChange={(e) => handleWardChange(e.target.value)}
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
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Đại điểm: <span className="text-red-500">*</span>
            </label></label>
            <input
              placeholder="Nhập địa điểm cụ thể"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Các trường khác */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Thời gian bắt đâu: <span className="text-red-500">*</span>
            </label></label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
              Thời gian kết thúc: <span className="text-red-500">*</span>
            </label></label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
            Ảnh bìa sự kiện: <span className="text-red-500">*</span>
          </label></label>
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
        <div className="form-group" style={{ overflow: 'hidden', height: '700px' }}>
          <label className="form-label text-xl font-semibold mb-2"><label className="form-label text-xl font-semibold mb-2">
            Mô tả dài: <span className="text-red-500">*</span>
          </label></label>
          <div className="relative">
            <ReactQuill
              value={formData.description}
              onChange={handleChange}
              theme="snow"
              modules={modules}
              // className="form-control p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg resize-none"
              placeholder="Nhập mô tả chi tiết về sự kiện..."
              style={{ width: '100%', height: '600px', boxSizing: 'border-box' }}
            />
            <div className="absolute right-2 top-2 text-gray-500 text-xs">
              {formData.description.length}
            </div>
          </div>
        </div>

        {/* Thêm Diễn giả */}
        <div className="container mx-auto p-0">
          <div className="border-1 border-gray-300 rounded-lg p-6">
            <h3 className="text-2xl font-semibold col-span-4 mb-4">Thông tin diễn giả</h3>

            {/* Lặp qua các diễn giả */}
            {formData.speakers.map((speaker, index) => (
              <div key={index} className="grid grid-cols-9 gap-4 mb-4 flex items-center justify-between">
                <div className="form-group col-span-2">
                  <label className="form-label text-l mb-2">
                    Tên diễn giả: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={speaker.name}
                    onChange={(e) => handleSpeakerChange(index, 'name', e.target.value)}
                    className="form-control"
                    placeholder="Nhập tên diễn giả"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label text-l mb-2">
                    Email diễn giả: <span className="text-red-500">*</span>
                  </label>                  <input
                    type="email"
                    value={speaker.email}
                    onChange={(e) => handleSpeakerChange(index, 'email', e.target.value)}
                    className="form-control"
                    placeholder="Nhập email diễn giả"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label text-l mb-2">
                    Số điện thoại diễn giả: <span className="text-red-500">*</span>
                  </label>                  <input
                    type="tel"
                    value={speaker.phone}
                    onChange={(e) => handleSpeakerChange(index, 'phone', e.target.value)}
                    className="form-control"
                    placeholder="Nhập số điện thoại diễn giả"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label text-l mb-2">
                    Ảnh đại diện diễn giả: <span className="text-red-500">*</span>
                  </label>                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="form-control"
                    accept="image/*"
                  />
                  
                </div>
                <div className="form-group col-span-1">
                  {/* Dấu trừ nhỏ (xóa diễn giả) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpeaker(index)}
                    className="text-lg text-red-600 hover:text-red-800 pr-2"
                  >
                    −
                  </button>

                  {/* Dấu cộng nhỏ (thêm diễn giả) */}
                  <button
                    type="button"
                    onClick={handleAddSpeaker}
                    className="text-lg text-blue-600 hover:text-blue-800 mt-4 ml-auto"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

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
        title={
          <div className="flex justify-between items-center">
          <span>Thêm vé hoặc mã giảm giá</span>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-xl font-semibold text-gray-500 hover:text-gray-700"
          >

          </button>
        </div>
        }
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
