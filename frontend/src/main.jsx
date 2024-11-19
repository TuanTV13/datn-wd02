import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Import component chính của bạn
import './index.css'; // Import CSS
import { BrowserRouter } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import TicketsContext from './Contexts/TicketContext.tsx';
import HomeContexts from './Contexts/HomeContext.tsx';
import EventContexts from './Contexts/ClientEventContext.tsx';
import CategoryContexts from './Contexts/CategoryContext.tsx';
// import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// Khởi tạo root chỉ một lần
const container = document.getElementById('root');
const root = createRoot(container);

// Render ứng dụng của bạn
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <HomeContexts>
      <TicketsContext>
        <EventContexts>
          <CategoryContexts>
            {/* <PayPalScriptProvider> */}
            <App />
            {/* </PayPalScriptProvider> */}
          </CategoryContexts>
        </EventContexts>
      </TicketsContext>
      </HomeContexts>
    </BrowserRouter>
  </React.StrictMode>
);
