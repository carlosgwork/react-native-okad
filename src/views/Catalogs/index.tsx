/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, NativeScrollEvent} from 'react-native';
import {gql, useQuery} from '@apollo/client';
import {setAction} from '@redux/actions';
import {useSelector} from 'react-redux';

import type {ThemeStyle as StyleType} from '@utils/styles';
import {useStyles} from '@global/Hooks';
import {TableSortOps, Vendor, Catalog} from '@utils/types';
import {emptyTableSortOption} from '@utils/constants';
import VendorRow from './vendorRow';
import {VendorsState} from '@redux/reducers/vendors';
import {AppHeader, AppSearchInput, CircularLoading} from '@root/components';
import {SortOpsByVendor} from '@root/redux/reducers/catalogs';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';

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
        description
        category
        created
      }
    }
  }
`;

export default function Catalogs({
  navigation,
}: AppNavProps<AppRouteEnum.Catalogs>) {
  const {styles} = useStyles(getStyles);
  const {vendors, searchText: vendorSearchText, sortOptions} = useSelector(
    (state: any): VendorsState => state.vendors,
  );
  const [offset, setOffset] = useState<number>(0);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendorsSortOps, setVendorsSortOps] = useState<SortOpsByVendor[]>([]);

  useEffect(() => {
    onFilterCatalog(vendorSearchText);
  }, [vendorSearchText]);

  const {loading, error} = useQuery(FETCH_VENDORS, {
    variables: {offset},
    onCompleted: (data) => {
      const newData = vendors.concat(data.vendors);
      setAction('vendors', {
        vendors: newData,
      });
      setSearchText('');
      setAction('vendors', {searchText: ''});
      sortVendors(newData);
      setFilteredVendors(newData);
    },
  });

  const onFilterCatalog = (text: string) => {
    const filtered = filterVendors(text, vendors);
    setFilteredVendors(filtered);
    sortVendors(filtered);
    setSearchText(text);
    setAction('vendors', {searchText: text});
  };

  const onSortChanged = (sortOp: TableSortOps, index: number) => {
    const newVendorSortOps = vendorsSortOps.slice();
    newVendorSortOps[index].sortOps = sortOp;
    setVendorsSortOps(newVendorSortOps);
    setAction('catalogs', {sortOptions: newVendorSortOps});
  };

  const filterVendors = (text: string, v: Vendor[]) => {
    if (text) {
      const filteredVendor = v.filter(
        (vendor: Vendor) =>
          vendor.name.toLowerCase().indexOf(text.toLowerCase()) > -1,
      );
      v.forEach((item) => {
        const matchItems = item.catalog_items.filter(
          (catalog: Catalog) =>
            catalog.name.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
            catalog.sku.toLowerCase().indexOf(text.toLowerCase()) > -1,
        );
        if (matchItems.length > 0) {
          if (filteredVendor.findIndex((it) => it.id === item.id) < 0) {
            const newV = Object.assign({}, item);
            newV.catalog_items = matchItems;
            filteredVendor.push(newV);
          }
        }
      });
      return filteredVendor;
    }
    return v;
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
      <View style={styles.mainContent}>
        <ScrollView
          onScroll={onContainerScroll}
          scrollEventThrottle={300}
          style={styles.container}>
          {filteredVendors.map((item, index) => (
            <VendorRow
              key={`vendor-row-${index}-${item.catalog_items.length}`}
              navigation={navigation}
              vendorName={item.name}
              catalogs={item.catalog_items}
              catalogSortOps={vendorsSortOps[index].sortOps}
              sortChanged={(sortOps: TableSortOps) =>
                onSortChanged(sortOps, index)
              }
            />
          ))}
          {filteredVendors.length === 0 && (
            <Text style={styles.centerText}>No Result</Text>
          )}
          <CircularLoading loading={loading} />
        </ScrollView>
      </View>
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
  mainContent: {
    flex: 1,
    marginTop: 10,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
