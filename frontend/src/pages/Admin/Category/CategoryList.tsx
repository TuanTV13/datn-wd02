import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message } from "antd";
import axios from "axios";
import axiosInstance from "../../../axios";
import moment from "moment";

const CategoryList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTrashedView, setIsTrashedView] = useState(false); // Trạng thái xem danh mục đã xoá

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });
  const [deleteCategory, setDeleteCategory] = useState({ id: null, name: "" });

  const [reload, setReload] = useState(false);

  useEffect(() => {
    isTrashedView ? fetchTrashedCategories() : fetchCategories();
  }, [reload, isTrashedView]);

  // Fetch danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/categories"
      );
      const formattedData = response.data.data.map((item, index) => ({
        key: index + 1,
        id: item.id,
        name: item.name,
        created_at: item.created_at || "N/A",
        updated_at: item.updated_at || "N/A",
      }));
      setData(formattedData);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh mục đã xoá
  const fetchTrashedCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("categories/list/Trashed");
      const formattedData = response.data.data.map((item, index) => ({
        key: index + 1,
        id: item.id,
        name: item.name,
        deleted_at: item.deleted_at || "N/A",
      }));
      setData(formattedData);
    } catch (error) {
      message.error("Không thể tải danh mục đã xoá.");
    } finally {
      setLoading(false);
    }
  };

  // Thêm danh mục
  const handleAddCategory = async () => {
    if (!newCategory.trim())
      return message.warning("Vui lòng nhập tên danh mục.");
    try {
      await axiosInstance.post(
        "http://localhost:8000/api/v1/categories/create",
        {
          name: newCategory,
        }
      );
      message.success("Thêm danh mục thành công!");
      setReload(!reload);
      setIsAddModalVisible(false);
      setNewCategory("");
    } catch (error) {
      message.error("Không thể thêm danh mục.");
    }
  };

  // Sửa danh mục
  const handleEditCategory = async () => {
    if (!editCategory.name.trim())
      return message.warning("Vui lòng nhập tên danh mục.");
    try {
      await axiosInstance.put(
        `http://localhost:8000/api/v1/categories/${editCategory.id}/update`,
        { name: editCategory.name }
      );
      message.success("Cập nhật danh mục thành công!");
      setReload(!reload);
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Không thể cập nhật danh mục.");
    }
  };

  // Xoá danh mục
  const handleDeleteCategory = async () => {
    try {
      await axiosInstance.delete(
        `http://localhost:8000/api/v1/categories/${deleteCategory.id}/delete`
      );
      message.success("Xoá danh mục thành công!");
      setReload(!reload);
      setIsDeleteModalVisible(false);
    } catch (error) {
      message.error("Không thể xoá danh mục.");
    }
  };

  // Khôi phục danh mục
  const handleRestoreCategory = async (id) => {
    try {
      await axiosInstance.get(
        `http://localhost:8000/api/v1/categories/${id}/restore`
      );
      message.success("Khôi phục danh mục thành công!");
      setReload(!reload);
    } catch (error) {
      message.error("Không thể khôi phục danh mục.");
    }
  };

  const columns = [
    { title: "STT", dataIndex: "key", key: "key", align: "center" },
    // { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    {
      title: isTrashedView ? "Ngày xoá" : "Ngày tạo",
      dataIndex: isTrashedView ? "deleted_at" : "created_at",
      render: (_, record) =>
        isTrashedView
          ? moment(record.deleted_at).format("DD/MM/YYYY HH:mm:ss")
          : moment(record.created_at).format("DD/MM/YYYY HH:mm:ss"),
      key: isTrashedView ? "deleted_at" : "created_at",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) =>
        isTrashedView ? (
          <Button type="link" onClick={() => handleRestoreCategory(record.id)}>
            Khôi phục
          </Button>
        ) : (
          <>
            <Button
              type="link"
              onClick={() =>
                setIsEditModalVisible(true) || setEditCategory(record)
              }
            >
              Sửa
            </Button>
            <Button
              type="link"
              danger
              onClick={() =>
                setIsDeleteModalVisible(true) || setDeleteCategory(record)
              }
            >
              Xóa
            </Button>
          </>
        ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {isTrashedView ? "Danh mục đã xoá" : "Danh sách danh mục"}
        </h2>
        <div>
          {!isTrashedView && (
            <Button
              type="primary"
              onClick={() => setIsAddModalVisible(true)}
              className="mr-2"
            >
              Thêm mới
            </Button>
          )}
          <Button onClick={() => setIsTrashedView(!isTrashedView)}>
            {isTrashedView ? "Danh mục chính" : "Danh mục đã xoá"}
          </Button>
        </div>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm danh mục */}
      <Modal
        title="Thêm danh mục"
        visible={isAddModalVisible}
        onOk={handleAddCategory}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <Input
          placeholder="Tên danh mục"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>

      {/* Modal sửa danh mục */}
      <Modal
        title="Sửa danh mục"
        visible={isEditModalVisible}
        onOk={handleEditCategory}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Input
          placeholder="Tên danh mục"
          value={editCategory.name}
          onChange={(e) =>
            setEditCategory({ ...editCategory, name: e.target.value })
          }
        />
      </Modal>

      {/* Modal xoá danh mục */}
      <Modal
        title="Xác nhận xoá"
        visible={isDeleteModalVisible}
        onOk={handleDeleteCategory}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xoá danh mục "{deleteCategory.name}" không?</p>
      </Modal>
    </div>
  );
};

export default CategoryList;
