import {Icons, Images} from '@assets';
import {
  AddReview,
  CustomBottomSheet,
  CustomBottomSheetMethods,
  ProgressImage,
  Text,
} from '@components';
import {NavigationParamStack} from '@data';
import {useUserInfo} from '@hooks';
import {RouteProp} from '@react-navigation/native';
import {useGetDirectoryDetailQuery} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {createOpenLink, navigate, Scale} from '@util';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {VideoRef} from 'react-native-video';
import {
  getUserLocation,
  openDirectoryWhatsApp,
  openEmail,
  openLocation,
  openPhoneCall,
  openWebsite,
  setField,
  validField,
} from '../../util/CommonHelper';
import AboutTab from './components/AboutTab';
import CompanyInfoTab from './components/CompanyInfoTab';
import ContactInfoTab from './components/ContactInfoTab';
import GalleryTab from './components/GalleryTab';
import {HeaderView} from './components/HeaderView';
import OtherInfoTab from './components/OtherInfoTab';
import ProductInfoTab from './components/ProductInfoTab';
import RatingTab from './components/RatingTab';
import ServiceCenterTab from './components/ServiceCenterTab';
import SocialButton from './components/SocialButton';
import SparePartInfoTab from './components/SparePartInfoTab';
import TechniciansWithTab from './components/TechniciansWithTab';
import WorkingWithTab from './components/WorkingWithTab';
import {Styles} from './Styles';

