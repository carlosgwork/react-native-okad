import React from 'react';
import Toast from '@components/Toast';
import configureStore from 'redux-mock-store';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('Toast Component', () => {
  it('renders null if text value is empty', () => {
    const store = mockStore({
      toast: {
        type: 'success',
        text: '',
      },
    });
    const tree = renderer.create(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Toast />
        </ThemeContext.Provider>
      </Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders a success toast', () => {
    const store = mockStore({
      toast: {
        type: 'success',
        text: 'Success!',
      },
    });
    const tree = renderer.create(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Toast />
        </ThemeContext.Provider>
      </Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders a failed toast', () => {
    const store = mockStore({
      toast: {
        type: 'danger',
        text: 'Failed!',
      },
    });
    const tree = renderer.create(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Toast />
        </ThemeContext.Provider>
      </Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
