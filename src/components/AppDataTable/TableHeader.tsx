/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

import AppText from '../AppText';
import {TableHeaderType, TableSortOps} from '@root/utils/types';

type Props = {
  header: TableHeaderType;
  sortOp: TableSortOps;
  onSortChanged?: (sortOp: TableSortOps) => any;
};

type OrderType = 'ASC' | 'DESC';

export default React.memo<Props>(function TableHeader(props: Props) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const {header, sortOp, onSortChanged} = props;

  const onHandleSort = React.useCallback(() => {
    let sortOrder = 'ASC';
    if (sortOp.sortBy === header.value) {
      sortOrder = sortOp.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    }
    onSortChanged &&
      onSortChanged({
        sortBy: header.value,
        sortOrder: sortOrder as OrderType,
      });
  }, [sortOp]);
  const Container: React.ElementType = header.sortable
    ? TouchableOpacity
    : View;
  return (
    <Container style={[styles.container, header.style]} onPress={onHandleSort}>
      <AppText
        color={'textBlack2'}
        font={'anSemiBold'}
        size={14}
        style={styles.text}>
        {header.label}
      </AppText>
      {sortOp.sortBy === header.value && (
        <Icon
          name={
            sortOp.sortOrder === 'ASC' ? 'md-arrow-dropdown' : 'md-arrow-dropup'
          }
          type="ionicon"
          color={themeStyle.textBlack2}
        />
      )}
    </Container>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    paddingVertical: themeStyle.scale(0),
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: themeStyle.scale(10),
    textTransform: 'uppercase',
  },
});
