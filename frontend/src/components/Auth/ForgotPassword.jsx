import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Auth.css';
import { Modal, Button } from 'react-bootstrap';

const ForgotPassword = ({ toggleForm }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [showEmailError, setShowEmailError] = React.useState(false);
  const [showVerificationCodeError, setShowVerificationCodeError] = React.useState(false);
  const [showPasswordError, setShowPasswordError] = React.useState(false);

  const sendCode = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/password/sendOTP', {
        email: data.email,
      });

      if (response.status === 200) {
        setModalMessage('Mã đã được gửi tới email!');
        setIsCodeSent(true);
        setEmail(data.email);
      } else {
        setModalMessage('Lỗi trong quá trình gửi email.');
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage(error.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới server.');
    } finally {
      setShowModal(true);
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/password/reset', {
        email: email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        verification_code: data.verification_code,
      });

      if (response.status === 200) {
        setModalMessage('Mật khẩu đã được cập nhật thành công!');
      } else {
        setModalMessage('Lỗi trong quá trình đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage(error.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới server.');
    } finally {
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    toggleForm();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onMouseEnter = (field) => {
    if (errors[field]) {
      if (field === 'email') setShowEmailError(true);
      if (field === 'verification_code') setShowVerificationCodeError(true);
      if (field === 'password_confirmation') setShowPasswordError(true);
    }
  };

  const onMouseLeave = (field) => {
    if (errors[field]) {
      if (field === 'email') setShowEmailError(false);
      if (field === 'verification_code') setShowVerificationCodeError(false);
      if (field === 'password_confirmation') setShowPasswordError(false);
    }
  };

  return (
   
      <div className="auth-container">
        <div className="auth-action-left">
          <div className="auth-form-outer">
            {!isCodeSent ? (
              <form onSubmit={handleSubmit(sendCode)}>
                <h2 className="auth-form-title">Gửi Mã Xác Thực</h2>
                <br />

                <div className="mb-3 input-container">
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Nhập email"
                    {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+$/, message: 'Email không hợp lệ' } })}
                    onMouseEnter={() => onMouseEnter('email')}
                    onMouseLeave={() => onMouseLeave('email')}
                  />
                  {errors.email && showEmailError && (
                    <div className="input-error">{errors.email.message}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">Gửi Mã</button>
                <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCancel}>Hủy</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(resetPassword)}>
                <h2 className="auth-form-title">Đặt Lại Mật Khẩu</h2>

                <div className="mb-3 input-container">
                  <input
                    type="text"
                    className={`form-control ${errors.verification_code ? 'is-invalid' : ''}`}
                    placeholder="Nhập mã xác thực"
                    {...register('verification_code', { required: 'Mã xác thực là bắt buộc' })}
                    onMouseEnter={() => onMouseEnter('verification_code')}
                    onMouseLeave={() => onMouseLeave('verification_code')}
                  />
                  {errors.verification_code && showVerificationCodeError && (
                    <div className="input-error">{errors.verification_code.message}</div>
                  )}
                </div>

                <div className="mb-3 input-container">
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Nhập mật khẩu mới"
                    {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' } })}
                  />
                  {errors.password && (
                    <div className="input-error">{errors.password.message}</div>
                  )}
                </div>

                <div className="mb-3 input-container">
                  <input
                    type="password"
                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                    placeholder="Xác nhận mật khẩu"
                    {...register('password_confirmation', { 
                      required: 'Xác nhận mật khẩu là bắt buộc', 
                      validate: value => value === watch('password') || 'Mật khẩu không khớp' 
                    })}
                    onMouseEnter={() => onMouseEnter('password_confirmation')}
                    onMouseLeave={() => onMouseLeave('password_confirmation')}
                  />
                  {errors.password_confirmation && showPasswordError && (
                    <div className="input-error">{errors.password_confirmation.message}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">Đặt Lại Mật Khẩu</button>
                <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCancel}>Hủy</button>
              </form>
            )}
          </div>
        </div>
        <div className="auth-action-right">
  <h2 className="welcome-text">Chào mừng đến với Eventify</h2>
  <img src='../../public/images/logo.webp' alt="Logo" className="auth-logo" />
</div>


        {/* Modal */}
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thông Báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
   
  );
};

export default ForgotPassword;
