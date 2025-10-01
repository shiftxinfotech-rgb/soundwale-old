import {Icons} from '@assets';
import {
  CommonHeader,
  Container,
  NoData,
  ProgressImage,
  Text,
  VectorIcon,
} from '@components';
import {BusinessShopImage} from '@data';
import {useToggleSnackBar} from '@hooks';
import {useIsFocused} from '@react-navigation/native';
import {useDeleteGalleyMutation, useGetGalleryQuery} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {formatGridData, navigate, normalizeApiError, Scale} from '@util';
import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {Styles} from './Styles';

export default function Buyers() {
  const isFocused = useIsFocused();
  const {
    data: galleryData,
    isFetching,
    isLoading,
    refetch,
  } = useGetGalleryQuery(undefined, {
    refetchOnFocus: true,
    skip: !isFocused,
    refetchOnMountOrArgChange: true,
  });

  const videoRefs = useRef<{[key: string]: VideoRef | null}>({});
  const [playingVideos, setPlayingVideos] = useState<{[key: string]: boolean}>(
    {},
  );
  const [deleteGallery, {}] = useDeleteGalleyMutation();
  const {toggleMessage} = useToggleSnackBar();
  const {t} = useTranslation(['generic']);

  const removeImage = useCallback(
    async (type: string, id: number) => {
      try {
        const formdata = new FormData();

        formdata.append('id', id);
        formdata.append('type', type);
        const result = await deleteGallery(formdata).unwrap();

        const {status, message} = result;
        if (status) {
          refetch();
        } else {
          toggleMessage(message);
        }
      } catch (error: unknown) {
        const {message} = normalizeApiError(error);
        if (message) {
          toggleMessage(message);
        } else {
          toggleMessage(t('generic:serverError'));
        }
      }
    },
    [deleteGallery, refetch, t, toggleMessage],
  );

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader
          title={t('gallery')}
          withBackArrow
          withChatNotification={false}
        />
        {isLoading || isFetching ? (
          <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : galleryData ? (
          <ScrollView
            style={[VS.flex_1]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[AppStyle.flexGrow]}>
            <View style={[VS.flex_1, VS.gap_15, VS.ph_15]}>
              {galleryData!.business_shop_images_data.length > 0 ||
              galleryData!.business_shop_video_data.length > 0 ? (
                <>
                  {galleryData!.business_shop_images_data.length > 0 && (
                    <View style={[VS.gap_15]}>
                      <Text fontWeight="semiBold" style={[TS.fs_20]}>
                        {t('photos')}
                      </Text>
                      <View style={[VS.fd_row, VS.gap_10, AppStyle.flexWrap]}>
                        {formatGridData<BusinessShopImage>(
                          galleryData!.business_shop_images_data,
                          3,
                        ).map((item, index) => {
                          if (item.__isPlaceholder) {
                            return (
                              <View key={index} style={Styles.imageView} />
                            );
                          }
                          return (
                            <TouchableOpacity
                              key={index}
                              activeOpacity={1}
                              style={Styles.imageView}
                              onPress={() => {
                                navigate('GalleryDetail', {
                                  images:
                                    galleryData!.business_shop_images_data.map(
                                      el => el.image_url,
                                    ),
                                  type: 'image',
                                });
                              }}>
                              <ProgressImage
                                source={{uri: item?.image_url}}
                                mode="cover"
                                containerStyle={[
                                  AppStyle.fullWidth,
                                  Styles.productImage,
                                ]}
                                imageStyle={[VS.br_10]}
                              />
                              <TouchableOpacity
                                onPress={() => removeImage('image', item.id)}
                                style={[VS.pt_7, VS.ai_center, VS.jc_center]}>
                                <Icons.Delete color={Colors.primary} />
                              </TouchableOpacity>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {galleryData!.business_shop_video_data.length > 0 ? (
                    <View style={[VS.gap_15]}>
                      <Text fontWeight="semiBold" style={[TS.fs_20]}>
                        {t('video')}
                      </Text>
                      <View style={[VS.fd_row, VS.gap_10, AppStyle.flexWrap]}>
                        {galleryData!.business_shop_video_data?.map(
                          (item, index) => (
                            <View key={index} style={Styles.imageView}>
                              <View
                                style={[
                                  VS.br_10,
                                  Styles.shortsVideo,
                                  VS.ai_center,
                                ]}>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => {
                                    navigate('GalleryDetail', {
                                      video:
                                        galleryData!.business_shop_video_data[0]
                                          .video_url,
                                      type: 'video',
                                    });
                                  }}>
                                  <Video
                                    source={{uri: item?.video_url}}
                                    ref={ref => {
                                      if (ref) {
                                        videoRefs.current[item.video_url] = ref;
                                      }
                                    }}
                                    paused={!playingVideos[item.video_url]}
                                    playInBackground={false}
                                    repeat={false}
                                    resizeMode="contain"
                                    controls={false}
                                    style={[
                                      AppStyle.fullWidth,
                                      Styles.shortsVideo,
                                      VS.br_10,
                                      {
                                        height: Scale(120),
                                        backgroundColor: Colors.lightGray,
                                      },
                                    ]}
                                  />
                                </TouchableOpacity>
                                <View style={[VS.fd_row]}>
                                  <TouchableOpacity
                                    hitSlop={CommonStyle.hitSlop}
                                    style={[
                                      VS.ai_center,
                                      VS.jc_center,
                                      VS.mt_10,
                                    ]}
                                    onPress={() => {
                                      setPlayingVideos(prev => {
                                        const newState = {...prev};
                                        if (newState[item.video_url]) {
                                          newState[item.video_url] = false;
                                        } else {
                                          Object.keys(newState).forEach(key => {
                                            newState[key] = false;
                                          });
                                          newState[item.video_url] = true;
                                          videoRefs.current[
                                            item.video_url
                                          ]?.seek(0);
                                        }
                                        return newState;
                                      });
                                    }}>
                                    {!playingVideos[item.video_url] ? (
                                      <Icons.Play color={Colors.black} />
                                    ) : (
                                      <VectorIcon
                                        iconColor={Colors.black}
                                        iconSize={20}
                                        iconType={5}
                                        iconName="pause"
                                      />
                                    )}
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      removeImage('video', item.id)
                                    }
                                    style={[
                                      VS.pt_7,
                                      VS.ai_center,
                                      VS.ml_5,
                                      VS.jc_center,
                                    ]}>
                                    <Icons.Delete color={Colors.primary} />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          ),
                        )}
                      </View>
                    </View>
                  ) : null}
                </>
              ) : (
                <>
                  <NoData message={t('noImagesFound')} />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[Styles.addButtonContainer]}
                    onPress={() => navigate('AddGallery')}>
                    <Icons.CirclePlus />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        ) : (
          <>
            <NoData message={t('noImagesFound')} />
            <TouchableOpacity
              activeOpacity={1}
              style={[Styles.addButtonContainer]}
              onPress={() => navigate('AddGallery')}>
              <Icons.CirclePlus />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          activeOpacity={1}
          style={[Styles.addButtonContainer]}
          onPress={() => navigate('AddGallery')}>
          <Icons.CirclePlus />
        </TouchableOpacity>
      </View>
    </Container>
  );
}
