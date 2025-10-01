import {Icons} from '@assets';
import {CommonModal, CommonModalRef, Container, InputBox} from '@components';
import {
  useGetUnReadCountQuery,
  useLazyGetDashboardQuery,
  useUpdatePushTokenMutation,
} from '@services';
import {AppStyle, Colors, CommonStyle, VS} from '@theme';
import {navigate} from '@util';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {tokenData} from '@features';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  InteractionManager,
  Keyboard,
  Linking,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import TabHeader from '../components/TabHeader';
import {Styles} from './Styles';
import AdCard from './components/AdCard';
import ImageSlider from './components/ImageSlider';
import TopPick from './components/TopPick';
import Trending from './components/Trending';

export default function Home() {
  const {t} = useTranslation(['tabNavigator']);
  const modalRef = useRef<CommonModalRef>(null);
  const tokenInfo = useSelector(tokenData, shallowEqual);
  const [updateToken] = useUpdatePushTokenMutation();
  const [getDashboard, {data: dashboardData, isFetching, isLoading}] =
    useLazyGetDashboardQuery();
  useGetUnReadCountQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getDashboard('');
    return () => {};
  }, [getDashboard]);

  const handleDeepLink = useCallback((url: string) => {
    try {
      if (!url.includes('soundwale.in')) {
        return false;
      }
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      if (
        pathSegments.length === 3 &&
        pathSegments[0] === 'directory' &&
        pathSegments[1] === 'post'
      ) {
        const id = pathSegments[2];
        navigate('DirectoryDetail', {id});
        return true;
      }

      if (pathSegments.length >= 3) {
        const [type, id, categoriesId] = pathSegments;

        if (type === 'buyer') {
          navigate('ProductDetail', {
            id,
            categories_id: categoriesId,
            type: 'buyer',
          });
          return true;
        }

        if (type === 'seller') {
          navigate('ProductDetailSeller', {
            id,
            categories_id: categoriesId,
            type: 'seller',
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }, []);

  useEffect(() => {
    const sub = Linking.addEventListener('url', evt => {
      handleDeepLink(evt.url);
    });
    Linking.getInitialURL()
      .then(url => {
        handleDeepLink(url ?? '');
      })
      .catch(console.warn);

    return () => {
      if (sub) {
        sub.remove();
      }
    };
  }, [handleDeepLink]);

  const handleSearch = useCallback(
    (text: string) => {
      getDashboard(text);
    },
    [getDashboard],
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDashboard('');
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [getDashboard]);

  useEffect(() => {
    if (tokenInfo !== undefined && tokenInfo !== null) {
      const {token, isPushed} = tokenInfo || {};
      if (!isPushed && token !== undefined && token !== null && token !== '') {
        const formData = new FormData();
        formData.append('fcm_token', token);
        updateToken(formData);
      }
    }
    return () => {};
  }, [tokenInfo, updateToken]);

  const onChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };
  return (
    <Container>
      <TabHeader title={t('home')} />

      <InputBox
        placeholder={t('searchHere')}
        maxLength={60}
        returnKeyLabel={'search'}
        returnKeyType={'search'}
        textContentType={'name'}
        inputMode={'search'}
        keyboardType={'default'}
        placeholderTextColor={Colors.dimGray}
        value={query}
        onChangeText={onChangeText}
        inputStyle={[
          Styles.searchInput,
          CommonStyle.shadowBox,
          VS.mh_15,
          VS.mv_5,
          VS.mb_12,
        ]}
        renderRightIcon={() => {
          if (query.length > 0) {
            return (
              <TouchableOpacity
                onPress={() => {
                  onChangeText('');
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[VS.flex_1]}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        contentContainerStyle={[
          AppStyle.flexGrow,
          Styles.spaceBottom,
          VS.gap_15,
        ]}>
        {isFetching || isLoading ? (
          <View style={[VS.flex_1, VS.jc_center, VS.ai_center]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {(dashboardData?.home_slider_data ?? []).length > 0 && (
              <ImageSlider slider={dashboardData?.home_slider_data ?? []} />
            )}
            {(dashboardData?.look_who_s_trending_data ?? []).length > 0 && (
              <Trending data={dashboardData?.look_who_s_trending_data ?? []} />
            )}
            <AdCard onPressAdd={() => navigate('AddAdvertisement')} />
            {(dashboardData?.our_top_pick_data ?? []).length > 0 && (
              <TopPick data={dashboardData?.our_top_pick_data ?? []} />
            )}
            {(dashboardData?.footer_slider_data ?? []).length > 0 && (
              <ImageSlider slider={dashboardData?.footer_slider_data ?? []} />
            )}
          </>
        )}
      </ScrollView>
      <CommonModal ref={modalRef} />
    </Container>
  );
}
