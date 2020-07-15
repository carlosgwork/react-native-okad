import * as React from 'react';
import {ScrollView, View} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {TableHeaderType, TableSortOps} from '@utils/types';

import TableHeader from './TableHeader';

type Props = {
  headers: TableHeaderType[];
  sortOp: TableSortOps;
  rows: any[];
  renderCell: (header: TableHeaderType, row: any) => React.ReactElement;
  onSortChanged?: (sortOp: TableSortOps) => any;
};

export default React.memo<Props>(function AppDataTable(props: Props) {
  const {styles} = useStyles(getStyles);

  const {headers, sortOp, rows, renderCell, onSortChanged} = props;

  return (
    <ScrollView style={styles.container}>
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
        {rows.map((row, index) => (
          <View
            style={[
              styles.row,
              index % 2 !== 1 ? styles.rowOdd : styles.rowEven,
            ]}
            key={index}>
            {headers.map((header) => (
              <View style={[styles.cell, header.style]} key={header.value}>
                {renderCell(header, row)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    paddingVertical: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: themeStyle.scale(20),
    paddingTop: themeStyle.scale(10),
  },
  rowContainer: {},
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: themeStyle.gray,
    paddingHorizontal: themeStyle.scale(20),
  },
  rowOdd: {},
  rowEven: {
    backgroundColor: themeStyle.backgroundGray1,
  },
  cell: {
    paddingVertical: themeStyle.scale(10),
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textWhite',
      font: 'anBold',
      size: 16,
    }),
    alignSelf: 'flex-end',
  },
});
