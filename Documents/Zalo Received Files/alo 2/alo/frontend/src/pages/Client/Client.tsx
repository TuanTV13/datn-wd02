import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './../../ClientComponent/Header';
import Footer from './../../ClientComponent/Footer';
const Client = () => {
  return (
    <div>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Client
