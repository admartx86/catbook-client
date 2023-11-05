import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import MeowFeed from './MeowFeed';
import Navigation from './Navigation';
import backIcon from '../img/angle-pointing-to-left.png';

const Explore = () => {
  const navigate = useNavigate();

  return (
    <main>
      <Navigation />
      <button className="p-4" onClick={() => navigate(-1)} aria-label="Back">
        <img src={backIcon} alt="Back" className="w-8" />
      </button>
      <section className="p-2">
        <SearchBar />
      </section>
      <MeowFeed filterCriteria={'Search'} />
    </main>
  );
};

export default Explore;
