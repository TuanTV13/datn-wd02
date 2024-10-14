// import React from 'react';
// import AddressForm from './components/addressform'; // Import component AddressForm
import { useRoutes } from "react-router-dom";
import Client from "./pages/Client/Client";
import Home from "./pages/Client/Home";
import LayoutAdmin from "./layouts/LayoutAdmin";
import ListTicket from "./pages/Admin/Tickets/ListTicket";
import ListUserBuyTicket from "./pages/Admin/Tickets/ListUserBuyTicket";
import AddTicket from "./pages/Admin/Tickets/AddTicket";
import EditTicket from "./pages/Admin/Tickets/EditTicket";
import AddDiscountCode from "./pages/Admin/Voucher/AddDiscountCode";
import DiscountCodeList from "./pages/Admin/Voucher/DiscountCodeList";
import VoucherAnalytics from "./pages/Admin/Voucher/VoucherAnalytics";
import ExpiringVouchers from "./pages/Admin/Voucher/ExpiringVouchers";
function App() {
  const route = useRoutes([
    {
      path: "",
      element: <Client />,
      children: [{ path: "", element: <Home /> }],
    },
    {
      path: "admin",
      element: <LayoutAdmin />,
      children: [
        { path: "ticket-list", element: <ListTicket /> },
        { path: "ticket-list-user", element: <ListUserBuyTicket /> },
        { path: "add-ticket", element: <AddTicket /> },
        { path: "edit-ticket/:id", element: <EditTicket /> },
        { path: "discount-code-list", element: <DiscountCodeList /> },
        { path: "discount-code", element: <AddDiscountCode /> },
        { path: "voucher-analytics", element: <VoucherAnalytics /> },
        { path: "expiring-vouchers", element: <ExpiringVouchers /> },
      ],
    },
  ]);
  return route;
}

export default App;
