import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Meow from './Meow';

const SingleMeowPage = () => {
  const { meowId } = useParams();
  const [singleMeow, setSingleMeow] = useState(null);

  useEffect(() => {
    const fetchSingleMeow = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`;
        const response = await axios.get(url, { withCredentials: true });
        setSingleMeow(response.data);
      } catch (error) {
        console.error('Error fetching single meow:', error);
      }
    };

    fetchSingleMeow();
  }, [meowId]);

  return <div>{singleMeow && <Meow meow={singleMeow} />}</div>;
};

export default SingleMeowPage;
