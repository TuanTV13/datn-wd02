import React, { useState } from "react";

const AddClient = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    province_id: "",
    district_id: "",
    ward_id: "",
    image: "",
    email_verification_token: "",
    email_verified_at: "",
    gender: "Nam", // Mặc định là Nam
    status: "Đang hoạt động", // Mặc định là Đang hoạt động
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API để thêm khách hàng mới
    console.log("Thêm khách hàng:", formData);
    // Reset form sau khi thêm thành công
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      province_id: "",
      district_id: "",
      ward_id: "",
      image: "",
      email_verification_token: "",
      email_verified_at: "",
      gender: "Nam",
      status: "Đang hoạt động",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-auto shadow">
      <h2 className="text-2xl font-bold mb-4">Thêm khách hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tỉnh/Thành</label>
          <input
            type="text"
            name="province_id"
            value={formData.province_id}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quận/Huyện</label>
          <input
            type="text"
            name="district_id"
            value={formData.district_id}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phường/Xã</label>
          <input
            type="text"
            name="ward_id"
            value={formData.ward_id}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ảnh</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700">Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Ngưng hoạt động">Ngưng hoạt động</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm khách hàng
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
