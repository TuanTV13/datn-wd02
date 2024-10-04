import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressForm = ({ onProvinceChange, onDistrictChange, onWardChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

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
    setSelectedWard(""); // Reset danh sách xã khi chọn tỉnh mới
    onProvinceChange(provinceId); // Gọi hàm từ props

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-districts/${provinceId}`);
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard(""); // Reset danh sách xã khi chọn huyện
    onDistrictChange(districtId); // Gọi hàm từ props

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-wards/${districtId}`);
      setWards(response.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    setSelectedWard(wardId);
    onWardChange(wardId); // Gọi hàm từ props
  };

  return (
    <div className="mb-3">
      <div className="form-group">
       
        <select
          id="province"
          className="form-control"
          value={selectedProvince}
          onChange={handleProvinceChange}
        >
          <option value="">-- Chọn tỉnh --</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProvince && (
        <div className="form-group">
         
          <select
            id="district"
            className="form-control"
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

      {selectedDistrict && (
        <div className="form-group">
          
          <select
            id="ward"
            className="form-control"
            value={selectedWard}
            onChange={handleWardChange}
            disabled={!selectedDistrict}
          >
            <option value="">-- Chọn xã --</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
