import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const sendCode = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/send-code', {
        email: data.email,
      });

      if (response.status === 200) {
        alert('Mã đã được gửi tới email!');
        setIsCodeSent(true);
        setEmail(data.email);
      } else {
        alert('Lỗi trong quá trình gửi email.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới server.');
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password', {
        email: email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        verification_code: data.verification_code,
      });

      if (response.status === 200) {
        alert('Mật khẩu đã được cập nhật thành công!');
      } else {
        alert('Lỗi trong quá trình đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới server.');
    }
  };

  return (
    <div>
      {!isCodeSent ? (
        <form onSubmit={handleSubmit(sendCode)} className="mb-3">
          <h1 className="mb-4">Gửi Mã Xác Thực</h1>
          
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Nhập email"
              {...register('email', { required: 'Email là bắt buộc', pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p className="text-danger">{errors.email.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary">Gửi Mã</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(resetPassword)} className="mb-3">
          <h1 className="mb-4">Đặt Lại Mật Khẩu</h1>

          <div className="mb-3">
            <input
              type="text"
              className={`form-control ${errors.verification_code ? 'is-invalid' : ''}`}
              placeholder="Nhập mã xác thực"
              {...register('verification_code', { required: 'Mã xác thực là bắt buộc' })}
            />
            {errors.verification_code && <p className="text-danger">{errors.verification_code.message}</p>}
          </div>

          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Nhập mật khẩu mới"
              {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' } })}
            />
            {errors.password && <p className="text-danger">{errors.password.message}</p>}
          </div>

          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
              placeholder="Xác nhận mật khẩu"
              {...register('password_confirmation', { required: 'Xác nhận mật khẩu là bắt buộc' })}
            />
            {errors.password_confirmation && <p className="text-danger">{errors.password_confirmation.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary">Đặt Lại Mật Khẩu</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
