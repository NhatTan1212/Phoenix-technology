import React, { useEffect } from 'react';

function MessengerChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.setAttribute('data-use-service-core', '');
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="elfsight-app-ae30d92d-90ff-443e-a17f-f34311108468" data-elfsight-app-lazy></div>
  );
}

export default MessengerChat;
