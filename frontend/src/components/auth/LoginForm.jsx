import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../service/auth-service';
import { Modal, Button } from 'react-bootstrap'; // Giữ lại Modal từ Bootstrap để hiển thị thông báo lỗi
import './LoginForm.css'; // Nhớ import CSS tùy chỉnh

const LoginForm = ({ toggleForm, showForgotPasswordForm }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Nhập email"
                {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
                defaultValue={localStorage.getItem('email') || ''}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Nhập mật khẩu"
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
              />
              <button 
                type="button" 
                className="position-absolute" 
                style={{ right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`uil ${showPassword ? 'uil-eye' : 'uil-eye-slash'}`}></i>
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
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
        <img src='https://i.pinimg.com/564x/b7/e1/8a/b7e18a28198f0b2cae87db8ba2218018.jpg' alt="Hình ảnh mô tả" style={{ height: '100%', width: 'auto' }} />
      </div>
    </div>
  );
};

export default LoginForm;
