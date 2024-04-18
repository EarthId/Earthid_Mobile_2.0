import React, { useEffect } from 'react';
import { InteractionManager } from 'react-native';

const IdleTimer = ({ timeout, onIdle }) => {
  useEffect(() => {
    const interactionTimeout = setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        onIdle();
      });
    }, timeout);

    return () => {
      clearTimeout(interactionTimeout);
    };
  }, [timeout, onIdle]);

  return null;
};

export default IdleTimer;
