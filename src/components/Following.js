import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { followUser, setLocalToken, unfollowUser } from '../userActions';

import axios from 'axios';

const Following = () => {

  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);
  const userIsFollowing = useSelector((state) => state.user.following);

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
        `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}/following`
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

  // const handleFollow = (userId, username, profileUsername) => {
  //   if (!following.some((follower) => follower._id === userId)) {
  //     dispatch(followUser(username, profileUsername));
  //     setFollowing([...following, { _id: userId }]);
  //   } else if (following.some((follower) => follower._id === userId)) {
  //     dispatch(unfollowUser(username, profileUsername));
  //     // const newFollowing = following.filter((follower) => follower._id !== userId);
  //     // setFollowing(newFollowing);
  //   }
  // };
  const fetchUpdatedUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/${username}/user`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching updated user info:", error);
    }
  }
  

  const updateLocalStorage = (updatedUserInfo) => {
    localStorage.setItem(
      'CatbookToken',
      JSON.stringify({
        username: updatedUserInfo.username,
        realName: updatedUserInfo.realName,
        userId: updatedUserInfo._id,
        profilePhoto: updatedUserInfo.profilePhoto,
        bio: updatedUserInfo.bio,
        location: updatedUserInfo.location,
        followers: updatedUserInfo.followers,
        following: updatedUserInfo.following
      })
    );
  }
  
  const handleFollow = async (userBeingFollowedByProfileUsernameUsername, userBeingFollowedByProfileUsernameId) => {
    try {
      await dispatch(followUser(username, userBeingFollowedByProfileUsernameUsername));
      // setProfileIsFollowing([...profileIsFollowing, { _id: userBeingFollowedByProfileUsernameId }]);
  
      const updatedUserInfo = await fetchUpdatedUserInfo();
      dispatch(setLocalToken(updatedUserInfo));
      // updateLocalStorage(updatedUserInfo);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  const handleUnfollow = async (userBeingFollowedByProfileUsernameUsername, userBeingFollowedByProfileUsernameId) => {
    try {
      await dispatch(unfollowUser(username, userBeingFollowedByProfileUsernameUsername));
  
      // const newFollowing = profileIsFollowing.filter((follower) => follower._id !== userBeingFollowedByProfileUsernameId);
      // setProfileIsFollowing(newFollowing);
  
      const updatedUserInfo = await fetchUpdatedUserInfo();
      dispatch(setLocalToken(updatedUserInfo));
      // updateLocalStorage(updatedUserInfo);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

 
  // const handleFollow = () => {
  //   if (profileUsername !== username) {
  //     if (!followers.some((follower) => follower._id === userId)) {
  //       dispatch(followUser(username, profileUsername));
  //       setFollowers([...followers, { _id: userId }]);
  //     } else if (followers.some((follower) => follower._id === userId)) {
  //       dispatch(unfollowUser(username, profileUsername));
  //       const newFollowers = followers.filter((follower) => follower._id !== userId);
  //       setFollowers(newFollowers);
  //     }
  //   }
  // };



  console.log('username:', username);
  console.log('userIsFollowing:', userIsFollowing);
  console.log('profileIsFollowing:', profileIsFollowing);
  console.log ('profileUsername:', profileUsername);
 

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
              <p> userBeingFollowedByProfileUsername._id {userBeingFollowedByProfileUsername._id}</p>



              { 
  (username !== profileUsername && userIsFollowing.includes(userBeingFollowedByProfileUsername._id)) || 
  (username === profileUsername && profileIsFollowing.some(obj => obj._id === userBeingFollowedByProfileUsername._id))
  ? (
  <div>
  <button onClick={() => handleUnfollow(userBeingFollowedByProfileUsername.username, userBeingFollowedByProfileUsername._id)}>Following</button>
  {/* <button onClick={() => handleUnfollow(userBeingFollowedByProfileUsername.username, userBeingFollowedByProfileUsername._id)}>{userBeingFollowedByProfileUsername.username}:{userBeingFollowedByProfileUsername._id}</button> */}
  </div>
) :  (
  <div>
  <button onClick={() => handleFollow(userBeingFollowedByProfileUsername.username, userBeingFollowedByProfileUsername._id)}>Follow</button>
  {/* <button onClick={() => handleFollow(userBeingFollowedByProfileUsername.username, userBeingFollowedByProfileUsername._id)}>{userBeingFollowedByProfileUsername.username}:{userBeingFollowedByProfileUsername._id}</button> */}
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
