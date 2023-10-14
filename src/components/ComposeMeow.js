import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createMeow, updateMeow } from '../meowActions';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import { clearIsEditing } from '../meowActions';
import Meow from './Meow';

const ComposeMeow = ({
  isAReply = false,
  isARemeow = false,
  originalMeowId = null,
  originalMeow = null,
  setShouldNavigateToHome,
  initialMeowText = ''
}) => {
  const dispatch = useDispatch();

  const { meowId } = useParams();

  const username = useSelector((state) => state.user.username);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const showEditForm = useSelector((state) => state.meow.showEditForm);

  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [remainingCharacters, setRemainingCharacters] = useState(280);

  useEffect(() => {
    if (isEditing) {
      const originalMeowText = initialMeowText;
      setMeowText(originalMeowText);
    }
  }, [isEditing]);

  useEffect(() => {
    setRemainingCharacters(280 - meowText.length);
  }, [meowText]);

  useEffect(() => {
    if (isAReply || isARemeow || isEditing) {
      inputRef.current.focus();
    }
  }, [isAReply, isARemeow, isEditing]);

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
    console.log('Function executed!'); //debug
    const formData = new FormData();
    formData.append('meowText', meowText);
    formData.append('meowMedia', selectedFile);
    formData.append('author', username);
    if (isAReply) {
      formData.append('isAReply', true);
      formData.append('replyToMeowId', originalMeowId);
    }
    if (isARemeow) {
      formData.append('isARemeow', true);
      formData.append('remeowToMeowId', originalMeowId);
      if (!meowText && !selectedFile) {
        formData.append('isADirectRemeow', true);
      } else {
        formData.append('isADirectRemeow', false);
      }
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    } //debug
    dispatch(createMeow(formData));

    if (isAReply) {
      dispatch(clearIsReplying());
    }
    if (isARemeow) {
      dispatch(clearIsRemeowing());
      setShouldNavigateToHome(true);
    }
    setMeowText('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const onUpdateMeow = () => {
    if (meowId) {
      const updatedMeow = {
        meowId: meowId,
        meowText: meowText
      };
      dispatch(updateMeow(updatedMeow));
      console.log('Attempting to update meow with ID:', meowId);
    } else {
      console.log('No ID available for update');
    }
    dispatch(clearIsEditing());
    setMeowText('');
    window.location.reload();
  };

  console.log('Original Meow ID:', originalMeowId); //debug
  // prettier-ignore
console.log('isEditing:', isEditing); //debug 
console.log('showEditForm:', showEditForm); //debug
  return (
    <div className="compose-meow">
      <input
        ref={inputRef}
        type="text"
        placeholder={
          isAReply ? 'Post your reply' : isARemeow ? 'Add a comment...' : "What's happening?"
        }
        value={meowText}
        onChange={(e) => setMeowText(e.target.value)}
      />
      { isEditing ? null : (<input type="file" ref={fileInputRef} onChange={onFileChange} />)}
      {isEditing ? (
        <button onClick={() => onUpdateMeow()}> Post Changes </button>
      ) : (
        <button
          onClick={() => {
            console.log('Button Clicked');
            onCreateMeow();
          }}
        >
          Post
        </button>
      )}
      <div>{remainingCharacters}</div>
      {isARemeow && originalMeow && (
        <div className="originalMeowEmbed">
          <Meow meow={originalMeow} isEmbedded={true} />
        </div>
      )}
    </div>
  );
};

export default ComposeMeow;
