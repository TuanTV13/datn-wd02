import { Popover } from "antd";
import { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import React from 'react';


const NotificationContent = () => {
  return (
    <div className="py-2 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <ul>
        {/* <li>Thông báo1</li>
        <li>Thông báo2</li>
        <li>Thông báo3</li>
        <li>Thông báo4</li> */}
      </ul>
    </div>
  );
};

const Notification = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      content={NotificationContent}
      title="Thông báo"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="cursor-pointer">
        <IoNotificationsOutline />
      </div>
    </Popover>
  );
};

export default Notification;
