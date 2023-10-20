import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import MeowFeed from './MeowFeed';
import Navigation from './Navigation';

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navigation />
      <button onClick={() => navigate(-1)}>Back</button>
      <SearchBar />
      <MeowFeed />
    </div>
  );
};

export default Explore;
