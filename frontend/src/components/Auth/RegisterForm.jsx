import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Auth.css';

const RegisterForm = ({ toggleForm }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [showNameError, setShowNameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false);

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...restData } = data; // Loại bỏ confirmPassword
      const response = await axios.post('http://127.0.0.1:8000/api/v1/register', restData);
      if (response.status === 200) {
        alert('Đăng ký thành công!');
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const backendErrors = Object.values(error.response.data.errors).flat();
        setErrorMessages(backendErrors);
      } else {
        setErrorMessages(['Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!']);
      }
      setCurrentErrorIndex(0);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex(currentErrorIndex + 1);
    } else {
      setShowModal(false);
      setErrorMessages([]);
    }
  };

  return (
    <div className="auth-container mt-36">
      <div className="auth-action-left">
        <div className="auth-form-outer">
          <h2 className="auth-form-title">Đăng Ký</h2>
          <br />
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Input Tên */}
            <div className="mb-3 input-container">
              <input
                id="name"
                type="text"
                placeholder="Nhập tên"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Tên là bắt buộc' })}
                onMouseEnter={() => errors.name && setShowNameError(true)}
                onMouseLeave={() => errors.name && setShowNameError(false)}
              />
              {errors.name && showNameError && (
                <div className="input-error">{errors.name.message}</div>
              )}
            </div>

            {/* Input Email */}
            <div className="mb-3 input-container">
              <input
                id="email"
                type="text"
                placeholder="Nhập email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
                onMouseEnter={() => errors.email && setShowEmailError(true)}
                onMouseLeave={() => errors.email && setShowEmailError(false)}
              />
              {errors.email && showEmailError && (
                <div className="input-error">{errors.email.message}</div>
              )}
            </div>

            {/* Input Số Điện Thoại */}
            <div className="mb-3 input-container">
              <input
                id="phone"
                type="text"
                placeholder="Nhập số điện thoại"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                {...register('phone', {
                  required: 'Số điện thoại là bắt buộc',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Số điện thoại không thể dài hơn 10 số',
                  },
                })}
              />
              {errors.phone && <div className="input-error">{errors.phone.message}</div>}
            </div>

            {/* Input Mật Khẩu */}
            <div className="mb-3 position-relative input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                onMouseEnter={() => errors.password && setShowPasswordError(true)}
                onMouseLeave={() => errors.password && setShowPasswordError(false)}
              />
              {!errors.password && (
                <i
                  className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', top: '50%', right: '10px', cursor: 'pointer', transform: 'translateY(-50%)' }}
                />
              )}
              {errors.password && showPasswordError && (
                <div className="input-error">{errors.password.message}</div>
              )}
            </div>

            {/* Input Xác Nhận Mật Khẩu */}
            <div className="mb-3 position-relative input-container">
              <input
                id="password_confirmation" // Sửa ở đây
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`} // Sửa ở đây
                {...register('password_confirmation', { // Sửa ở đây
                  required: 'Cần nhập lại mật khẩu',
                  validate: value => {
                    return value === password || 'Mật khẩu xác nhận không khớp';
                  },
                })}
                onMouseEnter={() => errors.password_confirmation && setShowConfirmPasswordError(true)} // Sửa ở đây
                onMouseLeave={() => errors.password_confirmation && setShowConfirmPasswordError(false)} // Sửa ở đây
              />
              {!errors.password_confirmation && ( // Sửa ở đây
                <i
                  className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', top: '50%', right: '10px', cursor: 'pointer', transform: 'translateY(-50%)' }}
                />
              )}
              {errors.password_confirmation && showConfirmPasswordError && ( // Sửa ở đây
                <div className="input-error">{errors.password_confirmation.message}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
          </form>

          <p className="mt-3">
            Đã là thành viên? <button className="btn btn-link" onClick={toggleForm}>Đăng nhập ngay</button>
          </p>
        </div>
      </div>

      <div className="auth-action-right">
        <h2 className="welcome-text">Chào mừng đến với Eventify</h2>
        <img src='../../public/images/logo.webp' alt="Logo" className="auth-logo" />
      </div>

      {/* Modal thông báo lỗi */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessages[currentErrorIndex]}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterForm;
