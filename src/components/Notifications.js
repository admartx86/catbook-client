import React from 'react';
import { usePersistedUser } from './usePersistedUser';

const Notfications = () => {
  usePersistedUser();
  return (
    <div>
      <h1>Notifications</h1>
      <p>
        Notification preview (placeholder) different depedning on type of notification... types?
        reply, like, retweet, follow
      </p>
      <p>
        Notification preview (placeholder) different depedning on type of notification... types?
        reply, like, retweet, follow
      </p>
      <p>
        Notification preview (placeholder) different depedning on type of notification... types?
        reply, like, retweet, follow
      </p>
    </div>
  );
};

export default Notfications;
