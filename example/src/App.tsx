import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AndroidSmsVerification, {
  useBroadcastReceiver,
} from 'react-native-android-sms-verification';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  const { message } = useBroadcastReceiver();

  React.useEffect(() => {
    AndroidSmsVerification.multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
