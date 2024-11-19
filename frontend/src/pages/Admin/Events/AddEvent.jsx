import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addEvent, fetchCategories } from '../../../api_service/event';
import { fetchProvinces, fetchDistricts, fetchWards } from '../../../api_service/location';
const AddEvent = () => {
  const [formData, setFormData] = useState({
    category_id: '',
    province_id: '',
    district_id: '',
    ward_id: '',
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    event_type: '',
    thumbnail: 'hhhh',
  });

  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [formDataProvince, setFormDataProvince] = useState({ province_id: "", district_id: "" });
  const [districts, setDistricts] = useState([]); // Danh sách huyện
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Kiểm tra nếu dữ liệu trả về từ API là mảng
    fetchCategories()  // Giả sử fetchCategories là hàm gọi API
    .then((response) => {
      // Kiểm tra nếu dữ liệu trả về có trường 'data' và là mảng
      if (response && response.data && Array.isArray(response.data)) {
        setCategories(response.data);  // Gán mảng danh mục vào state
      } else {
        console.error('Dữ liệu trả về không chứa trường "data" hoặc không phải mảng');
        setCategories([]);  // Gán mảng rỗng nếu không đúng cấu trúc
      }
    })
    .catch((error) => {
      console.error('Có lỗi khi gọi API:', error);
      setCategories([]);  // Đảm bảo mảng rỗng khi có lỗi
    });

    fetchProvinces()
    .then((data) => {
      console.log(data); // Log toàn bộ dữ liệu trả về
      if (Array.isArray(data.data.data)) {
        setProvinces(data.data.data); // Lưu danh sách tỉnh vào state
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching provinces:", error);
    });
  

  }, []);
  const handleProvinceChange = (provinceCode) => {
    setFormDataProvince({ ...formDataProvince, province_id: provinceCode, district_id: "" }); // Cập nhật mã tỉnh và reset huyện
    fetchDistricts(provinceCode)
      .then((data) => {
        if (Array.isArray(data.data.data)) {
          setDistricts(data.data.data); // Lưu danh sách huyện vào state
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", data);
        }
      })
      .catch((error) => console.error(error));
  };
  
  const handleDistrictChange = (districtCode) => {
    setFormDataProvince({ ...formDataProvince, district_id: districtCode }); // Cập nhật mã huyện
    fetchWards(districtCode)
      .then((data) => {
        if (Array.isArray(data)) {
          setWards(data); // Lưu danh sách xã vào state
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);  // Kiểm tra giá trị của formData trước khi gửi
    
    const dataToSubmit = new FormData();
  
    // Kiểm tra và xử lý trường ảnh
    if (formData.thumbnail) {
      dataToSubmit.append("thumbnail", formData.thumbnail);  // Gửi file ảnh (nếu có)
    }
    
    // Gửi các trường còn lại
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "thumbnail" && value !== "") {
        dataToSubmit.append(key, value);
      }
    });
    
    // Kiểm tra dữ liệu trước khi gửi
    if (dataToSubmit.has("category_id") && dataToSubmit.has("description") && 
      dataToSubmit.has("district_id") && dataToSubmit.has("start_time") && 
      dataToSubmit.has("end_time") && dataToSubmit.has("thumbnail")) {
        
      addEvent(dataToSubmit);  // Gọi API thêm sự kiện
    } else {
      console.error("Dữ liệu gửi lên chưa đầy đủ");
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
       {/* Danh mục */}
       <div>
        <label htmlFor="category_id">Danh mục sự kiện:</label>
        <select
  id="category_id"
  value={formData.category_id}
  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
  required
>
  <option value="">Chọn danh mục</option>
  {categories.length > 0 ? (
    categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))
  ) : (
    <option disabled>Không có danh mục</option>
  )}
</select>
      </div>

      {/* Tỉnh */}
      <div>
        <label htmlFor="province_id">Tỉnh:</label>
        <select
        id="province_id"
        value={formDataProvince.province_id}
        onChange={(e) => handleProvinceChange(e.target.value)}
        required
      >
        <option value="">Chọn tỉnh</option>
        {provinces.map((province) => (
          <option key={province._id} value={province.code}> 
            {province.name} {/* Hiển thị tên tỉnh */}
          </option>
        ))}
      </select>

      {/* Hiển thị mã tỉnh được chọn */}
      
      </div>

      {/* Quận/Huyện */}
      <div>
        <label htmlFor="district_id">Quận/Huyện:</label>
        <select
          id="district_id"
          value={formData.district_id}
          onChange={(e) => handleDistrictChange(e.target.value)}
          required
        >
          <option value="">Chọn quận/huyện</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Phường/Xã */}
      <div>
        <label htmlFor="ward_id">Phường/Xã:</label>
        <select
          id="ward_id"
          value={formData.ward_id}
          onChange={(e) => setFormData({ ...formData, ward_id: e.target.value })}
          required
        >
          <option value="">Chọn phường/xã</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tên sự kiện */}
      <div>
        <label htmlFor="name">Tên sự kiện:</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      {/* Mô tả sự kiện */}
      <div>
        <label htmlFor="description">Mô tả sự kiện:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      {/* Thời gian bắt đầu */}
      <div>
        <label htmlFor="start_time">Thời gian bắt đầu:</label>
        <input
          type="datetime-local"
          id="start_time"
          value={formData.start_time}
          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          required
        />
      </div>

      {/* Thời gian kết thúc */}
      <div>
        <label htmlFor="end_time">Thời gian kết thúc:</label>
        <input
          type="datetime-local"
          id="end_time"
          value={formData.end_time}
          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          required
        />
      </div>

      {/* Địa điểm */}
      <div>
        <label htmlFor="location">Địa điểm:</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      {/* Loại sự kiện */}
      <div>
        <label htmlFor="event_type">Loại sự kiện:</label>
        <select
          id="event_type"
          value={formData.event_type}
          onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
          required
        >
          <option value="">Chọn loại sự kiện</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Ảnh đại diện */}
      <div>
  <label htmlFor="thumbnail">Ảnh đại diện:</label>
  <input
    type="file"
    id="thumbnail"
    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
    required
  />
</div>


      <button type="submit">Thêm sự kiện</button>
    </form>
  );
};

export default AddEvent;