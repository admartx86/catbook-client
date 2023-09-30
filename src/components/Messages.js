import React from 'react';
import { usePersistedUser } from './usePersistedUser';

const Messages = () => {
  usePersistedUser();

  return (
    <div>
      <h1>Messages</h1>
      <button>Compose</button>
      <p>
        Message preview (placeholder) Name, Username, date or time since sent Meow preview (first
        few words.)
      </p>
      <p>
        Message preview (placeholder) Name, Username, date or time since sent Meow preview (first
        few words.)
      </p>
      <p>
        Message preview (placeholder) Name, Username, date or time since sent Meow preview (first
        few words.)
      </p>
    </div>
  );
};

export default Messages;
