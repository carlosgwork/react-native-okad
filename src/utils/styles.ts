import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const defaultColors = {
  backgroundWhite: '#FFFFFF',
  backgroundGray1: '#D8D8D8',

  purple: '#5D396E',
  lightPurple: '#9E5FC2',
  gray: '#9b9b9b',
  gray1: '#D8D8D8',
  white: '#ffffff',
  black: '#000000',
  black50: 'rgba(0, 0, 0, .75)',
  orange: '#FFA500',
  textBlack: '#000000',
  textBlack1: '#3D3D3D',
  textBlack2: '#55465F',
  textPurple: '#5D396E',
  textBlue: '#5E79DC',
  textWhite: '#FFF',
  textGray: '#979797',
  textLightPurple: '#855C9C',
  lightBlue: '#add8e6',
  lightPurple10: 'rgba(158, 95, 194, 0.1)',
  lightBorderColor: '#C6C6C8',
};

function getThemeColors(theme: Theme): AppColors {
  switch (theme) {
    case 'normal':
    default:
      return defaultColors;
  }
}

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;
const hasNotch = DeviceInfo.hasNotch();
const iPhoneX = Platform.OS === 'ios' && (height === 812 || height === 896);

const fonts = {
  anBold: 'AvenirNextLTPro-Bold',
  anSemiBold: 'AvenirNextLTPro-Demi',
  anItalic: 'AvenirNextLTPro-It',
  anRegular: 'AvenirNextLTPro-Regular',
};

const scale = (value: number) => {
  return value;
};

const textSizes: {
  [_: number]: {
    fontSize: number;
    letterSpacing: number;
    lineHeight: number;
    height: number;
  };
} = {
  [9]: {
    fontSize: scale(9),
    letterSpacing: scale(0.3),
    lineHeight: scale(10),
    height: scale(10),
  },
  [10]: {
    fontSize: scale(10),
    letterSpacing: scale(0.5),
    lineHeight: scale(10),
    height: scale(10),
  },
  [11]: {
    fontSize: scale(11),
    letterSpacing: scale(0.5),
    lineHeight: scale(11),
    height: scale(11),
  },
  [12]: {
    fontSize: scale(12),
    letterSpacing: scale(0.5),
    lineHeight: scale(12),
    height: scale(12),
  },
  [14]: {
    fontSize: scale(14),
    letterSpacing: scale(0.3),
    lineHeight: scale(14),
    height: scale(14),
  },
  [16]: {
    fontSize: scale(16),
    letterSpacing: scale(0.3),
    lineHeight: scale(16),
    height: scale(16),
  },
  [18]: {
    fontSize: scale(18),
    letterSpacing: scale(0.3),
    lineHeight: scale(18),
    height: scale(18),
  },
  [20]: {
    fontSize: scale(20),
    letterSpacing: scale(0.3),
    lineHeight: scale(20),
    height: scale(20),
  },
  [24]: {
    fontSize: scale(24),
    letterSpacing: scale(0.3),
    lineHeight: scale(24),
    height: scale(24),
  },
  [26]: {
    fontSize: scale(26),
    letterSpacing: scale(0.5),
    lineHeight: scale(26),
    height: scale(26),
  },
  [30]: {
    fontSize: scale(30),
    letterSpacing: 0,
    lineHeight: scale(30),
    height: scale(30),
  },
  [34]: {
    fontSize: scale(34),
    letterSpacing: 0,
    lineHeight: scale(46),
    height: scale(46),
  },
  [40]: {
    fontSize: scale(40),
    letterSpacing: 0,
    lineHeight: scale(40),
    height: scale(40),
  },
};

const commonStyles = () => {
  const viewCentered = {alignItems: 'center', justifyContent: 'center'};
  return {
    backgroundImage: {height: '100%', width: '100%'},
    bottomButtonView: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
    },
    content: {flex: 1, paddingHorizontal: scale(20)},
    flexView: {flex: 1},
    fullImageBackground: {
      height,
      paddingHorizontal: scale(20),
      width,
    },
    viewCentered,
  };
};

const textStyle = (
  {color, font, size}: TextStyleInputs,
  colors: AppColors,
) => ({
  color: colors[color],
  fontFamily: fonts[font],
  fontSize: textSizes[size].fontSize,
  letterSpacing: textSizes[size].letterSpacing,
  lineHeight: textSizes[size].lineHeight,
  height: textSizes[size].height,
});

export default function getThemeStyle(theme: Theme) {
  const colors = getThemeColors(theme);
  const getTextStyle = (inputs: TextStyleInputs) => textStyle(inputs, colors);
  return {
    ...colors,
    ...commonStyles(),
    ...fonts,
    getTextStyle,
    hasNotch,
    iPhoneX,
    scale,
    statusBarStyle: theme === 'dark' ? 'light-content' : 'dark-content',
    window: {height, width},
  };
}

export type TextSizes =
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 18
  | 20
  | 24
  | 26
  | 30
  | 40;

export type TextStyleInputs = {
  color: ColorKeys;
  font: FontKeys;
  size: TextSizes;
};

type $Values<T> = T[keyof T];

export type AppColors = {
  [_ in ColorKeys]: ColorValues;
};
export type AppFonts = {
  [_ in FontKeys]: FontValues;
};
export type ColorKeys = keyof typeof defaultColors;
export type ColorValues = $Values<typeof defaultColors>;
export type FontKeys = keyof typeof fonts;
export type FontValues = $Values<typeof fonts>;
export type Theme = 'dark' | 'normal';
export type ThemeStyle = ReturnType<typeof getThemeStyle>;
