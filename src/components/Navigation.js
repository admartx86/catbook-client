import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const username = useSelector((state) => state.user.username);

  return (
    <div>
      <Link to="/myaccount">My Account</Link>
      <Link to="/home">Home</Link>
      <Link to="/explore">Explore</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to={`/${username}`} reloadDocument={true}>
        Profile
      </Link>
    </div>
  );
};

export default Navigation;
