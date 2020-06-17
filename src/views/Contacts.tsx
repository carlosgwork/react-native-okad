import * as React from 'react'
import { Image, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { setAction } from '@redux/actions'
import { Icon } from 'react-native-elements'

import { AppHeader, AppGradButton } from '@components'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'
import { navigateHome } from '@utils/functions'

export default function Contacts() {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={null}
        pageTitle={'Contacts'}
        toolbarCenterContent={<View style={{ flexDirection: 'row' }}>
          <AppGradButton
            title={'NEW'}
            leftIconContent={<Icon
              name={'ios-add-circle'}
              type='ionicon'
              color={themeStyle.textWhite}
            />}
          />
        </View>}
      />
    </View>
  )
}

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    flex: 1,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18
    }),
  }
})
