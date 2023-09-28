import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersistedUser } from './usePersistedUser';
import Meow from './Meow'; // Assuming you have a Meow component to display each individual meow

const MeowFeed = () => {
  
  usePersistedUser();
  
  const [meows, setMeows] = useState([]); // To hold the list of meows

  // Fetch all meows when the component mounts
  useEffect(() => {
    const fetchMeows = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meows/`, { withCredentials: true });
        // Sort the meows by the date they were posted (newest first)
        const sortedMeows = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMeows(sortedMeows);
      } catch (error) {
        console.error('Error fetching meows:', error);
      }
    };

    fetchMeows();
  }, []);

  return (
    <div>
      {meows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        meows.map((meow) => (
          <Meow key={meow._id} meow={meow} />
        ))
      )}
    </div>
  );
  
};

export default MeowFeed;