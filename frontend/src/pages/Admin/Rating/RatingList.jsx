import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Row,
  Col,
  Card,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axiosInstance from "../../../axios";

const { Option } = Select;

const RatingList = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reload, setReload] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]); // Dữ liệu phản hồi

  // Gọi API để lấy dữ liệu phản hồi
  useEffect(() => {
    axiosInstance
      .get("http://localhost:8000/api/v1/feedbacks")
      .then((res) => {
        setFeedbackList(res.data.data); // Lưu dữ liệu phản hồi vào state
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        notification.error({
          message: "Lỗi khi lấy dữ liệu phản hồi",
          description: "Không thể lấy dữ liệu phản hồi từ API.",
        });
      });
  }, [reload]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã sự kiện",
      dataIndex: "event_id",
      key: "event_id",
    },
    {
      title: "Mã người dùng",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Phản hồi",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Gợi ý",
      dataIndex: "suggestions",
      key: "suggestions",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue="Chọn thao tác"
          style={{ width: 120 }}
          onChange={(value) => handleAction(value, record)}
        >
          <Option value="edit">
            <EditOutlined /> Sửa
          </Option>
          <Option value="delete">
            <DeleteOutlined style={{ color: "red" }} /> Xóa
          </Option>
        </Select>
      ),
    },
  ];

  const handleAddNew = () => {
    navigate("/admin/add-rating");
  };

  const handleAction = (action, key) => {
    switch (action) {
      case "edit":
        handleEdit(key);
        break;
      case "delete":
        handleDelete(key);
        break;
      default:
        break;
    }
  };

  const handleExportPDFAndExcel = () => {
    console.log("Xuất PDF và Excel");

    const ws = XLSX.utils.json_to_sheet(feedbackList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedbacks");

    XLSX.writeFile(wb, "Feedbacks_List.xlsx");
  };

  const handleEdit = (key) => {
    console.log("Sửa phản hồi có ID: ", key.id);
  };

  const handleDelete = (key) => {
    axiosInstance
      .delete(`/feedbacks/${key.id}/delete`)
      .then((res) => {
        notification.success({
          message: "Xoá phản hồi thành công",
          description: `Phản hồi với ID "${key.id}" đã được xoá.`,
        });
        setReload(!reload); // Tải lại dữ liệu
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        notification.error({
          message: "Xoá thất bại",
          description: "Đã xảy ra lỗi khi xoá phản hồi.",
        });
      });
  };

  const handleSearch = () => {
    console.log("Search text: ", searchText);
    console.log("Status: ", statusFilter);
  };

  return (
    <div className="feedback-list">
      <Row gutter={16}>
        <Col span={24}>
          <div className="header">
            <h2 className="title">Danh sách phản hồi</h2>
            <div className="action-buttons">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                size="large"
                style={{ marginRight: 10 }}
                onClick={handleExportPDFAndExcel}
              >
                Xuất PDF
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handleAddNew}
                style={{ marginRight: 10 }}
              >
                Thêm mới
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card style={{ padding: 10 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm phản hồi"
              style={{ width: "100%", borderRadius: "8px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ padding: 10 }}>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="Trạng thái"
              style={{ width: "100%", borderRadius: "8px" }}
            >
              <Option value="">Trạng Thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="expired">Hết hạn</Option>
            </Select>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ padding: 10 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              style={{
                width: "100%",
                borderRadius: "8px",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Table
            dataSource={feedbackList}
            columns={columns}
            pagination={{ pageSize: filterValue }}
            className="custom-table"
            locale={{
              emptyText: (
                <div className="empty-state">
                  <img src="/path/to/empty-icon.png" alt="No data" />
                  <p>Không có dữ liệu hiển thị</p>
                </div>
              ),
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RatingList;
