import { useRoutes } from "react-router-dom";
import LayoutAdmin from "./layouts/LayoutAdmin";
import DiscountCodeForm from "./components/DiscountCodeForm"; // Import component quản lý mã giảm giá
import Client from "./pages/Client/Client";
import Home from "./pages/Client/Home";

function App() {
  const routes = useRoutes([
    {
      path: "",
      element: <Client />,
      children: [{ path: "", element: <Home /> }],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        { path: "", element: <h2></h2> },
        { path: "discount-code", element: <DiscountCodeForm /> },
        { path: "discount-code-list", element: <h2>Danh sách mã giảm giá</h2> },
      ],
    },
  ]);

  return routes;
}

export default App;
