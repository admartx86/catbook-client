import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Meow from './Meow';
import ComposeMeow from './ComposeMeow';
import { setMeows } from '../meowActions'; //new

const SingleMeowPage = () => {
  const location = useLocation();

  const { meowId } = useParams();

  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);

  const meows = useSelector((state) => state.meow.meows); //new
  // const [meows, setMeows] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(isReplying);
  const [showRemeowForm, setShowRemeowForm] = useState(isRemeowing);
  // const [singleMeow, setSingleMeow] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    setShowReplyForm(isReplying);
  }, [isReplying]);

  useEffect(() => {
    setShowRemeowForm(isRemeowing);
  }, [isRemeowing]);

  useEffect(() => {
    fetchAllMeows();
  }, []);

  useEffect(() => {
    fetchSingleMeow();
  }, [meowId]);

  const fetchAllMeows = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/meows/`;
      const response = await axios.get(url, { withCredentials: true });
      // setMeows(response.data);
      dispatch(setMeows(response.data)); //new
    } catch (error) {
      console.error('Error fetching all meows:', error);
    }
  };

  const fetchSingleMeow = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`;
      const response = await axios.get(url, { withCredentials: true });
      
      // setSingleMeow(response.data);
      const currentMeows = meows.slice(); // Making a copy of current meows
      const index = currentMeows.findIndex(m => m._id === meowId); 
      if (index !== -1) {
        currentMeows[index] = response.data;
      } else {
        currentMeows.push(response.data);
      }
      dispatch(setMeows(currentMeows)); //new

    } catch (error) {
      console.error('Error fetching single meow:', error);
    }
  };

  const singleMeow = meows.find(m => m._id === meowId); 

  console.log('Is Replying:', isReplying); //debug
  console.log('Is Remeowing:', isRemeowing); //debug
  console.log('Location State:', location.state); //debug

  return (
    <div>
      {singleMeow ? <Meow meow={singleMeow} /> : null}
      {showReplyForm ? <ComposeMeow isAReply={true} originalMeowId={meowId} /> : null}
      {showRemeowForm ? <ComposeMeow isARemeow={true} originalMeowId={meowId} /> : null}
      <div className="replies">
      {/* {meows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        meows
          .filter((reply) => reply.repliedToMeow === meowId)
          .map((reply) => (
            <Meow key={reply._id} meow={reply} />)
      ))} */}
      
        
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
