import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Thêm trạng thái cho quên mật khẩu

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowForgotPassword(false); // Reset quên mật khẩu khi chuyển đổi
  };

  const showForgotPasswordForm = () => {
    setShowForgotPassword(true); // Hiển thị form quên mật khẩu
  };

  return (
    <div>
      {isLogin ? (
        <LoginForm 
          toggleForm={toggleForm} 
          showForgotPasswordForm={showForgotPasswordForm} 
        />
      ) : (
        <RegisterForm toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthContainer;
