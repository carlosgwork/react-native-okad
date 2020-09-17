import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useQuery} from '@apollo/client';
import Icon from 'react-native-vector-icons/Ionicons';

import {TableSortOps, Vendor, Catalog} from '@utils/types';
import {emptyTableSortOption} from '@utils/constants';
import {VendorsState} from '@redux/reducers/vendors';
import {AppText, AppSearchInput, CircularLoading} from '@root/components';
import {SortOpsByVendor} from '@root/redux/reducers/catalogs';
import {FETCH_VENDORS} from '@root/views/Catalogs/graphql';
import {setAction} from '@root/redux/actions';
import VendorRow from './vendorRow';
import {useStyles} from '@global/Hooks';

const FETCH_COUNT = 20;

const LineItemModal = ({
  onClose,
  onAddItem,
}: {
  onClose: () => void;
  onAddItem: (_: Catalog) => void;
}) => {
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

  const onItemPress = (item: Catalog) => {
    onAddItem(item);
    onClose();
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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Loading Error</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.hideButton} onPress={onClose}>
          <Icon name="close" size={22} color={'#979797'} />
        </TouchableOpacity>
        <View style={styles.headerLayout}>
          <AppText color={'textBlack2'} size={20} font={'anSemiBold'}>
            Add Item
          </AppText>
        </View>
        <View style={[styles.rowLayout, styles.rowLayout1]}>
          <AppSearchInput value={searchText} onChange={onFilterCatalog} />
        </View>
        <View style={styles.rowLayout}>
          <ScrollView
            style={styles.rowLayout2}
            onScroll={onContainerScroll}
            scrollEventThrottle={300}>
            {filteredVendors.map((item, index) => (
              <VendorRow
                key={`vendor-row-${index}-${item.catalog_items.length}`}
                vendorName={item.name}
                catalogs={item.catalog_items}
                onItemPress={onItemPress}
                catalogSortOps={vendorsSortOps[index].sortOps}
                sortChanged={(sortOps: TableSortOps) =>
                  onSortChanged(sortOps, index)
                }
              />
            ))}
            {!loading && filteredVendors.length === 0 && (
              <View style={styles.centerText}>
                <Text>No Result</Text>
              </View>
            )}
            <CircularLoading loading={loading} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const getStyles = () => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 100,
    width: 800,
    maxHeight: 1000,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerLayout: {
    flexDirection: 'row',
  },
  rowLayout: {
    flexDirection: 'row',
  },
  rowLayout1: {
    justifyContent: 'center',
    marginVertical: 20,
  },
  rowLayout2: {
    overflow: 'hidden',
    maxHeight: 800,
  },
  hideButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    width: 32,
    height: 32,
    paddingTop: 1,
    paddingLeft: 1,
    backgroundColor: '#eee',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    marginVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
});

export default LineItemModal;
