import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import MeowFeed from './MeowFeed';

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <SearchBar />
      <MeowFeed />
    </div>
  );
};

export default Explore;
