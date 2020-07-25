import * as React from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';

import {useStyles} from '@global/Hooks';

type Props = {
  leftIconContent?: React.ReactElement;
  onPress?: () => any;
  children: React.ReactElement;
  style?: ViewStyle;
};

export default React.memo<Props>(function AppTextButton(props: Props) {
  const {styles} = useStyles(getStyles);

  const {
    leftIconContent = null,
    onPress,
    children,
    style: extendStyles,
  } = props;

  return (
    <TouchableOpacity
      style={[styles.container, extendStyles]}
      onPress={onPress}>
      {leftIconContent && (
        <View style={styles.iconCont}>{leftIconContent}</View>
      )}
      {children}
    </TouchableOpacity>
  );
});

const getStyles = () => ({
  container: {},
  iconCont: {
    marginRight: 10,
  },
});
