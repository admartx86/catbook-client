import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersistedUser } from './usePersistedUser';
import Meow from './Meow'; 

const MeowFeed = () => {
  
  usePersistedUser();
  
  const [meows, setMeows] = useState([]); 

 
  useEffect(() => {
    const fetchMeows = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meows/`, { withCredentials: true });
       
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