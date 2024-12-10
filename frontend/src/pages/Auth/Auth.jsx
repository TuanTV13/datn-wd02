import React, { useState } from 'react';
import Header from '../../ClientComponent/Header'
import Footer from '../../ClientComponent/Footer'
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import ForgotPassword from '../../components/Auth/ForgotPassword'; // Nhập ForgotPassword

const Auth = () => {
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
        <Header/>
      {renderForm()} {/* Gọi hàm renderForm để hiển thị form hiện tại */}
      <Footer/>
    </div>
  );
};

export default Auth;
