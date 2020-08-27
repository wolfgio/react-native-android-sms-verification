import { useState, useRef, useCallback } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import type { EmitterSubscription } from 'react-native';

export const useBroadcastReceiver = () => {
  const { AndroidSmsVerification } = NativeModules;
  const [message, setMessage] = useState('');
  const listenerRef = useRef<EmitterSubscription>();

  const starListener = useCallback((): void => {
    try {
      AndroidSmsVerification.registerBroadcastReceiver();
      AndroidSmsVerification.startBroadcastReceiver();

      const eventEmitter = new NativeEventEmitter(AndroidSmsVerification);
      listenerRef.current = eventEmitter.addListener(
        'onMessageReceived',
        (event) => {
          setMessage(event);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }, [AndroidSmsVerification]);

  const stopListener = useCallback((): void => {
    try {
      AndroidSmsVerification.unRegisterBroadcastReceiver();
      listenerRef.current?.remove();
    } catch (error) {
      console.error(error);
    }
  }, [AndroidSmsVerification]);

  return { message, starListener, stopListener };
};
