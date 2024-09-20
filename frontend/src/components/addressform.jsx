import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Gọi API để lấy danh sách các tỉnh khi component được render
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/get-province");
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // Gọi API để lấy danh sách huyện khi tỉnh được chọn
  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict(""); // Reset danh sách huyện khi chọn tỉnh mới

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-districts/${provinceId}`);
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Tỉnh: ${selectedProvince}, Huyện: ${selectedDistrict}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="province">Chọn tỉnh:</label>
        <select id="province" value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">-- Chọn tỉnh --</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="district">Chọn huyện:</label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince} // Không cho chọn huyện nếu chưa chọn tỉnh
        >
          <option value="">-- Chọn huyện --</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={!selectedProvince || !selectedDistrict}>
        Submit
      </button>
    </form>
  );
};

export default AddressForm;
