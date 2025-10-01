import {Icons} from '@assets';
import {
  CommonHeader,
  CommonModal,
  CommonModalRef,
  Container,
  CustomBottomSheet,
  CustomBottomSheetMethods,
  CustomButton,
  ProgressImage,
  Text,
  UploadMedia,
} from '@components';
import {NavigationParamStack} from '@data';
import {useToggleSnackBar, useUserInfo} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useAddGalleryMutation} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {hexToRgbA, isValidImageUrl, normalizeApiError, Scale} from '@util';
import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from './Styles';

type AddGalleryRouteProp = RouteProp<NavigationParamStack, 'AddGallery'>;

const AddShortScreen: React.FC<{route: AddGalleryRouteProp}> = () => {
  const {toggleMessage} = useToggleSnackBar();
  const {t} = useTranslation(['generic']);
  const modalRef = useRef<CommonModalRef>(null);
  const {goBack} = useNavigation<NavigationProp<NavigationParamStack>>();
  const userDetail = useUserInfo();
  const flatListRef = useRef<FlatList>(null);

  const [addGallery, {isLoading}] = useAddGalleryMutation();
  const [selectedVideo, setSelectedVideo] = useState<{
    uri: string;
    name: string;
  } | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const sheetRef = useRef<CustomBottomSheetMethods | null>(null);

  const onSubmit = useCallback(async () => {
    if (selectedImages.length === 0) {
      toggleMessage(t('pleaseSelectAtLeastOnePhoto'));
      return;
    }
    try {
      const formdata = new FormData();
      if (selectedVideo) {
        const ext = selectedVideo.name.split('.').pop()?.toLowerCase() || 'mp4';
        const type = `video/${ext}`;
        formdata.append('video', {
          uri: selectedVideo.uri,
          name: selectedVideo.name.replace(/\s+/g, ''),
          type,
        });
      }
      formdata.append('user_id', userDetail?.id);

      if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach(element => {
          if ('path' in element && element.path) {
            if (!isValidImageUrl(element.path)) {
              const filePath = element.path;
              const name = filePath.split('/').pop() ?? 'image.jpg';
              const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
              const type = `image/${ext}`;
              formdata.append('shop_images[]', {
                uri: filePath,
                name,
                type,
              });
            }
          }
        });
      }

      const result = await addGallery(formdata).unwrap();

      const {status, message} = result;
      if (status) {
        modalRef?.current?.show({
          title: t('success'),
          content: message,
          isCancel: false,
          onClose: goBack,
        });
        setSelectedVideo(null);
        setSelectedImages([]);
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
  }, [
    addGallery,
    goBack,
    selectedImages,
    selectedVideo,
    t,
    toggleMessage,
    userDetail?.id,
  ]);

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader title={t('uploadPhotos')} withBackArrow />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[VS.ph_15, VS.gap_10, VS.mt_10]}>
            <TouchableOpacity
              style={[Styles.videoUploadContainer]}
              activeOpacity={1}
              onPress={() => sheetRef?.current?.onPresent()}>
              <LinearGradient
                colors={[
                  Colors.white,
                  Colors.white,
                  hexToRgbA(Colors.gradientStart, '0.3'),
                  hexToRgbA(Colors.gradientEnd, '0.3'),
                ]}
                locations={[0, 0.65, 0.9, 1]}
                start={{x: 0.6, y: 1}}
                end={{x: 1, y: 0}}
                style={[VS.br_12, AppStyle.fullWidth]}>
                <View
                  style={[
                    VS.ai_center,
                    VS.as_center,
                    VS.jc_center,
                    VS.gap_16,
                    VS.pv_36,
                  ]}>
                  <Icons.UploadVideo />
                  <View
                    style={[
                      VS.gap_10,
                      VS.ai_center,
                      VS.as_center,
                      VS.jc_center,
                    ]}>
                    <Text
                      fontWeight={'bold'}
                      style={[TS.fs_21, CommonStyle.textBlack]}>
                      {t('selectPhoto')}
                    </Text>
                    <Text
                      fontWeight={'medium'}
                      style={[TS.fs_14, CommonStyle.textBlack]}>
                      {t('supportedFormat')}{' '}
                      <Text style={[TS.fs_14, CommonStyle.textPrimary]}>
                        JPG, PNG
                      </Text>
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={selectedImages}
              horizontal
              keyExtractor={item => item.path}
              renderItem={({item, index}) => (
                <View key={index} style={[VS.mr_10, VS.ai_center]}>
                  <ProgressImage
                    source={{uri: item.path}}
                    imageStyle={{
                      width: Scale(80),
                      height: Scale(80),
                      borderRadius: Scale(10),
                    }}
                    mode="cover"
                    containerStyle={{
                      width: Scale(80),
                      height: Scale(80),
                      borderRadius: Scale(10),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={[VS.pt_5, VS.ai_center, VS.jc_center]}>
                    <Icons.Delete color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            />

            <CustomButton
              buttonTitle={t('submit')}
              isLoading={isLoading}
              containerStyle={[VS.mt_10]}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </View>
      <CommonModal ref={modalRef} />

      <CustomBottomSheet ref={sheetRef}>
        <UploadMedia
          croppingOptions={{
            multiple: true,
            cropperCircleOverlay: false,
            freeStyleCropEnabled: true,
          }}
          onSelectMedia={result => {
            if (result !== null) {
              if (Array.isArray(result) && result.length > 0) {
                setSelectedImages(prevImages => [...prevImages, ...result]);
                setTimeout(() => {
                  flatListRef?.current?.scrollToEnd({animated: true});
                }, 100);
              } else {
                setSelectedImages(prevImages => [...prevImages, result]);
                setTimeout(() => {
                  flatListRef?.current?.scrollToEnd({animated: true});
                }, 100);
              }
            }
          }}
          onCloseAction={() => sheetRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
    </Container>
  );
};

export default AddShortScreen;
