import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import type { EmitterSubscription } from 'react-native';

interface UseSmsRetriver {
  message: string;
  timeout: boolean;
  startListener: () => void;
  stopListener: () => void;
}

const useSmsRetriver = (): UseSmsRetriver => {
  const { AndroidSmsVerification } = NativeModules;
  const [message, setMessage] = useState('');
  const [timeout, setTimeout] = useState(false);
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
    const onReceiverTimeout = eventEmitter.addListener(
      'onReceiverTimeout',
      () => setTimeout(true)
    );

    return () => {
      onStartListener?.remove();
      onRegisterListener?.remove();
      onUnregisterListener?.remove();
      onReceiverTimeout?.remove();
    };
  }, [eventEmitter]);

  const startListener = useCallback((): void => {
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
    if (Platform.OS === 'android') {
      try {
        AndroidSmsVerification.unRegisterBroadcastReceiver();
        listenerRef.current?.remove();
      } catch (error) {
        console.error(error);
      }
    }
  }, [AndroidSmsVerification]);

  return { message, timeout, startListener, stopListener };
};

export default Platform.OS === 'android'
  ? useSmsRetriver
  : () =>
      ({
        message: '',
        timeout: false,
        startListener: () => {},
        stopListener: () => {},
      } as UseSmsRetriver);
