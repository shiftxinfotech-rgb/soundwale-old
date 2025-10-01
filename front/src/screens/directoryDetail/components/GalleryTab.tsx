import {Icons} from '@assets';

import {NoData, ProgressImage, Text, VectorIcon} from '@components';
import {BusinessShopImage, BusinessVideo, DirectoryDetail} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {formatGridData, navigate, Scale} from '@util';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {Styles} from '../Styles';
import {useTranslation} from 'react-i18next';

type GalleryTabProps = {
  details: DirectoryDetail;
  videoRefs: React.RefObject<{[key: string]: VideoRef | null}>;
  playingVideos: {[key: string]: boolean};
  setPlayingVideos: React.Dispatch<
    React.SetStateAction<{[key: string]: boolean}>
  >;
};

export default function GalleryTab({
  details,
  videoRefs,
  playingVideos,
  setPlayingVideos,
}: GalleryTabProps) {
  const {t} = useTranslation(['generic']);
  const {business_shop_images_data, business_shop_video_data} = details;

  const hasImages =
    Array.isArray(business_shop_images_data) &&
    business_shop_images_data.length > 0;
  const hasVideos =
    Array.isArray(business_shop_video_data) &&
    business_shop_video_data.length > 0;

  let imageGrid: BusinessShopImage[] = [];
  let videoGrid: BusinessVideo[] = [];

  if (!hasImages && !hasVideos) {
    return <NoData message={t('noInformationFound')} />;
  }
  if (hasImages) {
    imageGrid = formatGridData<BusinessShopImage>(business_shop_images_data, 3);
  }
  if (hasVideos) {
    videoGrid = formatGridData<BusinessVideo>(business_shop_video_data, 3);
  }

  return (
    <View style={[VS.gap_10]}>
      {hasImages ? (
        <>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('photos')}
          </Text>
          <View
            style={[
              VS.gap_10,
              CommonStyle.shadowBoxLight,
              VS.br_10,
              VS.p_10,
              VS.fd_row,
              VS.ai_center,
              VS.jc_space_around,
              AppStyle.flexWrap,
            ]}>
            {imageGrid.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => {
                  navigate('GalleryDetail', {
                    images: business_shop_images_data.map(el => el.image_url),
                    type: 'image',
                    index: index,
                  });
                }}
                style={Styles.imageView}>
                <ProgressImage
                  source={{uri: item?.image_url}}
                  containerStyle={[AppStyle.fullWidth, Styles.productImage]}
                  mode="cover"
                  imageStyle={[VS.br_10]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <></>
      )}

      {hasVideos ? (
        <>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('video')}
          </Text>
          {videoGrid.map((item, index) => (
            <View key={index} style={Styles.imageView}>
              <View style={[VS.br_10, Styles.shortsVideo, VS.ai_center]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    navigate('GalleryDetail', {
                      video: business_shop_video_data[0].video_url,
                      type: 'video',
                      index: index,
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
                    style={[VS.ai_center, VS.jc_center, VS.mt_10]}
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
                          videoRefs.current[item.video_url]?.seek(0);
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
                </View>
              </View>
            </View>
          ))}
        </>
      ) : (
        <></>
      )}
    </View>
  );
}
