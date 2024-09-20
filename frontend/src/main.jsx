import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Import component chính của bạn
import './index.css'; // Import CSS

// Khởi tạo root chỉ một lần
const container = document.getElementById('root');
const root = createRoot(container);

// Render ứng dụng của bạn
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
<<<<<<< HEAD
);
=======
);
>>>>>>> 0693cc158bfa58c071c8eb8df5b9cf21c9c319de
