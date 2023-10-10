import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMeows } from '../meowActions';
import Meow from './Meow';
import { useLocation } from 'react-router-dom';
// import { useLocation, useParams } from 'react-router-dom';

const MeowFeed = () => {
  const dispatch = useDispatch();
  const prevMeowsRef = useRef();
  const meows = useSelector((state) => state.meow.meows);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  // const { meowId } = useParams();

  useEffect(() => {
    prevMeowsRef.current = meows;
  }, [meows]);

  // useEffect(() => {
  //   const fetchMeows = async () => {
  //     // let url = `${process.env.REACT_APP_BACKEND_URL}/meows/`
  //     // if (meowId) {
  //     //   // Fetch a single Meow based on meowId
  //     //   url = `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`;
  //     // } else if (query) {
  //     //   url = `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`;
  //     // }
  //     try {
  //       let url = `${process.env.REACT_APP_BACKEND_URL}/meows/`;
  //       if (query) {
  //         url = `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`;
  //       // }

  //     // try {
  //       const response = await axios.get(url, { withCredentials: true });

  //       if (response.data.message) {
  //         dispatch(setMeows([]));
  //         return;
  //       }

  //       if (meowId) {
  //         dispatch(setMeows([response.data])); // Store as an array for consistency
  //       } else {

  //       const sortedMeows = response.data.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );
  //       const areMeowsDifferent =
  //         !prevMeowsRef.current ||
  //         sortedMeows.length !== prevMeowsRef.current.length ||
  //         !sortedMeows.every((meow, index) => meow._id === prevMeowsRef.current[index]._id);

  //       if (areMeowsDifferent) {
  //         dispatch(setMeows(sortedMeows));
  //       }
  //     }
  //   }} catch (error) {
  //       console.error('Error fetching meows:', error);
  //     }
  //   };
  //   fetchMeows();
  // }, [dispatch, query, meowId]);

  useEffect(() => {
    const fetchMeows = async () => {
      let url = `${process.env.REACT_APP_BACKEND_URL}/meows/`;

      // If there's a query, fetch based on search; ignore meowId as it's handled in SingleMeowPage
      if (query) {
        url = `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`;
      }

      try {
        const response = await axios.get(url, { withCredentials: true });

        if (response.data.message) {
          dispatch(setMeows([]));
          return;
        }

        const sortedMeows = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const areMeowsDifferent =
          !prevMeowsRef.current ||
          sortedMeows.length !== prevMeowsRef.current.length ||
          !sortedMeows.every((meow, index) => meow._id === prevMeowsRef.current[index]._id);

        if (areMeowsDifferent) {
          dispatch(setMeows(sortedMeows));
        }
      } catch (error) {
        console.error('Error fetching meows:', error);
      }
    };

    fetchMeows();
  }, [dispatch, query]);

  return (
    <div>
      {meows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        meows.map((meow) => <Meow key={meow._id} meow={meow} />)
      )}
    </div>
  );
};

export default MeowFeed;
