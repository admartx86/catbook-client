import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../userActions';

import axios from 'axios';

const Following = () => {

  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);
  const following = useSelector((state) => state.user.following);

  const { username: profileUsername } = useParams();

  const [profileIsFollowing, setProfileIsFollowing] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    setLoading(true);
    setError(null);
    try {
      const followingResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}/followingDetailed`
      );
      console.log('fetchFollowing:', followingResponse.data);
      setProfileIsFollowing(followingResponse.data.following);
    } catch (error) {
      console.log('fetchFollowing:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (username, userBeingFollowedByProfileUsernameUsername) => {
    try {
      await dispatch(followUser(username, userBeingFollowedByProfileUsernameUsername));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  const handleUnfollow = async (username, userBeingFollowedByProfileUsernameUsername) => {
    try {
      await dispatch(unfollowUser(username, userBeingFollowedByProfileUsernameUsername));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  console.log('username:', username);
  console.log('following:', following);
  console.log('profileIsFollowing:', profileIsFollowing);
  console.log ('profileUsername:', profileUsername);


  // prettier-ignore
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : Array.isArray(profileIsFollowing) && profileIsFollowing.length > 0 ? (
        <div>
          {profileIsFollowing.map((userBeingFollowedByProfileUsername, index) => (

            
            <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <img
                src={userBeingFollowedByProfileUsername.profilePhoto}
                alt={`${userBeingFollowedByProfileUsername.username}'s profile`}
                style={{ width: '50px', height: '50px' }}
              />
              <h2>{userBeingFollowedByProfileUsername.username}</h2>
              <h3>{userBeingFollowedByProfileUsername.realName}</h3>
              <p>{userBeingFollowedByProfileUsername.bio}</p>
              <p>{userBeingFollowedByProfileUsername._id}</p>



              { 

                    (following.includes(userBeingFollowedByProfileUsername._id))

                        ? (
                        <div>
                        <button onClick={() => handleUnfollow(username, userBeingFollowedByProfileUsername.username)}>Following</button>

                        </div>
                      ) :  (
                        <div>
                        <button onClick={() => handleFollow(username, userBeingFollowedByProfileUsername.username)}>Follow</button>
                        </div>
                      ) }   

             
            </div>
          ))}
        </div>
      ) : (
        <p>Looking for followers?</p>
      )}
    </div>
  );

};

export default Following;
