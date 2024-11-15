import React, { useState } from "react";
import { Table, Button, Input, Select, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./hehe.css";
import {
  SearchOutlined,
  FilePdfOutlined,
  EyeOutlined,
  FileExcelOutlined,
  EditOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const DiscountCodeList = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên voucher cho sự kiện",
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: "Giá trị của voucher",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Số lượng mã voucher",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue="Chọn thao tác"
          style={{ width: 120 }}
          onChange={(value) => handleAction(value, record.key)}
        >
          <Option value="view">
            <EyeOutlined /> Xem
          </Option>
          <Option value="export">
            <FileExcelOutlined /> Xuất excel
          </Option>
          <Option value="edit">
            <EditOutlined /> Sửa
          </Option>
          <Option value="lock">
            <LockOutlined /> Khóa
          </Option>
          <Option value="delete">
            <DeleteOutlined style={{ color: "red" }} /> Xóa
          </Option>
        </Select>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      stt: 1,
      code: "DISCOUNT50",
      eventName: "Giảm giá 50%",
      value: "50% off",
      quantity: 100,
      status: "Hoạt động",
      expiryDate: "2024-12-31",
    },
    {
      key: "2",
      stt: 2,
      code: "WELCOME10",
      eventName: "Chào mừng",
      value: "10% off",
      quantity: 50,
      status: "Hết hạn",
      expiryDate: "2023-10-01",
    },
    {
      key: "3",
      stt: 3,
      code: "SUMMER20",
      eventName: "Mùa hè",
      value: "20% off",
      quantity: 75,
      status: "Hoạt động",
      expiryDate: "2024-08-30",
    },
  ];

  const handleAddNew = () => {
    navigate("/admin/discount-code");
  };

  const handleAction = (action, key) => {
    switch (action) {
      case "view":
        handleView(key);
        break;
      case "export":
        handleExportExcel(key);
        break;
      case "edit":
        handleEdit(key);
        break;
      case "lock":
        handleLock(key);
        break;
      case "delete":
        handleDelete(key);
        break;
      default:
        break;
    }
  };

  const handleView = (key) => {
    console.log("Xem mã giảm giá có key: ", key);
  };

  const handleExportExcel = (key) => {
    console.log("Xuất excel mã giảm giá có key: ", key);
  };

  const handleEdit = (key) => {
    console.log("Sửa mã giảm giá có key: ", key);
  };

  const handleLock = (key) => {
    console.log("Khóa mã giảm giá có key: ", key);
  };

  const handleDelete = (key) => {
    console.log("Xóa mã giảm giá có key: ", key);
  };

  const handleSearch = () => {
    console.log("Search text: ", searchText);
    console.log("Status: ", statusFilter);
  };

  return (
    <div className="code-list">
      <Row gutter={16}>
        <Col span={24}>
          <div className="header">
            <h2 className="title">Danh sách mã giảm giá</h2>
            <div className="action-buttons">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                size="large"
                style={{ marginRight: 10 }}
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
              placeholder="Tìm kiếm mã giảm giá"
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
            dataSource={dataSource}
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

export default DiscountCodeList;
