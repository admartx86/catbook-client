import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createMeow, readMeow } from '../meowActions';

const ComposeMeow = () => {
  const dispatch = useDispatch();
  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === 'some-meow-id'));
  //
  const username = useSelector((state) => state.user.username);
  //

  const [meowText, setMeowText] = useState('');

  useEffect(() => {
    dispatch(readMeow('some-meow-id'));
  }, [dispatch]);

  const onCreateMeow = () => {
    dispatch(
      createMeow({
        meowText,
        authorPhoto: 'someURL',
        authorName: 'Jon Arbuckle',
        authorUsername: username
      })
    );
  };

  return (
    <div>
      <h1>Compose Meow</h1>

      <input
        type="text"
        placeholder="Meow text"
        value={meowText}
        onChange={(e) => setMeowText(e.target.value)}
      />

      <button onClick={onCreateMeow}>Create Meow</button>

      {meow && (
        <div>
          <h2>Read Meow</h2>
          <p>{meow.meowText}</p>
        </div>
      )}
    </div>
  );
};

export default ComposeMeow;
