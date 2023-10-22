import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import MeowFeed from './MeowFeed';
import Navigation from './Navigation';
import backIcon from '../img/angle-pointing-to-left.png';

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navigation />
      <button onClick={() => navigate(-1)}>
      <img src={backIcon} alt="Back" className='w-8'/>
        </button>
      <SearchBar />
      <MeowFeed filterCriteria={'Search'} />
    </div>
  );
};

export default Explore;
