import React from 'react';

const ModalInfo = ({ show, message, type, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className={`bg-white p-5 rounded-md shadow-lg ${type === 'error' ? 'border border-red-500' : 'border border-green-500'}`}>
        <p className="text-center">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 py-1 px-3 rounded-md"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ModalInfo;
