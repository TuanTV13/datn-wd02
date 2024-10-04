import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../service/auth-service';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Nhớ import Bootstrap

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

      // Kiểm tra phản hồi từ backend
      if (response.token) {
        setErrorMessage('Đăng nhập thành công!');
        setShowErrorModal(true);
        if (rememberMe) {
          localStorage.setItem('email', data.email);
        } else {
          localStorage.removeItem('email');
        }
      } else {
        // Nếu không có token, hiển thị thông báo lỗi
        setErrorMessage(response.message);
        setShowErrorModal(true);
        console.log(response.message);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      setErrorMessage(error.message || 'Đăng nhập thất bại!');
      setShowErrorModal(true);
      console.log(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(left, #7579ff, #b224ef)' }}>
      <div className="card" style={{ width: '30rem' }}>
        <div className="card-body">
          <h2 className="text-center">Đăng Nhập</h2>
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
              <i 
                className={`uil ${showPassword ? 'uil-eye' : 'uil-eye-slash'} position-absolute`}
                style={{ right: '10px', top: '10px', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
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

          {/* Modal để hiển thị lỗi */}
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
    </div>
  );
};

export default LoginForm;
