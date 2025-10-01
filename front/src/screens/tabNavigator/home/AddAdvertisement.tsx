import {Icons} from '@assets';
import {
  CommonHeader,
  CommonModal,
  CommonModalRef,
  Container,
  CountryCodePicker,
  CountrySelector,
  CustomBottomSheet,
  CustomBottomSheetMethods,
  CustomButton,
  InputBoxRHF,
  InputHeader,
  SelectionInputRHF,
  UploadMedia,
} from '@components';
import {CountryCodeMethods, CountryCodeParams} from '@data';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToggleSnackBar, useUserInfo} from '@hooks';
import {useNavigation} from '@react-navigation/native';
import {useAddAdvertisementMutation} from '@services';
import {AppStyle, VS} from '@theme';
import {
  fetchCodeInformation,
  getSampleNumber,
  normalizeApiError,
  URL_REGEX,
  validField,
} from '@util';
import {TFunction} from 'i18next';
import phone from 'phone';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import * as Yup from 'yup';

type AdvertisementInputFormParam = {
  requirements: string;
  image: ImageOrVideo;
  name: string;
  email: string;

  code?: CountryCodeParams;
  mobile: string;
};

const validationSchema = (t: TFunction<'contactUs', undefined>) =>
  Yup.object().shape({
    name: Yup.string().required(t('validation.name.required')),
    email: Yup.string()
      .required(t('validation.email.required'))
      .email(t('validation.email.invalid'))
      .matches(URL_REGEX.emailRegex, t('validation.email.invalid')),
    mobile: Yup.string()
      .required(t('validation.phone.required'))
      .test('phone-validation', function (value) {
        const {dial_code, name} = this.parent.code;
        const result = phone(`${dial_code} ${value}`);
        if (!result.isValid) {
          return this.createError({
            message: t('validation.phone.invalid', {countryName: name}),
          });
        }
        return true;
      }),
    image: Yup.mixed<ImageOrVideo>().required('Image is required'),
  });
