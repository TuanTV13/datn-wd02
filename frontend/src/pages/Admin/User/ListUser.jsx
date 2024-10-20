import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const ListUser = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);

  // Danh sách người dùng mẫu
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      status: 'Đang hoạt động',
      address: 'Hà Nội',
      birthday: '01/01/1990',
      gender: 'Nam',
      createdAt: '01/01/2023',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      status: 'Ngưng hoạt động',
      address: 'Đà Nẵng',
      birthday: '02/02/1992',
      gender: 'Nữ',
      createdAt: '05/05/2023',
    },
  ]);

  const [deletedUsers, setDeletedUsers] = useState([]);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const toggleDeletedUsers = () => {
    setShowDeletedUsers(!showDeletedUsers);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(user => user.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    setDeletedUsers([...deletedUsers, { ...userToDelete, status: 'Đã xóa' }]);
    closeConfirmModal();
  };

  const handleRestoreUser = (userId) => {
    const userToRestore = deletedUsers.find(user => user.id === userId);
    setDeletedUsers(deletedUsers.filter(user => user.id !== userId));
    setUsers([...users, { ...userToRestore, status: 'Đang hoạt động' }]);
  };

  const openConfirmModal = (userId) => {
    setConfirmDeleteUserId(userId);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmDeleteUserId(null);
    setConfirmModalIsOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow"> 
        <h2 className="text-2xl font-bold text-center">Danh sách người dùng</h2>
        <div className="p-4 flex justify-between">
          <button onClick={toggleDeletedUsers} className="bg-blue-500 text-white px-4 py-2 rounded-[10px]">
            {showDeletedUsers ? 'Danh sách người dùng' : 'Người dùng đã xóa'}
          </button>
          <div className="flex space-x-4 items-center">
            <span>Hiển thị:</span>
            <select className="border rounded px-2 py-1">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <button className="bg-gray-200 px-4 py-2 rounded-[10px]">Bộ lọc</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-[10px]">Xuất PDF</button>
          </div>
        </div>

        <table className="min-w-full table-auto border border-gray-700">
          <thead className="bg-gray-100 text-left items-center text-center">
            <tr>
              <th className="p-4 border border-gray-300">STT</th>
              <th className="p-4 border border-gray-300">Tên</th>
              <th className="p-4 border border-gray-300">Email</th>
              <th className="p-4 border border-gray-300">Số điện thoại</th>
              <th className="p-4 border border-gray-300">Trạng thái</th>
              <th className="p-4 border border-gray-300">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {(showDeletedUsers ? deletedUsers : users).map((user, index) => (
              <tr key={user.id}>
                <td className="p-4 border border-gray-300">{index + 1}</td>
                <td className="p-4 border border-gray-300">{user.name}</td>
                <td className="p-4 border border-gray-300">{user.email}</td>
                <td className="p-4 border border-gray-300">{user.phone}</td>
                <td className="p-4 border border-gray-300">{user.status}</td>
                <td className="p-4 border border-gray-300">
                  <div className="flex flex-col items-center space-y-1">
                    <button 
                      className="bg-red-500 text-white w-full h-8 rounded-[10px]"
                      onClick={() => openConfirmModal(user.id)}
                    >
                      Xóa
                    </button>
                    {showDeletedUsers && (
                      <button 
                        className="bg-green-500 text-white w-full h-8 rounded-[10px]"
                        onClick={() => handleRestoreUser(user.id)}
                      >
                        Khôi phục
                      </button>
                    )}
                    <button 
                      className="bg-yellow-500 text-white w-full h-8 rounded-[10px]"
                      onClick={() => openModal(user)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết người dùng */}
      {selectedUser && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 w-1/2 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Chi tiết người dùng</h2>
            <div>
              <p><strong>Tên:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
              <p><strong>Ngày sinh:</strong> {selectedUser.birthday}</p>
              <p><strong>Giới tính:</strong> {selectedUser.gender}</p>
              <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
              <p><strong>Ngày tạo:</strong> {selectedUser.createdAt}</p>
            </div>
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Đóng
            </button>
          </div>
        </Modal>
      )}

      {/* Modal xác nhận xóa người dùng */}
      {confirmDeleteUserId && (
        <Modal
          isOpen={confirmModalIsOpen}
          onRequestClose={closeConfirmModal}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 w-1/3 mx-auto">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            <div className="mt-4 flex justify-between">
              <button onClick={() => handleDeleteUser(confirmDeleteUserId)} className="bg-red-500 text-white px-4 py-2 rounded">
                Xóa
              </button>
              <button onClick={closeConfirmModal} className="bg-gray-300 px-4 py-2 rounded">
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListUser;
