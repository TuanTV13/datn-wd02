import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Card,
  notification,
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axiosInstance from "../../../axios";

const RatingList = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(5);
  const [searchText, setSearchText] = useState(""); 
  const [feedbackList, setFeedbackList] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 

  
  useEffect(() => {
    axiosInstance
      .get("http://localhost:8000/api/v1/feedbacks")
      .then((res) => {
        setFeedbackList(res.data.data); 
        setFilteredData(res.data.data); 
      })
      .catch((error) => {
        notification.error({
          message: "Lỗi khi lấy dữ liệu phản hồi",
          description: "Không thể lấy dữ liệu phản hồi từ API.",
        });
      });
  }, []);

  
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
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

  
  const handleSearch = () => {
    if (searchText) {
      const filtered = feedbackList.filter(
        (feedback) =>
          feedback.event_id.toString().includes(searchText) || 
          feedback.feedback.toLowerCase().includes(searchText.toLowerCase()) 
      );
      setFilteredData(filtered); 
    } else {
      setFilteredData(feedbackList); 
    }
  };

  
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
              {}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-[10px]"
                onClick={handleExportExcel} 
              >
                <ExportOutlined /> Xuất Excel
              </button>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card style={{ padding: 10 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo mã sự kiện hoặc phản hồi"
              style={{ width: "100%", borderRadius: "8px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} 
              onPressEnter={handleSearch} 
            />
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
          {filteredData.length > 0 ? (
            <Table
              dataSource={filteredData} 
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
          ) : (
            <Empty />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RatingList;
