import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../userActions';

import axios from 'axios';
import Navigation from './Navigation';

import backIcon from '../img/angle-pointing-to-left.png';

const Following = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  console.log('profileUsername:', profileUsername);
console.log('profileIsFollowing:', profileIsFollowing);


  const rearrangedProfileIsFollowing = [...profileIsFollowing].sort((a, b) => {
    if (a.username === username) return -1;
    if (b.username === username) return 1;
    return 0;
  });

  // prettier-ignore
  return (
      <div>
        <Navigation />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error.message}</p>
        ) : Array.isArray(rearrangedProfileIsFollowing) && rearrangedProfileIsFollowing.length > 0 ? (
          <div>
            <button onClick={() => navigate(-1)}>
            <img src={backIcon} alt="Back" className='w-8'/>
              </button>
            {rearrangedProfileIsFollowing.map((userBeingFollowedByProfileUsername, index) => (
              <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <Link to={`/${userBeingFollowedByProfileUsername.username}`} reloadDocument={true}>
                  <div>
                    
                    { userBeingFollowedByProfileUsername.profilePhoto ? (
                    <img
                      src={userBeingFollowedByProfileUsername.profilePhoto}
                      alt={`${userBeingFollowedByProfileUsername.username}'s profile`}
                      className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
                    />
                    ) : (
                      <img src='https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png'
                      className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
                      />
                    )}
                    <h2>{userBeingFollowedByProfileUsername.username}</h2>
                    <h3>{userBeingFollowedByProfileUsername.realName}</h3>
                    <p>{userBeingFollowedByProfileUsername.bio}</p>
                  </div>
                </Link>
  
                { 
                  userBeingFollowedByProfileUsername.username !== username ? (
                    following.includes(userBeingFollowedByProfileUsername._id) ? (
                      <div>
                        <button 
                        className="bg-purple-400 text-white 
                        rounded-full px-4 py-2
                        hover:scale-110 transition-all ease-in-out duration-200
                        text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                        onClick={() => handleUnfollow(username, userBeingFollowedByProfileUsername.username)}>Following</button>
                      </div>
                    ) : (
                      <div>
                        <button 
                        className="bg-purple-400 text-white 
                        rounded-full px-4 py-2
                        hover:scale-110 transition-all ease-in-out duration-200
                        text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                        onClick={() => handleFollow(username, userBeingFollowedByProfileUsername.username)}>Follow</button>
                      </div>
                    )
                  ) : null
                }
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
