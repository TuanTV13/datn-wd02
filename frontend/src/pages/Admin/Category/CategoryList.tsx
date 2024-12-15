import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message } from "antd";
import axios from "axios";
import axiosInstance from "../../../axios";

const CategoryList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });
  const [deleteCategory, setDeleteCategory] = useState({ id: null, name: "" });

  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [reload]);

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
      console.error("Failed to fetch categories:", error);
      message.error("Không thể tải danh sách danh mục.");
    } finally {
      setLoading(false);
    }
  };

  // Modal thêm danh mục
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
      console.error("Failed to add category:", error);
      message.error("Không thể thêm danh mục.");
    }
  };

  // Modal sửa danh mục
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
      setEditCategory({ id: null, name: "" });
    } catch (error) {
      console.error("Failed to update category:", error);
      message.error("Không thể cập nhật danh mục.");
    }
  };

  // Modal xoá danh mục
  const handleDeleteCategory = async () => {
    try {
      await axiosInstance.delete(
        `http://localhost:8000/api/v1/categories/${deleteCategory.id}/delete`
      );
      message.success("Xoá danh mục thành công!");
      setReload(!reload);
      setIsDeleteModalVisible(false);
      setDeleteCategory({ id: null, name: "" });
    } catch (error) {
      console.error("Failed to delete category:", error);
      message.error("Không thể xoá danh mục.");
    }
  };

  const columns = [
    { title: "STT", dataIndex: "key", key: "key", align: "center" },
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex space-x-2 justify-center">
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
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Danh sách danh mục</h2>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm mới
        </Button>
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
