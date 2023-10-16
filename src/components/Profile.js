import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  setRealName as setUserRealName,
  setBio as setUserBio,
  setLocation as setUserLocation,
  setProfilePhoto as setUserProfilePhoto,
  followUser,
  unfollowUser
} from '../userActions';

import MeowFeed from './MeowFeed';

import axios from 'axios';

const Profile = () => {
  const urlLocation = useLocation();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);

  const { username: profileUsername } = useParams();

  const [userData, setUserData] = useState(null);
  const [realName, setRealName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [dateJoined, setDateJoined] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [newRealName, setNewRealName] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}`
        );
        console.log('fetchUserData:', userDataResponse);
        setUserData(userDataResponse.data);
        setRealName(userDataResponse.data.realName);
        setProfilePhoto(userDataResponse.data.profilePhoto);
        setBio(userDataResponse.data.bio);
        setLocation(userDataResponse.data.location);
        setDateJoined(new Date(userDataResponse.data.dateJoined));
        setFollowing(userDataResponse.data.following);
        setFollowers(userDataResponse.data.followers);
      } catch (error) {
        console.log('fetchUserData:', error);
      }
    };
    fetchUserData();
  }, [urlLocation]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePhoto(file);
    setSelectedFile(file);
  };

  const handleEditProfileClick = () => {
    setNewRealName(realName);
    setNewBio(bio);
    setNewLocation(location);
    setNewProfilePhoto(profilePhoto);
    setIsEditingProfile(true);
  };

  const handleFollow = () => {
    if (profileUsername !== username && !following.includes(profileUsername)) {
      dispatch(followUser(username, profileUsername));
    } else if (profileUsername !== username && following.includes(profileUsername)) {
      dispatch(unfollowUser(username, profileUsername));
    }
  };

  const handleSaveClick = async () => {
    if (!newRealName) {
      setNewRealName(realName);
    } else
      try {
        const realNameResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editRealName`,
          { realName: newRealName },
          { withCredentials: true }
        );
        if (realNameResponse.status === 200) {
          console.log('realName updated succesfully:', realNameResponse.data);
          dispatch(setUserRealName(realNameResponse.data.realName));
        }
      } catch (error) {
        console.log('realName failed to update:', error);
      }

    if (!newProfilePhoto) {
      setNewProfilePhoto(profilePhoto);
    } else if (newProfilePhoto) {
      const formData = new FormData();
      formData.append('profilePhoto', newProfilePhoto);
      try {
        const profilePhotoResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editProfilePhoto`,
          formData,
          { withCredentials: true }
        );
        if (profilePhotoResponse.status === 200) {
          console.log('profilePhoto updated successfully:', profilePhotoResponse.data);
          dispatch(setUserProfilePhoto(profilePhotoResponse.data.profilePhoto));
        }
      } catch (error) {
        console.log('profilePhoto failed to update:', error);
      }
    }

    if (!newBio) {
      setNewBio(bio);
    } else
      try {
        const bioResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editBio`,
          { bio: newBio },
          { withCredentials: true }
        );

        if (bioResponse.status === 200) {
          console.log('bio updated successfully:', bioResponse.data);
          dispatch(setUserBio(bioResponse.data.bio));
        }
      } catch (error) {
        console.log('bio failed to update:', error);
      }

    if (!newLocation) {
      setLocation(location);
    } else
      try {
        const locationResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editLocation`,
          { location: newLocation },
          { withCredentials: true }
        );
        if (locationResponse.status === 200) {
          console.log('location updated successfully:', locationResponse.data);
          dispatch(setUserLocation(locationResponse.data.location));
        }
      } catch (error) {
        console.log('location failed to update:', error);
      }
    setIsEditingProfile(false);
  };

  function formatDate(dateJoined) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const month = months[dateJoined.getMonth()];
    const year = dateJoined.getFullYear();
    return `${month} ${year}`;
  }

  // prettier-ignore
  return (
    
      <div>  
        {isEditingProfile ? (
        <div className='edit-user-profile'>
          
          <div>Name:</div>
          <div><input type="text" value={newRealName} onChange={(e) => setNewRealName(e.target.value)}/></div>
          
          <div>Bio:</div>
          <div><input type="text" value={newBio} onChange={(e) => setNewBio(e.target.value)} /></div>
          
          <div>Location:</div>
          <div><input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)}/></div>
          
          <div style={{ position: 'relative', width: '100px', height: '100%', cursor: 'pointer' }}>
            <img src={ previewUrl ? previewUrl : profilePhoto }
            alt="Profile Photo" 
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}/>
            <input type="file" 
            style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
            onChange={handleFileChange}/>
          </div>

          <button onClick={handleSaveClick}>Save</button>
          <button onClick={() => setIsEditingProfile(false)}>Back</button>  

        </div>
        ) : (
        <div className='user-profile'>
          
          <div style={{ display: 'flex'}}>
            
            <div>
              <img src={profilePhoto} alt="Profile Photo" style={{ width: '100px', height: '100px', cursor: 'pointer' }} />
            </div>
            
            <div>
              {username === profileUsername ? (<button onClick={handleEditProfileClick}>Edit Profile</button>) : null}
              {profileUsername !== username && following.includes(profileUsername) ? (<button onClick={handleFollow}>Following</button>) : null}
              {profileUsername !== username && !following.includes(profileUsername) ? (<button onClick={handleFollow}>Follow</button>) : null}
            </div>
          
          </div>
          
          <div>
          
            <div>{realName ? realName : ''}</div>
            <div>@{profileUsername}</div>
            <div>{bio ? bio : ''}</div>
            <div style={{ display : 'flex' }}>
              <div>{location ? location : ''}</div>
              <div>{dateJoined ? `Joined ${formatDate(dateJoined)}` : ''}</div>
            </div>
            <div style={{ display : 'flex' }}>
              <div><Link to={`/${profileUsername}/following`}>{following?.length ?? 0} Following</Link></div>
              <div><Link to={`/${profileUsername}/followers`}>{followers?.length ?? 0} Followers</Link></div>
            </div>
            <div>
            <button>Meows</button>
            <button>Replies</button>
            <button>Media</button>
            <button>Likes</button>
          </div>
        
        </div>
        
        <MeowFeed />
      
      </div>
      )}
    </div>
  );
};

export default Profile;
