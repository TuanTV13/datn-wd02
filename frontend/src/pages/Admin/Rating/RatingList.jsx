import React, { useEffect, useState } from "react";
import { Table, Button, Input, Row, Col, Card, notification } from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilePdfOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axiosInstance from "../../../axios";

const RatingList = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(5);
  const [searchText, setSearchText] = useState(""); // Lưu giá trị tìm kiếm
  const [feedbackList, setFeedbackList] = useState([]); // Dữ liệu phản hồi
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc

  // Gọi API để lấy dữ liệu phản hồi
  useEffect(() => {
    axiosInstance
      .get("http://localhost:8000/api/v1/feedbacks")
      .then((res) => {
        setFeedbackList(res.data.data); // Lưu dữ liệu phản hồi vào state
        setFilteredData(res.data.data); // Lưu dữ liệu đã lọc
      })
      .catch((error) => {
        notification.error({
          message: "Lỗi khi lấy dữ liệu phản hồi",
          description: "Không thể lấy dữ liệu phản hồi từ API.",
        });
      });
  }, []);

  // Cột của bảng
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
        <Button
          type="link"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={() => handleDelete(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  // Hàm xóa phản hồi
  const handleDelete = (record) => {
    axiosInstance
      .delete(`/feedbacks/${record.id}/delete`)
      .then(() => {
        notification.success({
          message: "Xoá phản hồi thành công",
          description: `Phản hồi với ID "${record.id}" đã được xoá.`,
        });
        setFeedbackList(feedbackList.filter((item) => item.id !== record.id));
        setFilteredData(filteredData.filter((item) => item.id !== record.id));
      })
      .catch((error) => {
        notification.error({
          message: "Xoá thất bại",
          description: "Đã xảy ra lỗi khi xoá phản hồi.",
        });
      });
  };

  // Hàm tìm kiếm dữ liệu
  const handleSearch = () => {
    if (searchText) {
      const filtered = feedbackList.filter(
        (feedback) =>
          feedback.event_id.toString().includes(searchText) || // Tìm theo mã sự kiện
          feedback.feedback.toLowerCase().includes(searchText.toLowerCase()) // Tìm theo phản hồi
      );
      setFilteredData(filtered); // Cập nhật dữ liệu đã lọc
    } else {
      setFilteredData(feedbackList); // Nếu không có tìm kiếm, hiển thị tất cả dữ liệu
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedbacks");

    XLSX.writeFile(wb, "Feedbacks_List.xlsx");
  };

  return (
    <div className="feedback-list">
      <Row gutter={16}>
        <Col span={24}>
          <div className="header">
            <h2 className="title">Danh sách phản hồi</h2>
            <div className="action-buttons">
              <Button
                type="default"
                size="large"
                onClick={() => navigate("/admin/add-rating")} // Điều hướng tới trang thêm mới
                style={{ marginRight: 10 }}
              >
                Thêm mới
              </Button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-[10px]"
                onClick={handleExportExcel} // Xuất Excel
              >
                Xuất Excel
              </button>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card style={{ padding: 10 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo mã sự kiện hoặc phản hồi"
              style={{ width: "100%", borderRadius: "8px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // Cập nhật giá trị tìm kiếm
              onPressEnter={handleSearch} // Tìm kiếm khi nhấn Enter
            />
          </Card>
        </Col>

        <Col span={12}>
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
              onClick={handleSearch} // Tìm kiếm khi nhấn nút
            >
              Tìm kiếm
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Table
            dataSource={filteredData} // Hiển thị dữ liệu đã lọc
            columns={columns}
            pagination={{ pageSize: filterValue }}
            className="custom-table"
            locale={{
              emptyText: (
                <div className="empty-state">
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
