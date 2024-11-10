import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const ticketType = searchParams.get('ticketType');
  const quantity = searchParams.get('quantity');
  const totalPrice = searchParams.get('totalPrice');

  useEffect(() => {
    // Tải SDK PayPal
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD";
    script.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (totalPrice / 23000).toFixed(2), // Chuyển đổi sang USD, giả định 1 USD = 23,000 VND
              },
              description: `Vé ${ticketType} x ${quantity}`,
            }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Thanh toán thành công!');
            window.location.href = '/success'; // Chuyển hướng sau khi thanh toán
          });
        },
        onError: (err) => {
          console.error(err);
          alert('Thanh toán thất bại. Vui lòng thử lại.');
        }
      }).render('#paypal-button-container');
    });
    document.body.appendChild(script);
  }, [ticketType, quantity, totalPrice]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Xác nhận thanh toán</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Thông tin đơn hàng</h2>
        <p className="mb-2"><strong>Loại vé:</strong> {ticketType}</p>
        <p className="mb-2"><strong>Số lượng:</strong> {quantity}</p>
        <p className="mb-4"><strong>Tổng giá:</strong> {totalPrice.toLocaleString()} VND</p>

        <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
        <div id="paypal-button-container" className="flex justify-center mt-4"></div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Bằng cách nhấp vào nút "Thanh toán", bạn đồng ý với các điều khoản và điều kiện của chúng tôi.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
