import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMeow, readMeow } from '../meowActions';

const ComposeMeow = () => {
  const dispatch = useDispatch();

  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === 'some-meow-id'));
  const username = useSelector((state) => state.user.username);
  const realName = useSelector((state) => state.user.realName);

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
    const formData = new FormData();
    formData.append('meowText', meowText);
    formData.append('meowMedia', selectedFile);
    formData.append('authorPhoto', 'someURL');
    formData.append('authorName', realName);
    formData.append('authorUsername', username);
    console.log('in ComposeMEow formData:', formData);
    dispatch(createMeow(formData));
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
      <button onClick={onCreateMeow}>Post</button>
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
