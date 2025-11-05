import React from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return <div>Please log in to see your profile.</div>;
  }

  return <div>Welcome, {user.username}! This is your profile page.</div>;
};

export default Profile;