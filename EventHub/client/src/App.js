import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Giả sử bạn có một API endpoint để lấy thông tin user từ token
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard user={user} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;