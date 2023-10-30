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
             <button className='p-4' onClick={() => navigate(-1)}>
             <img src={backIcon} alt="Back" className='w-8'/>
              </button>

              <div className='p-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl break-all'>
              {username == profileUsername ? 'your' : `${profileUsername}'s`} <span className='font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>Followers</span> 
          </div>


            {rearrangedProfileFollowers.map((userFollowingProfile, index) => (
              <div key={index} className='border-4 border-slate-200 rounded-lg p-4 m-4'>
                <Link to={`/${userFollowingProfile.username}`} reloadDocument={true}>
                  <div>
                    { userFollowingProfile.profilePhoto ? (
                    <img
                      src={userFollowingProfile.profilePhoto}
                      alt={`${userFollowingProfile.username}'s profile`}
                      className="flex rounded-full h-28 w-28"
                    />
                    ) : (
<img src='https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png'
                className="flex rounded-full h-28 w-28"
                />
                    )}
                    <div className='py-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'>
                    <p className='py-4'>{userFollowingProfile.username}</p>
                    <p className='py-4'>{userFollowingProfile.realName}</p>
                    <p className='py-4'>{userFollowingProfile.bio}</p>
                    </div>
                  </div>
                </Link>
  
                {
                  userFollowingProfile.username !== username ? (
                    following.includes(userFollowingProfile._id) ? (
                      <div>
                        <button 
                        className="bg-purple-400 text-white 
                        rounded-full px-4 py-2
                        hover:scale-110 transition-all ease-in-out duration-200
                        sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                      
                        onClick={() => handleUnfollow(username, userFollowingProfile.username)}>Following</button>
                      </div>
                    ) : username === profileUsername && !following.includes(userFollowingProfile._id) ? (
                      <div>
                        <button 
                        className="bg-purple-400 text-white 
                        rounded-full px-4 py-2
                        hover:scale-110 transition-all ease-in-out duration-200
                        sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                      
                        onClick={() => handleFollow(username, userFollowingProfile.username)}>Follow Back</button>
                      </div>
                    ) : (
                      <div>
                        <button 
                        
                        className="bg-purple-400 text-white 
              rounded-full px-4 py-2
              hover:scale-110 transition-all ease-in-out duration-200
              sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            
                        onClick={() => handleFollow(username, userFollowingProfile.username)}>Follow</button>
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
