import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword'; // Nhập ForgotPassword

const AuthContainer = () => {
  const [currentForm, setCurrentForm] = useState('login'); // Thay đổi trạng thái cho form hiện tại

  const toggleForm = () => {
    setCurrentForm((prev) => (prev === 'login' ? 'register' : 'login')); // Chuyển đổi giữa đăng nhập và đăng ký
  };

  const showForgotPasswordForm = () => {
    setCurrentForm('forgot-password'); // Hiển thị form quên mật khẩu
  };

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return (
          <LoginForm 
            toggleForm={toggleForm} 
            showForgotPasswordForm={showForgotPasswordForm} 
          />
        );
      case 'register':
        return <RegisterForm toggleForm={toggleForm} />;
      case 'forgot-password':
        return <ForgotPassword toggleForm={toggleForm} />; // Truyền toggleForm cho ForgotPassword
      default:
        return null;
    }
  };

  return (
    <div>
      {renderForm()} {/* Gọi hàm renderForm để hiển thị form hiện tại */}
    </div>
  );
};

export default AuthContainer;
