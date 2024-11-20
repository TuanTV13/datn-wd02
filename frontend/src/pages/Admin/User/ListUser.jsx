import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "antd";
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch dữ liệu người dùng
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://192.168.2.112:8000/api/v1/users");
      const allUsers = response.data.users;
  
      const activeUsers = allUsers.filter((user) => user.deleted_at === null);
      const removedUsers = allUsers.filter((user) => user.deleted_at !== null);
  
      setUsers(activeUsers);
      setDeletedUsers(removedUsers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mở modal chi tiết
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Đóng modal chi tiết
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Xóa người dùng
  // Xóa người dùng
const handleDeleteUser = async (id) => {
  try {
    await axios.delete(`http://192.168.2.112:8000/api/v1/users/${id}`);
    fetchUsers();
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
  }
};

// Khôi phục người dùng
const handleRestoreUser = async (id) => {
  try {
    await axios.put(`http://192.168.2.112:8000/api/v1/users/restore/${id}`);
    fetchUsers();
  } catch (error) {
    console.error("Lỗi khi khôi phục người dùng:", error);
  }
};


  // Cột của bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <EyeOutlined
            className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => openModal(record)}
          />
          {showDeletedUsers ? (
            <ReloadOutlined
              className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleRestoreUser(record.id)}
            />
          ) : (
            <DeleteOutlined
              className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleDeleteUser(record.id)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách người dùng</h1>
        <Button
          type="primary"
          onClick={() => setShowDeletedUsers(!showDeletedUsers)}
        >
          {showDeletedUsers ? "Người dùng hoạt động" : "Người dùng đã xóa"}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={showDeletedUsers ? deletedUsers : users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal chi tiết người dùng */}
      <Modal
  title="Chi tiết người dùng"
  open={isModalOpen}
  onCancel={closeModal}
  footer={null}
>
  {selectedUser && (
    <div className="flex flex-col items-center">
      {/* Hiển thị ảnh */}
      {selectedUser.image ? (
        <img
          src={selectedUser.image}
          alt={selectedUser.name}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 mb-4">
          Không có ảnh
        </div>
      )}

      {/* Hiển thị thông tin người dùng */}
      <div className="text-center">
        <p>
          <strong>Tên:</strong> {selectedUser.name}
        </p>
        <p>
          <strong>Email:</strong> {selectedUser.email}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {selectedUser.phone}
        </p>
        <p>
          <strong>Trạng thái tài khoản: </strong> {selectedUser.status}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {selectedUser.address || "Không có thông tin"}
        </p>
      </div>
    </div>
  )}
</Modal>

    </div>
  );
};

export default ListUser;
