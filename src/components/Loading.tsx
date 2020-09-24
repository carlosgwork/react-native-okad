//@flow

import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';

type Props = {};

export default React.memo<Props>(function Loading() {
  const {styles} = useStyles(getStyles);
  const loading = useSelector((state: any) => state.loading.state);

  if (!loading) {
    return null;
  }
  return (
    <View style={styles.main}>
      <ActivityIndicator animating size="large" style={styles.loader} />
    </View>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  main: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 9999999,
  },
  logo: {
    width: themeStyle.window.width * 0.6,
  },
});
