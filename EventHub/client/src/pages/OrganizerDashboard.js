import React from 'react';

const OrganizerDashboard = ({ user }) => {
  if (!user || user.role !== 'organizer') {
    return <div>You are not authorized to see this page.</div>;
  }

  return <div>Welcome to the Organizer Dashboard, {user.username}!</div>;
};

export default OrganizerDashboard;