import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Import component chính của bạn
import './index.css'; // Import CSS
import { BrowserRouter } from 'react-router-dom';

// Khởi tạo root chỉ một lần
const container = document.getElementById('root');
const root = createRoot(container);

// Render ứng dụng của bạn
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
