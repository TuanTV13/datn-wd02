// src/components/DiscountCodeForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, Switch, message } from "antd";
const DiscountCodeForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Gửi dữ liệu tới API để lưu mã giảm giá
      console.log("Mã giảm giá:", values);
      message.success("Thêm mã giảm giá thành công!");
      form.resetFields();
    } catch (error) {
      message.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Thêm Mới Voucher</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mã Voucher"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
        >
          <Input placeholder="Nhập mã voucher" />
        </Form.Item>
        <Form.Item
          label="Số lượng voucher/vé"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <Input placeholder="Nhập số lượng voucher" type="number" />
        </Form.Item>
        <Form.Item
          label="Số tiền giảm"
          name="discountAmount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền giảm!" }]}
        >
          <Input placeholder="Nhập số tiền giảm" />
        </Form.Item>
        <Form.Item
          label="Giới hạn số lần sử dụng"
          name="usageLimit"
          rules={[
            { required: true, message: "Vui lòng nhập giới hạn sử dụng!" },
          ]}
        >
          <Input placeholder="Nhập giới hạn số lần sử dụng" type="number" />
        </Form.Item>
        <Form.Item
          label="Ngày hết hạn"
          name="expiryDate"
          rules={[{ required: true, message: "Vui lòng nhập ngày hết hạn!" }]}
        >
          <Input placeholder="Nhập ngày hết hạn (dd/mm/yyyy)" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch
            checkedChildren="Kích hoạt"
            unCheckedChildren="Chưa kích hoạt"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DiscountCodeForm;