export default function DirectoryDetail({
  route,
}: {
  route: RouteProp<NavigationParamStack, 'DirectoryDetail'>;
}) {
  const {t} = useTranslation(['generic', 'register']);
  const {id} = route.params;

  const {
    isLoading,
    isFetching,
    data: directoryInfo,

    refetch,
  } = useGetDirectoryDetailQuery(id.toString(), {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const videoRefs = useRef<{[key: string]: VideoRef | null}>({});
  const sheetRef = useRef<CustomBottomSheetMethods | null>(null);

  const currentUser = useUserInfo();

  const [_catalogueSlice, _setCatalogueSlice] = useState<number>(3);
  const [selectedRating, setSelectedRating] = useState<number>(-1);
  const [tabArray, setTabArray] = useState<{key: string; label: string}[]>([
    {key: 'Gallery', label: 'Gallery'},
    {key: 'Product Info', label: 'Product Info'},
    {key: 'Company Info', label: 'Company Info'},
    {key: 'About', label: 'About'},
    {key: 'Other Info', label: 'Other Info'},
    {key: 'Rating & Review', label: 'Rating & Review'},
  ]);
  const [playingVideos, setPlayingVideos] = useState<{[key: string]: boolean}>(
    {},
  );
  const [activeIndex, setActiveIndex] = useState('Gallery');

  const haveReviewed = useMemo(() => {
    if (
      directoryInfo?.review_data?.some(
        review => review.user_id === currentUser?.id,
      )
    ) {
      return true;
    }
    return false;
  }, [directoryInfo?.review_data, currentUser?.id]);

  useEffect(() => {
    if (directoryInfo?.roles?.some(role => role.slug === 'sound_provider')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {key: 'Product Info', label: t('directoryTab.productInfo')},
        {key: 'Company Info', label: t('directoryTab.companyInfo')},
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'dealer')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {key: 'Product Info', label: t('directoryTab.productInfo')},
        {
          key: 'Company Info',
          label: t('directoryTab.companyInfo'),
        },
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Contact Info', label: t('directoryTab.contactInfo')},
        {key: 'Service Center', label: t('directoryTab.serviceCenter')},
        {key: 'Spare Part', label: t('directoryTab.sparePart')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'manufacturer')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {key: 'Product Info', label: t('directoryTab.productInfo')},
        {
          key: 'Company Info',
          label: t('directoryTab.companyInfo'),
        },
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Contact Info', label: t('directoryTab.contactInfo')},
        {key: 'Service Center', label: t('directoryTab.serviceCenter')},
        {key: 'Spare Part', label: t('directoryTab.sparePart')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'dj_operator')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {
          key: 'Company Info',
          label: t('directoryTab.myProfilePdf'),
        },
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'sound_operator')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {
          key: 'Company Info',
          label: t('directoryTab.myProfilePdf'),
        },
        {key: 'Working With', label: t('directoryTab.workingWith')},
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'spare_part')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {
          key: 'Company Info',
          label: t('directoryTab.companyInfo'),
        },
        {key: 'Spare Part', label: t('directoryTab.sparePart')},
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'service_center')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {key: 'Product Info', label: t('directoryTab.productInfo')},
        {
          key: 'Company Info',
          label: t('directoryTab.companyInfo'),
        },
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Contact Info', label: t('directoryTab.contactInfo')},
        {key: 'Service Center', label: t('directoryTab.serviceCenter')},
        {key: 'Spare Part', label: t('directoryTab.sparePart')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'repairing_shop')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {
          key: 'Company Info',
          label: t('directoryTab.companyInfo'),
        },
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Service Center', label: t('directoryTab.serviceCenter')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }

    if (directoryInfo?.roles?.some(role => role.slug === 'sound_education')) {
      setTabArray([
        {key: 'Gallery', label: t('directoryTab.gallery')},
        {
          key: 'Company Info',
          label: t('directoryTab.myProfilePdf'),
        },
        {key: 'About', label: t('directoryTab.about')},
        {key: 'Technicians Info', label: t('directoryTab.inHarmony')},
        {key: 'Rating & Review', label: t('directoryTab.ratingReview')},
      ]);
      return;
    }
  }, [directoryInfo?.roles, t]);

  // useEffect(() => {
  //   if (directoryInfo && directoryInfo?.review_avg_rating) {
  //     let rating = parseFloat(directoryInfo?.review_avg_rating.toFixed(1)) - 1;
  //     setSelectedRating(rating);
  //   }
  // }, [directoryInfo]);

  const openPDFViewer = async (pdfUrl: string) => {
    try {
      if (!pdfUrl || pdfUrl.trim() === '') {
        Alert.alert('Error', t('pdfNotFound'));
        return;
      }
      const supported = await Linking.canOpenURL(pdfUrl);

      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert(t('pdfViewerNotFound'), t('noPdfViewerInstalled'), [
          {text: t('cancel'), style: 'cancel'},
          {
            text: t('openInBrowser'),
            onPress: async () => {
              try {
                await Linking.openURL(pdfUrl);
              } catch (err) {
                Alert.alert('Error', t('failedToOpenPdfInBrowser'));
              }
            },
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', t('failedToOpenPdf'), [
        {text: t('ok'), style: 'default'},
      ]);
    }
  };

  return (
    <View style={[VS.flex_1, CommonStyle.bgWhite]}>
      {isFetching || isLoading ? (
        <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      ) : directoryInfo ? (
        <>
          <HeaderView info={directoryInfo} />
          <ScrollView
            style={[VS.flex_1]}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerStyle={[AppStyle.flexGrow, VS.pb_20]}>
            <View style={[VS.ph_16]}>
              <View
                style={[
                  Styles.carouselContainer,
                  // CommonStyle.bgLightGray,
                  AppStyle.hideOverFlow,
                  VS.br_10,
                  VS.mt_17,
                ]}>
                {validField(directoryInfo.visiting_card_image) ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      navigate('GalleryDetail', {
                        images: [directoryInfo.visiting_card_image_url],
                        type: 'image',
                        index: 0,
                      });
                    }}
                    style={[
                      Styles.carouselContainer,
                      AppStyle.hideOverFlow,
                      CommonStyle.bgLightGray,
                    ]}>
                    <ProgressImage
                      source={{uri: directoryInfo.visiting_card_image_url}}
                      containerStyle={[AppStyle.fullSize]}
                      mode={'center'}
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      Styles.carouselContainer,
                      AppStyle.hideOverFlow,
                      CommonStyle.bgLightGray,
                    ]}>
                    <ProgressImage
                      source={Images.noImage}
                      containerStyle={[AppStyle.fullSize]}
                      mode={'center'}
                    />
                  </View>
                )}
              </View>

              <View style={[VS.fd_row, VS.gap_10, VS.mt_10]}>
                <ProgressImage
                  source={{uri: directoryInfo?.image_url}}
                  containerStyle={[Styles.profileContainerImage]}
                  imageStyle={[Styles.profileImage]}
                  mode="cover"
                />
                <View style={[VS.flex_1, VS.jc_center, VS.mt_5, VS.gap_5]}>
                  <Text fontWeight="bold" style={[TS.fs_19]}>
                    {setField(directoryInfo?.name)}
                  </Text>
                  {validField(directoryInfo?.personal_name) && (
                    <Text fontWeight="medium" style={[TS.fs_15]}>
                      {setField(directoryInfo?.personal_name)}
                    </Text>
                  )}
                  {directoryInfo?.review_avg_rating > 0 && (
                    <View style={[VS.fd_row, VS.mr_7]}>
                      <View
                        style={[
                          Styles.ratingView,
                          VS.fd_row,
                          VS.ph_9,
                          VS.ai_center,
                          VS.gap_5,
                          VS.jc_center,
                          VS.pv_3,
                        ]}>
                        <Icons.Star />
                        <Text
                          fontWeight="quickSandSemiBold"
                          style={[CommonStyle.textAmber, TS.fs_13, TS.lh_16]}>
                          {`${directoryInfo?.review_avg_rating.toFixed(1)} (${
                            directoryInfo?.review_count
                          })`}
                        </Text>
                      </View>
                    </View>
                  )}
                  {validField(directoryInfo?.city_name) &&
                    validField(directoryInfo?.state_name) &&
                    validField(directoryInfo?.country_name) && (
                      <View
                        style={[
                          VS.fd_row,
                          VS.ai_start,
                          VS.ai_center,
                          VS.gap_8,
                        ]}>
                        <Icons.Map size={Scale(15)} />
                        <Text
                          fontWeight="medium"
                          numberOfLines={3}
                          style={[TS.fs_14, CommonStyle.textBlueGray]}>
                          {getUserLocation(
                            directoryInfo?.city_name,
                            directoryInfo?.state_name,
                            directoryInfo?.country_name,
                          )}
                        </Text>
                      </View>
                    )}
                </View>
              </View>

              <View
                style={[
                  VS.mt_15,
                  VS.fd_row,
                  VS.gap_5,
                  VS.ai_center,
                  VS.jc_center,
                ]}>
                {validField(directoryInfo?.mobile_number) && (
                  <SocialButton
                    icon={
                      <Icons.CallNow
                        color={Colors.primary}
                        width={Scale(20)}
                        height={Scale(20)}
                      />
                    }
                    label={t('call')}
                    onPress={() => openPhoneCall(directoryInfo?.mobile_number)}
                  />
                )}
                {validField(directoryInfo?.mobile_number) && (
                  <SocialButton
                    icon={
                      <Icons.WhatsAppLine
                        color={Colors.primary}
                        size={Scale(23)}
                      />
                    }
                    label={t('whatsapp')}
                    onPress={() =>
                      openDirectoryWhatsApp(directoryInfo, currentUser!)
                    }
                  />
                )}

                {validField(directoryInfo?.email) && (
                  <SocialButton
                    icon={
                      <Icons.Email color={Colors.primary} size={Scale(23)} />
                    }
                    label={t('email')}
                    onPress={() => openEmail(directoryInfo?.email)}
                  />
                )}

                {validField(directoryInfo?.location) ? (
                  <SocialButton
                    icon={<Icons.Address />}
                    label={t('location')}
                    onPress={() => openLocation(directoryInfo?.location)}
                  />
                ) : (
                  <>
                    {directoryInfo.business_data &&
                      directoryInfo.business_data.length > 0 &&
                      validField(directoryInfo.business_data[0].address) && (
                        <SocialButton
                          icon={<Icons.Address />}
                          label={t('location')}
                          onPress={() => {
                            try {
                              createOpenLink({
                                travelType: 'public_transport',
                                end: directoryInfo.business_data[0].address,
                                latitude: parseFloat(
                                  directoryInfo.business_data[0].latitude ??
                                    '0',
                                ),
                                longitude: parseFloat(
                                  directoryInfo.business_data[0].longitude ??
                                    '0',
                                ),
                              });
                            } catch (error) {}
                          }}
                        />
                      )}
                  </>
                )}
              </View>

              <View
                style={[
                  VS.mt_15,
                  VS.fd_row,
                  VS.gap_5,
                  VS.ai_center,
                  VS.jc_center,
                ]}>
                {validField(directoryInfo.business_data?.[0]?.web_link) ||
                validField(directoryInfo.web_link) ? (
                  <SocialButton
                    icon={<Icons.WebSite />}
                    label={t('website')}
                    onPress={() =>
                      openWebsite(
                        directoryInfo.business_data?.[0]?.web_link ??
                          directoryInfo.web_link ??
                          '',
                      )
                    }
                  />
                ) : null}

                {validField(directoryInfo.business_data?.[0]?.facebook_link) ||
                validField(directoryInfo.facebook_link) ? (
                  <SocialButton
                    icon={<Icons.SocialFacebook />}
                    label={t('facebook')}
                    onPress={() =>
                      openWebsite(
                        directoryInfo.business_data?.[0]?.facebook_link ??
                          directoryInfo.facebook_link ??
                          '',
                      )
                    }
                  />
                ) : null}
                {validField(directoryInfo.business_data?.[0]?.instagram_link) ||
                validField(directoryInfo.instagram_link) ? (
                  <SocialButton
                    icon={<Icons.SocialInstagram />}
                    label={t('instagram')}
                    onPress={() =>
                      openWebsite(
                        directoryInfo.business_data?.[0]?.instagram_link ??
                          directoryInfo.instagram_link ??
                          '',
                      )
                    }
                  />
                ) : null}
                {validField(directoryInfo.business_data?.[0]?.youtube_link) ||
                validField(directoryInfo.youtube_link) ? (
                  <SocialButton
                    icon={<Icons.SocialYoutube />}
                    label={t('youtube')}
                    onPress={() =>
                      openWebsite(
                        directoryInfo.business_data?.[0]?.youtube_link ??
                          directoryInfo.youtube_link ??
                          '',
                      )
                    }
                  />
                ) : null}
              </View>

              {!directoryInfo?.roles?.some(role =>
                [
                  'dj_operator',
                  'sound_operator',
                  'repairing_shop',
                  'sound_education',
                  'manufacturer',
                  'spare_part',
                ].includes(role.slug ?? ''),
              ) &&
                directoryInfo.business_data.length > 0 &&
                validField(directoryInfo.business_data[0].name) && (
                  <View
                    style={[
                      VS.br_10,
                      VS.mt_15,
                      VS.fd_row,
                      AppStyle.hideOverFlow,
                    ]}>
                    <Text
                      fontWeight={'semiBold'}
                      style={[
                        TS.fs_12,
                        TS.tt_uppercase,
                        VS.flex_1,
                        CommonStyle.textPrimary,
                      ]}>
                      {directoryInfo?.roles?.some(role =>
                        ['sound_provider', 'spare_part'].includes(
                          role.slug ?? '',
                        ),
                      )
                        ? t('register:forms.sound_provider.label')
                        : t('register:forms.business.label')}
                      :{' '}
                      <Text
                        fontWeight={'semiBold'}
                        style={[TS.fs_12, TS.tt_capitalize]}>
                        {directoryInfo.business_data[0].name}
                      </Text>
                    </Text>
                  </View>
                )}

              {directoryInfo.business_data.length > 0 &&
                validField(directoryInfo.business_data[0].gst_number) && (
                  <View style={[VS.mt_15, VS.fd_row, AppStyle.hideOverFlow]}>
                    <Text
                      fontWeight={'semiBold'}
                      style={[
                        TS.fs_12,
                        TS.tt_uppercase,
                        VS.flex_1,
                        CommonStyle.textPrimary,
                      ]}>
                      {t('register:forms.gst.label')} :{' '}
                      <Text fontWeight={'semiBold'} style={[TS.fs_12]}>
                        {directoryInfo.business_data[0].gst_number}
                      </Text>
                    </Text>
                  </View>
                )}

              <TouchableOpacity
                disabled={haveReviewed}
                onPress={() => {
                  sheetRef?.current?.onPresent();
                }}
                activeOpacity={1}
                style={[VS.fd_row, VS.ai_center]}>
                <Text
                  fontWeight={'semiBold'}
                  style={[TS.fs_12, TS.tt_uppercase, VS.pv_14, VS.flex_1]}>
                  {t('rateCompany')}
                </Text>
                <View style={[VS.ai_center, VS.jc_center, VS.fd_row, VS.gap_5]}>
                  {Array(5)
                    .fill(0)
                    .map((__, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={1}
                          disabled={haveReviewed}
                          onPress={() => {
                            sheetRef?.current?.onPresent();
                          }}>
                          <Icons.Star size={23} color={Colors.dimGray} />
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceVertical={false}
                bounces={false}
                alwaysBounceHorizontal={false}>
                <View
                  style={[
                    {height: Scale(50)},
                    VS.fd_row,
                    VS.ph_11,
                    VS.gap_15,
                    VS.ai_center,
                  ]}>
                  {tabArray.map((tab, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={1}
                      onPress={() => setActiveIndex(tab.key)}>
                      <Text fontWeight="medium" style={[TS.fs_15]}>
                        {tab.label}
                      </Text>
                      <View
                        style={[
                          VS.mt_2,
                          VS.h_2,
                          activeIndex === tab.key
                            ? CommonStyle.bgPrimary
                            : CommonStyle.bgWhite,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View style={[VS.ph_16]}>
              {activeIndex === 'Gallery' && (
                <GalleryTab
                  details={directoryInfo}
                  videoRefs={videoRefs}
                  playingVideos={playingVideos}
                  setPlayingVideos={setPlayingVideos}
                />
              )}

              {activeIndex === 'Product Info' && (
                <ProductInfoTab info={directoryInfo} />
              )}

              {activeIndex === 'Company Info' && (
                <CompanyInfoTab
                  info={directoryInfo}
                  openPDFViewer={openPDFViewer}
                />
              )}

              {activeIndex === 'Spare Part' && (
                <SparePartInfoTab info={directoryInfo} />
              )}

              {activeIndex === 'About' && <AboutTab info={directoryInfo} />}

              {activeIndex === 'Other Info' &&
                directoryInfo?.roles?.some(
                  role => role.slug !== 'sound_provider',
                ) && <OtherInfoTab info={directoryInfo} />}

              {activeIndex === 'Contact Info' && (
                <ContactInfoTab info={directoryInfo} />
              )}

              {activeIndex === 'Service Center' && (
                <ServiceCenterTab info={directoryInfo} />
              )}

              {activeIndex === 'Technicians Info' && (
                <TechniciansWithTab info={directoryInfo} />
              )}

              {activeIndex === 'Working With' && (
                <WorkingWithTab info={directoryInfo} />
              )}
              {activeIndex === 'Rating & Review' && (
                <RatingTab info={directoryInfo} />
              )}
            </View>
          </ScrollView>
        </>
      ) : null}

      <CustomBottomSheet ref={sheetRef}>
        <AddReview
          onClose={() => sheetRef?.current?.onDismiss()}
          selectedRating={selectedRating}
          onSelectedRating={setSelectedRating}
          review_type="directory"
          userName={directoryInfo?.name ?? ''}
          relevant_id={directoryInfo?.id.toString() ?? ''}
          onSuccessCallback={() => {
            sheetRef?.current?.onDismiss();
            refetch();
          }}
        />
      </CustomBottomSheet>
    </View>
  );
}
