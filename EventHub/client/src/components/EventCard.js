import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const { _id, title, description, date, location, images } = event;
  // Construct the full image URL by prepending the server's base address
  const imageUrl = images && images.length > 0 ? `http://localhost:5000${images[0]}` : null;

  return (
    <div className="event-card">
      {imageUrl && (
        <div className="event-image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <div className="event-content">
        <h3>{title}</h3>
        <p className="description">{description}</p>
        <div className="event-details">
          <p>
            <i className="far fa-calendar"></i>
            {new Date(date).toLocaleDateString()}
          </p>
          <p>
            <i className="fas fa-map-marker-alt"></i>
            {location}
          </p>
        </div>
        <Link to={`/events/${_id}`} className="view-details">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;