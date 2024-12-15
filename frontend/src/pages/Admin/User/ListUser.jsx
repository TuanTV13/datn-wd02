import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import axios from "axios";
import axiosInstance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import { Empty, notification } from "antd";

const ListClient = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [confirmDeleteClientId, setConfirmDeleteClientId] = useState(null);
  const [showDeletedClients, setShowDeletedClients] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [deletedClients, setDeletedClients] = useState([]);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/users")
      .then((response) => {
        const { users } = response.data;
        const formattedClients = users.reverse().map((client) => ({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address || "Chưa có",
          province_id: 1,
          district_id: 1,
          ward_id: 1,
          image: client.image || "link_image_default.jpg",
          email_verified_at: client.email_verified_at,
          gender: "Chưa xác định",
          status: client.deleted_at ? "Đã xóa" : "Đang hoạt động",
        }));
        setClients(formattedClients);
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");
        console.error("Lỗi khi lấy dữ liệu từ API: ", error);
      });
  }, []);

  const exportToExcel = () => {
    const dataToExport = (showDeletedClients ? deletedClients : clients).map(
      (client) => ({
        ID: client.id,
        Tên: client.name,
        Email: client.email,
        "Số điện thoại": client.phone,
        "Địa chỉ": client.address,
        "Tỉnh/Thành": client.province_id,
        "Quận/Huyện": client.district_id,
        "Phường/Xã": client.ward_id,
        "Ngày xác thực email": client.email_verified_at,
        // "Giới tính": client.gender,
        "Trạng thái": client.status,
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "DanhSachKhachHang.xlsx");
  };

  const openModal = (client) => {
    setSelectedClient(client);
    setModalIsOpen(true);
  };

  const openEditModal = (client) => {
    setEditFormData(client);
    setEditModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClient(null);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEditFormData(null);
  };

  const toggleDeletedClients = () => {
    axiosInstance
      .get("http://localhost:8000/api/v1/users/trashed")
      .then((res) => {
        setDeletedClients(res.data.data);
        if (res.data.data.length <= 0 && !showDeletedClients) {
          notification.error({ message: "Không có người dùng nào được xóa" });
          return;
        }
        setCurrentPage(1);
        setShowDeletedClients(!showDeletedClients);
      });
  };

  const handleDeleteClient = (clientId) => {
    axiosInstance
      .delete(`/users/${clientId}/delete`, {})
      .then((response) => {
        const clientToDelete = clients.find((client) => client.id === clientId);

        setClients(clients.filter((client) => client.id !== clientId));
        notification.success({ message: "Đã xoá người dùng thành công" });
        setDeletedClients([
          ...deletedClients,
          { ...clientToDelete, status: "Đã xóa" },
        ]);
        closeConfirmModal();
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");
        console.error("Lỗi khi xóa người dùng: ", error);
      });
  };

  const handleRestoreClient = (clientId) => {
    axiosInstance
      .post(`http://localhost:8000/api/v1/users/${clientId}/restore`)
      .then(() => {
        const clientToRestore = deletedClients.find(
          (client) => client.id === clientId
        );
        setDeletedClients(
          deletedClients.filter((client) => client.id !== clientId)
        );
        setClients([
          ...clients,
          { ...clientToRestore, status: "Đang hoạt động" },
        ]);
      });
  };

  const openConfirmModal = (clientId) => {
    setConfirmDeleteClientId(clientId);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmDeleteClientId(null);
    setConfirmModalIsOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveEdit = () => {
    setClients(
      clients.map((client) =>
        client.id === editFormData.id ? editFormData : client
      )
    );
    closeEditModal();
  };

  // Tính toán số lượng trang
  const totalItems = showDeletedClients
    ? deletedClients.length
    : clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Lấy danh sách người dùng cho trang hiện tại
  const currentItems = (showDeletedClients ? deletedClients : clients).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Danh sách người dùng</h2>
        <div className="p-4 flex justify-between">
          <div className="flex space-x-4">
            <Link
              to="/admin/add-user"
              className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            >
              Thêm mới
            </Link>
            <button
              onClick={toggleDeletedClients}
              className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            >
              {showDeletedClients
                ? "Danh sách người dùng"
                : "Người dùng đã xóa"}
            </button>
          </div>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-[10px]"
          >
            <ExportOutlined /> Xuất Excel
          </button>
        </div>

        {clients.length > 0 ? (
          <table className="min-w-full table-auto border border-gray-700">
            <thead className="bg-gray-100 text-left items-center text-center">
              <tr>
                <th className="p-4 border border-gray-300">STT</th>
                <th className="p-4 border border-gray-300">Tên</th>
                <th className="p-4 border border-gray-300">Email</th>
                <th className="p-4 border border-gray-300">Số điện thoại</th>
                <th className="p-4 border border-gray-300">Địa chỉ</th>
                <th className="p-4 border border-gray-300">Trạng thái</th>
                <th className="p-4 border border-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {currentItems.map((client, index) => (
                <tr key={client.id}>
                  <td className="p-4 border border-gray-300">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-4 border border-gray-300">{client.name}</td>
                  <td className="p-4 border border-gray-300">{client.email}</td>
                  <td className="p-4 border border-gray-300">{client.phone}</td>
                  <td className="p-4 border border-gray-300">
                    {client.address}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {client.status}
                  </td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex flex-col items-center space-y-1">
                      <button
                        className="bg-red-500 text-white w-full h-8 rounded [10px]"
                        onClick={() => openConfirmModal(client.id)}
                      >
                        Xóa
                      </button>
                      {showDeletedClients && (
                        <button
                          className="bg-green-500 text-white w-full h-8 rounded-[10px]"
                          onClick={() => handleRestoreClient(client.id)}
                        >
                          Khôi phục
                        </button>
                      )}
                      <button
                        className="bg-blue-500 text-white w-full h-8 rounded-[10px]"
                        onClick={() => openModal(client)}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty />
        )}

        {/* Phân trang */}
        <div className="flex justify-between p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Sau
          </button>
        </div>
      </div>

      {selectedClient && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 w-1/2 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Chi tiết người dùng</h2>
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border border-gray-300">Thông tin</th>
                  <th className="p-4 border border-gray-300">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Tên:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.name}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Email:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.email}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Số điện thoại:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.phone}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Địa chỉ:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.address}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Ảnh:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.image}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Ngày xác thực email:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.email_verified_at}
                  </td>
                </tr>

                <tr>
                  <td className="p-4 border border-gray-300">
                    <strong>Trạng thái:</strong>
                  </td>
                  <td className="p-4 border border-gray-300">
                    {selectedClient.status}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}

      {editModalIsOpen && (
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 w-1/2 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa người dùng</h2>
            <form>
              <label className="block text-gray-700">Tên</label>
              <input
                type="text"
                name="name"
                value={editFormData?.name || ""}
                onChange={handleEditChange}
                className="border rounded w-full px-3 py-2 mb-4"
              />
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editFormData?.email || ""}
                onChange={handleEditChange}
                className="border rounded w-full px-3 py-2 mb-4"
              />
              <label className="block text-gray-700">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={editFormData?.phone || ""}
                onChange={handleEditChange}
                className="border rounded w-full px- 3 py-2 mb-4"
              />
              <label className="block text-gray-700">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={editFormData?.address || ""}
                onChange={handleEditChange}
                className="border rounded w-full px-3 py-2 mb-4"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                Lưu
              </button>
            </form>
          </div>
        </Modal>
      )}

      {confirmDeleteClientId && (
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
              <button
                onClick={() => handleDeleteClient(confirmDeleteClientId)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListClient;
