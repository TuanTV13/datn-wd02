import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"; 
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement 
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null); 
  const [eventCount, setEventCount] = useState<number>(0); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<any>(null); 
  const [startDate, setStartDate] = useState<any>(dayjs().subtract(1, "y")); 
  const [endDate, setEndDate] = useState<any>(dayjs()); 

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
      setEventCount(response.data.event_count); 
    } catch (err) {
      message.error("Có lỗi xảy ra khi lấy số lượng sự kiện");
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const chartData = {
    labels: data?.top_events?.map((event: any) => event.name), 
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: data?.top_events?.map((event: any) =>
          parseFloat(event.total_revenue)
        ), 
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: data?.top_events?.map((event: any) => event.name), 
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

  const pieChartData = {
    labels: data?.top_events?.map((event: any) => event.name), 
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
        ], 
      },
    ],
  };

  const doughnutChartData = {
    labels: data?.top_events?.map((event: any) => event.name), 
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
        ], 
      },
    ],
  };

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
            size: 10, 
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10, 
          },
        },
      },
    },
  };

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

  const tableData = data?.top_events?.map((event: any) => ({
    key: event.id,
    name: event.name,
    total_revenue: event.total_revenue ,
    percentage: event.percentage,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bảng báo cáo doanh thu</h2>

      {}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          Tổng số sự kiện hoàn thành: {eventCount}
        </h3>
      </div>

      {}
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

      {}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Tổng doanh thu: {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data.total_revenue)}{" "}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ doanh thu theo sự kiện
          </h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ doanh thu theo sự kiện (Đường)
          </h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>

        {}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ tỷ lệ doanh thu (Tròn)
          </h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>

        {}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Biểu đồ tỷ lệ doanh thu (Doughnut)
          </h3>
          <Doughnut data={doughnutChartData} options={chartOptions} />
        </div>
      </div>
      {}
      <h2 className="text-xl mb-2">Top 5 sự kiện có doanh thu cao nhất </h2>
      {tableData?.length > 0 ? (
        <Table columns={columns} dataSource={tableData} className="mb-6" />
      ) : (
        <Empty />
      )}

      {}
    </div>
  );
};

export default Dashboard;
