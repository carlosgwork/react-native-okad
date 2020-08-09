import React, {useState} from 'react';
import {View, Text, Switch, ScrollView} from 'react-native';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {AppHeader, NavBackBtn, AppText} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function AgreementDetails({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.AgreementDetails>) {
  const {styles} = useStyles(getStyles);
  const {parent = 'Contacts', contact, agreement} = route.params || {};
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const [listData, setListData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({key: `${i}`, text: `item #${i}`})),
  );

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const renderItem = (data, rowMap) => (
    <SwipeRow
      disableLeftSwipe={true}
      leftOpenValue={20 + Math.random() * 150}
      rightOpenValue={-150}>
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(rowMap, data.item.key)}>
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => console.log('You touched me')}
        style={styles.rowFront}
        underlayColor={'#AAA'}>
        <View>
          <Text>I am {data.item.text} in a SwipeListView</Text>
        </View>
      </TouchableOpacity>
    </SwipeRow>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={parent}
            onClick={() =>
              navigation.navigate(AppRouteEnum.ContactDetails, {
                parent: 'Contacts',
                itemTitle: `${contact.name_first} ${contact.name_last}`,
                itemId: contact.id,
              })
            }
          />
        }
        rightContent={
          <View style={styles.flexRow}>
            <Text style={styles.switchText}>Show details</Text>
            <Switch
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setShowDetails(!showDetails)}
              value={showDetails}
            />
          </View>
        }
        pageTitle={`Quote DHQ${agreement.id}`}
        toolbarCenterContent={null}
        toolbarRightContent={
          showDetails ? (
            <View style={styles.flexRow}>
              <AppText size={14} color={'textBlack2'} font={'anRegular'}>
                STATUS:
              </AppText>
              <AppText size={14} color={'textBlue'} font={'anSemiBold'}>
                Open
              </AppText>
            </View>
          ) : (
            <View />
          )
        }
      />
      <ScrollView>
        <View style={[styles.rowLayout, styles.block]}>
          <View style={styles.flexRow}>
            <View style={styles.addressView}>
              <View style={[styles.rowLayout, styles.bottomBorder]}>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  BILLING ADDRESS
                </AppText>
                <TouchableOpacity onPress={() => {}}>
                  <AppText
                    color={'textLightPurple'}
                    size={12}
                    font={'anSemiBold'}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              </View>
              <AppText color={'textBlack2'} size={16} font={'anSemiBold'}>
                Song Bao
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                1234 Main St
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                Parcomia CA 91331
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                (818) 473-2903
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                song.bao@email.com
              </AppText>
            </View>
            <View style={styles.addressView}>
              <View style={[styles.rowLayout, styles.bottomBorder]}>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  PROJECT ADDRESS
                </AppText>
                <TouchableOpacity onPress={() => {}}>
                  <AppText
                    color={'textLightPurple'}
                    size={12}
                    font={'anSemiBold'}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              </View>
              <AppText color={'textBlack2'} size={16} font={'anSemiBold'}>
                Song Bao
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                1234 Main St
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                Parcomia CA 91331
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                (818) 473-2903
              </AppText>
              <AppText color={'textBlack2'} size={16} font={'anRegular'}>
                song.bao@email.com
              </AppText>
            </View>
          </View>
          <View style={styles.metaView}>
            {showDetails && (
              <>
                <View style={styles.bottomBorder}>
                  <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                    META
                  </AppText>
                </View>
                <View style={styles.rowLayout}>
                  <AppText color={'textBlack2'} size={14} font={'anRegular'}>
                    Created
                  </AppText>
                  <AppText color={'textBlack2'} size={14} font={'anSemiBold'}>
                    2/14/2020, 12:18 PM
                  </AppText>
                </View>
                <View style={styles.rowLayout}>
                  <AppText color={'textBlack2'} size={14} font={'anRegular'}>
                    First View
                  </AppText>
                  <AppText color={'textBlack2'} size={14} font={'anSemiBold'}>
                    2/14/2020, 12:18 PM
                  </AppText>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.block}>
          <SwipeListView data={listData} renderItem={renderItem} />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  switchText: {
    marginRight: themeStyle.scale(10),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBorder: {
    borderBottomColor: themeStyle.lightBorderColor,
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 15,
    minWidth: 180,
  },
  addressView: {
    marginRight: 40,
  },
  block: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  tableRow: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'red',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});
