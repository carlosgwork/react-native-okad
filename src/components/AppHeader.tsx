import * as React from 'react'
import { Image, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { setAction } from '@redux/actions'

import { Header } from 'react-native-elements'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'
import { navigateHome } from '@utils/functions'

type Props = {
  leftContent?: React.ReactElement,
  rightContent?: React.ReactElement,
  toolbarLeftContent?: React.ReactElement,
  toolbarCenterContent?: React.ReactElement,
  toolbarRightContent?: React.ReactElement,
  pageTitle: string,
}

export default React.memo<Props>(function AppHeader(props: Props) {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  const defaultLeft = <View></View>
  const defaultRight = <View></View>
  const defaultToolbarLeft = props.pageTitle
    ? <Text style={styles.pageTitle}>{props.pageTitle}</Text>
    : null
  const defaultToolbarCenter = <View></View>
  const defaultToolbarRight = <View></View>

  const {
    leftContent = defaultLeft,
    rightContent = defaultRight,
    toolbarLeftContent = defaultToolbarLeft,
    toolbarCenterContent = defaultToolbarCenter,
    toolbarRightContent = defaultToolbarRight,
  } = props

  return (
    <View style={styles.container}>
      <Header
        leftComponent={leftContent}
        rightComponent={rightContent}
        containerStyle={{
          backgroundColor: themeStyle.backgroundWhite,
        }}
      />
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          { toolbarLeftContent }
        </View>
        <View style={styles.toolbarCenter}>
          { toolbarCenterContent }
        </View>
        <View style={styles.toolbarRight}>
          { toolbarRightContent }
        </View>
      </View>
    </View>
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    backgroundColor: themeStyle.backgroundWhite,
  },
  toolbar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    height: themeStyle.scale(50),
    borderBottomWidth: 1,
    borderColor: themeStyle.gray1,
  },
  toolbarLeft: {
    marginRight: themeStyle.scale(20),
  },
  toolbarCenter: {
    flex: 1,
  },
  toolbarRight: {
    marginLeft: themeStyle.scale(20),
  },

  pageTitle: {
    ...themeStyle.getTextStyle({
      color: 'textPurple',
      font: 'anBold',
      size: 40
    }),
  },

  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18
    }),
  }
})
