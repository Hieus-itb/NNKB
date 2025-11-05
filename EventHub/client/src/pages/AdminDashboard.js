import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // null for new, object for editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    existingImages: [], // Mảng URL ảnh hiện có
    imagesToRemove: [], // Mảng URL ảnh cần xóa
    imageFiles: [], // Mảng file ảnh mới
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleOpenModal = (event = null) => {
    setError('');
    if (event) {
      setCurrentEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().substring(0, 10), // Format for input[type=date]
        location: event.location,
        existingImages: event.images || [],
        imagesToRemove: [],
        imageFiles: [],
      });
    } else {
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        existingImages: [],
        imagesToRemove: [],
        imageFiles: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData({ ...formData, imageFiles: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = (imageUrl) => {
    // Thêm ảnh vào danh sách cần xóa và xóa khỏi danh sách xem trước
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== imageUrl),
      imagesToRemove: [...prev.imagesToRemove, imageUrl]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    submissionData.append('date', formData.date);
    submissionData.append('location', formData.location);
    formData.imageFiles.forEach(file => {
      submissionData.append('imageFiles', file);
    });
    if (formData.imagesToRemove.length > 0) {
      submissionData.append('removeImages', JSON.stringify(formData.imagesToRemove));
    }

    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

    try {
      if (currentEvent) {
        // Update existing event
        const response = await axios.put(`/api/events/${currentEvent._id}`, submissionData, config);
        setEvents(events.map((ev) => (ev._id === currentEvent._id ? response.data : ev)));
      } else {
        // Create new event
        const response = await axios.post('/api/events', submissionData, config);
        setEvents([...events, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (currentEvent ? 'Failed to update event.' : 'Failed to create event.')
      );
      console.error(err);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((event) => event._id !== eventId));
      } catch (err) {
        setError('Failed to delete event.');
        console.error(err);
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>You are not authorized to see this page.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <h2>Welcome, {user.username}!</h2>
        {error && <p className="error-message">{error}</p>}
        <h3>Manage Events</h3>
        <button className="add-event-btn" onClick={() => handleOpenModal()}>Add New Event</button>
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleOpenModal(event)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(event._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{currentEvent ? 'Edit Event' : 'Add New Event'}</h2>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <div className="image-previews">
                    {formData.existingImages.map((imgUrl, index) => (
                      <div key={index} className="current-image-preview">
                        <img src={`http://localhost:5000${imgUrl}`} alt={`Current event ${index + 1}`} />
                        <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(imgUrl)}>
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    name="imageFile"
                    onChange={handleChange}
                    accept="image/*"
                    multiple // Cho phép chọn nhiều file
                  />
                </div>
                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
              </form>
            </div>
          </div>
        )}
    </>
  );
};

export default AdminDashboard;