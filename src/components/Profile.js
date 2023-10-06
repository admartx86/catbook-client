import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRealName } from '../userActions';
import MeowFeed from './MeowFeed';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();

  const [dateJoined, setDateJoined] = useState(null);
  const realName = useSelector((state) => state.user.realName);



  const username = useSelector((state) => state.user.username);


  const [isEditing, setIsEditing] = useState(false);
  const [newRealName, setNewRealName] = useState('');

  useEffect(() => {
    const fetchDateJoined = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/dateJoined`,
          { withCredentials: true }
        );
        setDateJoined(new Date(res.data.dateJoined));
      } catch (error) {
        console.log('Error fetching date joined:', error);
      }
    };

    fetchDateJoined();
  }, []); 

  const handleEditClick = () => {
    setNewRealName(realName);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editRealName`,
        { realName: newRealName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log('Real name updated successfully', response.data);
        dispatch(setRealName(newRealName));
        setIsEditing(false);
      }
    } catch (error) {
      console.log('An error occurred while updating real name', error);
    }
  };

  function formatDate(dateJoined) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = months[dateJoined.getMonth()]; 
    const year = dateJoined.getFullYear();

    return `${month} ${year}`;
}

  return (
    <div>
      <button>Back</button>
      <p>Profile header image</p>
      <p>Profile Photo</p>
      {isEditing ? (
        <div>
          Name{' '}
          <input type="text" value={newRealName} onChange={(e) => setNewRealName(e.target.value)} />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <>
          <button onClick={handleEditClick}>Edit Profile</button>
          <p>{realName}</p>
        </>
      )}
      <p>@{username}</p>
      <p>Bio</p>
      <p>Location</p>
      {dateJoined? <p>Joined {formatDate(dateJoined)}</p> : null}
      <p>Following</p> <p>Followers</p>
      <button>Meows</button> <button> Replies</button>
      <button>Media</button> <button>Likes</button>
      <MeowFeed />
    </div>
  );
};

export default Profile;
