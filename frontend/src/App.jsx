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
import EventListing from "./pages/Client/EventList";

function App() {
  const route = useRoutes([
    {
      path: "",
      element: <Client />,
      children: [
        { path: "", element: <Home /> },
        { path: "event-list", element: <EventListing /> }
      ],
    },
    {path:'admin',element: <LayoutAdmin />,children:[
      {path: 'ticket-list', element: <ListTicket/>},
      {path: 'ticket-list-user', element: <ListUserBuyTicket/>},
      {path: 'add-ticket', element: <AddTicket/>},
      {path: 'edit-ticket/:id', element: <EditTicket/>},
    ]}
  ]);
  return route;
}

export default App;
