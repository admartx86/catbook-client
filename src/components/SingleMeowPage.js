import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Meow from './Meow';
import ComposeMeow from './ComposeMeow';
import { setMeows } from '../meowActions';

const SingleMeowPage = () => {
  const location = useLocation();

  const { meowId } = useParams();

  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);

  const meows = useSelector((state) => state.meow.meows);
  const [showReplyForm, setShowReplyForm] = useState(isReplying);
  const [showRemeowForm, setShowRemeowForm] = useState(isRemeowing);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    setShowReplyForm(isReplying);
  }, [isReplying]);

  useEffect(() => {
    setShowRemeowForm(isRemeowing);
  }, [isRemeowing]);

  useEffect(() => {
    const fetchMeowsData = async () => {
      try {
        const allMeowsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meows/`, {
          withCredentials: true
        });
        const singleMeowResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`,
          { withCredentials: true }
        );

        const combinedMeows = [...allMeowsResponse.data];

        const singleMeowIndex = combinedMeows.findIndex(
          (m) => m._id === singleMeowResponse.data._id
        );
        if (singleMeowIndex !== -1) {
          combinedMeows[singleMeowIndex] = singleMeowResponse.data;
        } else {
          combinedMeows.push(singleMeowResponse.data);
        }

        dispatch(setMeows(combinedMeows));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meows:', error);
        setLoading(false);
      }
    };

    fetchMeowsData();
  }, [meowId, dispatch]);

  const singleMeow = meows.find((m) => m._id === meowId);

  console.log('Is Replying:', isReplying); //debug
  console.log('Is Remeowing:', isRemeowing); //debug
  console.log('Location State:', location.state); //debug

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {singleMeow ? <Meow meow={singleMeow} /> : null}
          {showReplyForm ? <ComposeMeow isAReply={true} originalMeowId={meowId} /> : null}
          {showRemeowForm ? <ComposeMeow isARemeow={true} originalMeowId={meowId} /> : null}
          <div className="replies">
            {meows
              .filter((reply) => reply.repliedToMeow === meowId)
              .map((reply) => (
                <Meow key={reply._id} meow={reply} />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SingleMeowPage;
