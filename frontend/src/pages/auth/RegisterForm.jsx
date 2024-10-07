import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './LoginForm.css';

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
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register', data);
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
    <div className="auth-container">
      <div className="auth-action-left">
        <div className="auth-form-outer">
          <h2 className="auth-form-title">Đăng Ký</h2>
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
              {/* Chỉ hiển thị icon khi không có lỗi validate */}
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
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                {...register('confirmPassword', {
                  required: 'Cần nhập lại mật khẩu',
                  validate: value => {
                    return value === password || 'Mật khẩu không khớp';
                  },
                })}
                onMouseEnter={() => errors.confirmPassword && setShowConfirmPasswordError(true)}
                onMouseLeave={() => errors.confirmPassword && setShowConfirmPasswordError(false)}
              />
              {/* Chỉ hiển thị icon khi không có lỗi validate */}
              {!errors.confirmPassword && (
                <i
                  className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', top: '50%', right: '10px', cursor: 'pointer', transform: 'translateY(-50%)' }}
                />
              )}
              {errors.confirmPassword && showConfirmPasswordError && (
                <div className="input-error">{errors.confirmPassword.message}</div>
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
        <img src='https://i.pinimg.com/564x/b7/e1/8a/b7e18a28198f0b2cae87db8ba2218018.jpg' alt="Hình ảnh mô tả" style={{ height: '100%', width: 'auto' }} />
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
