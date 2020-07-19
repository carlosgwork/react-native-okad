/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View} from 'react-native';
import numeral from 'numeral';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {
  Catalog,
  CatalogKeys,
  TableHeaderType,
  TableSortOps,
} from '@utils/types';

import {AppTextButton, AppText, AppDataTable} from '@root/components';
import {emptyCatalog} from '@root/utils/constants';

const HEADERS: TableHeaderType[] = [
  {label: 'Sku', value: 'sku', sortable: true, style: {width: 180}},
  {label: 'Name', value: 'name', sortable: true, style: {flex: 1}},
  {label: 'Cost', value: 'cost', sortable: true, style: {width: 150}},
  {label: 'Price', value: 'price', sortable: true, style: {width: 150}},
  {label: 'Taxable', value: 'taxable', sortable: false, style: {width: 100}},
  {label: '', value: 'actions', sortable: false, style: {width: 50}},
];

const sortCatalog = (arr: Catalog[], sortBy: CatalogKeys | '') => {
  if (!sortBy) {
    return arr;
  }
  return arr.sort((a: Catalog, b: Catalog) => {
    const cmpA = a[sortBy];
    const cmpB = b[sortBy];
    let comparison = 0;
    if (cmpA !== undefined && cmpB !== undefined) {
      if (cmpA > cmpB) {
        comparison = 1;
      } else if (cmpA < cmpB) {
        comparison = -1;
      }
    }
    return comparison;
  });
};

const cellContent = (header: TableHeaderType, row: Catalog, styles: any) => {
  switch (header.value) {
    case 'sku':
      return (
        <AppTextButton style={styles.cellLayout} onPress={() => {}}>
          <AppText
            style={styles.noSpacing}
            color={'textPurple'}
            size={20}
            font={'anSemiBold'}>
            {row.sku}
          </AppText>
        </AppTextButton>
      );
    case 'name':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {row.name}
          </AppText>
        </View>
      );
    case 'cost':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {row.cost ? numeral(row.cost).format('$0,0.00') : ''}
          </AppText>
        </View>
      );
    case 'price':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {row.price ? numeral(row.price).format('$0,0.00') : ''}
          </AppText>
        </View>
      );
    case 'taxable':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {row.taxable ? 'TRUE' : ''}
          </AppText>
        </View>
      );
    default:
      return <></>;
  }
};

type Props = {
  vendorName: string;
  catalogs: Catalog[];
  catalogSortOps: TableSortOps;
  sortChanged: (_: TableSortOps) => void;
};

export default function VendorRow({
  vendorName,
  catalogs,
  catalogSortOps,
  sortChanged,
}: Props) {
  const {styles} = useStyles(getStyles);

  const [visibleCatalogs, setVisibleCatalogs] = useState<Catalog[]>(catalogs);

  const onSortChanged = (sortOp: TableSortOps) => {
    let sorted = sortCatalog(catalogs, sortOp.sortBy as CatalogKeys);
    if (sortOp.sortOrder === 'DESC') {
      sorted = sorted.reverse();
    }
    setVisibleCatalogs(sorted);
    sortChanged(sortOp);
  };

  const renderCell = React.useCallback(
    (header: TableHeaderType, row: Catalog) => cellContent(header, row, styles),
    [catalogs],
  );
  return (
    <View style={styles.vendorRow}>
      <View style={styles.vendorName}>
        <AppText style={styles.vendorNameText}>{vendorName}</AppText>
      </View>
      <AppDataTable
        headers={HEADERS}
        key={
          visibleCatalogs.length ||
          catalogSortOps.sortBy ||
          catalogSortOps.sortOrder
        }
        sortOp={catalogSortOps}
        renderCell={renderCell}
        rows={
          !visibleCatalogs.length ? new Array(emptyCatalog) : visibleCatalogs
        }
        onSortChanged={onSortChanged}
      />
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
  vendorRow: {
    paddingBottom: 20,
  },
  cellLayout: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 5,
    height: 40,
  },
  noSpacing: {
    letterSpacing: 0,
  },
  vendorName: {
    marginVertical: 10,
    paddingVertical: 15,
    marginLeft: themeStyle.scale(20),
    borderBottomWidth: 1,
    borderBottomColor: themeStyle.gray1,
  },
  vendorNameText: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anSemiBold',
      size: 18,
    }),
  },
});
