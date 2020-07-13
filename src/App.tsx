import * as React from 'react';
import {StatusBar, StatusBarStyle} from 'react-native';

import {Provider} from 'react-redux';
import {Loading, Toast} from '@root/components';
import Routes from '@routes/index';
import store from '@redux/store';
import {ThemeContext} from '@global/Context';
import getThemeStyle, {Theme} from '@root/utils/styles';

// if (!__DEV__) {
// }

export default function App() {
  const [theme, setTheme] = React.useState<Theme>('normal');
  const currentTheme = React.useMemo(
    () => ({setTheme, theme, themeStyle: getThemeStyle(theme)}),
    [theme],
  );
  return (
    <Provider store={store}>
      <ThemeContext.Provider value={currentTheme}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle={currentTheme.themeStyle.statusBarStyle as StatusBarStyle}
          translucent={true}
        />
        <Loading />
        <Toast />
        <Routes />
      </ThemeContext.Provider>
    </Provider>
  );
}
