import {Icons} from '@assets';
import {
  CommonHeader,
  Container,
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
  ProgressImage,
  SelectionInputRHF,
  Text,
  UploadMedia,
} from '@components';
import {
  CountryCodeMethods,
  CountryCodeParams,
  DropDownListParams,
  EditProfileFormParam,
  NavigationParamStack,
  OtherMobile,
  SelectedProductParams,
} from '@data';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToggleSnackBar} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  useEditBusinessProfileMutation,
  useEditPersonalProfileMutation,
  useGetAddPostDataQuery,
  useGetRolesQuery,
  useLazyGetCitiesQuery,
  useLazyGetCountriesQuery,
  useLazyGetStatesQuery,
} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {
  fetchCodeInformation,
  genderArray,
  getSampleNumber,
  isValidImageUrl,
  LatLng,
  navigate,
  normalizeApiError,
  URL_REGEX,
  validField,
} from '@util';
import phone from 'phone';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Controller, Resolver, useFieldArray, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import * as Yup from 'yup';
import ProfileAvatar from './components/ProfileAvatar';
import {Styles} from './Styles';
let selectedCountryCodeType = 'mobile';

let catArray: DropDownListParams[] = [];
let selectedImageType = '';
let activeMobileIndex: number | null = null;
type EditProfileRouteProp = RouteProp<NavigationParamStack, 'EditProfile'>;

