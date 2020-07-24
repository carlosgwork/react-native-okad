/* eslint-disable no-undef */
import React from 'react';
import Loading from '@components/Loading';
import configureStore from 'redux-mock-store';
import {ThemeContext} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
};

describe('Loading Component', () => {
  it('renders null while state.loading is false', () => {
    const store = mockStore({
      loading: false,
    });
    const tree = renderer.create(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Loading />
        </ThemeContext.Provider>
      </Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders a loading component while state.loading is true', () => {
    const store = mockStore({
      loading: true,
    });
    const tree = renderer.create(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Loading />
        </ThemeContext.Provider>
      </Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
