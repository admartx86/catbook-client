import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMeow, readMeow } from '../meowActions';

const ComposeMeow = ({ isAReply = false, originalMeowId = null }) => {
  const dispatch = useDispatch();

  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === 'some-meow-id'));
  const username = useSelector((state) => state.user.username);

  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');

  useEffect(() => {
    dispatch(readMeow('some-meow-id'));
  }, [dispatch]);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'm4v'];
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const acceptableExtensions = [...videoTypes, ...imageTypes];
    const sizeLimit = 50 * 1024 * 1024;

    if (!file) {
      setSelectedFile(null);
      return;
    } else {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!acceptableExtensions.includes(extension)) {
        alert(`Invalid file type. Accepted types are: ${acceptableExtensions.join(', ')}.`);
        return;
      }
      if (file.size > sizeLimit) {
        alert('File size is too large. Limit is 50MB.');
        return;
      }
      setSelectedFile(file);
      console.log('Selected File: ', file);
    }
  };

  const onCreateMeow = () => {
    console.log('Function executed!');
    const formData = new FormData();
    formData.append('meowText', meowText);
    formData.append('meowMedia', selectedFile);
    formData.append('author', username);
    if (isAReply) {
      formData.append('isAReply', true);
      formData.append('replyToMeowId', originalMeowId);
    }
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    dispatch(createMeow(formData));
  };

  const clickTest = () => {
    console.log('Button Clicked');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="What's happening?"
        value={meowText}
        onChange={(e) => setMeowText(e.target.value)}
      />
      <input type="file" onChange={onFileChange} />
      <button
        onClick={() => {
          console.log('Button Clicked');
          onCreateMeow();
        }}
      >
        Post
      </button>
      <button onClick={clickTest}>CLICKME</button>
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
