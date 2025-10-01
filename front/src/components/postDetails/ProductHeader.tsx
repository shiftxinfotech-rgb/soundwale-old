import {Icons, Images} from '@assets';
import {ImageBean, NavigationParamStack, ProductBean} from '@data';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AppStyle, Colors, CommonStyle, VS} from '@theme';
import {
  hexToRgbA,
  isValidImageUrl,
  navigate,
  onSharePost,
  Scale,
  width,
} from '@util';
import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {ProgressImage} from '../ProgressImage';
import {Styles} from './Styles';

type Props = {
  requestType: 'buyer' | 'seller';
  bean?: ProductBean;
  onToggleLike?: () => void;
  categories_id?: string;
};

const ProductHeader = ({
  bean,
  onToggleLike,
  categories_id,
  requestType,
}: Props) => {
  const progress = useSharedValue<number>(0);
  const scrollOffsetValue = useSharedValue<number>(0);

  const {images, main_category_name, is_likes, description, id} = bean || {};

  const {goBack} = useNavigation<NavigationProp<NavigationParamStack>>();

  const onPressShare = useCallback(() => {
    onSharePost(requestType, id?.toString() ?? '', categories_id ?? '', {
      title: main_category_name ?? '',
      description: description ?? '',
      image: images?.[0]?.image_url ?? '',
    });
  }, [requestType, id, categories_id, main_category_name, description, images]);

  const _renderCarouselItem = ({
    item,
    index,
  }: {
    item: ImageBean;
    index: number;
  }) => {
    const {image_url} = item || {};
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigate('GalleryDetail', {
            images: images?.map(el => el?.image_url ?? ''),
            type: 'image',
            index: index,
          });
        }}
        style={[
          Styles.carouselContainer,
          AppStyle.hideOverFlow,
          CommonStyle.bgLightGray,
        ]}>
        {isValidImageUrl(image_url) && (
          <ProgressImage
            source={{uri: image_url}}
            containerStyle={[AppStyle.fullSize]}
            mode={'center'}
          />
        )}
        <LinearGradient
          colors={[
            hexToRgbA(Colors.black, '0.6'),
            'transparent',
            'transparent',
            hexToRgbA(Colors.black, '0.6'),
          ]}
          locations={[0, 0.3, 0.6, 0.97]}
          style={[StyleSheet.absoluteFillObject]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.headerContainer}>
      <View
        style={[
          Styles.carouselContainer,
          CommonStyle.bgLightGray,
          AppStyle.hideOverFlow,
          VS.ai_center,
          VS.jc_center,
        ]}>
        {images !== undefined &&
        images !== null &&
        Array.isArray(images) &&
        images.length > 0 ? (
          <>
            <Carousel
              loop={true}
              autoPlay={false}
              autoPlayInterval={5000}
              pagingEnabled={true}
              width={width}
              height={Scale(270)}
              data={images ?? []}
              renderItem={_renderCarouselItem}
              style={{width: width, height: Scale(270)}}
              onProgressChange={progress}
              defaultScrollOffsetValue={scrollOffsetValue}
              onConfigurePanGesture={(g: {enabled: (arg0: boolean) => any}) => {
                'worklet';
                g.enabled(false);
              }}
            />
            {images.length > 1 && (
              <View style={[Styles.paginationContainer]}>
                <Pagination.Basic
                  data={images}
                  progress={progress}
                  dotStyle={Styles.dotStyle}
                  containerStyle={{gap: Scale(5)}}
                  activeDotStyle={{
                    backgroundColor: Colors.gradientStart,
                    width: Scale(20),
                    height: Scale(8),
                    borderRadius: Scale(10),
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <View style={[VS.ai_center, VS.mb_20]}>
            <ProgressImage
              source={Images.noImage}
              mode="contain"
              containerStyle={[{height: Scale(50), width: width - 50}]}
            />
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[
          Styles.backButton,
          Styles.iconButton,
          VS.ai_center,
          VS.jc_center,
        ]}
        activeOpacity={1}
        onPress={() => goBack()}>
        <Icons.ArrowBack color={Colors.white} />
      </TouchableOpacity>
      <View style={[Styles.iconRow, VS.fd_row, VS.gap_12, VS.ai_center]}>
        <TouchableOpacity
          onPress={onToggleLike}
          activeOpacity={0.8}
          style={[Styles.iconButton, VS.ai_center, VS.jc_center]}>
          <Icons.Heart color={is_likes === 1 ? Colors.primary : Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressShare}
          style={[Styles.iconButton, VS.ai_center, VS.jc_center]}>
          <Icons.Share />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductHeader;
