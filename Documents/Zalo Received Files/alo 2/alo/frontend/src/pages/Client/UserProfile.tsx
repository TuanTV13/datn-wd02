import React, { useState } from "react";
import { Button, Card, Descriptions, Image } from "antd";
import "tailwindcss/tailwind.css";

const UserProfile = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, City, Country",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcazeHuAcZDzv4_61fPLT-S00XnaKXch2YWQ&s",
  };

  return (
    <div className="w-full lg:py-10 py-4 border pb-[199px] mt-36">
      <div className="px-80 ">
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <Descriptions title="Thông tin cá nhân" bordered column={1}>
            <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {user.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {user.address}
            </Descriptions.Item>

            <Descriptions.Item label="Ảnh đại diện">
              <Image width={150} src={user.image} />
            </Descriptions.Item>
          </Descriptions>
          <a href="/profile/edit">
            {" "}
            <div className="flex justify-end mt-4">
              <Button type="primary">Sửa</Button>
            </div>
          </a>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
