import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Meow from './Meow';
import ComposeMeow from './ComposeMeow';
import { useSelector } from 'react-redux';

const SingleMeowPage = () => {
  const [meows, setMeows] = useState([]);

  const location = useLocation();

  const isReplying = useSelector((state) => state.reply.isReplying);

  const [showReplyForm, setShowReplyForm] = useState(isReplying);

  const { meowId } = useParams();
  const [singleMeow, setSingleMeow] = useState(null);

  useEffect(() => {
    setShowReplyForm(isReplying);
  }, [isReplying]);

  useEffect(() => {
    const fetchAllMeows = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/meows/`;
        const response = await axios.get(url, { withCredentials: true });
        setMeows(response.data);
      } catch (error) {
        console.error('Error fetching all meows:', error);
      }
    };

    fetchAllMeows();
  }, []);

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

  console.log('Is Replying:', isReplying);
  console.log('Location State:', location.state);

  return (
    <div>
      {singleMeow && <Meow meow={singleMeow} />}

      {showReplyForm && <ComposeMeow isAReply={true} originalMeowId={meowId} />}

      <div className="replies">
        {meows
          .filter((reply) => reply.repliedToMeow === meowId)
          .map((reply) => (
            <Meow key={reply._id} meow={reply} />
          ))}
      </div>
    </div>
  );
};

export default SingleMeowPage;
