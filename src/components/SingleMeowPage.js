import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import { clearIsEditing, clearLockForClearIsEditing, clearShowEditForm } from '../meowActions';
import axios from 'axios';
import Meow from './Meow';
import ComposeMeow from './ComposeMeow';
import { setMeows } from '../meowActions';
import Navigation from './Navigation';

const SingleMeowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { meowId } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [parentMeows, setParentMeows] = useState([]);
  const [isSelectingGif, setIsSelectingGif] = useState(false);

  const meows = useSelector((state) => state.meow.meows);
  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const showEditForm = useSelector((state) => state.meow.showEditForm);
  const isEditingIsLocked = useSelector((state) => state.meow.isEditingIsLocked);

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
    return () => {
      dispatch(clearIsReplying());
      dispatch(clearIsRemeowing());
    };
  }, [navigate]);

  useEffect(() => {
    if (isEditingIsLocked) {
      dispatch(clearLockForClearIsEditing(false));
    } else {
      dispatch(clearIsEditing());
      dispatch(clearShowEditForm());
    }
  }, [location]);

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
      <header>
        <Navigation />
      </header>

      <main>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {parentMeows.map((meow) =>
              meow && meow._id !== singleMeow._id ? (
                <div className="border-slate-200 border-b-4">
                  <Meow key={meow._id} meow={meow} />
                </div>
              ) : (
                <div className="placeholder-meow">Meow does not exist.</div>
              )
            )}

            {!isRemeowing && !isEditing ? (
              singleMeow ? (
                <div id="singleMeowScrollPoint">
                  <Meow meow={singleMeow} isSingleMeow={true} />
                </div>
              ) : (
                <div className="placeholder-meow">Meow does not exist.</div>
              )
            ) : null}

            {isReplying ? (
              <ComposeMeow
                isAReply={true}
                originalMeowId={meowId}
                isSelectingGif={isSelectingGif}
                setIsSelectingGif={setIsSelectingGif}
              />
            ) : null}

            {isRemeowing ? (
              <ComposeMeow
                isARemeow={true}
                originalMeowId={meowId}
                originalMeow={singleMeow}
                isSelectingGif={isSelectingGif}
                setIsSelectingGif={setIsSelectingGif}
              />
            ) : null}

            {showEditForm ? (
              <ComposeMeow
                isEditing={true}
                initialMeowText={singleMeow.meowText}
                originalMeowId={meowId}
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
                      <div className="border-slate-200 border-t-4">
                        <Meow key={reply._id} meow={reply} />
                      </div>
                    ) : (
                      <div className="border-slate-200 border-t-4">
                        <PlaceholderMeow key={index} content="This reply Meow does not exist." />
                      </div>
                    )
                  )}
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default SingleMeowPage;
