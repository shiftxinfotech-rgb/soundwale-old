import {Icons} from '@assets';
import {ComponentStyles, Text} from '@components';
import {unReadCount} from '@features';
import {useUserId} from '@hooks';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {Colors, CommonStyle, TS, VS} from '@theme';
import {navigate, Scale, useChatUnreadCount} from '@util';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

type Props = {
  title: string;
  titleWidget?: React.ReactNode;
  onPressHamburger?: () => void;
  onPressChat?: () => void;
  onPressNotification?: () => void;
  isSupplier?: boolean;
  isBack?: boolean;
  onSupplier?: () => void;
};

export default function TabHeader({
  title,
  titleWidget,
  isSupplier,
  onSupplier,
  isBack,
}: Props) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {count} = useSelector(unReadCount, shallowEqual);
  const currentUserId = useUserId();
  const chatUnreadCount = useChatUnreadCount();

  return (
    <View style={[CommonStyle.safeAreaSpaceTop]}>
      <View style={[VS.ai_center, VS.fd_row, VS.ph_15, VS.pv_10]}>
        <View style={[VS.fd_row, VS.ai_center, VS.flex_1, VS.gap_10]}>
          {isBack ? (
            <TouchableOpacity
              hitSlop={10}
              activeOpacity={1}
              onPress={() => navigation?.goBack()}>
              <Icons.ArrowBack />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              hitSlop={10}
              activeOpacity={1}
              onPress={() => navigation?.openDrawer()}>
              <Icons.Hamburger />
            </TouchableOpacity>
          )}
          <View>
            {isSupplier && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={onSupplier}
                style={[VS.fd_row, VS.ai_center, VS.gap_9]}>
                <Text
                  fontWeight="quickSandMedium"
                  style={[TS.fs_13, TS.lh_16, CommonStyle.textPrimary]}>
                  Supplier Type
                </Text>
                <Icons.ArrowDown
                  color={Colors.primary}
                  width={Scale(10)}
                  height={Scale(10)}
                />
              </TouchableOpacity>
            )}

            <Text fontWeight="semiBold" style={[TS.fs_18]}>
              {title}
            </Text>
          </View>

          {titleWidget}
        </View>
        <View style={[VS.fd_row, VS.ai_center, VS.jc_center, VS.gap_11]}>
          <TouchableOpacity
            accessibilityLabel={'Chat'}
            testID="chat-btn"
            onPress={() => {
              navigate('ChatListing');
            }}
            hitSlop={10}>
            <Icons.Chat />
            {chatUnreadCount > 0 && (
              <View
                style={[
                  ComponentStyles.badge,
                  CommonStyle.bgOrange,
                  VS.ai_center,
                  VS.as_center,
                  VS.jc_center,
                ]}>
                <Text
                  fontWeight="medium"
                  style={[TS.fs_11, CommonStyle.textWhite]}>
                  {chatUnreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={'Notification'}
            testID="notification-btn"
            onPress={() => navigate('Notification')}
            hitSlop={10}>
            <Icons.NotificationBell />
            {count > 0 && (
              <View
                style={[
                  ComponentStyles.badge,
                  CommonStyle.bgOrange,
                  VS.ai_center,
                  VS.as_center,
                  VS.jc_center,
                ]}>
                <Text
                  fontWeight="medium"
                  style={[TS.fs_11, CommonStyle.textWhite]}>
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