export default function AddAdvertisementScreen() {
  const {t} = useTranslation(['contactUs', 'generic']);
  const {toggleMessage} = useToggleSnackBar();
  const modalRef = useRef<CommonModalRef>(null);
  const {goBack} = useNavigation();
  const userDetail = useUserInfo();
  const mediaPickerRef = useRef<CustomBottomSheetMethods>(null);

  const countrySheetRef = useRef<CountryCodeMethods | null>(null);

  const [countryCodeInfo, setCountryCodeInfo] = useState<
    CountryCodeParams | undefined
  >(undefined);
  const [phoneLength, setPhoneLength] = useState<number>(10);
  const [addAdvertisement, {isLoading}] = useAddAdvertisementMutation();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    trigger,
    clearErrors,
    watch,
  } = useForm<AdvertisementInputFormParam>({
    defaultValues: {
      name: userDetail?.name ?? '',
      email: userDetail?.email ?? '',
      mobile: userDetail?.mobile_number ?? '',
      code: undefined,
      image: undefined,
    },
    resolver: yupResolver(validationSchema(t) as any),
    mode: 'onChange',
    criteriaMode: 'firstError',
    delayError: 100,
    shouldFocusError: true,
  });
  const mobile_no = watch('mobile');

  useEffect(() => {
    if (userDetail) {
      const cName = userDetail?.code_sort;
      const info = fetchCodeInformation(cName);
      if (info != null) {
        setCountryCodeInfo(info);
        setValue('code', info);
        const pLen = getSampleNumber(info)?.length ?? 10;
        setPhoneLength(pLen);
      }
      //   getDealerCompany(userDetail?.id?.toString() ?? '');
    }
  }, [setValue, userDetail]);

  const submitForm = useCallback(
    async (data: AdvertisementInputFormParam) => {
      try {
        const formData = new FormData();
        formData.append('name', data.name ?? '');
        formData.append('email', data.email ?? '');
        formData.append('code', data.code?.dial_code ?? '');
        formData.append('mobile', data.mobile ?? '');
        formData.append('code_sort', data.code?.code ?? '');
        // formData.append('company_id', data.company.id ?? '');

        // formData.append('your_requirement', data?.requirements ?? '');
        if (data.image) {
          const filePath = data.image?.path ?? '';
          if (filePath) {
            const name = filePath?.split('/').pop() ?? 'profile.jpg';
            const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
            const type = `image/${ext}`;
            formData.append('image', {
              uri: filePath,
              name,
              type,
            });
          }
        }

        const result = await addAdvertisement(formData).unwrap();
        const {status, message} = result;
        if (status) {
          modalRef?.current?.show({
            title: 'Success!',
            content: message,
            isCancel: false,
            onClose: goBack,
          });
          reset();
          if (countryCodeInfo) {
            setValue('code', countryCodeInfo);
            const pLen = getSampleNumber(countryCodeInfo)?.length ?? 10;
            setPhoneLength(pLen);
          }
        } else {
          toggleMessage(message);
        }
      } catch (error: unknown) {
        const {message, errors: fieldErrors} = normalizeApiError(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof AdvertisementInputFormParam, {
                type: 'manual',
                message: messages[0],
              });
            }
          });
        } else if (message) {
          toggleMessage(message);
        } else {
          toggleMessage(t('generic:serverError'));
        }
      }
    },
    [
      addAdvertisement,
      countryCodeInfo,
      goBack,
      reset,
      setError,
      setValue,
      t,
      toggleMessage,
    ],
  );

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader
          title={'Add Advertisement'}
          withBackArrow
          withChatNotification={false}
        />
        <View style={[VS.pv_7, VS.ph_16, VS.flex_1]}>
          <KeyboardAwareScrollView
            contentContainerStyle={[AppStyle.flexGrow]}
            showsVerticalScrollIndicator={false}
            ScrollViewComponent={ScrollView}
            alwaysBounceVertical={false}
            // enableOnAndroid={true}
            // bouncesZoom={false}
            // alwaysBounceVertical={false}
            // extraScrollHeight={100}
            // keyboardDismissMode={'interactive'}
            // keyboardShouldPersistTaps={'handled'}
          >
            <View style={[VS.gap_17]}>
              <InputBoxRHF
                fieldName="name"
                control={control}
                headerComponent={<InputHeader title={t('name')} />}
                placeholder={t('namePlaceholder')}
                autoCapitalize={'words'}
                maxLength={30}
              />
              <InputBoxRHF
                fieldName="email"
                control={control}
                headerComponent={<InputHeader title={t('emailId')} />}
                placeholder={t('emailIdPlaceholder')}
                autoCapitalize={'none'}
                inputMode={'email'}
                textContentType={'emailAddress'}
                maxLength={246}
              />

              <InputBoxRHF
                fieldName="mobile"
                control={control}
                headerComponent={<InputHeader title={t('phoneNo')} />}
                placeholder={t('phoneNoPlaceholder')}
                autoCapitalize={'none'}
                editable={false}
                inputMode={'numeric'}
                inputStyle={[VS.ph_10]}
                maxLength={phoneLength}
                renderLeftIcon={
                  <Controller
                    control={control}
                    name={'code'}
                    render={({field: {value}}) => (
                      <CountrySelector
                        countryCode={value}
                        onPressButton={() => {
                          countrySheetRef?.current?.onPresent();
                        }}
                      />
                    )}
                  />
                }
              />

              <SelectionInputRHF
                fieldName="image"
                control={control}
                headerComponent={<InputHeader title="image" />}
                placeholder="Upload Image"
                displayValue={val => val.filename ?? ''}
                onPress={() => {
                  modalRef?.current?.hide();
                  mediaPickerRef?.current?.onPresent();
                }}
                renderRightIcon={<Icons.Uploader />}
              />

              <CustomButton
                buttonTitle={t('submit')}
                isLoading={isLoading}
                containerStyle={VS.mt_5}
                wrapperStyle={[VS.mb_20]}
                onPress={handleSubmit(submitForm)}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        <CountryCodePicker
          ref={countrySheetRef}
          onSelectCountry={(info: CountryCodeParams) => {
            setValue('code', info);
            const pLen = getSampleNumber(info)?.length ?? 10;
            setPhoneLength(pLen);
            if (validField(mobile_no)) {
              trigger('mobile');
            }
          }}
        />
      </View>
      <CommonModal ref={modalRef} />

      <CustomBottomSheet ref={mediaPickerRef}>
        <UploadMedia
          // croppingOptions={{cropping: true}}
          croppingOptions={{
            cropperCircleOverlay: false,
            freeStyleCropEnabled: true,
            // width: 1600,
            // height: 900,
          }}
          onSelectMedia={result => {
            if (result !== null) {
              setValue('image', result);
              clearErrors('image');
            }
          }}
          onCloseAction={() => mediaPickerRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
    </Container>
  );
}
