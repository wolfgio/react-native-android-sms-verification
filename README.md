# react-native-android-sms-verification

rn abstraction of Android SMS Verification API

[![CircleCI](https://circleci.com/gh/wolfgio/react-native-android-sms-verification.svg?style=svg)](https://circleci.com/gh/wolfgio/react-native-android-sms-verification) [![npm](https://img.shields.io/npm/v/react-native-android-sms-verification)](https://www.npmjs.com/package/react-native-android-sms-verification)

https://developers.google.com/identity/sms-retriever/overview

## Installation

```sh
npm install react-native-android-sms-verification
```

## Usage

```js
import { useBroadcastReceiver } from 'react-native-android-sms-verification';

const { message, starListener, stopListener } = useBroadcastReceiver();
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
