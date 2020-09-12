import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

type Props = {
  leftIconContent?: React.ReactElement;
  rightIconContent?: React.ReactElement;
  title: string;
  btnStyle?: object;
  containerStyle?: object;
  textStyle?: object;
  onPress?: () => any;
};

export default React.memo<Props>(function AppGradButton(props: Props) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const {
    leftIconContent = null,
    rightIconContent = null,
    onPress,
    title,
    btnStyle,
    containerStyle,
    textStyle,
  } = props;

  return (
    <TouchableOpacity
      style={{...styles.container, ...containerStyle}}
      onPress={onPress}>
      <LinearGradient
        style={{...styles.btn, ...btnStyle}}
        start={{x: 1.0, y: 0.0}}
        end={{x: 0.0, y: 0.0}}
        locations={[0.7, 0.2]}
        colors={[themeStyle.purple, themeStyle.lightPurple]}>
        {leftIconContent && (
          <View style={styles.iconCont}>{leftIconContent}</View>
        )}
        <View style={styles.textContainer}>
          <Text style={{...styles.text, ...textStyle}}>{title}</Text>
        </View>
        {rightIconContent && (
          <View style={styles.rightIconCont}>{rightIconContent}</View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    backgroundColor: themeStyle.backgroundWhite,
    borderRadius: themeStyle.scale(40),
  },
  btn: {
    flexDirection: 'row',
    paddingLeft: themeStyle.scale(10),
    paddingRight: themeStyle.scale(30),
    paddingVertical: themeStyle.scale(5),
    borderRadius: themeStyle.scale(20),
    ...themeStyle.viewCentered,
  },
  iconCont: {
    marginRight: themeStyle.scale(9),
  },
  rightIconCont: {
    marginLeft: -10,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textWhite',
      font: 'anSemiBold',
      size: 14,
    }),
    letterSpacing: 2,
    alignSelf: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
    paddingRight: 20,
  },
});
