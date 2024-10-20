import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../api_service/auth';
import { Modal, Button } from 'react-bootstrap';
import './Auth.css';

const LoginForm = ({ toggleForm, showForgotPasswordForm }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleClose = () => setShowErrorModal(false);

  const onSubmit = async (data) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await login(data.email, data.password);
      if (response.token) {
        setErrorMessage('Đăng nhập thành công!');
        setShowErrorModal(true);
        if (rememberMe) {
          localStorage.setItem('email', data.email);
        } else {
          localStorage.removeItem('email');
        }
      } else {
        setErrorMessage(response.message);
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Đăng nhập thất bại!');
      setShowErrorModal(true);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-action-left">
        <div className="auth-form-outer">
          <h2 className="auth-form-title">Đăng Nhập</h2>
          <br />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 input-container">
              <input
                id="email"
                type="text"
                placeholder='Email'
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
                defaultValue={localStorage.getItem('email') || ''}
                onMouseEnter={() => errors.email && setShowEmailError(true)}
                onMouseLeave={() => errors.email && setShowEmailError(false)}
              />
              {errors.email && showEmailError && (
                <div className="input-error">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-3 position-relative input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder='Mật khẩu'
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

            <div className="form-check mb-3 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                style={{ display: 'none' }} // Ẩn checkbox mặc định
              />
              <i
                className={`far ${rememberMe ? 'fa-check-square' : 'fa-square'}`}
                onClick={() => setRememberMe(!rememberMe)}
                style={{ cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }}
              />
              <label className="form-check-label" htmlFor="rememberMe">Lưu thông tin đăng nhập</label>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="forgot-pass mt-3 text-center" onClick={showForgotPasswordForm}>
            Quên mật khẩu?
          </p>

          <p className="text-center">
            Chưa có tài khoản? <button className="btn btn-link" onClick={toggleForm}>Đăng ký ngay</button>
          </p>

          <Modal show={showErrorModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <div className="auth-action-right">
  <h2 className="welcome-text">Chào mừng đến với Eventify</h2>
  <img src='../../public/images/logo.webp' alt="Logo" className="auth-logo" />
</div>

    </div>
  );
};

export default LoginForm;
