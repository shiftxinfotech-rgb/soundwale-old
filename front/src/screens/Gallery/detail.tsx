import {Icons} from '@assets';
import {CommonHeader, Container, VectorIcon} from '@components';
import {NavigationParamStack} from '@data';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import {RouteProp} from '@react-navigation/native';
import {AppStyle, Colors, CommonStyle, VS} from '@theme';
import {height, Scale, width} from '@util';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {FadeIn, FadeOut} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import Video, {VideoRef} from 'react-native-video';

export default function GalleryDetail({
  route,
}: {
  route: RouteProp<NavigationParamStack, 'GalleryDetail'>;
}) {
  const {t} = useTranslation('generic');
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<{[key: string]: VideoRef | null}>({});
  const [playingVideos, setPlayingVideos] = useState<{[key: string]: boolean}>(
    {},
  );

  console.log('route.params', route?.params?.images);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: route.params.index,
          animated: true,
        });
      }, 100);
    }
  }, [route.params.index]);

  const renderImage = ({item}: {item: string}) => {
    return (
      <View style={[VS.flex_1]}>
        <ImageZoom
          uri={item}
          entering={FadeIn}
          exiting={FadeOut}
          minScale={2}
          maxScale={8}
          doubleTapScale={3}
          isSingleTapEnabled
          isDoubleTapEnabled
          resizeMethod="scale"
        />
      </View>
    );
  };

  return (
    <Container>
      <CommonHeader
        title={route.params.type === 'image' ? t('photos') : t('video')}
        withBackArrow
        withChatNotification={false}
      />

      {route.params.type === 'image' ? (
        <Carousel
          loop={true}
          width={width}
          height={height - 100}
          data={route.params.images ?? []}
          renderItem={renderImage}
          scrollAnimationDuration={1200}
          defaultIndex={route.params.index}
        />
      ) : null}

      {route.params.type === 'video' && (
        <View style={[VS.ai_center, VS.jc_center, VS.flex_1]}>
          <Video
            source={{uri: route.params?.video}}
            ref={ref => {
              if (ref) {
                videoRefs.current[route.params?.video] = ref;
              }
            }}
            paused={!playingVideos[route.params?.video]}
            playInBackground={false}
            repeat={false}
            resizeMode="contain"
            controls={false}
            style={[
              AppStyle.fullWidth,
              VS.ai_center,
              VS.jc_center,
              VS.br_10,
              {
                height: Scale(200),
              },
            ]}
          />
          <View style={[VS.fd_row]}>
            <TouchableOpacity
              hitSlop={CommonStyle.hitSlop}
              style={[VS.ai_center, VS.jc_center, VS.mt_10]}
              onPress={() => {
                setPlayingVideos(prev => {
                  const newState = {...prev};
                  if (newState[route.params?.video]) {
                    newState[route.params?.video] = false;
                  } else {
                    Object.keys(newState).forEach(key => {
                      newState[key] = false;
                    });
                    newState[route.params?.video] = true;
                    videoRefs.current[route.params?.video]?.seek(0);
                  }
                  return newState;
                });
              }}>
              {!playingVideos[route.params?.video] ? (
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
      )}
    </Container>
  );
}
