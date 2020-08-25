import { NativeModules } from 'react-native';

type AndroidSmsVerificationType = {
  multiply(a: number, b: number): Promise<number>;
};

const { AndroidSmsVerification } = NativeModules;

export default AndroidSmsVerification as AndroidSmsVerificationType;
