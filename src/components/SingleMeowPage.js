import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import { clearIsEditing, setShowEditForm } from '../meowActions';
import axios from 'axios';
import Meow from './Meow';
import ComposeMeow from './ComposeMeow';
import { setMeows } from '../meowActions';

const SingleMeowPage = () => {
  const navigate = useNavigate();
  const { meowId } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [shouldNavigateToHome, setShouldNavigateToHome] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(isReplying);
  const [showRemeowForm, setShowRemeowForm] = useState(isRemeowing);
  const [parentMeows, setParentMeows] = useState([]);

  const meows = useSelector((state) => state.meow.meows);
  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const showEditForm = useSelector((state) => state.meow.showEditForm);

  const singleMeow = meows.find((m) => m._id === meowId);

  useEffect(() => {
    setParentMeows([]);

    const fetchParentMeows = async (currentMeowId) => {
      let chain = [];
      let currentMeow = meows.find((m) => m._id === currentMeowId);

      while (currentMeow && currentMeow.isAReply) {
        const parentMeow = meows.find((meow) => meow._id === currentMeow?.repliedToMeow);
        if (parentMeow) {
          chain.unshift(parentMeow);
          currentMeow = parentMeow;
        } else {
          break;
        }
      }

      setParentMeows(chain);
      const element = document.getElementById('singleMeowScrollPoint');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    if (singleMeow && singleMeow.isAReply) {
      fetchParentMeows(singleMeow._id);
    }
  }, [singleMeow, meows, navigate]);

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
  }, [navigate]);

//   useEffect(() => {
//     return () => {
//       dispatch(clearIsEditing());
//   }; 
// }, []);

  useEffect(() => {
    setShowReplyForm(isReplying);
  }, [isReplying]);

  useEffect(() => {
    setShowRemeowForm(isRemeowing);
  }, [isRemeowing]);

  useEffect(() => {
    setShowEditForm(isEditing);
  }, [isEditing]);

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
        dispatch(setMeows(combinedMeows));
        setLoading(false);
      }
    };
    fetchMeowsData();
  }, [meowId, dispatch]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {parentMeows.map((meow) =>
            meow && meow._id !== singleMeow._id ? (
              <Meow key={meow._id} meow={meow} />
            ) : (
              <div className="placeholder-meow">Meow does not exist.</div>
            )
          )}
          
          {!isRemeowing && !isEditing ? (
            singleMeow ? (
              <div id="singleMeowScrollPoint" className="single-meow">
                <Meow meow={singleMeow} isSingleMeow={true} />
              </div>
            ) : (
              <div className="placeholder-meow">Meow does not exist.</div>
            )
          ) : null}
          {showReplyForm ? <ComposeMeow isAReply={true} originalMeowId={meowId} /> : null}
          {showRemeowForm ? (
            <ComposeMeow
              setShouldNavigateToHome={setShouldNavigateToHome}
              isARemeow={true}
              originalMeowId={meowId}
              originalMeow={singleMeow}
            />
          ) : null}
          {showEditForm ? (
            <ComposeMeow
              // setShouldNavigateToHome={setShouldNavigateToHome}
              isEditing={true}
              initialMeowText={singleMeow.meowText}
              originalMeowId={meowId}
              // meowText={singleMeow.meowText}
              // originalMeowId={meowId}
              originalMeow={singleMeow}
            />
          ) : null}
          {!isReplying && !isRemeowing && !isEditing ? (
            <div className="replies">
              {meows
                .filter((reply) => reply?.repliedToMeow === meowId)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((reply, index) =>
                  reply ? (
                    <Meow key={reply._id} meow={reply} />
                  ) : (
                    <PlaceholderMeow key={index} content="This reply Meow does not exist." />
                  )
                )}
                
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SingleMeowPage;
