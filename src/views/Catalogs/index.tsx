import React, {useState} from 'react';
import {View, Text, ScrollView, NativeScrollEvent} from 'react-native';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {setAction} from '@redux/actions';
import {useSelector} from 'react-redux';

import type {ThemeStyle as StyleType} from '@utils/styles';
import {useStyles} from '@global/Hooks';
import {TableSortOps, Vendor} from '@utils/types';
import {emptyTableSortOption} from '@utils/constants';
import VendorRow from './vendorRow';
import {VendorsState} from '@redux/reducers/vendors';
import {AppHeader, AppSearchInput, CircularLoading} from '@root/components';
import {SortOpsByVendor} from '@root/redux/reducers/catalogs';

const FETCH_COUNT = 20;

export const FETCH_VENDORS = gql`
  query Vendors($offset: Int!) {
    vendors(limit: 20, offset: $offset) {
      id
      logo_uri
      name
      short_name
      catalog_items {
        cost
        id
        price
        sku
        taxable
        name
      }
    }
  }
`;

export default function Catalogs() {
  const {styles} = useStyles(getStyles);
  const {vendors, sortOptions} = useSelector(
    (state: any): VendorsState => state.vendors,
  );
  const [offset, setOffset] = useState<number>(0);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendorsSortOps, setVendorsSortOps] = useState<SortOpsByVendor[]>([]);

  const {loading, error} = useQuery(FETCH_VENDORS, {
    variables: {offset},
    onCompleted: (data) => {
      const newData = vendors.concat(data.vendors);
      setAction('vendors', {
        vendors: newData,
      });
      setSearchText('');
      sortVendors(newData);
      setFilteredVendors(newData);
    },
  });

  const onFilterCatalog = (text: string) => {
    const filtered = filterVendors(text, vendors);
    setFilteredVendors(filtered);
    sortVendors(filtered);
    setSearchText(text);
  };

  const onSortChanged = (sortOp: TableSortOps, index: number) => {
    const newVendorSortOps = vendorsSortOps.slice();
    newVendorSortOps[index].sortOps = sortOp;
    setVendorsSortOps(newVendorSortOps);
    setAction('catalogs', {sortOptions: newVendorSortOps});
  };

  const filterVendors = (text: string, v: Vendor[]) => {
    if (searchText) {
      const filtered = v.filter(
        (vendor: Vendor) =>
          vendor.name.toLowerCase().indexOf(text.toLowerCase()) > -1,
      );
      return filtered;
    }
    return [];
  };

  const sortVendors = (v: Vendor[]) => {
    const sortOps: SortOpsByVendor[] = v.map((vendor) => {
      const opt = sortOptions.filter(
        (option) => option.vendor_id === vendor.id,
      );
      const newSortOpt: SortOpsByVendor = {
        sortOps: emptyTableSortOption,
        vendor_id: vendor.id,
      };
      return opt.length > 0 ? opt[0] : newSortOpt;
    });
    setVendorsSortOps(sortOps);
  };

  const onContainerScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }): void => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    if (loading) {
      return;
    }
    if (layoutMeasurement.height > contentSize.height) {
      if (contentOffset.y > 60) {
        setOffset(offset + FETCH_COUNT);
      }
    } else {
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height + 60
      ) {
        setOffset(offset + FETCH_COUNT);
      }
    }
  };

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading Error</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={null}
        pageTitle={'Catalog'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <AppSearchInput value={searchText} onChange={onFilterCatalog} />
        }
      />
      <ScrollView
        onScroll={onContainerScroll}
        scrollEventThrottle={300}
        style={styles.container}>
        {filteredVendors.map((item, index) => (
          <VendorRow
            key={index}
            vendorName={item.name}
            catalogs={item.catalog_items}
            catalogSortOps={vendorsSortOps[index].sortOps}
            sortChanged={(sortOps: TableSortOps) =>
              onSortChanged(sortOps, index)
            }
          />
        ))}
        <CircularLoading loading={loading || !vendorsSortOps.length} />
      </ScrollView>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
  cellLayout: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    height: 40,
  },
  noSpacing: {
    letterSpacing: 0,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
  loader: {
    marginTop: 25,
    marginBottom: 25,
  },
});
