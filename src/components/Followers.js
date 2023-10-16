import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

const Followers = () => {
  const { username: profileUsername } = useParams();

  const [followers, setFollowers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    setLoading(true);
    setError(null);
    try {
      const followersResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}/followers`
      );
      console.log('fetchFollowers:', followersResponse.data); // Log the data to check its structure
      setFollowers(followersResponse.data.followers);
    } catch (error) {
      console.log('fetchFollowers:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : Array.isArray(followers) && followers.length > 0 ? (
        <div>
          {followers.map((follower, index) => (
            <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <img
                src={follower.profilePhoto}
                alt={`${follower.username}'s profile`}
                style={{ width: '50px', height: '50px' }}
              />
              <h2>{follower.username}</h2>
              <h3>{follower.realName}</h3>
              <p>{follower.bio}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Looking for followers?</p>
      )}
    </div>
  );
};

export default Followers;
