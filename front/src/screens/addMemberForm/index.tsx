import {Icons} from '@assets';
import {
  CommonHeader,
  CountryCodePicker,
  CountrySelector,
  CustomBottomSheet,
  CustomBottomSheetMethods,
  CustomButton,
  CustomDropDownList,
  CustomMultiDropDownList,
  CustomRadioGroup,
  InputBoxRHF,
  InputHeader,
  SelectionInputRHF,
  Text,
  UploadMedia,
} from '@components';
import {
  CountryCodeMethods,
  CountryCodeParams,
  DropDownListParams,
  InputFormParam,
  NavigationParamStack,
  SelectedProductParams,
  SelectedSubProductParams,
} from '@data';
import {tokenData} from '@features';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToggleSnackBar} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useGetAddPostDataQuery,
  useLazyGetCitiesQuery,
  useLazyGetCountriesQuery,
  useLazyGetStatesQuery,
  useRegisterUserMutation,
} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {
  ChatHelper,
  fetchCodeInformation,
  genderArray,
  getSampleNumber,
  isValidImageUrl,
  LatLng,
  navigate,
  navigateAndResetComplete,
  normalizeApiError,
  URL_REGEX,
  validField,
} from '@util';
import phone from 'phone';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Controller, Resolver, useFieldArray, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {shallowEqual, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Styles} from './Styles';

let selectedUploadImage: string = '';
let selectedCountryCodeType: string = '';
type AddMemberFormProps = RouteProp<NavigationParamStack, 'AddMemberForm'>;

let locationCoords: LatLng = {
  latitude: 0,
  longitude: 0,
};
let selectedMIndex: number | null = null;

