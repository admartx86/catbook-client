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
  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedGifUrl, setSelectedGifUrl] = useState(null); //new

  // const [isSelectingGif, setIsSelectingGif] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [meowText, setMeowText] = useState('');
  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  // const [isSelectingGif, setIsSelectingGif] = useState(false);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [remainingCharacters, setRemainingCharacters] = useState(280);

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
  console.log('showEditForm:', showEditForm); //debug
  console.log('originalMeow:', originalMeow); //debug
  console.log('embeddedMeowData:', embeddedMeowData); //debug

  // prettier-ignore
  return (
    
    // <div className="border border-2 border-red-500">
    <div className= 'flex flex-col p-5 m-5' >
     
     
     
     <div className='flex gap-4'>
     
     <div>
      <img
      src={profilePhoto}
      alt={'Profile Photo'}
      className="rounded-full w-16 h-16"
      />
      {/* {isEditing ? (
      <div>
          <div>
            {realName}
          </div> 
          <div>
            @{username}
          </div>
      </div>
      ) : null} */}

</div>
      <div className='flex flex-col pt-5 min-w-300 max-w-full'>

      <div className='flex'>
      <textarea
        ref={inputRef}
        // type="text"
        placeholder={
          isAReply ? 'Post your reply' : isARemeow ? 'Add a comment...' : "What's happening?"
        }
        value={meowText}
        rows='13'
        fullWidth
        onChange={(e) => setMeowText(e.target.value)}
        className="overflow-y-auto resize-none w-full focus:outline-none"
      />{' '}
      </div>
      
      
      
      <div className='flex justify-end pr-2'>{remainingCharacters}</div>
      

      </div>



      </div>


<div>      

<div className="relative flex justify-start px-5">
<div className='relative flex justify-start'>

  {selectedGifUrl && (
        <>
      
          <img src={selectedGifUrl} alt="Selected GIF" className='w-full p-5' />
        
          <button onClick={clearSelectedGif} 
          
            title='Clear Selected GIF'
        className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4">
          
            <img src={clearSelectionIcon} alt="Clear Selected GIF" className='w-10'/>
            </button>
        </>
      )}
</div>
</div>

      
      <div className="relative flex justify-start px-5">

        <div className='relative flex justify-start'>

        
  {previewUrl && (
    <>
      {previewUrl.startsWith('data:image/') ? (
        <img src={previewUrl} alt="Selected Media" className='w-full p-5 rounded-lg'
        // className="absolute top-0 left-0"
        // className="w-full object-cover"
        />
      ) : (
        <video controls width="200">
          <source src={previewUrl} alt="SelectedMedia" type="video/mp4" 
          // className="absolute top-0 left-0"
          className="w-full p-5 rounded-lg"
          />
          </video>
      )}
      <button 
        onClick={clearSelectedFile} 
        title='Clear Selected Media'
        className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
      >
        <img src={clearSelectionIcon} alt="Clear Selected Media" className='w-10'/>
      </button>
    </>
  )}


  </div>

  </div>


</div>

{isARemeow && originalMeow && (
        <div className="originalMeowEmbed">
          <Meow meow={originalMeow} isEmbedded={true} />
        </div>
      )}

  <div className='flex flex-col'>

    <div>
{ 
      !isEditing && isSelectingGif ? ( 
        
          <button onClick={closeGifSelect}
          className='bg-purple-400 text-white rounded-full px-4 py-2 my-4 hover:scale-110 transition-all ease-in-out duration-200'>
            Close GIF Select
            </button>
        ) : null
    }

</div>

<div>
{isSelectingGif ? (
        <Gif setSelectedGifUrl={setSelectedGifUrl} setIsSelectingGif={setIsSelectingGif} />
      ) : null}

</div>

</div>
      
      
      
      <div>
        {isEditing ? <p>{renderMedia(meowMedia)}</p> : null}
        {isEditing && originalMeow && embeddedMeowData ? 
      <Meow meow={embeddedMeowData} isEmbedded={true}/> 
      : null}
      </div>



      <div className="flex gap-5 p-3">

      <div>

      {/* {isEditing || previewUrl !== '' || isSelectingGif ? null : ( */}
{isEditing || isSelectingGif ? null : (


<div>
  {/* Hidden file input */}
  <input
    type="file"
    id="fileInput"
    className="hidden"
    onChange={onFileChange}
  />
  
 
  {/* Button-like label for the hidden file input */}
  <label
    htmlFor="fileInput"
    className="cursor-pointer"
    // className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
  >
    <img src={mediaIcon} alt="Add Media" title='Add Media' className='w-8 hover:scale-110 transition-all ease-in-out duration-200'/>
  </label>
</div>
      )
    }

</div>


      {/* <div>
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
      </div> */}

<div clasName="flex">

     
      {!isEditing && !isSelectingGif ? ( 
          <button onClick={openGifSelect}>
            <img src={gifIcon} alt="Add GIF" title='Add GIF' className='w-8 hover:scale-110 transition-all ease-in-out duration-200'/>
            </button>
        ) : null
    
      }

      {/* { 
      !isEditing ? ( 
        !isSelectingGif ? (
          <button onClick={openGifSelect}>
            <img src={gifIcon} alt="Add GIF" className='w-6'/>
            </button>
        ) : (
          <button onClick={closeGifSelect}>
            Close GIF Select
            </button>
        )
      ) : null
    } */}
      

   
      
</div>  
  
    {/* {isEditing || previewUrl !== '' || isSelectingGif ? null : (
      <input type="file" ref={fileInputRef} onChange={onFileChange} />
    )} */}


      {isEditing ? (
      <button onClick={() => onUpdateMeow()}
      className='bg-purple-400 text-white rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200'> 
      Post Changes 
      </button>
    ) : (
      !isSelectingGif && (
        <button
          onClick={() => {
            console.log('Button Clicked');
            onCreateMeow();
          }}
          className='bg-purple-400 text-white rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200'
        >
          Post
        </button>
      )
    )}
    </div>
          <hr/>
    </div>
          
  );
};

export default ComposeMeow;
