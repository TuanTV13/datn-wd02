import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import axios from "axios";
import axiosInstance from "../../../axios";
import { useNavigate } from "react-router-dom";

const ListClient = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal chi tiết người dùng
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); // Modal chỉnh sửa người dùng
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false); // Modal xác nhận xóa
  const [selectedClient, setSelectedClient] = useState(null);
  const [confirmDeleteClientId, setConfirmDeleteClientId] = useState(null);
  const [showDeletedClients, setShowDeletedClients] = useState(false);
  const [editFormData, setEditFormData] = useState(null); // Dữ liệu cho form chỉnh sửa
  const navigate = useNavigate();

  const [clients, setClients] = useState([]); // Dữ liệu người dùng từ API
  const [deletedClients, setDeletedClients] = useState([]);

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/users")
      .then((response) => {
        const { users } = response.data;
        const formattedClients = users.map((client) => ({
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
        "Giới tính": client.gender,
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
    setEditFormData(client); // Gán dữ liệu người dùng vào form
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
    setShowDeletedClients(!showDeletedClients);
  };

  const handleDeleteClient = (clientId) => {
    axiosInstance
      .delete(`/users/${clientId}/delete`, {})
      .then((response) => {
        // Nếu xóa thành công, cập nhật lại danh sách người dùng
        const clientToDelete = clients.find((client) => client.id === clientId);

        setClients(clients.filter((client) => client.id !== clientId));
        setDeletedClients([
          ...deletedClients,
          { ...clientToDelete, status: "Đã xóa" },
        ]);

        closeConfirmModal(); // Đóng modal xác nhận xóa
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        console.error("Lỗi khi xóa người dùng: ", error);
      });
  };

  const handleRestoreClient = (clientId) => {
    const clientToRestore = deletedClients.find(
      (client) => client.id === clientId
    );
    setDeletedClients(
      deletedClients.filter((client) => client.id !== clientId)
    );
    setClients([...clients, { ...clientToRestore, status: "Đang hoạt động" }]);
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

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Danh sách người dùng</h2>
        <div className="p-4 flex justify-between">
          <button
            onClick={toggleDeletedClients}
            className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
          >
            {showDeletedClients ? "Danh sách người dùng" : "người dùng đã xóa"}
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-[10px]"
          >
            Xuất Excel
          </button>
        </div>

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
            {(showDeletedClients ? deletedClients : clients).map(
              (client, index) => (
                <tr key={client.id}>
                  <td className="p-4 border border-gray-300">{index + 1}</td>
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
                      {/* <button
                        className="bg-yellow-500 text-white w-full h-8 rounded-[10px]"
                        onClick={() => openEditModal(client)}
                      >
                        Chỉnh sửa
                      </button> */}
                      <button
                        className="bg-red-500 text-white w-full h-8 rounded-[10px]"
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
              )
            )}
          </tbody>
        </table>
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
            <div>
              <p>
                <strong>Tên:</strong> {selectedClient.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedClient.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedClient.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedClient.address}
              </p>
              <p>
                <strong>Ảnh:</strong> {selectedClient.image}
              </p>
              <p>
                <strong>Ngày xác thực email:</strong>{" "}
                {selectedClient.email_verified_at}
              </p>
              <p>
                <strong>Giới tính:</strong> {selectedClient.gender}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedClient.status}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}

      {/* Modal chỉnh sửa người dùng */}
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
                className="border rounded w-full px-3 py-2 mb-4"
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

      {/* Modal xác nhận xóa người dùng */}
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
