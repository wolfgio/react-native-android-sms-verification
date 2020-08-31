import * as React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useSmsRetriver } from 'react-native-android-sms-verification';

export default function App() {
  const { message, startListener, stopListener } = useSmsRetriver();
  const [code, setCode] = React.useState('');

  React.useEffect(() => {
    const result = message.match('(\\d{6})');

    if (result) {
      setCode(result[0]);
    }
  }, [message]);

  React.useEffect(() => {
    startListener();

    return () => stopListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text>SMS will automatically fill this input</Text>
      <TextInput style={styles.input} placeholder="CODE" value={code} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 300,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#333',
    marginTop: 16,
  },
});
