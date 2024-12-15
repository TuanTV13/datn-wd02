import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"; // Import Doughnut chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axiosInstance from "../../../axios";
import { DatePicker, Table, Spin, message, Empty } from "antd";
import dayjs from "dayjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Đăng ký biểu đồ Doughnut
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null); // Dữ liệu trả về từ API tổng doanh thu
  const [eventCount, setEventCount] = useState<number>(0); // Tổng số sự kiện
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState<any>(null); // Lỗi khi gọi API
  const [startDate, setStartDate] = useState<any>(dayjs().subtract(1, "y")); // Ngày bắt đầu
  const [endDate, setEndDate] = useState<any>(dayjs()); // Ngày kết thúc

  // Gọi API để lấy doanh thu theo ngày bắt đầu và kết thúc
  const fetchRevenueData = async (start_date: string, end_date: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/events/statistics/top-revenue-events",
        {
          params: {
            start_date: start_date,
            end_date: end_date,
          },
        }
      );
      setData(response.data.data);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API để lấy số lượng sự kiện
  const fetchEventCount = async (start_date: string, end_date: string) => {
    try {
      const response = await axiosInstance.get(
        "/events/statistics/event-count",
        {
          params: {
            start_date: start_date,
            end_date: end_date,
          },
        }
      );
      setEventCount(response.data.event_count); // Lưu tổng số sự kiện
    } catch (err) {
      message.error("Có lỗi xảy ra khi lấy số lượng sự kiện");
    }
  };

  // Gọi API khi chọn ngày mới
  useEffect(() => {
    if (startDate && endDate) {
      fetchRevenueData(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
      fetchEventCount(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
    }
  }, [startDate, endDate]);

  // Nếu đang tải dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu có lỗi khi gọi API
  if (error) {
    return <div>{error}</div>;
  }

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: data?.top_events?.map((event: any) => event.name), // Tên sự kiện
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: data?.top_events?.map((event: any) =>
          parseFloat(event.total_revenue)
        ), // Doanh thu của từng sự kiện
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ đường (Line chart)
  const lineChartData = {
    labels: data?.top_events?.map((event: any) => event.name), // Tên sự kiện
    datasets: [
      {
        label: "Doanh thu theo sự kiện",
        data: data?.top_events?.map((event: any) =>
          parseFloat(event.total_revenue)
        ),
        fill: false,
        borderColor: "#4BC0C0",
        tension: 0.1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn (Pie chart)
  const pieChartData = {
    labels: data?.top_events?.map((event: any) => event.name), // Tên sự kiện
    datasets: [
      {
        label: "Tỷ lệ doanh thu",
        data: data?.top_events?.map((event: any) =>
          parseFloat(event.total_revenue)
        ), // Doanh thu của từng sự kiện
        backgroundColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FF33A1",
          "#FFC300",
        ], // Các màu sắc cho các phần tử
      },
    ],
  };

  // Dữ liệu cho biểu đồ Doughnut (hình tròn phân khúc)
  const doughnutChartData = {
    labels: data?.top_events?.map((event: any) => event.name), // Tên sự kiện
    datasets: [
      {
        label: "Tỷ lệ doanh thu",
        data: data?.top_events?.map((event: any) =>
          parseFloat(event.total_revenue)
        ),
        backgroundColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FF33A1",
          "#FFC300",
        ], // Các màu sắc cho các phần tử
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Doanh thu theo sự kiện",
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10, // Thu nhỏ chữ trên trục X
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10, // Thu nhỏ chữ trên trục Y
          },
        },
      },
    },
  };

  // Columns cho bảng báo cáo doanh thu
  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "total_revenue",
      key: "total_revenue",
    },
    {
      title: "Tỷ lệ (%)",
      dataIndex: "percentage",
      key: "percentage",
      render: (percentage: any) => `${percentage.toFixed()}%`,
    },
  ];

  // Dữ liệu bảng báo cáo
  const tableData = data?.top_events?.map((event: any) => ({
    key: event.id,
    name: event.name,
    total_revenue: event.total_revenue,
    percentage: event.percentage,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bảng báo cáo doanh thu</h2>

      {/* Hiển thị tổng số sự kiện */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          Tổng số sự kiện hoàn thành: {eventCount}
        </h3>
      </div>

      {/* Date Pickers */}
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <span className="mr-2">Ngày bắt đầu:</span>
            <DatePicker
              value={startDate}
              onChange={(date: any) => setStartDate(date)}
              format="YYYY-MM-DD"
              className="w-full"
            />
          </div>
          <div>
            <span className="mr-2">Ngày kết thúc:</span>
            <DatePicker
              value={endDate}
              onChange={(date: any) => setEndDate(date)}
              format="YYYY-MM-DD"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Tổng doanh thu */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Tổng doanh thu: {data.total_revenue} VNĐ
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Biểu đồ cột */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ doanh thu theo sự kiện
          </h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Biểu đồ đường */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ doanh thu theo sự kiện (Đường)
          </h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>

        {/* Biểu đồ tròn */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ tỷ lệ doanh thu (Tròn)
          </h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>

        {/* Biểu đồ Doughnut */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ tỷ lệ doanh thu (Doughnut)
          </h3>
          <Doughnut data={doughnutChartData} options={chartOptions} />
        </div>
      </div>
      {/* Bảng báo cáo doanh thu */}
      <h2 className="text-xl mb-2">Top 5 sự kiện có doanh thu cao nhất </h2>
      {tableData?.length > 0 ? (
        <Table columns={columns} dataSource={tableData} className="mb-6" />
      ) : (
        <Empty />
      )}

      {/* Các biểu đồ */}
    </div>
  );
};

export default Dashboard;
