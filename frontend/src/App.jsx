// import React from 'react';
// import AddressForm from './components/addressform'; // Import component AddressForm
import { useRoutes } from "react-router-dom";
import Client from "./pages/Client/Client";
import Home from "./pages/Client/Home";
import LayoutAdmin from "./layouts/LayoutAdmin";
import ListTicket from "./pages/Admin/Tickets/ListTicket";
import AddTicket from "./pages/Admin/Tickets/AddTicket";
import EditTicket from "./pages/Admin/Tickets/EditTicket";
import Auth from "./pages/Auth/Auth";
import ListEvent from "./pages/Admin/Events/ListEvents";
import AddEvent from "./pages/Admin/Events/AddEvent";
import UpdateEvent from "./pages/Admin/Events/UpdateEvent";
import DetailEvents from "./pages/Admin/Events/DetailEvent";
import ListClient from "./pages/Admin/Client/ListClient";
import AddClient from "./pages/Admin/Client/AddClient";

import ListUser from "./pages/Admin/User/ListUser";
import AddUser from "./pages/Admin/User/AddUser";
import EventListing from "./pages/Client/EventList";
import Cart from "./pages/Client/Cart";
import CheckOut from "./pages/Client/CheckOut";
import EventDetail from "./pages/Client/EventDetail";
import EventHistory from "./pages/Client/EventHistory";
import PaymentHistory from "./pages/Client/PaymentHistory";
import VerifyEmailPage from "./components/Auth/VerifyEmailPage";
import CategoryEvent from "./pages/Client/CategoryEven";
import UserProfileEdit from "./pages/Client/UserProfileEdit";
import UserChangePassword from "./pages/Client/UserChangePassword";
import UserProfile from "./pages/Client/UserProfile";
import AddDiscountCode from "./pages/Admin/Voucher/AddDiscountCode";
import DiscountCodeList from "./pages/Admin/Voucher/DiscountCodeList";
import ExpiringVoucherForm from "./pages/Admin/Voucher/ExpiringVouchers";
import Order from "./pages/Client/Order";
import SearchEvent from "./pages/Client/SearchEvent";

function App() {
  const route = useRoutes([
    {
      path: "",
      element: <Client />,
      children: [
        { path: "", element: <Home /> },
        { path: "event-list", element: <EventListing /> },
        { path: "event-detail/:id", element: <EventDetail /> },
        { path: "event-category/:id", element: <CategoryEvent /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <CheckOut /> },
        { path: "order", element: <Order /> },
        { path: "event-history", element: <EventHistory /> },
        { path: "payment-history", element: <PaymentHistory /> },
        { path: "profile", element: <UserProfile /> },
        { path: "profile/edit", element: <UserProfileEdit /> },
        { path: "change-password", element: <UserChangePassword /> },
        { path: "search", element: <SearchEvent /> },
      ],
    },
    {
      path: "admin",
      element: <LayoutAdmin />,
      children: [
        { path: "ticket-list", element: <ListTicket /> },
        { path: "add-ticket", element: <AddTicket /> },
        { path: "edit-ticket/:id", element: <EditTicket /> },
        { path: "event-list", element: <ListEvent /> },
        { path: "add-event", element: <AddEvent /> },
        { path: "update-event/", element: <UpdateEvent /> },
        { path: "detail-event/", element: <DetailEvents /> },
        { path: "user-list", element: <ListUser /> },
        { path: "add-user", element: <AddUser /> },
        { path: "client-list", element: <ListClient /> },
        { path: "add-client", element: <AddClient /> },
        { path: "discount-code-list", element: <DiscountCodeList /> },
        { path: "discount-code", element: <AddDiscountCode /> },
        { path: "expiring-vouchers", element: <ExpiringVoucherForm /> },
      ],
    },
    {
      path: "auth",
      element: <Auth />,
    },
    {
      path: "verify-email",
      element: <VerifyEmailPage />,
    },
  ]);
  return route;
}

export default App;
