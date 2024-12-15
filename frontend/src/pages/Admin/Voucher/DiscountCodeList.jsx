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
  Empty,
} from "antd";
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
  ExportOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axiosInstance from "../../../axios";

const { Option } = Select;

const DiscountCodeList = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reload, setReload] = useState(false);
  const [listVoucher, setListVoucher] = useState([]);
  useEffect(() => {
    axiosInstance.get("/vouchers").then((res) => {
      setListVoucher(res.data.data);
    });
  }, [reload]);
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
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
      dataIndex: "discount_value",
      key: "discount_value",
    },
    {
      title: "Số lượng mã voucher",
      dataIndex: "issue_quantity",
      key: "issue_quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, row) => (
        <div>{text === "published" ? "Hoạt động" : "Hết hạn"}</div>
      ),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "end_time",
      key: "end_time",
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
          {/* <Option value="view">
            <EyeOutlined /> Xem
          </Option> */}
          {/* <Option value="export">
            <FileExcelOutlined /> Xuất excel
          </Option> */}
          <Option value="edit">
            <EditOutlined /> Sửa
          </Option>
          {/* <Option value="lock">
            <LockOutlined /> Khóa
          </Option> */}
          <Option value="delete">
            <DeleteOutlined style={{ color: "red" }} /> Xóa
          </Option>
        </Select>
      ),
    },
  ];

  // const dataSource = [
  //   {
  //     key: "1",
  //     stt: 1,
  //     code: "DISCOUNT50",
  //     eventName: "Giảm giá 50%",
  //     value: "50% off",
  //     quantity: 100,
  //     status: "Hoạt động",
  //     expiryDate: "2024-12-31",
  //   },
  //   {
  //     key: "2",
  //     stt: 2,
  //     code: "WELCOME10",
  //     eventName: "Chào mừng",
  //     value: "10% off",
  //     quantity: 50,
  //     status: "Hết hạn",
  //     expiryDate: "2023-10-01",
  //   },
  //   {
  //     key: "3",
  //     stt: 3,
  //     code: "SUMMER20",
  //     eventName: "Mùa hè",
  //     value: "20% off",
  //     quantity: 75,
  //     status: "Hoạt động",
  //     expiryDate: "2024-08-30",
  //   },
  // ];

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

  const handleExportPDFAndExcel = () => {

    const ws = XLSX.utils.json_to_sheet(listVoucher);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vouchers");

    XLSX.writeFile(wb, "Vouchers_List.xlsx");
  };

  const handleView = (key) => {
  };

  const handleExportExcel = (key) => {
  };

  const handleEdit = (key) => {
    navigate("/admin/expiring-voucher", { state: { item: key } });
  };

  const handleLock = (key) => {
  };

  const handleDelete = (key) => {
    axiosInstance
      .delete(`/vouchers/${key.id}/delete`, {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2xvZ2luIiwiaWF0IjoxNzMxNjQ0MzIwLCJleHAiOjQ4Mzg3NjQ0MzIwLCJuYmYiOjE3MzE2NDQzMjAsImp0aSI6Ik9Eb3IwWjZWeUoyTDIxUksiLCJzdWIiOiI2IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.-xRi4wH0bh3ysiTH9pMWmWaYgGoKiiYpfTkfx2J_D18",
        },
      })
      .then((res) => {
        notification.success({
          message: "Xoá mã giảm giá thành công",
          description: `Mã giảm giá "${key.code}" đã được Xoá.`,
        });
        setReload(!reload);
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        notification.error({
          message: "Xoá thất bại",
          description: "Đã xảy ra lỗi khi xoá mã giảm giá.",
        });
      });
  };

  const handleSearch = () => {
    
  };

  return (
    <div className="code-list">
      <Row gutter={16}>
        <Col span={24}>
          <div className="header">
            <h2 className="title">Danh sách mã giảm giá</h2>
            <div className="action-buttons">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-[10px]"
                style={{ marginRight: 10 }}
                onClick={handleExportPDFAndExcel}
              >
                <ExportOutlined /> Xuất Excel
              </button>
              <Button
                type="default"
                size="large"
                className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
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
            {/* <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="Trạng thái"
              style={{ width: "100%", borderRadius: "8px" }}
            >
              <Option value="">Trạng Thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="expired">Bản nháp</Option>
            </Select> */}

            <select
              // value={statusFilter}
              // onChange={(value) => setStatusFilter(value)}
              placeholder="Trạng thái"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="published">Hoạt động</option>
              <option value="draft">Bản nháp</option>
            </select>
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
          {listVoucher.length > 0 ? (
            <Table
              dataSource={listVoucher}
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
          ) : (
            <Empty />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DiscountCodeList;
