import React, { useState } from 'react';
import ComposeMeow from './ComposeMeow';
import MeowFeed from './MeowFeed';
import { useDispatch, useSelector } from 'react-redux';
import { clearIsEditing, clearShowEditForm } from '../meowActions';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isSelectingGif, setIsSelectingGif] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState('All');

  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    dispatch(clearIsEditing());
    dispatch(clearShowEditForm());
  }, [location]);

  const handleShowAll = () => {
    setFilterCriteria('All');
  };

  const handleShowFollowing = () => {
    setFilterCriteria('Following');
  };

  return (
    <div>
      <header>
        <Navigation />
      </header>

      <main>
        <section>
          <ComposeMeow isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif} />
        </section>

        <section>
          <div className="flex justify-evenly sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl p-2 border-b-4 border-slate-200">
            <button
              className={
                filterCriteria == 'All'
                  ? 'border-b-4 border-green-400 px-4 py-2'
                  : 'px-4 py-2 text-slate-600'
              }
              onClick={handleShowAll}
            >
              All
            </button>
            <button
              className={
                filterCriteria == 'Following'
                  ? 'border-b-4 border-green-400 px-4 py-2'
                  : 'px-4 py-2 text-slate-600'
              }
              onClick={handleShowFollowing}
            >
              Following
            </button>
          </div>
        </section>

        <section>
          {!isSelectingGif ? (
            // <MeowFeed isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif}/>
            <MeowFeed
              filterCriteria={filterCriteria}
              username={username}
              userId={userId}
              isSelectingGif={isSelectingGif}
              setIsSelectingGif={setIsSelectingGif}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default Home;
