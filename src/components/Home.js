import React from 'react';
import ComposeMeow from './ComposeMeow';
import MeowFeed from './MeowFeed';
import { usePersistedUser } from './usePersistedUser';

const Home = () => {
  usePersistedUser();

  return (
    <div>
      <ComposeMeow />
      <MeowFeed />
    </div>
  );
};

export default Home;
