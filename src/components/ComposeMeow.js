import React, { useState, useRef, useEffect } from 'react';
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
import clearSelectionIcon from '../img/remove-button.png';

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

  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const username = useSelector((state) => state.user.username);
  const realName = useSelector((state) => state.user.realName);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const showEditForm = useSelector((state) => state.meow.showEditForm);

  const isReplying = useSelector((state) => state.reply.isReplying);

  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedGifUrl, setSelectedGifUrl] = useState(null); //new

  // const [isSelectingGif, setIsSelectingGif] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');
  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [cols, setCols] = useState(50);
  const [rows, setRows] = useState(15);

  // const [isSelectingGif, setIsSelectingGif] = useState(false);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [remainingCharacters, setRemainingCharacters] = useState(280);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;

      if (width <= 640) {
        setCols(30);
        setRows(10);
      } else if (width <= 768) {
        setCols(40);
        setRows(10);
      } else if (width <= 1024) {
        setCols(50);
        setRows(14);
      } else {
        setCols(60);
        setRows(14);
      }
    };

    // Update cols when the component mounts
    updateCols();

    // Add the event listener
    window.addEventListener('resize', updateCols);

    // Cleanup: Remove the event listener
    return () => {
      window.removeEventListener('resize', updateCols);
    };
  }, []); // The empty dependency array means this effect will run once when the component mounts

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedGifUrl]);

  useEffect(() => {
    console.log('selectedGifUrl:', selectedGifUrl);
    console.log('selectedGif:', selectedGif);
  }, [selectedGifUrl, selectedGif]);

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
    if (selectedGifUrl) {
      const cleanedGifUrl = selectedGifUrl.split('?')[0];
      formData.append('gifUrl', cleanedGifUrl);
    }
    if (isAReply) {
      formData.append('isAReply', true);
      formData.append('replyToMeowId', originalMeowId); //??!!
    }
    if (isARemeow) {
      formData.append('isARemeow', true);
      formData.append('remeowToMeowId', originalMeowId); //??!!
      if (!meowText && !selectedFile) {
        formData.append('isADirectRemeow', true);
      } else {
        formData.append('isADirectRemeow', false);
      }
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    } //debug
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
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

  const openGifSelect = () => {
    setIsSelectingGif(true);
  };

  const closeGifSelect = () => {
    setIsSelectingGif(false);
  };

  const clearSelectedGif = () => {
    setSelectedGifUrl(null);
  };

  console.log('Original Meow ID:', originalMeowId); //debug
  console.log('isEditing:', isEditing); //debug
  console.log('isReplying:', isReplying); //debug
  console.log('showEditForm:', showEditForm); //debug
  console.log('originalMeow:', originalMeow); //debug
  console.log('embeddedMeowData:', embeddedMeowData); //debug

  return (
    <div>
      <div className="flex flex-col p-5 m-5">
        <div
          className="flex flex-shrink-0
      gap-5"
        >
          <div className="">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={'Profile Photo'}
                className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
              />
            ) : (
              <img
                src="https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png"
                className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
              />
            )}

            <div
              className="flex flex-shrink-0 justify-center p-2
          text-md sm:text-md md:text-lg lg:text-lg xl:text-xl"
            >
              {remainingCharacters}
            </div>
          </div>
          {/* <div className="flex flex-col pt-5 min-w-300 max-w-full"> */}

          <div className="flex flex-col lg:flex-row">
            <textarea
              ref={inputRef}
              placeholder={
                isAReply ? 'Post your reply' : isARemeow ? 'Add a comment...' : "What's happening?"
              }
              value={meowText}
              rows={rows}
              cols={cols}
              fullWidth
              onChange={(e) => {
                if (e.target.value.length <= 280) {
                  setMeowText(e.target.value);
                }
              }}
              className="overflow-y-auto resize-none focus:outline-none 
              text-md sm:text-md md:text-lg lg:text-lg xl:text-xl"
            />{' '}
            {/* <div className='relative'>
            {selectedGifUrl && (
              <>
                <img src={selectedGifUrl} alt="Selected GIF" className="w-full p-5 object-cover" />

                <button
                  onClick={clearSelectedGif}
                  title="Clear Selected GIF"
                  className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                >
                  <img src={clearSelectionIcon} alt="Clear Selected GIF" className="w-10" />
                </button>
              </>
            )}
          
</div>
<div className='relative'>
          
            {previewUrl && (
              <>
                {previewUrl.startsWith('data:image/') ? (
                  <img src={previewUrl} alt="Selected Media" className="w-full p-5 object-cover" />
                ) : (
                  <video controls width="200">
                    <source
                      src={previewUrl}
                      alt="SelectedMedia"
                      type="video/mp4"
                      className="w-full p-5 rounded-lg"
                    />
                  </video>
                )}
                <button
                  onClick={clearSelectedFile}
                  title="Clear Selected Media"
                  className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                >
                  <img src={clearSelectionIcon} alt="Clear Selected Media" className="w-10" />
                </button>
              </>
            )}
     </div>      */}
            <div className="flex flex-col lg:flex-row">
              {(selectedGifUrl || previewUrl) && ( // Conditionally render the flex container
                <>
                  {selectedGifUrl && (
                    <div className={`flex-1 relative ${previewUrl ? '' : 'lg:flex-grow'}`}>
                      <button
                        onClick={clearSelectedGif}
                        title="Clear Selected GIF"
                        className="absolute top-5 right-5 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                      >
                        <img src={clearSelectionIcon} alt="Clear Selected GIF" className="w-10" />
                      </button>
                      <img
                        src={selectedGifUrl}
                        alt="Selected GIF"
                        className="w-full p-5 max-w-md"
                      />
                    </div>
                  )}
                  {previewUrl && (
                    <div className={`flex-1 relative ${selectedGifUrl ? '' : 'lg:flex-grow'}`}>
                      {previewUrl.startsWith('data:image/') ? (
                        <div>
                          <img
                            src={previewUrl}
                            alt="Selected Media"
                            className="w-full p-5 max-w-lg"
                          />
                          <button
                            onClick={clearSelectedFile}
                            title="Clear Selected Media"
                            className="absolute top-5 right-5 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                          >
                            <img
                              src={clearSelectionIcon}
                              alt="Clear Selected Media"
                              className="w-10"
                            />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <video controls className="w-full p-5 rounded-lg">
                            <source src={previewUrl} alt="SelectedMedia" type="video/mp4" />
                          </video>
                          <button
                            onClick={clearSelectedFile}
                            title="Clear Selected Media"
                            className="absolute top-5 right-5 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                          >
                            <img
                              src={clearSelectionIcon}
                              alt="Clear Selected Media"
                              className="w-10"
                            />
                          </button>
                        </div>
                      )}
                      {/* <button
                  onClick={clearSelectedFile}
                  title="Clear Selected Media"
                  className="absolute top-5 right-5 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                >
                  <img src={clearSelectionIcon} alt="Clear Selected Media" className="w-10" />
                </button> */}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* </div> */}
        </div>

        <div>
          <div className="relative flex justify-start px-5"></div>

          <div className="relative flex justify-start px-5"></div>
        </div>

        {isARemeow && originalMeow && (
          <div className="originalMeowEmbed">
            <Meow meow={originalMeow} isEmbedded={true} />
          </div>
        )}

        <div className="flex flex-col">
          <div>
            {!isEditing && isSelectingGif ? (
              <button
                onClick={closeGifSelect}
                className="bg-purple-400 text-white rounded-full px-4 py-2 my-4 hover:scale-110 transition-all ease-in-out duration-200"
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

        <div>
          {isEditing ? <p>{renderMedia(meowMedia)}</p> : null}
          {isEditing && originalMeow && embeddedMeowData ? (
            <div className="border-4 border-slate-200 rounded-lg p-5">
              <Meow meow={embeddedMeowData} isEmbedded={true} />
            </div>
          ) : null}
        </div>

        <div className="flex p-2 gap-8 sm:gap-10 md:p-4 md:gap-12 lg:gap-14 xl:gap-16">
          <div className="flex">
            {isEditing || isSelectingGif ? null : (
              <div>
                <input type="file" id="fileInput" className="hidden" onChange={onFileChange} />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <img
                    src={mediaIcon}
                    alt="Add Media"
                    title="Add Media"
                    className="align-center w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 hover:scale-110 transition-all ease-in-out duration-200"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex">
            {!isEditing && !isSelectingGif ? (
              <button onClick={openGifSelect}>
                <img
                  src={gifIcon}
                  alt="Add GIF"
                  title="Add GIF"
                  className="align-center w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 hover:scale-110 transition-all ease-in-out duration-200"
                />
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <button
              onClick={() => onUpdateMeow()}
              className="bg-purple-400 text-white rounded-full px-8 py-2 hover:scale-110 transition-all ease-in-out duration-200"
            >
              Post Changes
            </button>
          ) : (
            !isSelectingGif && (
              <button
                onClick={() => {
                  console.log('Button Clicked');
                  onCreateMeow();
                }}
                className="bg-purple-400 text-white 
              rounded-full px-4 py-2
              hover:scale-110 transition-all ease-in-out duration-200
              text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
              >
                Post
              </button>
            )
          )}
        </div>
      </div>
      {!isEditing && !isReplying ? (
        <>
          <hr className="border-2 border-slate-200 " />
        </>
      ) : null}
    </div>
  );
};

export default ComposeMeow;
