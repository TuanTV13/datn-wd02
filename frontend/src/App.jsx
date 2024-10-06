// import React from 'react';
// import AddressForm from './components/addressform'; // Import component AddressForm
import { useRoutes } from 'react-router-dom';
import Client from './pages/Client/Client';
import Home from './pages/Client/Home';

function App () {
  const route = useRoutes([
    {path:'',element:<Client/>,children: [
      {path:'',element:<Home/>}
    ]}
  ])
  return route
};

export default App;
