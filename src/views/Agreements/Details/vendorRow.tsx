/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import numeral from 'numeral';
import IonIcon from 'react-native-vector-icons/Ionicons';

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
  {label: 'Sku', value: 'sku', sortable: true, style: {width: 150}},
  {label: 'Name', value: 'name', sortable: true, style: {flex: 1}},
  {label: 'Cost', value: 'cost', sortable: true, style: {width: 150}},
  {label: 'Price', value: 'price', sortable: true, style: {width: 150}},
  {label: 'Taxable', value: 'taxable', sortable: false, style: {width: 60}},
];

const sortCatalog = (arr: Catalog[], sortBy: CatalogKeys | '') => {
  if (!sortBy) {
    return arr.slice();
  }
  return arr.slice().sort((a: Catalog, b: Catalog) => {
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

const cellContent = (
  onItemPress: () => void,
  header: TableHeaderType,
  row: Catalog,
  styles: any,
) => {
  switch (header.value) {
    case 'sku':
      return (
        <AppTextButton style={styles.cellLayout} onPress={onItemPress}>
          <AppText
            style={styles.noSpacing}
            color={'textBlack2'}
            size={16}
            font={'anSemiBold'}>
            {row.sku}
          </AppText>
        </AppTextButton>
      );
    case 'name':
      return (
        <TouchableOpacity style={styles.cellLayout} onPress={onItemPress}>
          <AppText style={styles.noSpacing} size={16}>
            {row.name}
          </AppText>
        </TouchableOpacity>
      );
    case 'cost':
      return (
        <TouchableOpacity style={styles.cellLayout} onPress={onItemPress}>
          <AppText style={styles.noSpacing} size={16}>
            {row.cost ? numeral(row.cost / 100).format('$0,0.00') : ''}
          </AppText>
        </TouchableOpacity>
      );
    case 'price':
      return (
        <TouchableOpacity style={styles.cellLayout} onPress={onItemPress}>
          <AppText style={styles.noSpacing} size={16}>
            {row.price ? numeral(row.price / 100).format('$0,0.00') : ''}
          </AppText>
        </TouchableOpacity>
      );
    case 'taxable':
      return (
        <TouchableOpacity
          style={[styles.cellLayout, styles.alignRight]}
          onPress={onItemPress}>
          {row.taxable && (
            <IonIcon name={'checkmark-sharp'} color={'#55465F'} size={22} />
          )}
          {!row.taxable && <></>}
        </TouchableOpacity>
      );
    default:
      return <></>;
  }
};

type Props = {
  onItemPress: () => void;
  vendorName: string;
  catalogs: Catalog[];
  catalogSortOps: TableSortOps;
  sortChanged: (_: TableSortOps) => void;
};

export default function VendorRow({
  onItemPress,
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
    (header: TableHeaderType, row: Catalog) =>
      cellContent(onItemPress, header, row, styles),
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
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 38,
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  noSpacing: {
    letterSpacing: 0,
  },
  vendorName: {
    marginVertical: 3,
    paddingVertical: 16,
    marginLeft: themeStyle.scale(15),
    borderBottomWidth: 1,
    borderBottomColor: themeStyle.lightBorderColor,
  },
  vendorNameText: {
    ...themeStyle.getTextStyle({
      color: 'textBlack1',
      font: 'anMedium',
      size: 16,
    }),
  },
});
