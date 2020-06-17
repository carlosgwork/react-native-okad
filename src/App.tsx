import * as React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Provider } from 'react-redux'
import { Loading, Toast } from '@components'
import Routes from '@routes/index'
import store from '@redux/store'
import { ThemeContext } from '@global/Context'
import getThemeStyle from '@utils/styles'

// if (!__DEV__) {
// }

export default function App() {
  const [theme, setTheme] = React.useState('normal');
  const currentTheme = React.useMemo(
    () => ({ setTheme, theme, themeStyle: getThemeStyle(theme) }),
    [theme]
  )
  return (
    <Provider store={store}>
      <ThemeContext.Provider value={currentTheme}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle={currentTheme.themeStyle.statusBarStyle}
          translucent={true}
        />
        <Loading />
        <Toast />
        <Routes />
      </ThemeContext.Provider>
    </Provider>
  )
}
