import * as React from 'react'
import { Image, View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { Icon } from 'react-native-elements'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'

import AppText from '../AppText'
import { TableHeaderType, TableSortOps } from '@root/utils/types'

type Props = {
  header: TableHeaderType,
  sortOp: TableSortOps,
  onSortChanged?: (sortOp: TableSortOps) => any,
}

export default React.memo<Props>(function TableHeader(props: Props) {
  const { themeStyle } = useTheme()
  const { styles } = useStyles(getStyles)

  const { header, sortOp, onSortChanged } = props

  const onHandleSort = React.useCallback(() => {
    let sortOrder = 'ASC'
    if (sortOp.sortBy === header.value) {
      sortOrder = sortOp.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }
    onSortChanged && onSortChanged({
      sortBy: header.value,
      sortOrder,
    })
  }, [sortOp])
  const Container = header.sortable ? TouchableOpacity : View
  return (
    <Container
      style={[styles.container, header.style]}
      onPress={onHandleSort}
    >
      <AppText
        color={'textBlack2'}
        font={'anBold'}
        style={styles.text}
      >{header.label}</AppText>
      {sortOp.sortBy === header.value && 
        <Icon
          name={sortOp.sortOrder === 'ASC' ? 'md-arrow-dropdown' : 'md-arrow-dropup'}
          type='ionicon'
          color={themeStyle.textBlack2}
        />
      }
    </Container>
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    paddingVertical: themeStyle.scale(0),
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginRight: themeStyle.scale(10),
    textTransform: 'uppercase'
  }
})
