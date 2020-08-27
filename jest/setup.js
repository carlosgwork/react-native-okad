/* eslint-disable no-undef */
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'react-native-gesture-handler/jestSetup';
import {NativeModules} from 'react-native';

jest.mock('react-native-device-info', () => {
  return {
    get: jest.fn(),
    hasNotch: jest.fn(),
  };
});

jest.mock('@react-native-community/google-signin', () => {
  const mockGoogleSignin = require.requireActual(
    '@react-native-community/google-signin',
  );
  mockGoogleSignin.GoogleSignin.hasPlayServices = () => Promise.resolve(true);
  mockGoogleSignin.GoogleSignin.configure = () => Promise.resolve();
  mockGoogleSignin.GoogleSignin.currentUserAsync = () => {
    return Promise.resolve({
      name: 'name',
      email: 'test@example.com',
      // .... other user data
    });
  };

  // ... and other functions you want to mock
  return mockGoogleSignin;
});

NativeModules.RNGoogleSignin = {
  BUTTON_SIZE_ICON: 0,
  BUTTON_SIZE_STANDARD: 0,
  BUTTON_SIZE_WIDE: 0,
  BUTTON_COLOR_AUTO: 0,
  BUTTON_COLOR_LIGHT: 0,
  BUTTON_COLOR_DARK: 0,
  SIGN_IN_CANCELLED: '0',
  IN_PROGRESS: '1',
  PLAY_SERVICES_NOT_AVAILABLE: '2',
  SIGN_IN_REQUIRED: '3',
  configure: jest.fn(),
  currentUserAsync: jest.fn(),
};

export {NativeModules};


jest.mock('@react-navigation/native', () => ({
  useNavigation: () => jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

/**
 * Set up DOM in node.js environment for Enzyme to mount to
 */
const {JSDOM} = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const {window} = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

const originalConsoleError = console.error;
console.error = (message) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};

/**
 * Set up Enzyme to mount to DOM, simulate events,
 * and inspect the DOM in tests.
 */
configure({adapter: new Adapter()});
