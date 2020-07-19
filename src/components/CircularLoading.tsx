import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useStyles} from '@global/Hooks';

type Props = {
  loading: boolean;
};

export default React.memo<Props>(function CircularLoading({loading}: Props) {
  const {styles} = useStyles(getStyles);
  if (!loading) {
    return null;
  }
  return <ActivityIndicator animating size="large" style={styles.loader} />;
});

const getStyles = () => ({
  loader: {
    marginTop: 25,
    marginBottom: 25,
  },
});
