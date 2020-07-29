/* eslint-disable no-undef */
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-native-device-info', () => {
  return {
    get: jest.fn(),
    hasNotch: jest.fn(),
  };
});

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
