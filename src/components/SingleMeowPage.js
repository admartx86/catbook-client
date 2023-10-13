import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import axios from 'axios';
import Meow from './Meow';
import ComposeMeow from './ComposeMeow';
import { setMeows } from '../meowActions';

import placeholderMeow from '../placeholderMeow';

const SingleMeowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meowId } = useParams();

  const [shouldNavigateToHome, setShouldNavigateToHome] = useState(false);

  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);

  const meows = useSelector((state) => state.meow.meows);
  const [showReplyForm, setShowReplyForm] = useState(isReplying);
  const [showRemeowForm, setShowRemeowForm] = useState(isRemeowing);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (shouldNavigateToHome) {
      navigate('/home');
      setShouldNavigateToHome(false);
    }
  }, [shouldNavigateToHome]);

  useEffect(() => {
    return () => {
      dispatch(clearIsReplying());
      dispatch(clearIsRemeowing());
    };
  }, []);

  useEffect(() => {
    setShowReplyForm(isReplying);
  }, [isReplying]);

  useEffect(() => {
    setShowRemeowForm(isRemeowing);
  }, [isRemeowing]);

  useEffect(() => {
    const fetchMeowsData = async () => {
      
      let allMeowsResponse; //new
      
      try {
        const allMeowsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meows/`, {
          withCredentials: true
        });
        const singleMeowResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`,
          { withCredentials: true }
        );


        if (singleMeowResponse.data) {

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
      }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching meows:', error);

        // Add placeholder for the missing meow
        const combinedMeows = [...(allMeowsResponse?.data || [])];
        combinedMeows.push(placeholderMeow); // Add the placeholder meow to the list
        dispatch(setMeows(combinedMeows));

        setLoading(false);
      }
    };

    fetchMeowsData();
  }, [meowId, dispatch]);

  const singleMeow = meows.find((m) => m._id === meowId);

  console.log('Is Replying:', isReplying);
  console.log('Is Remeowing:', isRemeowing);
  console.log('Location State:', location.state);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        {!isRemeowing ? (
          singleMeow ? (
            <Meow meow={singleMeow} isSingleMeow={true} />
          ) : (
            <div className='placeholder-meow'>Meow does not exist.</div>
          )
        ) : null}
          {/* {!isRemeowing && singleMeow ? <Meow meow={singleMeow} isSingleMeow={true} /> : null} */}

          {showReplyForm ? <ComposeMeow isAReply={true} originalMeowId={meowId} /> : null}
          {showRemeowForm ? (
            <ComposeMeow
              setShouldNavigateToHome={setShouldNavigateToHome}
              isARemeow={true}
              originalMeowId={meowId}
              originalMeow={singleMeow}
            />
          ) : null}
          {!isReplying && !isRemeowing && (
            <div className="replies">
              {meows
                .filter((reply) => reply.repliedToMeow === meowId)
                .map((reply) => (
                  <Meow key={reply._id} meow={reply} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleMeowPage;
