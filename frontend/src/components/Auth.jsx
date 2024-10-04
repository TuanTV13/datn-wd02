import React, { useState } from 'react';
import Login from './LoginForm';
import Signup from './RegisterForm';
import ForgotPassword from './ForgotPassword';

const Auth = () => {
  const [activeForm, setActiveForm] = useState('login'); // Quản lý trạng thái form hiện tại

  const toggleForm = () => {
    setActiveForm(activeForm === 'login' ? 'signup' : 'login');
  };

  const showForgotPasswordForm = () => {
    setActiveForm('forgotPassword');
  };

  return (
    <div className={`container ${activeForm === 'signup' ? 'active' : ''}`}>
      <div className="forms">
        <div className={`form ${activeForm === 'signup' ? 'signup' : activeForm === 'forgotPassword' ? 'forgotPassword' : 'login'}`}>
          {activeForm === 'login' && <Login toggleForm={toggleForm} showForgotPasswordForm={showForgotPasswordForm} />}
          {activeForm === 'signup' && <Signup toggleForm={toggleForm} />}
          {activeForm === 'forgotPassword' && <ForgotPassword />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
