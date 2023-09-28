import { useState } from 'react';
import axios from 'axios';

export const useMeowCRUD = () => {
  const [meow, setMeow] = useState(null);
  const [meowId, setMeowId] = useState('');
  const [meowText, setMeowText] = useState('');

  const createMeow = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meows/`, {
          
  
          authorPhoto: 'someURL',
          authorName: 'John Doe',
          authorUsername: 'john_doe',
          meowText: meowText,
          // ... other fields
        }, { withCredentials: true });
        console.log('Created Meow:', response.data);
      } catch (error) {
        console.error('Error creating Meow:', error);
      }
  };

  const readMeow = async () => {
    try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`;
        console.log(`Making request to: ${url}`);
        const response = await axios.get(url, { withCredentials: true });
        setMeow(response.data);
      } catch (error) {
        console.error('Meow not found:', error);
      }
  };

  const updateMeow = async (meowId) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, 
        {
          meowText: 'Updated meow text, just for testing testing 1 2 3!',
          // ... other updated fields
        }, { withCredentials: true });
        console.log('Updated Meow:', response.data);
      } catch (error) {
        console.error('Error updating Meow:', error);
      }
  };

  const deleteMeow = async (meowId) => {
    try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, { withCredentials: true });
        console.log('Meow deleted');
      } catch (error) {
        console.error('Error deleting Meow:', error);
      }
  };

  return {
    meow,
    setMeowId,
    meowText,
    setMeowText,
    createMeow,
    readMeow,
    updateMeow,
    deleteMeow
  };
};
