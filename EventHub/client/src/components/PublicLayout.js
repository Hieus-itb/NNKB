import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = ({ user, onLogout }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <><Header user={user} onLogout={onLogout} /><main><Outlet /></main><Footer /></>
  );
};

export default PublicLayout;