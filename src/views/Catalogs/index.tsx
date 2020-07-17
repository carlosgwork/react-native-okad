import React, {useState, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  SafeAreaView,
} from 'react-native';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {setAction} from '@redux/actions';
import {useSelector} from 'react-redux';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {TableSortOps} from '@root/utils/types';
import {emptyTableSortOption} from '@utils/constants';
import {Loading} from '@root/components';
import VendorRow from './vendorRow';
import {VendorsState} from '@root/redux/reducers/vendors';

export const FETCH_VENDORS = gql`
  query Vendors($pageNum: Int!) {
    vendors(limit: 10, offset: $pageNum) {
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
  const [pageNum, setPageNum] = useState<number>(0);

  const {data, loading, error} = useQuery(FETCH_VENDORS, {
    variables: {pageNum},
  });
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [vendorsSortOps, setVendorsSortOps] = useState<TableSortOps[]>([]);

  useEffect(() => {
    console.log('-------- vendor changed .... sort ops changed', vendors);
    const sortOps: TableSortOps[] = vendors.map((vendor) => {
      const opt = sortOptions.filter(
        (option) => option.vendor_id === vendor.id,
      );
      return opt.length > 0 ? opt[0].sortOps : emptyTableSortOption;
    });
    console.log('--- -sortOps:', sortOps);
    setVendorsSortOps(sortOps);
  }, [vendors, sortOptions]);

  const renderFooter = () => {
    if (!loadingTable) {
      return null;
    }
    return <ActivityIndicator animating size="large" style={styles.loader} />;
  };

  const dataRefresh = () => {
    setRefreshing(true);
  };

  const loadMore = () => {
    setLoadingTable(true);
    setPageNum(pageNum + 1);
  };

  if (!vendors.length) {
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text>Loading Error</Text>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Loading />
        </View>
      );
    }
    console.log('---------- vendors load: ', data.vendors);
    setAction('vendors', {
      vendors: data.vendors,
    });
  }
  if (!vendorsSortOps.length) {
    return (
      <View style={styles.emptyContainer}>
        <Loading />
      </View>
    );
  }
  console.log('------ vendors and sortops: ', vendors, vendorsSortOps);
  return (
    <SafeAreaView>
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item, index}) => (
          <VendorRow
            key={index}
            vendorName={item.name}
            catalogs={item.catalog_items}
            catalogSortOps={vendorsSortOps[index]}
          />
        )}
        ListFooterComponent={renderFooter}
        onRefresh={dataRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.01}
      />
    </SafeAreaView>
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
    marginTop: 15,
    marginBottom: 15,
  },
});
