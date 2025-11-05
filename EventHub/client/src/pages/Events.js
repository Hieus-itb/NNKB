import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './Home.css'; // Re-using Home.css for simplicity

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-grid" style={{ padding: '2rem' }}>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default Events;