import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

type AndroidSmsVerificationType = {
  multiply(a: number, b: number): Promise<number>;
};

const { AndroidSmsVerification } = NativeModules;

export const useBroadcastReceiver = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(AndroidSmsVerification);
    const listener = eventEmitter.addListener('onMessageReceived', (event) => {
      setMessage(event);
    });

    return () => listener.remove();
  }, []);

  return { message };
};

export default AndroidSmsVerification as AndroidSmsVerificationType;
