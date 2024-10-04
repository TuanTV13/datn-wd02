import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import AddressForm from './addressform'; // Import AddressForm

const RegisterForm = ({ toggleForm }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State để lưu thông tin địa chỉ
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Theo dõi mật khẩu để so sánh với confirm password
  const password = watch('password');

  const onSubmit = async (data) => {
    // Gộp thông tin địa chỉ vào dữ liệu đăng ký
    const registrationData = {
      ...data,
      province_id: selectedProvince,
      district_id: selectedDistrict,
      ward_id: selectedWard,
    };

    try {
      // Gọi API để gửi dữ liệu đăng ký
      const response = await axios.post('http://127.0.0.1:8000/api/register', registrationData);
      if (response.status === 200) {
        alert('Đăng ký thành công!'); // Thông báo đăng ký thành công
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response && error.response.data.errors) {
        alert('Đăng ký thất bại: ' + JSON.stringify(error.response.data.errors)); // Thông báo lỗi chi tiết
      } else {
        alert('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!'); // Thông báo đăng ký thất bại
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Đăng kí</h2>

        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Nhập tên"
            {...register('name', { required: 'Tên là bắt buộc' })}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>

        <div className="mb-3">
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Nhập email"
            {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
          />
          {errors.email && <p className="text-danger">{errors.email.message}</p>}
        </div>

        <div className="mb-3 position-relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Nhập mật khẩu"
            {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } })}
          />
          <i 
            className={`uil ${showPassword ? 'uil-eye' : 'uil-eye-slash'} position-absolute`}
            style={{ right: '10px', top: '10px', cursor: 'pointer' }}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
          {errors.password && <p className="text-danger">{errors.password.message}</p>}
        </div>

        <div className="mb-3 position-relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Nhập lại mật khẩu"
            {...register('confirmPassword', {
              required: 'Bạn cần nhập lại mật khẩu',
              validate: value => value === password || 'Mật khẩu không khớp',
            })}
          />
          <i 
            className={`uil ${showConfirmPassword ? 'uil-eye' : 'uil-eye-slash'} position-absolute`}
            style={{ right: '10px', top: '10px', cursor: 'pointer' }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          ></i>
          {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
        </div>

        {/* Thêm AddressForm vào đây và xử lý thông tin tỉnh, huyện */}
        <AddressForm 
          onProvinceChange={setSelectedProvince} 
          onDistrictChange={setSelectedDistrict} 
          onWardChange={setSelectedWard} // Thêm onWardChange
        />

        <button type="submit" className="btn btn-primary">Đăng ký</button>
      </form>

      <p className="mt-3">
        Đã là thành viên? <button className="btn btn-link" onClick={toggleForm}>Đăng nhập ngay</button>
      </p>
    </div>
  );
};

export default RegisterForm;
