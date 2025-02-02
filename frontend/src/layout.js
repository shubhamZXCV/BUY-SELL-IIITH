import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet /> {/* This is where the child routes will be rendered */}
      </div>
    </>
  );
};

export default Layout;