const EditProfile: React.FC<{route: EditProfileRouteProp}> = ({route}) => {
  const {t} = useTranslation(['profile', 'generic', 'register']);
  const profileData = (route?.params && route?.params?.profileData) ?? null;

  const {addListener, goBack} =
    useNavigation<NavigationProp<NavigationParamStack>>();
  const {toggleMessage} = useToggleSnackBar();

  const locationPickerRef = useRef<boolean>(false);
  const countrySheetRef = useRef<CountryCodeMethods | null>(null);
  const sheetRef = useRef<CustomBottomSheetMethods | null>(null);

  const {data: rolesArray} = useGetRolesQuery();
  const [getCountries, {data: countryList}] = useLazyGetCountriesQuery();
  const [getStates] = useLazyGetStatesQuery();
  const [getCities] = useLazyGetCitiesQuery();
  const [editProfile, {isLoading}] = useEditPersonalProfileMutation();

  const {data: addPostData} = useGetAddPostDataQuery(
    profileData?.id?.toString() ?? '',
  );
  const [editBusinessProfile, {isLoading: businessLoading}] =
    useEditBusinessProfileMutation();

  const [phoneLength, setPhoneLength] = useState<number>(10);
  const [productList, setProductList] = useState<DropDownListParams[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [locationCoords, setLocationCoords] = useState<LatLng | null>(null);
  const [stateArray, setStateArray] = useState<DropDownListParams[]>([]);
  const [cityArray, setCityArray] = useState<DropDownListParams[]>();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('register:validation.name.required')),
    email: Yup.string().when('profileData.role', {
      is: (val: string | string[]) =>
        val &&
        !(
          (Array.isArray(val) ? val : [val]).includes('dealer') ||
          (Array.isArray(val) ? val : [val]).includes('manufacturer') ||
          (Array.isArray(val) ? val : [val]).includes('service_center')
        ),
      then: schema =>
        schema
          .required(t('register:validation.email.required'))
          .email(t('register:validation.email.invalid'))
          .matches(
            URL_REGEX.emailRegex,
            t('register:validation.email.invalid'),
          ),
      otherwise: schema => schema.notRequired(),
    }),
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
            message: t('register:validation.mobile.invalid', {
              countryName: name,
            }),
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
          const {dial_code, name} = this.parent.countryCode;
          if (!dial_code) {
            return this.createError({
              message: t('register:validation.countryCode.required'),
            });
          }
          const result = phone(`${dial_code} ${value}`);
          if (!result.isValid) {
            return this.createError({
              message: t('register:validation.mobile.invalid', {
                countryName: name,
              }),
            });
          }
          return true;
        }),
        email: Yup.string().when('type', {
          is: (type: string) => type === 'Marketing',
          then: schema =>
            schema
              .required(t('register:validation.email.required'))
              .email(t('register:validation.email.invalid'))
              .matches(
                URL_REGEX.emailRegex,
                t('register:validation.email.invalid'),
              ),
          otherwise: schema =>
            schema
              .notRequired()
              .test(
                'email-if-present',
                t('register:validation.email.enterValid'),
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
    country: Yup.object().required(t('register:validation.country.required')),
    state: Yup.object().required(t('register:validation.state.required')),
    city: Yup.object().required(t('register:validation.city.required')),
    village: Yup.string().required(t('register:validation.village.required')),
    facebook_link: Yup.string().test(
      'facebook-url',
      t('register:validation.facebook.invalid'),
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
      t('register:validation.instagram.invalid'),
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
      t('register:validation.youtube.invalid'),
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
      t('register:validation.website.invalid'),
      function (value) {
        if (!value || value.length === 0) {
          return true;
        }
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          value,
        );
      },
    ),
    whats_app_mobile_number: Yup.string().test(
      'phone-validation',
      function (value) {
        if (!value) {
          return true;
        }
        const {dial_code, name} = this.parent.whats_app_code;
        if (!dial_code) {
          return this.createError({
            message: t('register:validation.countryCode.required'),
          });
        }
        const result = phone(`${dial_code} ${value}`);
        if (!result.isValid) {
          return this.createError({
            message: t('register:validation.whatsapp.invalid', {
              countryName: name,
            }),
          });
        }
        return true;
      },
    ),
    gst_number: Yup.string().test('gst-validation', function (value) {
      if (!value || value.trim() === '') {
        return true;
      }
      const formattedValue = value.toUpperCase();

      if (!URL_REGEX.gst.test(formattedValue)) {
        return this.createError({
          message: t?.('register:validation.gst.invalid'),
        });
      }
      return true;
    }),
  });

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: {},
  } = useForm<EditProfileFormParam>({
    defaultValues: {
      name: profileData.name ?? '',
      email: profileData.email ?? '',
      service_info: [],
      mobile_number: profileData.mobile_number ?? '',
      village: profileData?.village ?? '',
      countryCode: undefined,
      city: undefined,
      gst_number: profileData?.business_data?.[0]?.gst_number ?? '',
      business_name: profileData?.business_data?.[0]?.name
        ? profileData?.business_data?.[0]?.name
        : profileData?.name,
      personal_name: profileData?.personal_name ?? '',
      taluka: profileData?.taluka ?? '',
      description: profileData?.description ?? '',
      visiting_card_image: '',
      visiting_card_file: '',
      image: profileData?.image_url ?? '',
      location: profileData?.location ?? '',
      facebook_link: profileData?.facebook_link ?? '',
      your_best_engineer: [],
      youtube_link: profileData?.youtube_link ?? '',
      instagram_link: profileData?.instagram_link ?? '',
      web_link: profileData?.web_link ?? '',
      district: profileData?.district ?? '',
      categories_name: [] as DropDownListParams[],
      sub_categories_name: [] as DropDownListParams[],
      category_id: [],
      sub_category_id: [],
      state: undefined,
      country: undefined,
      gender: profileData?.gender === 'male' ? genderArray[1] : genderArray[0],
      roles: '',
      whats_app_code: undefined,
      extra_mobile_number: [],
      whats_app_mobile_number:
        profileData?.whats_app_mobile_number ?? profileData.mobile_number,
    },
    resolver: yupResolver(
      validationSchema,
    ) as unknown as Resolver<EditProfileFormParam>,
    mode: 'onChange',
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

  useEffect(() => {
    if (addPostData) {
      setProductList(addPostData?.categories ?? []);
    }
  }, [addPostData]);

  useEffect(() => {
    if (validField(profileData?.service_center_info)) {
      let JSonArray = JSON.parse(profileData?.service_center_info ?? '');
      // Transform as above
      const formattedServiceInfo = JSonArray.map((item: any) => {
        const companyIds = item?.company_id.split(',');
        const companyNames = item.company_name.split(',');
        const companies = companyIds.map((id: unknown, idx: number) => ({
          id,
          label: companyNames[idx] || '',
          value: id,
        }));
        return {
          company_id: companies,
          company_name: companyNames,
          location: item.location,
          latitude: item.latitude,
          longitude: item.longitude,
        };
      });

      setValue('service_info', formattedServiceInfo);
    }
  }, [profileData, setValue]);

  useEffect(() => {
    const listener = addListener('focus', () => {
      if (locationPickerRef.current) {
        return;
      }
      getCountries();
    });
    return () => listener();
  }, [addListener, getCountries]);

  useEffect(() => {
    if (!locationPickerRef.current) {
      if (profileData) {
        const cName = profileData?.code_sort ?? 'in';
        const info = fetchCodeInformation(cName);
        if (info != null) {
          setValue('countryCode', info);
          const pLen = getSampleNumber(info)?.length ?? 10;
          setPhoneLength(pLen);
        }
        if (profileData?.roles && profileData?.roles.length > 0) {
          setSelectedRoles(profileData?.roles?.map(role => role.name!));
        }

        if (validField(profileData?.visiting_card_image)) {
          setValue(
            'visiting_card_file',
            profileData?.visiting_card_image_url ?? '',
          );
        }

        if (profileData?.country_id && profileData?.country_name) {
          setValue('country', {
            id: profileData?.country_id,
            label: profileData?.country_name,
            value: profileData?.country_name,
          });
          getStates(Number(profileData.country_id!))
            .unwrap()
            .then(states => {
              if (states && states.length > 0) {
                setStateArray([...states]);
              }
            });
        }
        if (profileData?.state_id && profileData?.state_name) {
          setValue('state', {
            id: profileData?.state_id,
            label: profileData?.state_name,
            value: profileData?.state_name,
          });
          getCities(Number(profileData.state_id!))
            .unwrap()
            .then(cities => {
              if (cities && cities.length > 0) {
                setCityArray([...cities]);
              }
            });
        }
        if (profileData?.city_id && profileData?.city_name) {
          setValue('city', {
            id: profileData?.city_id,
            label: profileData?.city_name,
            value: profileData?.city_name,
          });
        }

        if (validField(profileData?.location)) {
          setValue('location', profileData?.location ?? '');
          setLocationCoords({
            latitude: Number(profileData?.latitude ?? 0),
            longitude: Number(profileData?.longitude ?? 0),
          });
        }

        if (profileData?.business_data?.[0]?.category_id) {
          const categoryId =
            profileData.business_data[0].category_id.split(',');
          setSelectedCategory(categoryId);
          setValue('category_id', categoryId);
          const categoryNames = profileData.business_data[0].category_names;
          if (Array.isArray(categoryNames) && categoryNames.length > 0) {
            setValue(
              'categories_name',
              categoryNames.map(item => ({
                id: item.id,
                label: item.value,
                value: item.value,
              })),
            );
          }
        }

        if (profileData?.business_data?.[0]?.sub_category_id) {
          const subcategoryId =
            profileData.business_data[0].sub_category_id.split(',');

          setValue('sub_category_id', subcategoryId);

          const subCategoryNames =
            profileData.business_data[0].sub_category_names;
          if (Array.isArray(subCategoryNames) && subCategoryNames.length > 0) {
            setValue(
              'sub_categories_name',
              subCategoryNames.map(item => ({
                id: item.id,
                label: item.value,
                value: item.value,
              })),
            );
          }
        }

        const whatsappName = profileData?.whats_app_code ?? 'in';
        const whatsappInfo = fetchCodeInformation(whatsappName);

        if (whatsappInfo) {
          setValue('whats_app_code', whatsappInfo);
        }

        if (
          profileData.extra_mobile_number !== '' &&
          profileData.extra_mobile_number !== null
        ) {
          // Initialize extra mobile numbers if present
          let JsonArray = JSON.parse(profileData.extra_mobile_number ?? '');
          let newArray: OtherMobile[] = [];

          // Find existing types
          const owner =
            JsonArray.find((item: any) => item.type === 'Owner') || {};
          const marketing =
            JsonArray.find((item: any) => item.type === 'Marketing') || {};
          const others = JsonArray.filter((item: any) => item.type === 'Other');

          // Always push Owner, Marketing, then Others
          if (Object.keys(owner).length) {
            const cCode = fetchCodeInformation(owner.code_sort ?? 'in');
            newArray.push({
              id: '0',
              name: owner.name || '',
              email: owner.email || '',
              mobile_number: owner.mobile_number || '',
              countryCode: cCode,
              type: 'Owner',
            });
          }
          if (Object.keys(marketing).length) {
            const cCode = fetchCodeInformation(marketing.code_sort ?? 'in');
            newArray.push({
              id: '1',
              name: marketing.name || '',
              email: marketing.email || '',
              mobile_number: marketing.mobile_number || '',
              countryCode: cCode,
              type: 'Marketing',
            });
          }
          others.forEach((item: any, idx: number) => {
            const cCode = fetchCodeInformation(item.code_sort ?? 'in');
            newArray.push({
              id: (idx + 2).toString(),
              name: item.name || '',
              email: item.email || '',
              mobile_number: item.mobile_number || '',
              countryCode: cCode,
              type: 'Other',
            });
          });

          setValue('extra_mobile_number', newArray);
        }
      } else {
        const whatsappInfo = fetchCodeInformation('in');
        if (whatsappInfo) {
          setValue('whats_app_code', whatsappInfo);
        }
      }
    }
  }, [getCities, getStates, profileData, setValue]);

  const handleCamera = () => {
    selectedImageType = 'image';
    sheetRef?.current?.onPresent();
  };

  const addOtherMobileNumber = useCallback(
    (mobile?: string) => {
      const defaultCountryCode = fetchCodeInformation('in');
      // Determine type
      const valMobile = getValues('extra_mobile_number') ?? [];
      let type = 'Other';
      const types = valMobile.map(f => f.type);
      if (!types.includes('Owner')) {
        type = 'Owner';
      } else if (!types.includes('Marketing')) {
        type = 'Marketing';
      }

      const newField = {
        id: Date.now().toString(),
        name: '',
        mobile_number: mobile ?? '',
        countryCode: defaultCountryCode,
        email: '',
        type,
      };
      append(newField);
    },
    [append, getValues],
  );

  const updateOtherMobileField = useCallback(
    (index: number, field: string, value: any) => {
      const valMobile = getValues('extra_mobile_number') ?? [];
      const current = valMobile[index];
      const updated = {...current, [field]: value};
      update(index, updated);

      if (field === 'countryCode') {
        const pLen = getSampleNumber(value)?.length ?? 10;
        setPhoneLength(pLen);
        trigger(`extra_mobile_number.${index}.countryCode`);
        trigger(`extra_mobile_number.${index}.mobile_number`);
      }
    },
    [getValues, update, trigger],
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
        toggleMessage('Product name already exists');
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName.toLowerCase().replace(/\s+/g, '_'),
        id: '',
      };
      setProductList(old => [formattedValue, ...old]);
    },
    [productList, toggleMessage],
  );

  const onSubmitBusinessProfile = async (data: EditProfileFormParam) => {
    try {
      const formdata = new FormData();

      formdata.append('id', profileData?.id ?? '');
      if (
        profileData?.roles?.some(role =>
          [
            'manufacturer',
            'sound_operator',
            'dj_operator',
            'sound_provider',
            'dealer',
            'service_center',
          ].includes(role.slug ?? ''),
        )
      ) {
        formdata.append('name', data.name ?? '');
      } else {
        formdata.append('name', data.business_name ?? '');
      }

      formdata.append('gst_number', data.gst_number ?? '');
      formdata.append('address', data.location ?? '');

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

      const result = await editBusinessProfile(formdata).unwrap();

      const {status, message} = result;
      if (status) {
        goBack();
        toggleMessage(message);
      } else {
        toggleMessage(message);
      }
    } catch (error: unknown) {
      const {message, errors: fieldErrors} = normalizeApiError(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof EditProfileFormParam, {
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

  const onSubmit = async (data: EditProfileFormParam) => {
    try {
      const formdata = new FormData();

      formdata.append('id', profileData?.id ?? '');
      if (!isValidImageUrl(data.image)) {
        const filePath = data.image;
        if (filePath) {
          const name = filePath.split('/').pop() ?? 'image.jpg';
          const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
          const type = `image/${ext}`;
          formdata.append('image', {
            uri: filePath,
            name,
            type,
          });
        }
      }
      const roleIds = selectedRoles
        .map(roleName => rolesArray?.find(role => role.name === roleName)?.id)
        .filter(Boolean)
        .join(',');
      formdata.append('role_id', roleIds);
      formdata.append('name', data.name ?? '');
      formdata.append('description', data.description ?? '');
      formdata.append('personal_name', data?.personal_name ?? '');
      // if (
      //   profileData?.roles?.some(r => ['spare_part'].includes(r.slug ?? ''))
      // ) {
      //   formdata.append('personal_name', data?.business_name ?? '');
      // } else {
      //   formdata.append('personal_name', data?.personal_name ?? '');
      // }

      if (
        profileData?.roles?.some(role => role.slug === 'dealer') ||
        profileData?.roles?.some(role => role.slug === 'service_center') ||
        profileData?.roles?.some(role => role.slug === 'manufacturer')
      ) {
        formdata.append(
          'code_sort',
          data?.extra_mobile_number?.[0].countryCode?.code ?? '',
        );
      } else {
        formdata.append('code_sort', data.countryCode?.code ?? '');
      }
      if (
        profileData?.roles?.some(role => role.slug === 'dealer') ||
        profileData?.roles?.some(role => role.slug === 'service_center') ||
        profileData?.roles?.some(role => role.slug === 'manufacturer')
      ) {
        formdata.append(
          'code',
          data?.extra_mobile_number?.[0].countryCode?.dial_code ?? '',
        );
      } else {
        formdata.append('code', data.countryCode?.dial_code ?? '');
      }

      if (
        profileData?.roles?.some(role => role.slug === 'dealer') ||
        profileData?.roles?.some(role => role.slug === 'service_center') ||
        profileData?.roles?.some(role => role.slug === 'manufacturer')
      ) {
        formdata.append(
          'mobile_number',
          data?.extra_mobile_number?.[0].mobile_number ?? '',
        );
      } else {
        formdata.append('mobile_number', data.mobile_number ?? '');
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
        'whats_app_mobile_number',
        data?.whats_app_mobile_number ?? '',
      );
      // formdata.append(
      //   'available_on_whatsapp_with_same_number',
      //   whatsappSame ? 1 : 0,
      // );
      // formdata.append(
      //   'receive_promotional_and_marketing_email',
      //   promotional ? 1 : 0,
      // );

      formdata.append('whats_app_code', data?.whats_app_code.dial_code ?? '');
      if (
        profileData?.roles?.some(role => role.slug === 'dealer') ||
        profileData?.roles?.some(role => role.slug === 'service_center') ||
        profileData?.roles?.some(role => role.slug === 'manufacturer')
      ) {
        formdata.append('email', data?.extra_mobile_number?.[0].email ?? '');
      } else {
        formdata.append('email', data.email ?? '');
      }

      formdata.append('gender', data?.gender.value ?? '');

      formdata.append('youtube_link', data?.youtube_link ?? '');
      formdata.append('facebook_link', data?.facebook_link ?? '');
      formdata.append('instagram_link', data?.instagram_link ?? '');
      formdata.append('web_link', data.web_link ?? '');

      formdata.append('country_id', data.country?.id ?? '');
      formdata.append('state_id', data.state?.id ?? '');
      formdata.append('city_id', data.city?.id ?? '');
      formdata.append('district', data?.district ?? '');
      formdata.append('taluka', data?.taluka ?? '');
      formdata.append('village', data?.village ?? '');
      formdata.append('location', data?.location ?? '');
      formdata.append('address', data?.location ?? '');
      if (locationCoords) {
        formdata.append('latitude', locationCoords.latitude.toString());
        formdata.append('longitude', locationCoords.longitude.toString());
      }

      // formdata.append(
      //   'your_best_engineer',
      //   JSON.stringify(data?.your_best_engineer) ?? '',
      // );
      // if (data.service_info && data.service_info.length > 0) {
      //   const serviceInfoPayload = data.service_info.map(item => ({
      //     company_id: item.company_id.map(c => (c.id ? c.id : '0')).toString(),
      //     company_name: item.company_id.map(c => c.label ?? '').toString(),
      //     location: item.location ?? '',
      //     latitude: item.latitude,
      //     longitude: item.longitude,
      //   }));
      //   formdata.append(
      //     'service_center_info',
      //     JSON.stringify(serviceInfoPayload),
      //   );
      // }
      // let SubProductArray: SelectedSubProductParams[] = [];
      // if (data.sub_categories_name.length > 0) {
      //   data.sub_categories_name.forEach(element => {
      //     SubProductArray.push({
      //       sub_category_id: element?.id ?? '',
      //       sub_category_name: element?.label,
      //     });
      //   });
      //   formdata.append('sub_category_id', JSON.stringify(SubProductArray));
      // } else {
      //   formdata.append('sub_category_id', '');
      // }

      if (data.extra_mobile_number && data.extra_mobile_number.length > 0) {
        let newArray: any[] = [];
        data.extra_mobile_number.forEach((item: OtherMobile) => {
          const {email, mobile_number, name, type, countryCode} = item || {};
          newArray.push({
            name: name || '',
            email: email || '',
            mobile_number: mobile_number || '',
            code_sort: countryCode?.code ?? '',
            code: countryCode?.dial_code ?? '',
            type: type || '',
          });
        });
        formdata.append('extra_mobile_number', JSON.stringify(newArray));
      }

      const result = await editProfile(formdata).unwrap();

      const {status, message} = result;
      toggleMessage(message);
      if (status) {
        if (
          !profileData?.roles?.some(role =>
            ['repairing_shop', 'sound_education'].includes(role.slug ?? ''),
          )
        ) {
          onSubmitBusinessProfile(data);
        }
      } else {
        setTimeout(() => {
          goBack();
        }, 500);
      }
    } catch (error: unknown) {
      const {message, errors: fieldErrors} = normalizeApiError(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof EditProfileFormParam, {
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
    (names: string[]) => {
      const slugs = profileData?.roles?.map(role => role.slug) || [];
      return names.some(el => slugs.includes(el));
    },
    [profileData?.roles],
  );

  return (
    <Container>
      <CommonHeader
        title={t('editProfile')}
        withBackArrow
        withChatNotification={false}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          AppStyle.flexGrow,
          VS.ph_16,
          VS.pv_10,
          VS.gap_10,
        ]}
        showsVerticalScrollIndicator={false}
        ScrollViewComponent={ScrollView}
        alwaysBounceVertical={false}>
        <Controller
          name={'image'}
          control={control}
          render={({field: {value}}) => (
            <ProfileAvatar imageUri={value} onPressCamera={handleCamera} />
          )}
        />
        {isExist(['dj_operator', 'sound_operator']) && (
          <>
            <Text
              style={[TS.fs_15, TS.tt_capitalize]}
              fontWeight="quickSandMedium">
              {t('register:gender')}
            </Text>
            <Controller
              control={control}
              name="gender"
              render={({field: {value, onChange}}) => (
                <CustomRadioGroup
                  options={t('register:forms.genderOptions', {
                    returnObjects: true,
                  })}
                  value={value?.value}
                  onChange={onChange}
                />
              )}
            />
          </>
        )}

        <InputBoxRHF
          fieldName="name"
          autoCapitalize={'words'}
          control={control}
          headerComponent={
            <InputHeader
              title={
                isExist(['sound_provider'])
                  ? t('register:forms.sound_provider.label')
                  : isExist(['dealer'])
                  ? t('register:forms.dealer.label')
                  : isExist(['manufacturer'])
                  ? t('register:forms.manufacturer.label')
                  : isExist(['sound_education'])
                  ? t('register:forms.sound_education.label')
                  : isExist(['spare_part'])
                  ? t('register:forms.spare_part.label')
                  : isExist(['repairing_shop'])
                  ? t('register:forms.repairing_shop.label')
                  : isExist(['dj_operator', 'sound_operator'])
                  ? t('register:forms.dj_operator.label')
                  : isExist(['service_center'])
                  ? t('register:forms.dealer.label')
                  : t('register:forms.common.label')
              }
            />
          }
          placeholder={
            isExist(['sound_provider'])
              ? t('register:forms.sound_provider.placeholder')
              : isExist(['dealer', 'service_center'])
              ? t('register:forms.dealer.placeholder')
              : isExist(['manufacturer'])
              ? t('register:forms.manufacturer.placeholder')
              : isExist(['sound_education'])
              ? t('register:forms.sound_education.placeholder')
              : isExist(['spare_part'])
              ? t('register:forms.spare_part.placeholder')
              : isExist(['repairing_shop'])
              ? t('register:forms.repairing_shop.placeholder')
              : isExist(['dj_operator', 'sound_operator'])
              ? t('register:forms.dj_operator.placeholder')
              : t('register:forms.common.placeholder')
          }
        />

        {isExist([
          'repairing_shop',
          'sound_education',
          'sound_provider',
          'dj_operator',
          'sound_operator',
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
                    ? t('register:forms.spare_part.yourShopName')
                    : t('register:forms.spare_part.label')
                }
                textWeight="quickSandMedium"
              />
            }
            placeholder={
              isExist(['spare_part'])
                ? t('register:forms.spare_part.yourShopNamePlaceholder')
                : t('register:forms.spare_part.placeholder')
            }
          />
        )}

        {!isExist([
          'manufacturer',
          'repairing_shop',
          'sound_education',
          'sound_operator',
          'dj_operator',
          'sound_provider',
          'service_center',
          'dealer',
          'spare_part',
        ]) && (
          <InputBoxRHF
            fieldName="business_name"
            control={control}
            autoCapitalize={'words'}
            headerComponent={
              <InputHeader
                title={
                  isExist(['spare_part'])
                    ? t('register:forms.spare_part.yourShopName')
                    : isExist(['dj_operator', 'sound_operator'])
                    ? t('register:forms.dj_operator.label')
                    : isExist(['sound_provider'])
                    ? t('register:forms.sound_provider.label')
                    : isExist(['manufacturer'])
                    ? t('register:forms.manufacturer.label')
                    : t('register:forms.common.label')
                }
                textWeight="quickSandMedium"
              />
            }
            placeholder={
              isExist(['spare_part'])
                ? t('register:forms.spare_part.yourShopNamePlaceholder')
                : isExist(['dj_operator', 'sound_operator'])
                ? t('register:forms.dj_operator.placeholder')
                : isExist(['sound_provider'])
                ? t('register:forms.sound_provider.placeholder')
                : isExist(['manufacturer'])
                ? t('register:forms.manufacturer.placeholder')
                : t('register:forms.common.placeholder')
            }
          />
        )}

        {!isExist(['dealer', 'manufacturer', 'service_center']) && (
          <InputBoxRHF
            fieldName="email"
            control={control}
            headerComponent={
              <InputHeader title={t('register:forms.email.label')} />
            }
            placeholder={t('register:forms.email.placeholder')}
            keyboardType="email-address"
          />
        )}

        {!isExist(['dealer', 'manufacturer', 'service_center']) && (
          <InputBoxRHF
            fieldName="mobile_number"
            control={control}
            editable={false}
            headerComponent={
              <InputHeader title={t('register:forms.mobile.label')} />
            }
            placeholder={t('register:forms.mobile.placeholder')}
            keyboardType="phone-pad"
            inputMode="numeric"
            maxLength={phoneLength}
            renderLeftIcon={
              <Controller
                control={control}
                name={'countryCode'}
                render={({field: {value}}) => (
                  <CountrySelector
                    countryCode={value}
                    separatorStyle={[VS.mh_6]}
                    onPressButton={() => {}}
                  />
                )}
              />
            }
          />
        )}

        {isExist(['dealer', 'service_center', 'manufacturer']) ? (
          <View>
            {otherMobileFields.map((field, idx) => (
              <View
                key={idx}
                style={[
                  {backgroundColor: Colors.primary},
                  VS.ph_15,
                  VS.pv_10,
                  VS.br_10,
                  VS.mb_20,
                ]}>
                <View style={[VS.fd_row, VS.jc_space_between, VS.mb_5]}>
                  <InputHeader
                    title={
                      field.type === 'Owner'
                        ? t('register:forms.fieldType.owner')
                        : field.type === 'Marketing'
                        ? t('register:forms.fieldType.marketing')
                        : t('register:forms.fieldType.other')
                    }
                    textWeight="quickSandBold"
                    textStyle={[CommonStyle.textWhite]}
                  />
                  {idx === 0 && otherMobileFields.length !== 3 ? (
                    <TouchableOpacity
                      onPress={() => addOtherMobileNumber('')}
                      style={[VS.ph_12, VS.pv_8, CommonStyle.bgWhite, VS.br_8]}>
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

                <InputBoxRHF
                  fieldName={`extra_mobile_number.${idx}.name`}
                  inputStyle={[VS.ph_6, CommonStyle.bgWhite]}
                  control={control}
                  autoCapitalize={'words'}
                  headerComponent={
                    <InputHeader
                      title={t('register:forms.common.label')}
                      textWeight="quickSandMedium"
                      textStyle={[CommonStyle.textWhite]}
                    />
                  }
                  placeholder={t('register:forms.common.placeholder')}
                  parentStyle={[VS.mb_16]}
                />
                <InputBoxRHF
                  fieldName={`extra_mobile_number.${idx}.mobile_number`}
                  control={control}
                  inputStyle={[VS.ph_6, CommonStyle.bgWhite]}
                  headerComponent={
                    <InputHeader
                      title={t('register:forms.mobile.label')}
                      textWeight="quickSandMedium"
                      textStyle={[CommonStyle.textWhite]}
                    />
                  }
                  placeholder={t('register:forms.mobile.placeholder')}
                  editable={idx === 0 ? false : true}
                  parentStyle={[VS.mb_16]}
                  keyboardType="phone-pad"
                  inputMode="numeric"
                  maxLength={getSampleNumber(field.countryCode)?.length ?? 10}
                  renderLeftIcon={
                    <Controller
                      control={control}
                      name={`extra_mobile_number.${idx}.countryCode`}
                      render={({field: {value}}) => (
                        <CountrySelector
                          countryCode={value ?? fetchCodeInformation('in')}
                          separatorStyle={[VS.mh_6]}
                          onPressButton={() => {
                            Keyboard.dismiss();
                            activeMobileIndex = idx;
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
                      title={t('register:forms.email.label')}
                      textWeight="quickSandMedium"
                      textStyle={[CommonStyle.textWhite]}
                    />
                  }
                  placeholder={t('register:forms.email.placeholder')}
                  keyboardType="email-address"
                  inputMode="email"
                  parentStyle={[VS.mb_16]}
                />
              </View>
            ))}
          </View>
        ) : null}

        {isExist(['manufacturer']) && (
          <CustomMultiDropDownList
            options={productList ?? []}
            headerTitle={
              profileData?.roles?.some(role => role.slug === 'manufacturer')
                ? t('register:forms.whatManufacturer.label')
                : t('selectProduct')
            }
            placeholder={
              profileData?.roles?.some(role => role.slug === 'manufacturer')
                ? t('register:forms.whatManufacturer.placeholder')
                : t('selectProduct')
            }
            fieldName="categories_name"
            control={control}
            title={
              profileData?.roles?.some(role => role.slug === 'manufacturer')
                ? t('register:forms.whatManufacturer.enterNew')
                : t('register:forms.whatManufacturer.enterNewProduct')
            }
            allowCustomEntry={true}
            onChangeInput={handleAddProduct}
            onAddPress={handleAddProduct}
            isSearchable={false}
            selected={selectedCategory}
            onSelect={(selected: DropDownListParams[]) => {
              catArray = selected;
            }}
            onCloseDropDown={() => {
              const companyIds = catArray.map(company => String(company.id));
              setValue('categories_name', catArray);
              setValue('category_id', companyIds);
              setSelectedCategory(companyIds);
            }}
          />
        )}

        <SelectionInputRHF
          fieldName="visiting_card_image"
          control={control}
          headerComponent={
            <InputHeader
              title={t('register:forms.visitingCard.label')}
              textWeight="quickSandMedium"
            />
          }
          placeholder={t('register:forms.visitingCard.placeholder')}
          onPress={() => {
            Keyboard.dismiss();
            selectedImageType = 'visiting_card_image';
            sheetRef?.current?.onPresent();
          }}
          renderRightIcon={<Icons.Uploader />}
        />

        <Controller
          control={control}
          name="visiting_card_file"
          render={({field: {value}}) =>
            value && typeof value === 'string' && value.trim() !== '' ? (
              <View style={[Styles.shopImageContainer, VS.mb_10]}>
                {value && typeof value === 'string' && value.trim() !== '' && (
                  <ProgressImage
                    source={{
                      uri: value,
                    }}
                    imageStyle={[VS.br_15]}
                    containerStyle={[Styles.shopImageContainer]}
                  />
                )}
                {getValues('visiting_card_file') !== '' &&
                  !getValues('visiting_card_file')?.startsWith('https://') && (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        setValue('visiting_card_image', '');
                        setValue('visiting_card_file', '');
                        clearErrors('visiting_card_file');
                      }}
                      style={[
                        Styles.shopImageDelete,
                        VS.pt_5,
                        VS.ai_center,
                        VS.jc_center,
                      ]}>
                      <Icons.Delete />
                    </TouchableOpacity>
                  )}
              </View>
            ) : (
              <></>
            )
          }
        />

        <View style={[VS.fd_row, VS.ai_start, VS.flex_1, VS.gap_10]}>
          <CustomDropDownList
            options={countryList ?? []}
            headerTitle={t('register:forms.country.label')}
            placeholder={t('register:forms.country.placeholder')}
            isSearchable
            displayValue={val => val.label}
            fieldName="country"
            title={t('register:forms.country.placeholder')}
            onSelect={val => {
              const values = getValues();
              reset({
                ...values,
                state: undefined,
                city: undefined,
              });
              setStateArray([]);
              setCityArray([]);
              getStates(Number(val.id!))
                .unwrap()
                .then(states => {
                  if (states && states.length > 0) {
                    setStateArray([...states]);
                  }
                });
            }}
            control={control}
          />
          <CustomDropDownList
            options={stateArray ?? []}
            displayValue={val => val.label}
            isSearchable
            headerTitle={t('register:forms.state.label')}
            placeholder={t('register:forms.state.placeholder')}
            fieldName="state"
            title={t('register:forms.state.placeholder')}
            onSelect={val => {
              const values = getValues();
              reset({
                ...values,
                city: undefined,
              });
              setCityArray([]);
              getCities(Number(val.id!))
                .unwrap()
                .then(cities => {
                  if (cities && cities.length > 0) {
                    setCityArray([...cities]);
                  }
                });
            }}
            control={control}
          />
        </View>

        <View style={[VS.fd_row, VS.ai_start, VS.flex_1, VS.gap_10]}>
          <CustomDropDownList
            fieldName="city"
            control={control}
            options={cityArray ?? []}
            headerTitle={t('register:forms.city.label')}
            displayValue={val => val.label}
            placeholder={t('register:forms.city.placeholder')}
            isSearchable
            title={t('register:forms.city.placeholder')}
            onSelect={() => {}}
          />
          <InputBoxRHF
            fieldName="village"
            control={control}
            headerComponent={
              <InputHeader title={t('register:forms.village.label')} />
            }
            placeholder={t('register:forms.village.placeholder')}
            autoCapitalize="words"
            parentStyle={[VS.flex_1]}
          />
        </View>
        <SelectionInputRHF
          fieldName="location"
          control={control}
          headerComponent={
            <InputHeader
              title={t('register:forms.location.label')}
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
                  setLocationCoords(locationData.coordinates);
                });
                setTimeout(() => {
                  locationPickerRef.current = false;
                }, 1000);
              },
            });
          }}
          renderRightIcon={<Icons.Location />}
          placeholder={t('register:forms.location.placeholder')}
        />

        <InputBoxRHF
          fieldName="facebook_link"
          control={control}
          headerComponent={
            <InputHeader
              title={t('register:forms.facebook.label')}
              textWeight="quickSandMedium"
            />
          }
          placeholder={t('register:forms.facebook.placeholder')}
          keyboardType={'url'}
          inputMode={'url'}
          maxLength={255}
        />

        <InputBoxRHF
          fieldName="instagram_link"
          control={control}
          headerComponent={
            <InputHeader
              title={t('register:forms.instagram.label')}
              textWeight="quickSandMedium"
            />
          }
          placeholder={t('register:forms.instagram.placeholder')}
          keyboardType={'url'}
          inputMode={'url'}
          maxLength={255}
        />

        <InputBoxRHF
          fieldName="web_link"
          control={control}
          headerComponent={
            <InputHeader
              title={t('register:forms.website.label')}
              textWeight="quickSandMedium"
            />
          }
          placeholder={t('register:forms.website.placeholder')}
          keyboardType={'url'}
          inputMode={'url'}
          maxLength={255}
        />

        <InputBoxRHF
          fieldName="youtube_link"
          control={control}
          headerComponent={
            <InputHeader
              title={t('register:forms.youtube.label')}
              textWeight="quickSandMedium"
            />
          }
          placeholder={t('register:forms.youtube.placeholder')}
          keyboardType={'url'}
          inputMode={'url'}
          maxLength={255}
        />

        {!isExist(['repairing_shop', 'sound_education']) && (
          <InputBoxRHF
            fieldName="gst_number"
            control={control}
            maxLength={16}
            headerComponent={
              <InputHeader
                title={t('register:forms.gst.label')}
                textWeight="quickSandMedium"
                textStyle={[TS.tt_uppercase]}
              />
            }
            placeholder={t('register:forms.gst.placeholder')}
            autoCapitalize={'characters'}
            inputMode={'text'}
            keyboardType={'default'}
          />
        )}

        <InputBoxRHF
          fieldName="description"
          control={control}
          headerComponent={
            <InputHeader title={t('register:forms.aboutUs.label')} />
          }
          placeholder={t('register:forms.aboutUs.placeholder')}
          multiline={true}
          maxLength={5000}
          numberOfLines={4}
          textInputStyle={[Styles.descriptionInput, VS.pt_15]}
        />

        <CustomButton
          buttonTitle={t('save')}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading || businessLoading}
          wrapperStyle={VS.mb_20}
        />
      </KeyboardAwareScrollView>

      <CountryCodePicker
        ref={countrySheetRef}
        onSelectCountry={(info: CountryCodeParams) => {
          const pLen = getSampleNumber(info)?.length ?? 10;
          if (selectedCountryCodeType === 'mobile') {
            setValue('countryCode', info);
            trigger('countryCode');
            setPhoneLength(pLen);
          } else if (
            selectedCountryCodeType === 'otherCountryCode' &&
            activeMobileIndex !== null
          ) {
            updateOtherMobileField(activeMobileIndex, 'countryCode', info);
          } else {
            setValue('whats_app_code', info);
            trigger('whats_app_code');
          }
        }}
      />

      <CustomBottomSheet ref={sheetRef}>
        <UploadMedia
          croppingOptions={
            selectedImageType === 'visiting_card_image'
              ? {
                  cropperCircleOverlay: false,
                  freeStyleCropEnabled: true,
                }
              : {
                  cropperCircleOverlay: true,
                  freeStyleCropEnabled: false,
                }
          }
          onSelectMedia={result => {
            if (selectedImageType === 'visiting_card_image') {
              if (result !== null) {
                setValue('visiting_card_file', result?.path ?? '');
                setValue('visiting_card_image', result.filename ?? '');
                trigger('visiting_card_image');
              }
            } else {
              if (result !== null) {
                setValue('image', result.path ?? '');
              }
            }
          }}
          onCloseAction={() => sheetRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
    </Container>
  );
};

export default EditProfile;
