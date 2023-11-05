import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createMeow, updateMeow } from '../meowActions';
import { clearIsReplying } from '../replyActions';
import { clearIsRemeowing } from '../remeowActions';
import { clearIsEditing } from '../meowActions';
import Meow from './Meow';
import Gif from './Gif';
import axios from 'axios';
import gifIcon from '../img/piece.png';
import mediaIcon from '../img/picture.png';
import ComposeMeowProfilePhoto from './ComposeMeowProfilePhoto';
import ComposeMeowTextArea from './ComposeMeowTextArea';
import ComposeMeowRemainingCharacters from './ComposeMeowRemainingCharacters';
import ComposeMeowGifAndMediaPreviews from './ComposeMeowGifAndMediaPreview';

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

  const { meowId } = useParams();

  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username);
  const realName = useSelector((state) => state.user.realName);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const showEditForm = useSelector((state) => state.meow.showEditForm);
  const isReplying = useSelector((state) => state.reply.isReplying);

  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedGifUrl, setSelectedGifUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');
  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedGifUrl]);

  useEffect(() => {}, [selectedGifUrl, selectedGif]);

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

  const openGifSelect = () => {
    setIsSelectingGif(true);
  };

  const closeGifSelect = () => {
    setIsSelectingGif(false);
  };

  return (
    <section
      className={
        !isEditing && !isReplying
          ? 'border-b-4 border-slate-200 flex flex-col p-2'
          : 'flex flex-col p-2'
      }
    >
      <div className="flex flex-shrink-0">
        <div className="bg-white flex flex-col flex-shrink-0 items-center">
          <ComposeMeowProfilePhoto />
          <ComposeMeowRemainingCharacters meowText={meowText} />
        </div>
        <div className="flex flex-col lg:flex-row w-full">
          <ComposeMeowTextArea
            isAReply={isAReply}
            isARemeow={isARemeow}
            meowText={meowText}
            setMeowText={setMeowText}
          />
          <ComposeMeowGifAndMediaPreviews
            selectedGifUrl={selectedGifUrl}
            setSelectedGifUrl={setSelectedGifUrl}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            setSelectedFile={setSelectedFile}
          />
        </div>
      </div>
      {isARemeow && originalMeow && (
        <div className="originalMeowEmbed">
          <Meow meow={originalMeow} isEmbedded={true} />
        </div>
      )}
      <div className="flex flex-col pl-12">
        <div className="flex p-3">
          {!isEditing && isSelectingGif ? (
            <button
              onClick={closeGifSelect}
              className="bg-purple-400 text-white 
                rounded-full px-4 py-2
                sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
                hover:scale-110 transition-all ease-in-out duration-200"
            >
              Close GIF Select
            </button>
          ) : null}
        </div>
        <div>
          {isSelectingGif ? (
            <Gif setSelectedGifUrl={setSelectedGifUrl} setIsSelectingGif={setIsSelectingGif} />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-2">
        {isEditing ? <p>{renderMedia(meowMedia)}</p> : null}
        {isEditing && originalMeow && embeddedMeowData ? (
          <div className="border-4 border-slate-200 rounded-lg">
            <Meow meow={embeddedMeowData} isEmbedded={true} />
          </div>
        ) : null}
      </div>

      <div className="pl-14 md:pl-24 lg:pl-28 xl:pl-32 flex">
        <div className="flex p-3 lg:p-5">
          {isEditing || isSelectingGif ? null : (
            <button>
              <input type="file" id="fileInput" className="hidden" onChange={onFileChange} />
              <label htmlFor="fileInput" className="cursor-pointer">
                <img
                  src={mediaIcon}
                  alt="Add Media"
                  title="Add Media"
                  className="w-6 lg:w-12 self-center hover:scale-110 transition-all ease-in-out duration-200"
                />
              </label>
            </button>
          )}
        </div>

        <div className="flex p-3 lg:p-5">
          {!isEditing && !isSelectingGif ? (
            <button onClick={openGifSelect}>
              <img
                src={gifIcon}
                alt="Add GIF"
                title="Add GIF"
                className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
              />
            </button>
          ) : null}
        </div>

        <div className="flex p-3 lg:p-5">
          {isEditing ? (
            <div className="self-center">
              <button
                onClick={() => onUpdateMeow()}
                className="bg-purple-400 text-white 
              rounded-full px-4 py-2
              sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
              hover:scale-110 transition-all ease-in-out duration-200"
              >
                Post Changes
              </button>
            </div>
          ) : (
            !isSelectingGif && (
              <div className="self-center">
                <button
                  onClick={() => {
                    console.log('Button Clicked');
                    onCreateMeow();
                  }}
                  className="bg-purple-400 text-white 
              rounded-full px-4 py-2
              sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
              hover:scale-110 transition-all ease-in-out duration-200"
                >
                  Post
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ComposeMeow;
