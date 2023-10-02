import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createMeow, readMeow } from '../meowActions';

const ComposeMeow = () => {
  const dispatch = useDispatch();
  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === 'some-meow-id'));

  const username = useSelector((state) => state.user.username);

  const [selectedFile, setSelectedFile] = useState(null);

  const [meowText, setMeowText] = useState('');

  useEffect(() => {
    dispatch(readMeow('some-meow-id'));
  }, [dispatch]);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Update selected file
    console.log('Selected File: ', event.target.files[0]);
  };

  const onCreateMeow = () => {
    const formData = new FormData();
    formData.append('meowText', meowText);
    formData.append('meowMedia', selectedFile); // Attach the selected file
    formData.append('authorPhoto', 'someURL'); // Attach the selected file
    formData.append('authorName', username);
    formData.append('authorUsername', username);

    dispatch(createMeow(formData));
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
      <input type="file" onChange={onFileChange} />
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
