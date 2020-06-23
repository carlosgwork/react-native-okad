import * as React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { setAction } from '@redux/actions'

import { Input } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'
import { navigateHome } from '@utils/functions'

type Props = {
  value: string,
  onChange?: () => any,
}

export default React.memo<Props>(function AppSearchInput(props: Props) {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  const {
    value,
    onChange,
  } = props

  return (
    <Input
      placeholder="Search"
      leftIcon={{ type: 'ionicon', name: 'ios-search', color: themeStyle.textGray, size: themeStyle.scale(20) }}
      rightIcon={{ type: 'ionicon', name: 'ios-mic', color: themeStyle.textGray, size: themeStyle.scale(20) }}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      onChangeText={onChange}
      value={value}
      errorStyle={styles.error}
    />
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: themeStyle.scale(40),
    paddingHorizontal: 10,
    minWidth: 200,
    height: 35,
  },
  input: {
    padding: 0,
    ...themeStyle.getTextStyle({
      color: 'textGray',
      font: 'anRegular',
      size: 14,
    }),
  },
  error: {
    height: 0,
    padding: 0,
    margin: 0,
  }
})
