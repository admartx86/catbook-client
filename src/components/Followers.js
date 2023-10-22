import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../userActions';

import Navigation from './Navigation';

import axios from 'axios';

import backIcon from '../img/angle-pointing-to-left.png';

const Followers = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username);
  const following = useSelector((state) => state.user.following);

  const { username: profileUsername } = useParams();

  const [profileFollowers, setProfileFollowers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    setLoading(true);
    setError(null);
    try {
      const FollowersResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}/FollowersDetailed`
      );
      console.log('fetchFollowers:', FollowersResponse.data);
      setProfileFollowers(FollowersResponse.data.followers);
    } catch (error) {
      console.log('fetchFollowers:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (username, userFollowingProfileUsername) => {
    try {
      await dispatch(followUser(username, userFollowingProfileUsername));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleUnfollow = async (username, userFollowingProfileUsername) => {
    try {
      await dispatch(unfollowUser(username, userFollowingProfileUsername));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  console.log('username:', username);
  console.log('following:', following);
  console.log('profileFollowers:', profileFollowers);
  console.log('profileUsername:', profileUsername);

  const rearrangedProfileFollowers = [...profileFollowers].sort((a, b) => {
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
        ) : Array.isArray(rearrangedProfileFollowers) && rearrangedProfileFollowers.length > 0 ? (
          <div>
             <button onClick={() => navigate(-1)}>
             <img src={backIcon} alt="Back" className='w-8'/>
              </button>
            {rearrangedProfileFollowers.map((userFollowingProfile, index) => (
              <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <Link to={`/${userFollowingProfile.username}`} reloadDocument={true}>
                  <div>
                    <img
                      src={userFollowingProfile.profilePhoto}
                      alt={`${userFollowingProfile.username}'s profile`}
                      style={{ width: '50px', height: '50px' }}
                    />
                    <h2>{userFollowingProfile.username}</h2>
                    <h3>{userFollowingProfile.realName}</h3>
                    <p>{userFollowingProfile.bio}</p>
                  </div>
                </Link>
  
                {
                  userFollowingProfile.username !== username ? (
                    following.includes(userFollowingProfile._id) ? (
                      <div>
                        <button onClick={() => handleUnfollow(username, userFollowingProfile.username)}>Following</button>
                      </div>
                    ) : username === profileUsername && !following.includes(userFollowingProfile._id) ? (
                      <div>
                        <button onClick={() => handleFollow(username, userFollowingProfile.username)}>Follow Back</button>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => handleFollow(username, userFollowingProfile.username)}>Follow</button>
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

export default Followers;
