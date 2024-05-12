import React from 'react';
import ElfisghtWidget from 'react-elfsight-widget';

function MessengerChat() {
  return (
    <div>
      <ElfisghtWidget
        src="https://static.elfsight.com/platform/platform.js"
        data-use-service-core
        data-elfsight-app-lazy
        appId="ae30d92d-90ff-443e-a17f-f34311108468"
      />
    </div>
  );
}

export default MessengerChat;
