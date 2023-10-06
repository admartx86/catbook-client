import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRealName, setBio, setLocation } from '../userActions';
import MeowFeed from './MeowFeed';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();

  const [dateJoined, setDateJoined] = useState(null);
 

  const realName = useSelector((state) => state.user.realName);

  const [newBio, setNewBio] = useState('');       // To hold the edited bio
  const [newLocation, setNewLocation] = useState('');   // To hold the edited location
  

  const username = useSelector((state) => state.user.username);
  const bio = useSelector((state) => state.user.bio);
  const location = useSelector((state) => state.user.location);


  const [isEditing, setIsEditing] = useState(false);
  const [newRealName, setNewRealName] = useState('');

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/bio`,
          { withCredentials: true }
        );
        setBio(res.data.bio);
      } catch (error) {
        console.log('Error fetching date joined:', error);
      }
    };
fetchBio();
  }, []);


  useEffect(() => {
    

    

    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/location`,
          { withCredentials: true }
        );
        setLocation(res.data.location);
      } catch (error) {
        console.log('Error fetching date joined:', error);
      }
    };

    

  
    fetchLocation();
   
  }, []); 

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
    setNewBio(bio);
    setNewLocation(location);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const realNameResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editRealName`,
        { realName: newRealName },
        { withCredentials: true }
      );
  
      if (realNameResponse.status === 200) {
        console.log('Real name updated successfully', realNameResponse.data);
        dispatch(setRealName(newRealName));
      }
    } catch (error) {
      console.log('An error occurred while updating real name', error);
    }
  
    try {
      const bioResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editBio`,
        { bio: newBio },
        { withCredentials: true }
      );
  
      if (bioResponse.status === 200) {
        console.log('Bio updated successfully', bioResponse.data);
        dispatch(setBio(newBio));
      }
    } catch (error) {
      console.log('An error occurred while updating bio', error);
    }
  
    try {
      const locationResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editLocation`,
        { location: newLocation },
        { withCredentials: true }
      );
  
      if (locationResponse.status === 200) {
        console.log('Location updated successfully', locationResponse.data);
        dispatch(setLocation(newLocation));
      }
    } catch (error) {
      console.log('An error occurred while updating location', error);
    }
  
    setIsEditing(false);
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
    Name: <input type="text" value={newRealName} onChange={(e) => setNewRealName(e.target.value)} />
    Bio: <input type="text" value={newBio} onChange={(e) => setNewBio(e.target.value)} />
    Location: <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
    <button onClick={handleSaveClick}>Save</button>
  </div>
) : (
  <>
    <button onClick={handleEditClick}>Edit Profile</button>
    <p>{realName}</p>
    <p>{/* current bio value */}</p>
    <p>{/* current location value */}</p>
  </>
)}

      <p>@{username}</p>
      <p>{bio}</p>
      <p>{location}</p>
      {dateJoined? <p>Joined {formatDate(dateJoined)}</p> : null}
      <p>Following</p> <p>Followers</p>
      <button>Meows</button> <button> Replies</button>
      <button>Media</button> <button>Likes</button>
      <MeowFeed />
    </div>
  );
};

export default Profile;
