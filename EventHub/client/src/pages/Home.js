import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './Home.css';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>Discover Amazing Events</h1>
        <p>Find and register for events that match your interests</p>
      </section>

      <section className="featured-events">
        <h2>Featured Events</h2>
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;