import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import type { EmitterSubscription } from 'react-native';

export const useBroadcastReceiver = () => {
  const { AndroidSmsVerification } = NativeModules;
  const [message, setMessage] = useState('');
  const listenerRef = useRef<EmitterSubscription>();
  const eventEmitter = useMemo(
    () => new NativeEventEmitter(AndroidSmsVerification),
    [AndroidSmsVerification]
  );

  useEffect(() => {
    const onStartListener = eventEmitter.addListener(
      'onListenerStarted',
      (event) => console.info(event)
    );
    const onRegisterListener = eventEmitter.addListener(
      'onReceiverRegistered',
      (event) => console.info(event)
    );
    const onUnregisterListener = eventEmitter.addListener(
      'onReceiverUnregistered',
      (event) => console.info(event)
    );

    return () => {
      onStartListener?.remove();
      onRegisterListener?.remove();
      onUnregisterListener?.remove();
    };
  }, [eventEmitter]);

  const starListener = useCallback((): void => {
    try {
      AndroidSmsVerification.registerBroadcastReceiver();
      AndroidSmsVerification.startBroadcastReceiver();
      listenerRef.current = eventEmitter.addListener(
        'onMessageReceived',
        setMessage
      );
    } catch (error) {
      console.error(error);
    }
  }, [AndroidSmsVerification, eventEmitter]);

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
