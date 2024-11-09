import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Hoạt động", value: 400 },
  { name: "Hết hạn", value: 200 },
  { name: "Đã sử dụng", value: 100 },
];

const COLORS = ["#00C49F", "#FF8042", "#FFBB28"];

const VoucherAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="voucher-analytics">
      <div className="header">
        <h2>Phân tích số liệu voucher</h2>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số mã giảm giá" value={700} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Mã giảm giá hoạt động" value={400} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Mã giảm giá hết hạn" value={200} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Tỷ lệ mã giảm giá theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Các mã giảm giá được sử dụng">
            <p>
              Thông tin chi tiết về mã giảm giá đã được sử dụng sẽ hiển thị ở
              đây.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VoucherAnalytics;
