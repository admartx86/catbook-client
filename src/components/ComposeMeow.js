import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { createMeow, updateMeow } from '../meowActions';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import { clearIsEditing } from '../meowActions';

import axios from 'axios';

import Meow from './Meow';
import Gif from './Gif';
import ComposeMeowProfilePhoto from './ComposeMeowProfilePhoto';
import ComposeMeowTextArea from './ComposeMeowTextArea';
import ComposeMeowRemainingCharacters from './ComposeMeowRemainingCharacters';
import ComposeMeowGifAndMediaPreviews from './ComposeMeowGifAndMediaPreview';
import ComposeMeowButtons from './ComposeMeowButtons';

const ComposeMeow = ({
  isAReply = false,
  isARemeow = false,
  originalMeowId = null,
  originalMeow = null,
  initialMeowText = '',
  isSelectingGif,
  setIsSelectingGif
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { meowId } = useParams();

  const username = useSelector((state) => state.user.username);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const isReplying = useSelector((state) => state.reply.isReplying);
  const meowMedia = useSelector(
    (state) => state.meow.meows.find((m) => m._id === meowId)?.meowMedia
  );

  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedGifUrl, setSelectedGifUrl] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');
  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedGifUrl]);

  useEffect(() => {
    if (isEditing) {
      const originalMeowText = initialMeowText;
      setMeowText(originalMeowText);
    }
  }, [isEditing]);

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
        alert(
          `😿 File type not supported! 😺👉 Choose from the following supported file types: ${acceptableExtensions.join(
            ', '
          )}.`
        );
        return;
      }
      if (file.size > sizeLimit) {
        alert('🙀🐘 File size is too large. 😺🐁 Choose a file 50MB or smaller.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onCreateMeow = () => {
    const formData = new FormData();
    formData.append('meowText', meowText);
    formData.append('meowMedia', selectedFile);
    formData.append('author', username);
    if (selectedGifUrl) {
      const cleanedGifUrl = selectedGifUrl.split('?')[0];
      formData.append('gifUrl', cleanedGifUrl);
    }
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

    if (selectedGifUrl) {
      clearSelectedGif();
    }

    dispatch(createMeow(formData));
    if (isAReply) {
      dispatch(clearIsReplying());
    }
    if (isARemeow) {
      dispatch(clearIsRemeowing());
      navigate('/home');
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

  const clearSelectedGif = () => {
    setSelectedGifUrl(null);
  };

  const openGifSelect = () => {
    setIsSelectingGif(true);
  };

  return (
    <div
      className={
        !isEditing && !isReplying
          ? 'border-b-4 border-slate-200 flex flex-col p-2'
          : 'flex flex-col p-2'
      }
    >
      <div className="flex flex-shrink-0">
        <header className="bg-white flex flex-col flex-shrink-0 items-center">
          <ComposeMeowProfilePhoto />
          <ComposeMeowRemainingCharacters meowText={meowText} />
        </header>

        <section className="flex flex-col lg:flex-row w-full">
          <ComposeMeowTextArea
            isAReply={isAReply}
            isARemeow={isARemeow}
            meowText={meowText}
            setMeowText={setMeowText}
            inputRef={inputRef}
          />
          <ComposeMeowGifAndMediaPreviews
            selectedGifUrl={selectedGifUrl}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            setSelectedFile={setSelectedFile}
            clearSelectedGif={clearSelectedGif}
            fileInputRef={fileInputRef}
          />
        </section>
      </div>

      {isARemeow && originalMeow && (
        <div className="originalMeowEmbed">
          <Meow meow={originalMeow} isEmbedded={true} />
        </div>
      )}

      <Gif
        setSelectedGif={setSelectedGif}
        setSelectedGifUrl={setSelectedGifUrl}
        setIsSelectingGif={setIsSelectingGif}
        isEditing={isEditing}
        isSelectingGif={isSelectingGif}
      />

      <div className="flex flex-col lg:flex-row p-2">
        {isEditing ? <p>{renderMedia(meowMedia)}</p> : null}
        {isEditing && originalMeow && embeddedMeowData ? (
          <div className="border-4 border-slate-200 rounded-lg">
            <Meow meow={embeddedMeowData} isEmbedded={true} />
          </div>
        ) : null}
      </div>

      <footer>
        <ComposeMeowButtons
          isEditing={isEditing}
          isSelectingGif={isSelectingGif}
          onFileChange={onFileChange}
          openGifSelect={openGifSelect}
          onUpdateMeow={onUpdateMeow}
          onCreateMeow={onCreateMeow}
        />
      </footer>
    </div>
  );
};

export default ComposeMeow;
