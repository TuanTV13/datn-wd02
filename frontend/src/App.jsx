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
import Auth from "./pages/Auth/Auth";
import ListEvent from "./pages/Admin/Events/ListEvents";
import AddEvent from "./pages/Admin/Events/AddEvent";
import UpdateEvent from "./pages/Admin/Events/UpdateEvent";
import DetailEvents from "./pages/Admin/Events/DetailEvent";

function App() {
  const route = useRoutes([
    {
      path: "",
      element: <Client />,
      children: [{ path: "", element: <Home /> }],
    },
    {path:'admin',element: <LayoutAdmin />,children:[
      {path: 'ticket-list', element: <ListTicket/>},
      {path: 'ticket-list-user', element: <ListUserBuyTicket/>},
      {path: 'add-ticket', element: <AddTicket/>},
      {path: 'edit-ticket/:id', element: <EditTicket/>},
      {path:'event-list', element:<ListEvent/>},
      {path:'add-event', element:<AddEvent/>},
      {path:'update-event/:id', element:<UpdateEvent/>},
      {path:'detail-event/', element:<DetailEvents/>}
    ]},
    {
      path:'auth', element: <Auth/>
    }
  ]);
  return route;
}

export default App;
