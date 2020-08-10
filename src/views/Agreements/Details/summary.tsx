import React, {useState, useEffect} from 'react';
import {View, Image, ScrollView, Text} from 'react-native';
import numeral from 'numeral';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {AppHeader, NavBackBtn, AppText} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
import {AgreementLineItemType} from '@root/utils/types';

export default function AgreementSummary({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.AgreementSummary>) {
  const {styles} = useStyles(getStyles);
  const {parent = 'Summary', itemTitle, agreement} = route.params || {};
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    let total = 0;
    agreement.line_items?.map((item) => {
      total += item.price * item.qty - item.discount;
    });
    setTotalPrice(total);
  }, [agreement.line_items]);

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={parent}
            onClick={() => {
              navigation.pop();
            }}
          />
        }
        rightContent={null}
        pageTitle={itemTitle || ''}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <ScrollView style={styles.mainLayout}>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.tableHeader]}>
            <View style={styles.qtyCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                QTY
              </AppText>
            </View>
            <View style={styles.descCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                DESCRIPTION
              </AppText>
            </View>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                PRICE
              </AppText>
            </View>
            <View style={styles.discountCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                DISCOUNT
              </AppText>
            </View>
            <View style={styles.subTotalCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                SUBTOTAL
              </AppText>
            </View>
          </View>
          {agreement.line_items?.map(
            (item: AgreementLineItemType, index: number) => (
              <View style={[styles.rowLayout, styles.rowFront]} key={index}>
                <View style={styles.qtyCell}>
                  <AppText color={'lightPurple'} size={16} font={'anSemiBold'}>
                    {`${item.qty}`}
                  </AppText>
                </View>
                <View style={styles.descCell}>
                  <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                    {item.catalog_item.name}
                  </AppText>
                </View>
                <View style={styles.priceCell}>
                  <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                    {`$${numeral(item.price / 100).format('0,0.00')}`}
                  </AppText>
                </View>
                <View style={styles.discountCell}>
                  <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                    {item.discount
                      ? `$${numeral(item.discount / 100).format('0,0.00')}`
                      : ''}
                  </AppText>
                </View>
                <View style={styles.subTotalCell}>
                  <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                    {`$${numeral(
                      (item.qty * item.price - item.discount) / 100,
                    ).format('0,0.00')}`}
                  </AppText>
                </View>
              </View>
            ),
          )}
        </View>
        <View style={[styles.block, styles.tableHeader]}>
          <View style={[styles.rowLayout, styles.totalRow]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                SUBTOTAL
              </AppText>
            </View>
            <View style={styles.priceCell}>
              <View>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  SALES TAX
                </AppText>
              </View>
            </View>
            <View style={styles.totalCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                TOTAL
              </AppText>
            </View>
          </View>
          <View style={[styles.rowLayout, styles.totalRow]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                {`$${numeral(totalPrice / 100).format('0,0.00')}`}
              </AppText>
            </View>
            <View style={[styles.priceCell, styles.editDiscountCell]}>
              <View>
                <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                  {`$${numeral(
                    (totalPrice * agreement.sales_tax_rate) / 100 / 100,
                  ).format('0,0.00')}`}
                </AppText>
              </View>
              <View>
                <AppText color={'textBlack2'} size={20} font={'anRegular'}>
                  {` @ ${agreement.sales_tax_rate}%`}
                </AppText>
              </View>
            </View>
            <View style={styles.totalCell}>
              <AppText color={'textBlack2'} size={24} font={'anSemiBold'}>
                {`$${numeral(
                  (totalPrice * (100 - agreement.sales_tax_rate)) / 100 / 100,
                ).format('0,0.00')}`}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.block}>
          <AppText font={'anSemiBold'} size={20} color={'textBlack2'}>
            Warranty
          </AppText>
          <View style={styles.subblock}>
            <Text style={styles.lineHeight15}>
              These products are covered by a manufacturer's limited warranty on
              parts: Lifetime on drive train components and 2 years on all
              remaining component parts. Batteries are NOT under warranty.
              Gamburd Gamburd Inc provides a 12 month labor warranty from date
              of installation.
            </Text>
          </View>
        </View>
        <View style={styles.block}>
          <AppText font={'anSemiBold'} size={20} color={'textBlack2'}>
            Terms and Conditions of Equipment Sale
          </AppText>
          <View style={styles.subblock}>
            <Text style={styles.lineHeight15}>
              {
                '1. All sales are final.\n2. Quote valid for 30 days.\n3. Permits are not included.\n4. Price does not include modification to handrails.\n5. Price does not include installation of an electrical outlet.\n6. Stairlift must be installed within 10 days of delivery or storage fee of $45 per day will apply.\n7. Customer must communicate if there is radiant or similar type flooring.\n8. Installation will require drilling through the flooring which will leave holes once removed\n'
              }
            </Text>
          </View>
        </View>
        <View style={styles.block}>
          <AppText font={'anSemiBold'} size={20} color={'textBlack2'}>
            Notice of Three-Day Right to Cancel
          </AppText>
          <View style={styles.subblock}>
            <Text style={styles.lineHeight15}>
              You, the buyer, have the right to cancel this contract within
              three business days. You may cancel by e-mailing, mailing, faxing,
              or delivering a written notice to the contractor at the
              contractor’s place of business by midnight of the third business
              day after you received a signed and dated copy of the contract
              that includes this notice. Include your name, your address, and
              the date you received the signed copy of the contract and this
              notice.
            </Text>
          </View>
          <View style={styles.subblock}>
            <Text style={styles.lineHeight15}>
              If you cancel, the contractor must return to you anything you paid
              within 10 days of receiving the notice of cancellation. For your
              part, you must make available to the contractor at your residence,
              in substantially as good condition as you received them, goods
              delivered to you under this contract or sale. Or, you may, if you
              wish, comply with the contractor’s instructions on how to return
              the goods at the contractor’s expense and risk. If you do make the
              goods available to the contractor and the contractor does not pick
              them up within 20 days of the date of your notice of cancellation,
              you may keep them without any further obligation. If you fail to
              make the goods available to the contractor, or if you agree to
              return the goods to the contractor and fail to do so, then you
              remain liable for performance of all obligations under the
              contract.
            </Text>
          </View>
          <View style={styles.subblock}>
            <Text style={styles.lineHeight15}>
              The undersigned acknowledges receipt of this Notice Of Three-Day
              Right To Cancel.
            </Text>
          </View>
        </View>
        <View style={styles.block}>
          <AppText font={'anSemiBold'} size={20} color={'textBlack2'}>
            Heated Floors Notice
          </AppText>
          <View style={styles.subblock}>
            <Text style={styles.lineHeight15}>
              If your home contains heated floors and the attached Quote is for
              the installation of a stair lift, then the Seller cannot proceed
              without your providing Seller with an adequately detailed diagram
              which shows the Seller the location of the
              materials/equipment/pipes which enable the floors to be heated. If
              based upon such diagram, Seller determines that the installation
              of such stair lift would or might interfere with the
              materials/equipment/pipes which enable the floors to be heated,
              then Seller will be unable to proceed with such installation.
            </Text>
          </View>
          <View style={styles.subblock}>
            <Text numberOfLines={5} style={styles.lineHeight15}>
              If your home contains heated floors and based upon the diagram
              provided by you, the Seller determines that the installation of
              the stair lift will not interfere with the
              materials/equipment/pipes which enable the floors to be heated,
              you nevertheless release Seller from any Losses (as defined in
              Paragraph 11 of the Terms And Conditions Of Equipment Sale) to
              such materials/equipment/pipes which result from or pertain to the
              installation of the stair lift and/or the ongoing use by you of
              the stair lift.
            </Text>
          </View>
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
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  tableHeader: {
    paddingBottom: 10,
  },
  rowFront: {
    height: 50,
    borderBottomColor: themeStyle.lightBorderColor,
    borderBottomWidth: 1,
    backgroundColor: themeStyle.backgroundWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyCell: {
    width: 50,
  },
  descCell: {
    flex: 1,
  },
  priceCell: {
    width: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  discountCell: {
    width: 100,
  },
  subTotalCell: {
    width: 100,
    alignItems: 'flex-end',
  },
  totalCell: {
    width: 180,
    alignItems: 'flex-end',
  },
  editDiscountCell: {
    justifyContent: 'flex-start',
  },
  totalRow: {
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  mainLayout: {
    position: 'relative',
    flex: 1,
  },
  switchView: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 10,
  },
  subblock: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lineHeight15: {
    fontSize: 16,
    lineHeight: 26,
    color: themeStyle.textBlack2,
  },
});
