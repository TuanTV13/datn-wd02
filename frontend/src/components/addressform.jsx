import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/get-provinces");
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

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
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

<<<<<<< HEAD
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
=======
      {selectedProvince && (
        <div>
          <label htmlFor="district">Chọn huyện:</label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedProvince}
          >
            <option value="">-- Chọn huyện --</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}
>>>>>>> 0693cc158bfa58c071c8eb8df5b9cf21c9c319de

      <button type="submit" disabled={!selectedProvince || !selectedDistrict}>
        Submit
      </button>
    </form>
  );
};

export default AddressForm;
