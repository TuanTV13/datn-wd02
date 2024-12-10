import React, { useState } from "react";
import { Table, Button, Select, Row, Col, Modal, Empty } from "antd";
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

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
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789",
      status: "Đang hoạt động",
      address: "Hà Nội",
      birthday: "01/01/1990",
      gender: "Nam",
      createdAt: "01/01/2023",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987654321",
      status: "Ngưng hoạt động",
      address: "Đà Nẵng",
      birthday: "02/02/1992",
      gender: "Nữ",
      createdAt: "05/05/2023",
    },
  ]);

  const [deletedUsers, setDeletedUsers] = useState([]);

  const toggleDeletedUsers = () => {
    setShowDeletedUsers(!showDeletedUsers);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find((user) => user.id === userId);
    setUsers(users.filter((user) => user.id !== userId));
    setDeletedUsers([...deletedUsers, { ...userToDelete, status: "Đã xóa" }]);
    closeConfirmModal();
  };

  const handleRestoreUser = (userId) => {
    const userToRestore = deletedUsers.find((user) => user.id === userId);
    setDeletedUsers(deletedUsers.filter((user) => user.id !== userId));
    setUsers([...users, { ...userToRestore, status: "Đang hoạt động" }]);
  };

  const openConfirmModal = (userId) => {
    setConfirmDeleteUserId(userId);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmDeleteUserId(null);
    setConfirmModalIsOpen(false);
  };

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
        <div className="flex space-x-2">
          <Button
            icon={<EyeOutlined />}
            onClick={() => openModal(record)}
            className="bg-blue-500 text-white"
          >
            Xem
          </Button>
          {showDeletedUsers ? (
            <Button
              icon={<ReloadOutlined />}
              onClick={() => handleRestoreUser(record.id)}
              className="bg-green-500 text-white"
            >
              Khôi phục
            </Button>
          ) : (
            <Button
              icon={<DeleteOutlined />}
              onClick={() => openConfirmModal(record.id)}
              className="bg-red-500 text-white"
            >
              Xóa
            </Button>
          )}
        </div>
      ),
    },
  ];

  const dataSource = (showDeletedUsers ? deletedUsers : users).map((user) => ({
    key: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
  }));

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <Row className="mb-4" justify="space-between">
          <Col>
            <Button
              onClick={toggleDeletedUsers}
              className="bg-blue-500 text-white"
            >
              {showDeletedUsers ? "Danh sách người dùng" : "Người dùng đã xóa"}
            </Button>
          </Col>
          <Col>
            <Select
              defaultValue="5"
              style={{ width: 120 }}
              onChange={(value) => setFilterValue(value)}
            >
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="20">20</Option>
            </Select>
          </Col>
        </Row>
        {dataSource.length > 0 ? (
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ defaultPageSize: 5 }}
            rowKey="key"
          />
        ) : (
          <Empty />
        )}
      </div>

      {/* Modal chi tiết người dùng */}
      {selectedUser && (
        <Modal
          title="Chi tiết người dùng"
          visible={modalIsOpen}
          onCancel={() => setModalIsOpen(false)}
          footer={null}
        >
          <div>
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
              <strong>Địa chỉ:</strong> {selectedUser.address}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {selectedUser.birthday}
            </p>
            <p>
              <strong>Giới tính:</strong> {selectedUser.gender}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {selectedUser.createdAt}
            </p>
          </div>
          <Button
            onClick={() => setModalIsOpen(false)}
            className="bg-red-500 text-white"
          >
            Đóng
          </Button>
        </Modal>
      )}

      {/* Modal xác nhận xóa người dùng */}
      {confirmDeleteUserId && (
        <Modal
          title="Xác nhận xóa"
          visible={confirmModalIsOpen}
          onCancel={closeConfirmModal}
          footer={[
            <Button key="cancel" onClick={closeConfirmModal}>
              Hủy
            </Button>,
            <Button
              key="delete"
              onClick={() => handleDeleteUser(confirmDeleteUserId)}
              className="bg-red-500 text-white"
            >
              Xóa
            </Button>,
          ]}
        >
          <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
        </Modal>
      )}
    </div>
  );
};

export default ListUser;
