import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useStyles} from '@global/Hooks';

type Props = {};

export default React.memo<Props>(function CircularLoading() {
  const {styles} = useStyles(getStyles);

  return (
    <View style={styles.emptyContainer}>
      <ActivityIndicator animating size="large" style={styles.loader} />
    </View>
  );
});

const getStyles = () => ({
  emptyContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 9999999,
  },
});
