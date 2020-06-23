import * as React from 'react'
import { Image, View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { setAction } from '@redux/actions'

import { Header } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'
import { navigateHome } from '@utils/functions'
import { TableHeaderType, TableSortOps } from '@utils/types'

import { AppText } from '@components'
import TableHeader from './TableHeader'

type Props = {
  headers: TableHeaderType[],
  sortOp: TableSortOps,
  rows: any[],
  renderCell: (header: TableHeaderType, row: any) => React.ReactElement,
  onSortChanged?: (sortOp: TableSortOps) => any,
}

export default React.memo<Props>(function AppDataTable(props: Props) {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  const {
    headers,
    sortOp,
    rows,
    renderCell,
    onSortChanged
  } = props

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {headers.map((header, index) => (
          <TableHeader
            header={header}
            sortOp={sortOp}
            key={index}
            onSortChanged={onSortChanged}
          />
        ))}
      </View>
      <View style={styles.rowContainer}>
        { rows.map((row, index) => (
          <View style={[styles.row, index % 2 !== 0 ? styles.rowOdd : styles.rowEven]} key={index}>
            {
              headers.map((header, index) => (
                <View
                  style={[styles.cell, header.style]}
                  key={header.value}
                >
                  {renderCell(header, row)}
                </View>
              ))
            }
          </View>
        )) }
      </View>
    </View>
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    paddingVertical: themeStyle.scale(20)
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: themeStyle.scale(20)
  },
  rowContainer: {
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: themeStyle.gray,
    paddingHorizontal: themeStyle.scale(20)
  },
  rowOdd: {
  },
  rowEven: {
    backgroundColor: themeStyle.backgroundGray1,
  },
  cell: {
    paddingVertical: themeStyle.scale(10)
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textWhite',
      font: 'anBold',
      size: 16
    }),
    alignSelf: 'flex-end'
  }
})
