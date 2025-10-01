import {Icons} from '@assets';
import {
  CategorySelectItem,
  CommonHeader,
  CustomButton,
  Text,
} from '@components';
import {NavigationParamStack, RoleBean} from '@data';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useGetRolesQuery} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, BackHandler, ScrollView, View} from 'react-native';

export default function AddMemberScreen() {
  const {t} = useTranslation('register');
  const {navigate} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {isLoading, isFetching, data: rolesArray} = useGetRolesQuery();
  const {params} = useRoute<RouteProp<NavigationParamStack, 'AddMember'>>();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  }, []);

  const renderItem = useCallback(
    (role: RoleBean, index: number) => {
      return (
        <CategorySelectItem
          key={index}
          icon={role.image_url ?? ''}
          selectedIcon={role.selected_image_url ?? ''}
          title={role.name ?? ''}
          subtitle={role.description ?? ''}
          selected={selectedCategory === (role.slug ?? '')}
          onPress={() => {
            handleCategoryPress(role.slug ?? '');
          }}
        />
      );
    },
    [handleCategoryPress, selectedCategory],
  );

  return (
    <View style={[VS.flex_1, CommonStyle.bgWhite]}>
      <CommonHeader
        title={t('addMember')}
        withBackArrow={false}
        withChatNotification={false}
      />
      {isLoading || isFetching ? (
        <View style={[VS.flex_1, VS.jc_center, VS.ai_center]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            style={[VS.flex_1]}
            contentContainerStyle={[
              VS.pb_20,
              AppStyle.flexGrow,
              VS.ph_15,
              VS.pt_10,
            ]}
            showsVerticalScrollIndicator={false}>
            <View style={[VS.gap_10]}>
              {rolesArray?.map((role, index) => renderItem(role, index))}
            </View>
          </ScrollView>
          <CustomButton
            buttonTitle={t('next')}
            variant={selectedCategory ? 'primary' : 'secondary'}
            customView={
              <View style={[VS.fd_row, VS.ai_center, VS.gap_5]}>
                <Icons.Next />
                <Text
                  fontWeight={'quickSandBold'}
                  style={[TS.fs_16, CommonStyle.textWhite]}>
                  {t('next')}
                </Text>
              </View>
            }
            disabled={!selectedCategory}
            onPress={() => {
              const selectedRole = rolesArray?.find(
                cat => cat.slug === selectedCategory,
              );
              navigate('AddMemberForm', {
                selectedMember: selectedCategory ? [selectedCategory] : [],
                selectedName: selectedRole?.name || '',
                selectedIds: selectedRole?.id ? String(selectedRole.id) : '',
                email: params.email,
                mobile_number: params.mobile_number,
                countryCode: params.countryCode,
                code: params.code,
              });
            }}
            wrapperStyle={[VS.mt_10, VS.mb_16, VS.mh_16]}
          />
        </>
      )}
    </View>
  );
}
