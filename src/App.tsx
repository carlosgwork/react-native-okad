import * as React from 'react';
import {StatusBar, StatusBarStyle, Text} from 'react-native';
import {Provider} from 'react-redux';
import {Loading, Toast} from '@root/components';
import Routes from '@routes/index';
import store from '@redux/store';
import {ThemeContext} from '@global/Context';
import getThemeStyle, {Theme} from '@root/utils/styles';
import NetInfo from '@react-native-community/netinfo';

import {ApolloProvider} from '@apollo/client';
import makeApolloClient from './apollo';
import {setAction} from './redux/actions';

export default function App() {
  const [theme, setTheme] = React.useState<Theme>('normal');
  const currentTheme = React.useMemo(
    () => ({setTheme, theme, themeStyle: getThemeStyle(theme)}),
    [theme],
  );
  const [client, setClient] = React.useState<any>(null);
  const [isOnline, setIsOnline] = React.useState<boolean>(true);

  NetInfo.addEventListener((state) => {
    console.log('---- state.isInternetReachable: ', state.isInternetReachable);
    if (isOnline !== !!state.isInternetReachable) {
      setIsOnline(!!state.isInternetReachable);
      setAction('network', {online: !!state.isInternetReachable});
      console.log('---- now is online: ', !!state.isInternetReachable);
    }
  });
  const fetchSession = async () => {
    // fetch session
    const cc = makeApolloClient(
      'uoLzq7KMFjjY9gjAqMtMaxVHo1BORUeQZQYIN3sObGOLifkz0qDgJPqvvNCU0DGT',
    );
    setClient(cc);
  };
  React.useEffect(() => {
    fetchSession();
  }, []);
  if (!client) {
    return <Text>Waiting</Text>;
  }
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </Provider>
  );
}
