import { useRoutes } from 'react-router-dom';
import Client from './pages/Client/Client';
import Home from './pages/Client/Home';
import AuthContainer from './pages/auth/AuthContainer'; // Cập nhật đường dẫn

function App() {
  const route = useRoutes([
    {
      path: '',
      element: <Client />,
      children: [
        { path: '', element: <Home /> },
      ],
    },
    {
      path: 'auth',
      element: <AuthContainer />, // Route tới AuthContainer
    },
  ]);

  return route;
}

export default App;
