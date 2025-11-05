import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">EventHub</Link>
      </div>
      <nav className={`nav ${isOpen ? 'active' : ''}`}>
        <Link to="/events">Events</Link>
        {user ? (
          <>
            {user.role === 'organizer' && (
              <Link to="/organizer/dashboard">Organizer Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard">Admin Dashboard</Link>
            )}
            <Link to="/profile">Profile</Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
};

export default Header;