import { Dimensions, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const defaultColors = {
  backgroundPrimary: '#FFFFFF',
  black: '#000000',
  black50: 'rgba(0, 0, 0, .75)',
  
  textBlack: '#000000',
  themePrimary: '#100D32',
}

function getThemeColors(theme: Theme): AppColors {
  switch (theme) {
    case 'normal':
      return {
        backgroundPrimary: '#FFFFFF',
        black: '#000000',
        black50: 'rgba(0, 0, 0, .75)',
        
        textBlack: '#000000',
        themePrimary: '#100D32',
      }
    case 'normal':
    default:
      return defaultColors
  }
}

const width: number = Dimensions.get('window').width
const height: number = Dimensions.get('window').height
const hasNotch = DeviceInfo.hasNotch()
const iPhoneX = Platform.OS === 'ios' && (height === 812 || height === 896)

const fonts = {
  anBold: 'AvenirNextLTPro-Bold',
  anItalic: 'AvenirNextLTPro-It',
  anRegular: 'AvenirNextLTPro-Regular',
}

const scale = (value: number) => {
  if (height / width >= 2) {
    return (value * width) / 768
  } else {
    return (value * height) / 1024
  }
}

const textSizes: {
  [number]: { fontSize: number, letterSpacing: number, lineHeight: number }
} = {
  [9]: {
    fontSize: scale(9),
    letterSpacing: scale(0.5),
    lineHeight: scale(13)
  },
  [10]: {
    fontSize: scale(10),
    letterSpacing: scale(0.5),
    lineHeight: scale(14)
  },
  [11]: {
    fontSize: scale(11),
    letterSpacing: scale(0.5),
    lineHeight: scale(15)
  },
  [12]: {
    fontSize: scale(12),
    letterSpacing: scale(0.5),
    lineHeight: scale(16)
  },
  [14]: {
    fontSize: scale(14),
    letterSpacing: scale(0.5),
    lineHeight: scale(20)
  },
  [16]: {
    fontSize: scale(16),
    letterSpacing: scale(0.5),
    lineHeight: scale(20)
  },
  [18]: {
    fontSize: scale(18),
    letterSpacing: scale(0.5),
    lineHeight: scale(24)
  },
  [20]: {
    fontSize: scale(20),
    letterSpacing: scale(0.5),
    lineHeight: scale(24)
  },
  [24]: {
    fontSize: scale(24),
    letterSpacing: scale(0.5),
    lineHeight: scale(32)
  },
  [26]: {
    fontSize: scale(26),
    letterSpacing: scale(0.5),
    lineHeight: scale(32)
  },
  [30]: {
    fontSize: scale(30),
    letterSpacing: 0,
    lineHeight: scale(36)
  },
  [40]: {
    fontSize: scale(40),
    letterSpacing: 0,
    lineHeight: scale(46)
  }
}

const commonStyles = (colors: AppColors, getTextStyle) => {
  const viewCentered = { alignItems: 'center', justifyContent: 'center' }
  return {
    backgroundImage: { height: '100%', width: '100%' },
    bottomButtonView: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
    content: { flex: 1, paddingHorizontal: scale(20) },
    flexView: { flex: 1 },
    fullImageBackground: {
      height,
      paddingHorizontal: scale(20),
      width
    },
    viewCentered
  }
}

const textStyle = ({ color, font, size }: TextStyleInputs, colors: AppColors) => ({
  color: colors[color],
  fontFamily: fonts[font],
  fontSize: textSizes[size].fontSize,
  letterSpacing: textSizes[size].letterSpacing,
  lineHeight: textSizes[size].lineHeight
})

export default function getThemeStyle(theme: Theme) {
  const colors = getThemeColors(theme)
  const getTextStyle = (inputs: TextStyleInputs) => textStyle(inputs, colors)
  return {
    ...colors,
    ...commonStyles(colors, getTextStyle),
    ...fonts,
    getTextStyle,
    hasNotch,
    iPhoneX,
    scale,
    statusBarStyle: theme === 'dark' ? 'light-content' : 'dark-content',
    window: { height, width }
  }
}

type TextSizes = 9 | 10 | 11 | 12 | 14 | 16 | 18 | 20 | 24 | 26 | 30 | 40
type TextStyleInputs = { color: ColorKeys, font: FontKeys, size: TextSizes }
export type AppColors = { [ColorKeys]: ColorValues }
export type AppFonts = { [FontKeys]: FontValues }
export type ColorKeys = $Keys<typeof defaultColors>
export type ColorValues = $Values<typeof defaultColors>
export type FontKeys = $Keys<typeof fonts>
export type FontValues = $Values<typeof fonts>
export type Theme = 'dark' | 'normal'
export type ThemeStyle<T> = $Call<typeof getThemeStyle, T>