const AddMemberForm: React.FC<{route: AddMemberFormProps}> = ({route}) => {
  const {t} = useTranslation(['register', 'generic']);
  const {selectedMember, selectedName, selectedIds} = route?.params ?? {};
  const {addListener, goBack} =
    useNavigation<NavigationProp<NavigationParamStack>>();
  const {toggleMessage} = useToggleSnackBar();
  const locationPickerRef = useRef<boolean>(false);
  const sheetRef = useRef<CustomBottomSheetMethods | null>(null);
  const countrySheetRef = useRef<CountryCodeMethods | null>(null);

  const tokenInfo = useSelector(tokenData, shallowEqual);
  const {params} = useRoute<RouteProp<NavigationParamStack, 'AddMemberForm'>>();
  const [getCountries, {data: countryList, isFetching}] =
    useLazyGetCountriesQuery();
  const {data: addPostData} = useGetAddPostDataQuery('');
  const [getStates] = useLazyGetStatesQuery();
  const [getCities] = useLazyGetCitiesQuery();
  const [registerUser, {isLoading}] = useRegisterUserMutation();

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [productList, setProductList] = useState<DropDownListParams[]>([]);
  const [phoneLength, setPhoneLength] = useState<number>(10);
  const [stateArray, setStateArray] = useState<DropDownListParams[]>([]);
  const [cityArray, setCityArray] = useState<DropDownListParams[]>();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('validation.name.required'))
      .min(2, t('validation.name.minLength')),
    mobile_number: Yup.string()
      .nullable()
      .transform(value => (value === '' ? null : value))
      .test('phone-validation', function (value) {
        if (!value) {
          return true;
        }
        if (!this.parent.countryCode) {
          return true;
        }
        const {dial_code, name} = this.parent.countryCode;
        const result = phone(`${dial_code} ${value}`);
        if (!result.isValid) {
          return this.createError({
            message: t('validation.mobile.invalid', {countryName: name}),
          });
        }
        return true;
      }),

    extra_mobile_number: Yup.array().of(
      Yup.object().shape({
        mobile_number: Yup.string().test('phone-validation', function (value) {
          if (!value) {
            return true;
          }
          const countryCode = this.parent.countryCode;
          if (!countryCode?.dial_code) {
            return this.createError({
              message: t('validation.countryCode.required'),
            });
          }
          const result = phone(`${countryCode.dial_code} ${value}`);
          if (!result.isValid) {
            return this.createError({
              message: t('validation.mobile.invalid', {
                countryName: countryCode.name,
              }),
            });
          }
          return true;
        }),
        email: Yup.string().when('type', {
          is: (type: string) => type === 'Marketing',
          then: schema =>
            schema
              .required(t('validation.email.required'))
              .email(t('validation.email.invalid'))
              .matches(URL_REGEX.emailRegex, t('validation.email.invalid')),
          otherwise: schema =>
            schema
              .notRequired()
              .test(
                'email-if-present',
                t('validation.email.enterValid'),
                function (value) {
                  if (!value || value.length === 0) {
                    return true;
                  }
                  // Validate email format
                  const emailRegex = URL_REGEX.emailRegex;
                  return emailRegex.test(value);
                },
              ),
        }),
      }),
    ),

    email: Yup.string().when('selectedMember', {
      is: (val: string[]) =>
        val &&
        !(
          val.includes('dealer') ||
          val.includes('manufacturer') ||
          val.includes('service_center')
        ),
      then: schema =>
        schema
          .required(t('validation.email.required'))
          .email(t('validation.email.invalid'))
          .matches(URL_REGEX.emailRegex, t('validation.email.invalid')),
      otherwise: schema => schema.notRequired(),
    }),
    country: Yup.object().required(t('validation.country.required')),
    state: Yup.object().required(t('validation.state.required')),
    city: Yup.object().required(t('validation.city.required')),
    villageOrCity: Yup.string().required(
      t('validation.villageOrCity.required'),
    ),
    location: Yup.string().required(t('validation.location.required')),
    facebook_link: Yup.string().test(
      'facebook-url',
      t('validation.facebook.invalid'),
      function (value) {
        if (!value || value.length === 0) {
          return true;
        }
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          value,
        );
      },
    ),
    instagram_link: Yup.string().test(
      'instagram-url',
      t('validation.instagram.invalid'),
      function (value) {
        if (!value || value.length === 0) {
          return true;
        }
        const instagramRegex =
          /^https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9._-]+\/?)+$/i;
        return instagramRegex.test(value);
      },
    ),
    youtube_link: Yup.string().test(
      'youtube-url',
      t('validation.youtube.invalid'),
      function (value) {
        if (!value || value.length === 0) {
          return true;
        }
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          value,
        );
      },
    ),
    web_link: Yup.string().test(
      'web-url',
      t('validation.website.invalid'),
      function (value) {
        if (!value || value.length === 0) {
          return true;
        }
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          value,
        );
      },
    ),
    dealer_list_area_wise_website: Yup.string().when(
      'dealer_list_area_wise_type',
      {
        is: (val: DropDownListParams) => val?.value === 'website',
        then: () =>
          Yup.string().test(
            'web-url',
            t('validation.website.invalid'),
            function (value) {
              if (!value || value.length === 0) {
                return true;
              }
              return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
                value,
              );
            },
          ),
        otherwise: () => Yup.string().notRequired(),
      },
    ),
    catalogue_website: Yup.string().when('catalogue_type', {
      is: (val: DropDownListParams) => val?.value === 'website',
      then: () =>
        Yup.string().test(
          'web-url',
          t('validation.website.invalid'),
          function (value) {
            if (!value || value.length === 0) {
              return true;
            }
            return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
              value,
            );
          },
        ),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    reset,
    setError,
    watch,
    clearErrors,
  } = useForm<InputFormParam>({
    defaultValues: {
      countryCode: params?.countryCode ?? undefined,
      name: '',
      email: params?.email ?? '',
      mobile_number: params?.mobile_number ?? '',
      district: '',
      taluka: '',
      location: '',
      service_center: '',
      country: undefined,
      state: undefined,
      city: undefined,
      villageOrCity: '',
      facebook_link: '',
      your_best_engineer: [],
      instagram_link: '',
      web_link: '',
      personal_name: '',
      gender: genderArray[0],
      domestic_name: '',
      dealer_list_area_wise_type: {label: 'PDF', value: 'pdf'},
      dealer_list_area_wise: '',
      dealer_list_area_wise_file: '',
      dealer_list_area_wise_pdf: '',
      export_name: '',
      catalogue_website: '',
      visiting_card_image: '',
      profile_file: '',
      visiting_card_file: '',
      catalogue_type: {label: 'PDF', value: 'pdf'},
      catalogue_file: '',
      company_about: '',
      serviceCenterCompany: '',
      description: '',
      categories_name: [] as DropDownListParams[],
      sub_categories_name: [] as DropDownListParams[],
      category_id: [],
      sub_category_id: [],
      soundProvider: '',
      manufacturer: '',
      companyName: '',
      working_with: [],
      service_info: [],
      profile: '',
      catalogue_pdf: '',
      authorised_dealer_company_name: undefined,
      selectedMember: selectedMember,
      youtube_link: '',
      new_company: '',
      description_pdf: '',
      description_pdf_file: '',
      extra_mobile_number: [],
    },
    resolver: yupResolver(
      validationSchema,
    ) as unknown as Resolver<InputFormParam>,
    mode: 'onChange',
    criteriaMode: 'firstError',
    delayError: 100,
    shouldFocusError: true,
  });

  const {
    fields: otherMobileFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'extra_mobile_number',
  });

  const mobile_no = watch('mobile_number');

  const addOtherMobileNumber = useCallback(
    (mobile?: string) => {
      const defaultCode = params?.countryCode?.code ?? 'in';
      const defaultCountryCode = fetchCodeInformation(defaultCode);
      if (!defaultCountryCode) {
        return;
      }

      let type = 'Other';
      const valMobile = getValues('extra_mobile_number') ?? [];
      const types = valMobile.map(f => f.type);
      if (!types.includes('Owner')) {
        type = 'Owner';
      } else if (!types.includes('Marketing')) {
        type = 'Marketing';
      }

      append({
        name: '',
        mobile_number: mobile ?? '',
        countryCode: defaultCountryCode,
        email: '',
        type,
      });
    },
    [append, getValues, params?.countryCode?.code],
  );

  const updateOtherMobileField = useCallback(
    (index: number, field: string, value: any) => {
      const valMobile = getValues('extra_mobile_number') ?? [];
      const current = valMobile[index];
      const updated = {...current, [field]: value};
      update(index, updated);

      if (field === 'countryCode' || field === 'w_countryCode') {
        const pLen = getSampleNumber(value)?.length ?? 10;
        setPhoneLength(pLen);
        trigger(`extra_mobile_number.${index}.${field}`);
        trigger(`extra_mobile_number.${index}.mobile_number`);
      }
    },
    [getValues, trigger, update],
  );

  const handleAddProduct = useCallback(
    (text?: string) => {
      const trimmedName = text?.trim();
      if (!trimmedName) {
        return;
      }

      const companyExists = productList.some(
        company => company.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (companyExists) {
        toggleMessage(t('generic:productNameAlreadyExists'));
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName.toLowerCase().replace(/\s+/g, '_'),
        id: '',
      };
      setProductList(old => [formattedValue, ...old]);
    },
    [productList, toggleMessage, t],
  );

  useEffect(() => {
    const fetchCountries = async () => {
      await getCountries();
    };
    const listener = addListener('focus', () => {
      if (!locationPickerRef.current) {
        fetchCountries();
      }
    });
    return () => listener();
  }, [addListener, getCountries]);

  useEffect(() => {
    const backAction = () => {
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [goBack]);

  useEffect(() => {
    if (addPostData?.categories) {
      setProductList(addPostData?.categories ?? []);
    }
  }, [addPostData?.categories]);

  useEffect(() => {
    const defaultCode =
      params && params.countryCode ? params.countryCode.code : 'in';
    const info = fetchCodeInformation(defaultCode);
    if (info != null) {
      if (!locationPickerRef.current) {
        setValue('countryCode', info);
      }
    }
  }, [params, setValue]);

  useEffect(() => {
    if (countryList && countryList.length > 0) {
      if (!locationPickerRef.current) {
        const country = countryList.find(
          item =>
            item.value.toLowerCase() ===
            params?.countryCode?.name?.toLowerCase(),
        );
        if (country) {
          setValue('country', country);
          getStates(Number(country.id!))
            .unwrap()
            .then(states => {
              if (states && states.length > 0) {
                setStateArray([...states]);
              }
            });
        }
      }
    }
  }, [countryList, getStates, params?.countryCode?.name, setValue]);

  useEffect(() => {
    if (
      selectedMember.some(m =>
        ['dealer', 'manufacturer', 'service_center'].includes(m),
      ) &&
      !initialized
    ) {
      if (!locationPickerRef.current) {
        addOtherMobileNumber(params?.mobile_number ?? '');
        setInitialized(true);
      }
    }
  }, [
    addOtherMobileNumber,
    params?.mobile_number,
    selectedMember,
    initialized,
  ]);

  const onFormSubmit = async (data: InputFormParam) => {
    try {
      const formdata = new FormData();
      const {token} = tokenInfo || {};

      formdata.append('name', data.name ?? '');
      formdata.append('personal_name', data?.personal_name ?? '');
      if (
        selectedMember.includes('dealer') ||
        selectedMember.includes('manufacturer') ||
        selectedMember.includes('service_center')
      ) {
        formdata.append('email', data?.extra_mobile_number?.[0].email ?? '');
      } else {
        formdata.append('email', data.email ?? '');
      }

      formdata.append('role_id', selectedIds);
      formdata.append('fcm_token', token);

      if (
        selectedMember.includes('dealer') ||
        selectedMember.includes('manufacturer') ||
        selectedMember.includes('service_center')
      ) {
        formdata.append(
          'code',
          data?.extra_mobile_number?.[0].countryCode.dial_code ?? '',
        );
      } else {
        formdata.append('code', data.countryCode?.dial_code ?? '');
      }

      if (
        selectedMember.includes('dealer') ||
        selectedMember.includes('manufacturer') ||
        selectedMember.includes('service_center')
      ) {
        formdata.append(
          'mobile_number',
          data?.extra_mobile_number?.[0].mobile_number ?? '',
        );
      } else {
        formdata.append('mobile_number', data.mobile_number ?? '');
      }
      formdata.append('gender', data?.gender?.value ?? '');

      formdata.append('taluka', data?.taluka ?? '');
      formdata.append('district', data?.district ?? '');
      formdata.append('country_id', data.country?.id ?? '');
      formdata.append('state_id', data.state?.id ?? '');
      formdata.append('city_id', data.city?.id ?? '');
      formdata.append('village', data?.villageOrCity ?? '');
      formdata.append('location', data?.location ?? '');
      formdata.append('address', data?.location ?? '');
      formdata.append('latitude', locationCoords?.latitude ?? '');
      formdata.append('longitude', locationCoords?.longitude ?? '');

      formdata.append('facebook_link', data?.facebook_link ?? '');
      formdata.append('instagram_link', data?.instagram_link ?? '');
      formdata.append('web_link', data.web_link ?? '');
      formdata.append('youtube_link', data?.youtube_link ?? '');

      let productArray: SelectedProductParams[] = [];
      if (data.categories_name) {
        data.categories_name.forEach(element => {
          productArray.push({
            category_id: element?.id ?? '',
            category_name: element?.label,
          });
        });
        formdata.append('category_id', JSON.stringify(productArray));
      } else {
        formdata.append('category_id', '');
      }

      let SubProductArray: SelectedSubProductParams[] = [];
      if (data.sub_categories_name) {
        data.sub_categories_name.forEach(element => {
          SubProductArray.push({
            sub_category_id: element?.id ?? '',
            sub_category_name: element?.label,
          });
        });
        formdata.append('sub_category_id', JSON.stringify(SubProductArray));
      } else {
        formdata.append('sub_category_id', '');
      }

      if (!isValidImageUrl(data.visiting_card_image)) {
        const filePath = data.visiting_card_file;
        if (filePath) {
          const name = filePath.split('/').pop() ?? 'visitingCard.jpg';
          const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
          const type = `image/${ext}`;
          formdata.append('visiting_card_image', {
            uri: filePath,
            name,
            type,
          });
        }
      }

      formdata.append(
        'authorised_dealer_company_name',
        data?.authorised_dealer_company_name?.value ?? '',
      );
      formdata.append('company_about', data?.company_about ?? '');

      formdata.append(
        'dealer_list_area_wise_type',
        data?.dealer_list_area_wise_type.value ?? '',
      );

      if (
        data.dealer_list_area_wise_type.value === 'pdf' &&
        validField(data.dealer_list_area_wise_file)
      ) {
        const filePath = data.dealer_list_area_wise_file;
        if (filePath) {
          const name = filePath.split('/').pop() ?? 'dealer_list_area_wise.pdf';
          formdata.append('dealer_list_area_wise_pdf', {
            uri: filePath,
            name,
            type: 'application/pdf',
          });
        }
      } else if (data.dealer_list_area_wise_type.value === 'website') {
        formdata.append(
          'dealer_list_area_wise_website',
          data.dealer_list_area_wise_website ?? '',
        );
      }

      formdata.append(
        'working_with',
        JSON.stringify(data.working_with?.filter(Boolean) ?? []),
      );
      formdata.append(
        'your_best_engineer',
        JSON.stringify(data?.your_best_engineer) ?? '',
      );
      formdata.append('coaching_class', data?.coaching_class ?? '');
      formdata.append(
        'new_company',
        data?.authorised_dealer_company_name?.value ?? '',
      );
      if (data.extra_mobile_number && data.extra_mobile_number.length > 0) {
        let formData: any = [];
        data.extra_mobile_number.forEach(element => {
          formData.push({
            name: element.name,
            mobile_number: element.mobile_number,
            code_sort: element.countryCode.code,
            code: element.countryCode.dial_code,
            email: element.email,
            type: element.type || '',
          });
        });
        formdata.append('extra_mobile_number', JSON.stringify(formData));
      }
      if (!isValidImageUrl(data.profile)) {
        const filePath = data.profile_file;
        if (filePath) {
          const name = filePath.split('/').pop() ?? 'profile.jpg';
          const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
          const type = `image/${ext}`;
          formdata.append('image', {
            uri: filePath,
            name,
            type,
          });
        }
      }

      if (
        data.catalogue_type.value === 'pdf' &&
        validField(data.catalogue_file)
      ) {
        const filePath = data.catalogue_file;
        if (filePath) {
          const name = filePath.split('/').pop() ?? 'catalogue.pdf';
          formdata.append('catalogue_pdf', {
            uri: filePath,
            name,
            type: 'application/pdf',
          });
        }
      } else if (data.catalogue_type.value === 'website') {
        formdata.append('catalogue_website', data?.catalogue_website ?? '');
      }

      formdata.append('description', data?.description ?? '');

      if (validField(data.description_pdf_file)) {
        const filePath = data.description_pdf_file;
        if (filePath) {
          const name = filePath.split('/').pop() ?? 'description.pdf';
          formdata.append('description_pdf', {
            uri: filePath,
            name,
            type: 'application/pdf',
          });
        }
      }
      formdata.append('service_center', data?.service_center ?? '');
      formdata.append('code_sort', data?.countryCode?.code ?? '');

      if (data.service_info && data.service_info.length > 0) {
        const serviceInfoPayload = data.service_info.map(item => ({
          company_id: item.company_id.map(c => (c.id ? c.id : '0')).toString(),
          company_name: item.company_id.map(c => c.label ?? '').toString(),
          location: item.location ?? '',
          latitude: item?.latitude ?? 0,
          longitude: item?.longitude ?? 0,
          center_name: item.center_name ?? '',
          mobile_number: item.mobile_number ?? '',
          code_sort: item.countryCode?.code ?? '',
          code: item.countryCode?.dial_code ?? '',
        }));
        formdata.append(
          'service_center_info',
          JSON.stringify(serviceInfoPayload),
        );
      }

      console.log('Form data', formdata);

      const result = await registerUser(formdata).unwrap();
      const {status, message, user} = result;
      if (status) {
        if (user) {
          await ChatHelper.signInOrCreateUser();
          await ChatHelper.createUserProfile(user);
        }
        navigateAndResetComplete('DrawerNavigator');
      } else {
        toggleMessage(message);
      }
    } catch (error: unknown) {
      const {message, errors: fieldErrors} = normalizeApiError(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof InputFormParam, {
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
  };

  const isExist = useCallback(
    (array: string[]) => selectedMember.some(m => array.includes(m)),
    [selectedMember],
  );

  return (
    <View style={[VS.flex_1, CommonStyle.bgWhite]}>
      <CommonHeader
        title={selectedName.toString()}
        withBackArrow
        isMultiLine
        withChatNotification={false}
      />
      {isFetching ? (
        <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={[AppStyle.flexGrow, VS.gap_16, VS.ph_16]}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          ScrollViewComponent={ScrollView}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={'interactive'}>
          {isExist(['dj_operator', 'sound_operator']) && (
            <View style={[VS.gap_10]}>
              <Text
                style={[TS.fs_15, TS.tt_capitalize]}
                fontWeight="quickSandMedium">
                {t('gender')}
              </Text>
              <Controller
                control={control}
                name="gender"
                render={({field: {value, onChange}}) => (
                  <CustomRadioGroup
                    options={t('forms.genderOptions', {returnObjects: true})}
                    value={value?.value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          )}
          <InputBoxRHF
            fieldName="name"
            control={control}
            autoCapitalize={'words'}
            headerComponent={
              <InputHeader
                title={
                  isExist(['spare_part'])
                    ? t('forms.spare_part.label')
                    : isExist(['dealer'])
                    ? t('forms.dealer.label')
                    : isExist(['manufacturer'])
                    ? t('forms.manufacturer.label')
                    : isExist(['repairing_shop'])
                    ? t('forms.repairing_shop.label')
                    : isExist(['sound_education'])
                    ? t('forms.sound_education.label')
                    : isExist(['sound_provider'])
                    ? t('forms.sound_provider.label')
                    : isExist(['dj_operator', 'sound_operator'])
                    ? t('forms.dj_operator.label')
                    : isExist(['service_center'])
                    ? t('forms.dealer.label')
                    : t('forms.common.label')
                }
                textWeight="quickSandMedium"
              />
            }
            placeholder={
              isExist(['spare_part'])
                ? t('forms.spare_part.placeholder')
                : isExist(['dealer', 'service_center'])
                ? t('forms.dealer.placeholder')
                : isExist(['manufacturer'])
                ? t('forms.manufacturer.placeholder')
                : isExist(['repairing_shop'])
                ? t('forms.repairing_shop.placeholder')
                : isExist(['sound_education'])
                ? t('forms.sound_education.placeholder')
                : isExist(['sound_provider'])
                ? t('forms.sound_provider.placeholder')
                : isExist(['dj_operator', 'sound_operator'])
                ? t('forms.dj_operator.placeholder')
                : t('forms.common.placeholder')
            }
          />

          {isExist([
            'repairing_shop',
            'sound_provider',
            'sound_operator',
            'dj_operator',
            'sound_education',
            'spare_part',
          ]) && (
            <InputBoxRHF
              fieldName="personal_name"
              autoCapitalize={'words'}
              control={control}
              headerComponent={
                <InputHeader
                  title={
                    isExist(['spare_part'])
                      ? t('forms.spare_part.yourShopName')
                      : t('forms.spare_part.label')
                  }
                  textWeight="quickSandMedium"
                />
              }
              placeholder={
                isExist(['spare_part'])
                  ? t('forms.spare_part.yourShopNamePlaceholder')
                  : t('forms.spare_part.placeholder')
              }
            />
          )}

          {isExist(['manufacturer']) && (
            <CustomMultiDropDownList
              fieldName="categories_name"
              control={control}
              options={productList ?? []}
              headerTitle={t('forms.whatManufacturer.label')}
              placeholder={t('forms.whatManufacturer.placeholder')}
              title={t('forms.whatManufacturer.enterNew')}
              allowCustomEntry={true}
              isSearchable={false}
              onAddPress={handleAddProduct}
              selected={selectedCategory}
              onSelect={(selected: DropDownListParams[]) => {
                const companyIdsForService = selected.map(
                  (company: DropDownListParams) => String(company.id),
                );
                setValue('categories_name', selected);
                setValue('category_id', companyIdsForService);
                setSelectedCategory(companyIdsForService);
              }}
            />
          )}

          {!selectedMember.some(m =>
            ['dealer', 'service_center', 'manufacturer'].includes(m),
          ) && (
            <InputBoxRHF
              fieldName="email"
              control={control}
              headerComponent={
                <InputHeader
                  title={t('forms.email.label')}
                  textWeight="quickSandMedium"
                />
              }
              placeholder={t('forms.email.placeholder')}
              textContentType="emailAddress"
              keyboardType="email-address"
              maxLength={246}
            />
          )}

          {isExist(['dealer', 'service_center', 'manufacturer']) ? null : (
            <InputBoxRHF
              fieldName="mobile_number"
              control={control}
              headerComponent={
                <InputHeader
                  title={t('forms.mobile.label')}
                  textWeight="quickSandMedium"
                />
              }
              maxLength={phoneLength}
              keyboardType="phone-pad"
              inputMode="numeric"
              editable={false}
              placeholder={t('forms.mobile.placeholder')}
              renderLeftIcon={
                <Controller
                  control={control}
                  name={'countryCode'}
                  render={({field: {value}}) => (
                    <CountrySelector
                      countryCode={value}
                      onPressButton={() => {}}
                    />
                  )}
                />
              }
            />
          )}

          {isExist(['dealer', 'service_center', 'manufacturer']) ? (
            <View style={[VS.gap_16]}>
              {otherMobileFields.map((field, idx) => (
                <View
                  key={field.id}
                  style={[
                    {backgroundColor: Colors.primary},
                    VS.ph_15,
                    VS.pv_10,
                    VS.br_10,
                    VS.gap_5,
                  ]}>
                  <View style={[VS.fd_row, VS.jc_space_between]}>
                    <InputHeader
                      title={
                        field.type === 'Owner'
                          ? t('forms.fieldType.owner')
                          : field.type === 'Marketing'
                          ? t('forms.fieldType.marketing')
                          : t('forms.fieldType.other')
                      }
                      textWeight="quickSandBold"
                      textStyle={[CommonStyle.textWhite]}
                    />
                    {idx === 0 && otherMobileFields.length !== 3 ? (
                      <TouchableOpacity
                        onPress={() => addOtherMobileNumber('')}
                        style={[
                          VS.ph_12,
                          VS.pv_8,
                          CommonStyle.bgWhite,
                          VS.br_8,
                        ]}>
                        <Text
                          style={[TS.fs_14, CommonStyle.textBlack]}
                          fontWeight="medium">
                          {t('addMore')}
                        </Text>
                      </TouchableOpacity>
                    ) : idx !== 0 ? (
                      <TouchableOpacity
                        onPress={() => remove(idx)}
                        hitSlop={{
                          top: 10,
                          bottom: 10,
                          left: 10,
                          right: 10,
                        }}
                        style={[VS.ai_center, VS.jc_center]}>
                        <Icons.Close color={Colors.white} />
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  <View style={[VS.gap_16]}>
                    <InputBoxRHF
                      fieldName={`extra_mobile_number.${idx}.name`}
                      autoCapitalize={'words'}
                      inputStyle={[VS.ph_6, CommonStyle.bgWhite]}
                      control={control}
                      headerComponent={
                        <InputHeader
                          title={t('forms.name.label')}
                          textWeight="quickSandMedium"
                          textStyle={[CommonStyle.textWhite]}
                        />
                      }
                      placeholder={t('forms.name.placeholder')}
                    />
                    <InputBoxRHF
                      fieldName={`extra_mobile_number.${idx}.mobile_number`}
                      control={control}
                      inputStyle={[VS.ph_6, CommonStyle.bgWhite]}
                      headerComponent={
                        <InputHeader
                          title={t('forms.mobile.label')}
                          textWeight="quickSandMedium"
                          textStyle={[CommonStyle.textWhite]}
                        />
                      }
                      placeholder={t('forms.mobile.placeholder')}
                      editable={idx === 0 ? false : true}
                      keyboardType="phone-pad"
                      inputMode="numeric"
                      maxLength={
                        getSampleNumber(field.countryCode)?.length ?? 10
                      }
                      renderLeftIcon={
                        <Controller
                          control={control}
                          name={`extra_mobile_number.${idx}.countryCode`}
                          render={({field: {value}}) => (
                            <CountrySelector
                              countryCode={value}
                              separatorStyle={[VS.mh_6]}
                              onPressButton={() => {
                                Keyboard.dismiss();
                                selectedMIndex = idx;
                                selectedCountryCodeType = 'otherCountryCode';
                                countrySheetRef?.current?.onPresent();
                              }}
                            />
                          )}
                        />
                      }
                    />
                    <InputBoxRHF
                      inputStyle={[VS.ph_6, CommonStyle.bgWhite]}
                      fieldName={`extra_mobile_number.${idx}.email`}
                      control={control}
                      headerComponent={
                        <InputHeader
                          title={t('forms.email.label')}
                          textWeight="quickSandMedium"
                          textStyle={[CommonStyle.textWhite]}
                        />
                      }
                      placeholder={t('forms.email.placeholder')}
                      keyboardType="email-address"
                      inputMode="email"
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {isExist(['repairing_shop', 'sound_education']) && (
            <SelectionInputRHF
              fieldName="visiting_card_image"
              control={control}
              headerComponent={
                <InputHeader
                  title={t('forms.visitingCard.label')}
                  textWeight="quickSandMedium"
                />
              }
              placeholder={t('forms.visitingCard.placeholder')}
              onPress={() => {
                Keyboard.dismiss();
                selectedUploadImage = 'visiting_card_image';
                sheetRef?.current?.onPresent();
              }}
              renderRightIcon={<Icons.Uploader />}
            />
          )}

          <SelectionInputRHF
            fieldName="location"
            control={control}
            headerComponent={
              <InputHeader
                title={t('forms.location.label')}
                textWeight="quickSandMedium"
              />
            }
            onPress={() => {
              clearErrors('location');
              locationPickerRef.current = true;
              navigate('LocationSelector', {
                onGoBack: (locationData: {
                  coordinates: LatLng;
                  address: {
                    fullAddress: string;
                  };
                }) => {
                  requestAnimationFrame(() => {
                    setValue('location', locationData.address.fullAddress);
                    locationCoords = locationData.coordinates;
                    locationPickerRef.current = false;
                  });
                },
              });
            }}
            renderRightIcon={<Icons.Location />}
            placeholder={t('forms.location.placeholder')}
          />

          <View style={[VS.fd_row, VS.ai_start, VS.gap_10]}>
            <CustomDropDownList
              options={countryList ?? []}
              isSearchable
              headerTitle={t('forms.country.placeholder')}
              placeholder={t('forms.country.placeholder')}
              fieldName="country"
              title={t('forms.country.placeholder')}
              displayValue={val => val.label}
              onSelect={val => {
                const values = getValues();
                reset({
                  ...values,
                  state: undefined,
                  city: undefined,
                });
                setStateArray([]);
                setCityArray([]);
                getStates(Number(val.id!), false)
                  .unwrap()
                  .then(states => {
                    setStateArray([...states]);
                  });
              }}
              control={control}
            />
            <CustomDropDownList
              fieldName="state"
              control={control}
              options={stateArray ?? []}
              isSearchable
              headerTitle={t('forms.state.placeholder')}
              placeholder={t('forms.state.placeholder')}
              title={t('forms.state.placeholder')}
              displayValue={val => val.label}
              onSelect={val => {
                const values = getValues();
                reset({
                  ...values,
                  city: undefined,
                });
                setCityArray([]);
                getCities(Number(val.id!), false)
                  .unwrap()
                  .then(cities => {
                    setCityArray([...cities]);
                  });
              }}
            />
          </View>

          <View style={[VS.fd_row, VS.ai_start, VS.gap_10]}>
            <Controller
              control={control}
              name="city"
              render={({field, fieldState: {error}}) => (
                <CustomDropDownList
                  options={cityArray ?? []}
                  headerTitle={t('forms.city.placeholder')}
                  placeholder={t('forms.city.placeholder')}
                  isSearchable
                  fieldName="city"
                  title={t('forms.city.placeholder')}
                  displayValue={val => val.label}
                  onSelect={val => {
                    field.onChange(val);
                  }}
                  control={control}
                  error={error?.message}
                />
              )}
            />
            <InputBoxRHF
              fieldName="villageOrCity"
              control={control}
              headerComponent={
                <InputHeader
                  title={t('forms.village.label')}
                  textWeight="quickSandMedium"
                />
              }
              placeholder={t('forms.village.placeholder')}
              autoCapitalize="words"
              parentStyle={[VS.flex_1]}
            />
          </View>

          {isExist(['sound_education', 'repairing_shop']) && (
            <>
              <InputBoxRHF
                fieldName="facebook_link"
                control={control}
                headerComponent={
                  <InputHeader
                    title={t('forms.facebook.label')}
                    textWeight="quickSandMedium"
                  />
                }
                placeholder={t('forms.facebook.placeholder')}
              />
              <InputBoxRHF
                fieldName="instagram_link"
                control={control}
                headerComponent={
                  <InputHeader
                    title={t('forms.instagram.label')}
                    textWeight="quickSandMedium"
                  />
                }
                placeholder={t('forms.instagram.placeholder')}
              />
              <InputBoxRHF
                fieldName="web_link"
                control={control}
                headerComponent={
                  <InputHeader
                    title={t('forms.website.label')}
                    textWeight="quickSandMedium"
                  />
                }
                placeholder={t('forms.website.placeholder')}
              />
              <InputBoxRHF
                fieldName="youtube_link"
                control={control}
                headerComponent={
                  <InputHeader
                    title={t('forms.youtube.label')}
                    textWeight="quickSandMedium"
                  />
                }
                placeholder={t('forms.youtube.placeholder')}
              />
              <InputBoxRHF
                fieldName="description"
                control={control}
                headerComponent={
                  <InputHeader title={t('forms.aboutUs.label')} />
                }
                placeholder={t('forms.aboutUs.placeholder')}
                multiline={true}
                returnKeyType="next"
                textInputStyle={[Styles.descriptionInput, VS.pt_15]}
              />
            </>
          )}

          <CustomButton
            isLoading={isLoading}
            buttonTitle={t('submit')}
            onPress={handleSubmit(onFormSubmit)}
            wrapperStyle={[VS.mv_10, VS.mh_16]}
          />
        </KeyboardAwareScrollView>
      )}

      <CountryCodePicker
        ref={countrySheetRef}
        onSelectCountry={(info: CountryCodeParams) => {
          if (selectedCountryCodeType === 'countryCode') {
            setValue('countryCode', info);
            const pLen = getSampleNumber(info)?.length ?? 10;
            setPhoneLength(pLen);
            if (validField(mobile_no)) {
              trigger('mobile_number');
            }
          } else if (
            selectedCountryCodeType === 'otherCountryCode' &&
            selectedMIndex !== null
          ) {
            updateOtherMobileField(selectedMIndex, 'countryCode', info);
          } else if (
            selectedCountryCodeType === 'whatsappCountryCode' &&
            selectedMIndex !== null
          ) {
            updateOtherMobileField(selectedMIndex, 'w_countryCode', info);
          }
        }}
      />

      <CustomBottomSheet ref={sheetRef}>
        <UploadMedia
          onSelectMedia={result => {
            if (result !== null) {
              if (selectedUploadImage === 'visiting_card_image') {
                setValue('visiting_card_file', result?.path ?? '');
                setValue('visiting_card_image', result.filename ?? '');
                trigger('visiting_card_image');
              }
              if (selectedUploadImage === 'profile') {
                setValue('profile_file', result.path ?? '');
                setValue('profile', result.filename ?? '');
                trigger('profile');
              }
            }
          }}
          croppingOptions={{
            cropperCircleOverlay: false,
            freeStyleCropEnabled: true,
          }}
          onCloseAction={() => sheetRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
    </View>
  );
};

export default AddMemberForm;
