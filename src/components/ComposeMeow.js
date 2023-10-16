import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createMeow, updateMeow } from '../meowActions';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import { clearIsEditing } from '../meowActions';
import Meow from './Meow';
import axios from 'axios';

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

  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const username = useSelector((state) => state.user.username);
  const realName = useSelector((state) => state.user.realName);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const showEditForm = useSelector((state) => state.meow.showEditForm);

  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');
  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const meowMedia = useSelector(
    (state) => state.meow.meows.find((m) => m._id === meowId)?.meowMedia
  );

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

  const renderMedia = (meowMedia) => {
    if (meowMedia) {
      const extension = meowMedia.split('.').pop().toLowerCase();
      const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'm4v'];
      const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      if (videoTypes.includes(extension)) {
        return (
          <video controls width="250">
            <source src={meowMedia} type={`video/${extension}`} />
          </video>
        );
      }
      if (imageTypes.includes(extension)) {
        return <img src={meowMedia} alt="Media" />;
      }
    }
  };

  useEffect(() => {
    if (originalMeow) {
      const fetchEmbeddedMeow = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/meows/${originalMeow.embeddedMeow}`
          );
          setEmbeddedMeowData(response.data);
        } catch (error) {
          console.error('Error fetching embedded meow:', error);
        }
      };
      fetchEmbeddedMeow();
    }
  }, [originalMeowId]);

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  console.log('Original Meow ID:', originalMeowId); //debug
  // prettier-ignore
  console.log('isEditing:', isEditing); //debug
  console.log('showEditForm:', showEditForm); //debug
  console.log('originalMeow:', originalMeow); //debug
  console.log('embeddedMeowData:', embeddedMeowData); //debug

  return (
    <div className="compose-meow">
      {isEditing ? (
        <div>
          <div>
            <img src={profilePhoto} />
          </div>{' '}
          <div>{realName}</div> <div>@{username}</div>
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="text"
        placeholder={
          isAReply ? 'Post your reply' : isARemeow ? 'Add a comment...' : "What's happening?"
        }
        value={meowText}
        onChange={(e) => setMeowText(e.target.value)}
      />{' '}
      <div>{remainingCharacters}</div>
      <div>
        {isEditing ? <p>{renderMedia(meowMedia)}</p> : null}
        {isEditing && originalMeow && embeddedMeowData ? (
          <Meow meow={embeddedMeowData} isEmbedded={true} />
        ) : isARemeow && !embeddedMeowData ? (
          <div className="placeholder-meow">Meow does not exist.</div>
        ) : null}
      </div>
      <div>
        {previewUrl && (
          <>
            {previewUrl.startsWith('data:image/') ? (
              <img src={previewUrl} alt="Preview" width="200" />
            ) : (
              <video controls width="200">
                <source src={previewUrl} type="video/mp4" />
              </video>
            )}
            <button onClick={clearSelectedFile}>Clear Selected File</button>
          </>
        )}
      </div>
      {isEditing || previewUrl != '' ? null : (
        <input type="file" ref={fileInputRef} onChange={onFileChange} />
      )}
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
      {isARemeow && originalMeow && (
        <div className="originalMeowEmbed">
          <Meow meow={originalMeow} isEmbedded={true} />
        </div>
      )}
    </div>
  );
};

export default ComposeMeow;
