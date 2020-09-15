import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import type { EmitterSubscription } from 'react-native';

export default () => {
  const AndroidSmsVerification =
    Platform.OS === 'android' ? NativeModules.AndroidSmsVerification : null;
  const [message, setMessage] = useState('');
  const listenerRef = useRef<EmitterSubscription>();
  const eventEmitter = useMemo(
    () => new NativeEventEmitter(AndroidSmsVerification),
    [AndroidSmsVerification]
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
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
    }

    return () => null;
  }, [eventEmitter]);

  const startListener = useCallback((): void => {
    if (Platform.OS === 'android') {
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
    }
  }, [AndroidSmsVerification, eventEmitter]);

  const stopListener = useCallback((): void => {
    if (Platform.OS === 'android') {
      try {
        AndroidSmsVerification.unRegisterBroadcastReceiver();
        listenerRef.current?.remove();
      } catch (error) {
        console.error(error);
      }
    }
  }, [AndroidSmsVerification]);

  return { message, startListener, stopListener };
};
