
import React, { useState, useEffect } from "react";
const AddressForm = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selected_province, setSelectedProvince] = useState("");
    const [selected_district, setSelectedDistrict] = useState("");
  // Dữ liệu các tỉnh và huyện (nên lấy từ server hoặc API thực tế)
  useEffect(() => {
    const fetch_provinces = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/register");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetch_provinces();
  }, []);

  // Gọi API để lấy danh sách huyện khi tỉnh được chọn
  const handle_province_change = async (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict(""); // Reset huyện khi chọn tỉnh mới

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-districts/${provinceId}`);
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handle_district_change = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handle_submit = (e) => {
    e.preventDefault();
    alert(`Tỉnh: ${selected_province}, Huyện: ${selected_district}`);
  };

  return (
    <form onSubmit={handle_submit}>
      <div>
        <label htmlFor="province">Chọn tỉnh:</label>
        <select id="province" value={selected_province} onChange={handle_province_change}>
          <option value="">-- Chọn tỉnh --</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {selected_province && (
        <div>
          <label htmlFor="district">Chọn huyện:</label>
          <select
            id="district"
            value={selected_district}
            onChange={handle_district_change}
            disabled={!selected_province}
          >
            <option value="">-- Chọn huyện --</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" disabled={!selected_province || !selected_district}>
        Submit
      </button>
    </form>
  );
};

export default AddressForm;
