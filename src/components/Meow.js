import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MeowAuthorPhoto from './MeowAuthorPhoto';
import MeowHeader from './MeowHeader';
import MeowButtons from './MeowButtons';
import PlaceholderMeow from './PlaceholderMeow';

const placeholderMeow = {
  author: {
    _id: 'placeholder',
    username: 'placeholder',
    realName: 'placeholder',
    profilePhoto: 'placeholder'
  },
  createdAt: '',
  gifUrl: '',
  isAPlaceholder: true,
  isARemeow: false,
  isAReply: false,
  likedBy: [],
  meowText: '',
  meowMedia: '',
  embedMeow: null,
  repliedToAuthor: '',
  repliedToMeow: '',
  repliedBy: [],
  remeowedBy: []
};

const Meow = ({ meow: initialMeow, isEmbedded = false }) => {
  const navigate = useNavigate();

  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);

  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);
  const isEditing = useSelector((state) => state.meow.isEditing);

  const remeowedBy = useSelector((state) => {
    const specificMeow = state.meow.meows.find((m) => m._id === initialMeow._id);
    return specificMeow ? specificMeow.remeowedBy : [];
  });
  let username = useSelector((state) => state.user.username);

  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === initialMeow._id));

  const { meowText, meowMedia, gifUrl } = meow || {};

  let [dummyValue, setDummyValue] = useState(0);

  let authorPhoto, authorName, authorUsername;

  if (meow?.author) {
    authorPhoto = meow?.author?.profilePhoto;
    authorName = meow?.author?.realName;
    authorUsername = meow?.author?.username;
  }

  const forceRerender = () => {
    setDummyValue((prevDummyValue) => prevDummyValue + 1);
  };

  useEffect(() => {
    forceRerender();
  }, []);
  //meow, remeowedBy

  useEffect(() => {
    if (meow?.embeddedMeow) {
      const fetchEmbeddedMeow = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/meows/${meow.embeddedMeow}`
          );
          setEmbeddedMeowData(response.data);
        } catch (error) {
          console.error('Error fetching embedded meow:', error);
          setEmbeddedMeowData(placeholderMeow);
        }
      };
      fetchEmbeddedMeow();
    }
  }, []);
  //meow

  const renderMedia = (meowMedia) => {
    if (meowMedia) {
      const extension = meowMedia.split('.').pop().toLowerCase();
      const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'm4v'];
      const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      if (videoTypes.includes(extension)) {
        return (
          <video controls className="w-[25vw] p-5">
            <source src={meowMedia} type={`video/${extension}`} />
          </video>
        );
      }
      if (imageTypes.includes(extension)) {
        return <img className="w-[25vw] p-5" src={meowMedia} alt="Media" />;
      }
    }
  };

  const shouldDisplayButtons = () => {
    if (
      (isEmbedded && (meow?.meowText || meow?.meowMedia)) ||
      isReplying ||
      isRemeowing ||
      isEditing ||
      meow?.isAPlaceholder
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="bg-white p-7">
      {!meow?.isAPlaceholder ? (
        <div 
        onClick={() => {navigate(`/${authorUsername}/status/${meow?._id}`);}}
        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          <div>
            <div className="flex ">
              <MeowAuthorPhoto
                authorPhoto={meow.author.profilePhoto}
                authorUsername={meow.author.username}
              />
              <div className="flex">
                <div className="p-7 flex gap-2 sm:gap-2 md:gap-4 lg:gap-6 xl:gap-8">
                  <div className="flex flex-col">
                    <MeowHeader
                      authorName={meow?.author?.realName}
                      authorUsername={meow?.author?.username}
                      createdAt={meow?.createdAt}
                      meow={meow}
                      repliedToAuthor={meow.repliedToAuthor}
                    />  
                    <div>
                      
                      <div className='flex flex-col'>
                        
                        <div className='flex flex-col xl:flex-row'>
                          <div className='flex 1 max-w-[40vw] break-all p-5'>
                            <p className='text-2xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl'>
                              {meowText || ''}</p>
                          </div>
                          <div className='flex flex-1 
                          justify-center justify-items-center content-center place-content-center place-items-center justify-self-center items-center align-middle self-center place-self-center'>
                            {gifUrl ? 
                            <img src={gifUrl} alt="GIF" width="200" 
                            className='w-[25vw] p-5
                            justify-center justify-items-center content-center place-content-center place-items-center justify-self-center items-center align-middle self-center place-self-center'
                            /> 
                            : null}
                          </div>
                          <div className=''>
                            {renderMedia(meowMedia)}
                          </div>
                        </div>
                        
                        <div className='flex flex-col xl:flex-row'>
                          {embeddedMeowData ? (
                          <div className='border-4 border-slate-200 rounded-lg p-5'>
                            <Meow 
                              meow={embeddedMeowData} 
                              isEmbedded={true} />
                          </div>
                          ) : 
                          meow?.isARemeow && !embeddedMeowData ? (
                          <div className='border-4 border-slate-200 rounded-lg p-5'>
                            <PlaceholderMeow 
                            meow={meow} 
                            isEmbedded={meow.isEmbedded} />
                          </div>
                          ) : null}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {shouldDisplayButtons() ? (
              <MeowButtons
                meow={meow}
                isARemeow={meow.isARemeow}
                embeddedMeow={meow.embeddedMeow}
              />
            ) : null}
          </div>
        </div>
        ) : (
        <PlaceholderMeow 
        meow={meow} 
        isEmbedded={meow.isEmbedded} />
      )}
    </div>
  );
};

export default Meow;

Meow.defaultProps = {
  meow: {
    createdAt: '',
    meowText: '',
    meowMedia: '',
    embedMeow: null,
    author: {
      profilePhoto: '',
      realName: '',
      username: ''
    }
  }
};
