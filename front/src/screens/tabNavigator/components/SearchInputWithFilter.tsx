import {Icons} from '@assets';
import {InputBox} from '@components';
import {NavigationParamStack, Selections} from '@data';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Colors, CommonStyle, VS} from '@theme';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {InteractionManager, Keyboard, TouchableOpacity, View} from 'react-native';
import {Styles} from './Styles';

type Props = {
  screenFrom: 'buyer' | 'seller';
  preSelectedFilters?: Selections;
  searchInput: string;
  onSearch: (content: string) => void;
  onFilterSelected: (filters: Selections) => void;
};

export default function SearchInputWithFilter({
  screenFrom,
  preSelectedFilters,
  searchInput,
  onSearch,
  onFilterSelected,
}: Props) {
  const {t} = useTranslation(['tabNavigator']);
  const {navigate} = useNavigation<NavigationProp<NavigationParamStack>>();

  return (
    <View
      style={[
        VS.fd_row,
        VS.ai_center,
        VS.jc_space_between,
        VS.gap_16,
        VS.mh_15,
        VS.pv_5,
      ]}>
      <InputBox
        placeholder={t('searchHere')}
        maxLength={60}
        returnKeyLabel={'search'}
        returnKeyType={'search'}
        textContentType={'name'}
        inputMode={'search'}
        keyboardType={'default'}
        parentStyle={[VS.flex_1]}
        placeholderTextColor={Colors.dimGray}
        value={searchInput}
        onChangeText={onSearch}
        inputStyle={[
          Styles.searchInput,
          CommonStyle.bgWhite,
          CommonStyle.textBlack,
          CommonStyle.shadowBox,
        ]}
        renderRightIcon={() => {
          if (searchInput.length > 0) {
            return (
              <TouchableOpacity
                onPress={() => {
                  onSearch('');
                  InteractionManager.runAfterInteractions(() => {
                    Keyboard.dismiss();
                  });
                }}>
                <Icons.Close />
              </TouchableOpacity>
            );
          }
          return <Icons.Search />;
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigate('FilterScreen', {
            type: screenFrom,
            preFilters: preSelectedFilters,
            onGoBack: onFilterSelected,
          })
        }
        style={[
          VS.ai_center,
          VS.jc_center,
          Styles.filterIcon,
          CommonStyle.bgPrimary,
        ]}>
        <Icons.Filter />
      </TouchableOpacity>
    </View>
  );
}
