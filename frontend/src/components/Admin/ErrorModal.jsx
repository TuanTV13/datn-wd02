import React from 'react';

const ModalInfo = ({ show, onClose, children }) => {
  if (!show) return null;
console.log(children);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
        <p>{children}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
      </div>
    </div>
  );
};

export default ModalInfo;
