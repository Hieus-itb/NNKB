import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './EventDetails.css';
const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading event details...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <h1>{event.title}</h1>
        <div className="event-meta">
          <span><i className="far fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</span>
          <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
        </div>
      </div>

      {event.images && event.images.length > 0 && (
        <div className="event-gallery">
          {event.images.map((img, index) => (
            <img key={index} src={`http://localhost:5000${img}`} alt={`${event.title} - Image ${index + 1}`} />
          ))}
        </div>
      )}

      <div className="event-description">
        <h2>About this event</h2>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventDetails;