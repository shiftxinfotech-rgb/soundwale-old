import { Icons } from '@assets';
import {
  CommonHeader,
  CustomBottomSheet,
  CustomBottomSheetMethods,
  CustomButton,
  CustomDropDownList,
  CustomMultiDropDownList,
  CustomMultiDropDownListRef,
  CustomRadioGroup,
  InputBoxRHF,
  InputHeader,
  ProgressImage,
  SelectionInput,
  SelectionInputRHF,
  Text,
  UploadMedia,
} from '@components';
import {
  DropDownListParams,
  ExtractedAddress,
  NavigationParamStack,
  SelectedManufacturerParams,
} from '@data';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToggleSnackBar, useUserInfo } from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  useAddBuyerRequirementMutation,
  useAddSellerRequirementMutation,
  useDeleteRequirementImageMutation,
  useEditRequirementMutation,
  useGetAddPostDataQuery,
  useGetRolesQuery,
  useGetTypeOfManufacturerQuery,
  useLazyGetSubCategoryListQuery,
} from '@services';
import { AppStyle, Colors, CommonStyle, TS, VS } from '@theme';
import { LatLng, navigate, normalizeApiError, validField } from '@util';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as Yup from 'yup';
import { Styles } from './Styles';
let slugArray: string[] = [];
type InputFormParam = {
  productType?: DropDownListParams;
  product?: DropDownListParams;
  subProduct?: DropDownListParams;
  company?: DropDownListParams;
  budget?: string;
  description?: string;
  other_details?: string;
  state?: DropDownListParams;
  images?: {uri: string; id: string}[];
  roles_name?: DropDownListParams[];
  roles_id?: string[];
  product_id?: string[];
  location?: string;
  product_name?: DropDownListParams[];
};
let locationCoords: LatLng = {
  latitude: 0,
  longitude: 0,
};
let extractedAddress: ExtractedAddress = {
  country: undefined,
  state: undefined,
  city: undefined,
  postalCode: undefined,
};
type AddPostRouteProp = RouteProp<NavigationParamStack, 'AddPost'>;

const AddPostScreen: React.FC<{route: AddPostRouteProp}> = ({route}) => {
  const type = route && route.params.type;
  const requirementInfo = (route && route.params.requirementInfo) ?? undefined;
  const {goBack} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {t} = useTranslation(['generic', 'register']);
  const locationPickerRef = useRef<boolean>(false);
  const sheetRef = useRef<CustomBottomSheetMethods | null>(null);
  const manufacturerRef = useRef<CustomMultiDropDownListRef | null>(null);

  const userInfo = useUserInfo();
  const {toggleMessage} = useToggleSnackBar();

  const {data: rolesArray} = useGetRolesQuery();
  const [removePostImage, {}] = useDeleteRequirementImageMutation();
  const {data: addPostData, isLoading} = useGetAddPostDataQuery(
    userInfo?.id?.toString() ?? '',
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const [getSubCategoryList, {data: subCategoryData}] =
    useLazyGetSubCategoryListQuery();
  const {data: typeOfManufacturerData} = useGetTypeOfManufacturerQuery(
    userInfo?.id?.toString() ?? '',
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const [addBuyerRequirement, {isLoading: addingBuyerRequirement}] =
    useAddBuyerRequirementMutation();
  const [addSellerRequirement, {isLoading: addingSellerRequirement}] =
    useAddSellerRequirementMutation();

  const [editRequirement, {isLoading: editLoading}] =
    useEditRequirementMutation();

  const validationSchema = Yup.object().shape({
    productType: Yup.object<DropDownListParams>().required(
      t('productTypeRequired'),
    ),
    product: Yup.object<DropDownListParams>().required(t('productRequired')),
    company: Yup.object<DropDownListParams>().required(t('companyRequired')),
    roles_id: Yup.array()
      .of(Yup.string())
      .min(1, t('minRolesRequired'))
      .required(t('rolesRequired')),
    roles_name: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.string().required(t('roleIdRequired')),
          label: Yup.string().required(t('roleLabelRequired')),
          value: Yup.string().required(t('roleValueRequired')),
        }),
      )
      .min(1, t('minRolesRequired'))
      .required(t('rolesRequired')),
    budget: Yup.string()
      .required(
        t('isRequired', {field: type === 'seller' ? t('price') : t('budget')}),
      )
      .matches(
        /^[0-9.]+$/,
        t('mustBeNumber', {
          field: type === 'seller' ? t('price') : t('budget'),
        }),
      ),
  });

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [roleList, setRoleList] = useState<DropDownListParams[]>([]);
  const [dealerCompanyList, setDealerCompanyList] = useState<
    DropDownListParams[]
  >([]);
  const [manufacturerList, setManufacturerList] = useState<
    DropDownListParams[]
  >([]);
  const [productList, setProductList] = useState<DropDownListParams[]>([]);
  const [subProductList, setSubProductList] = useState<DropDownListParams[]>(
    [],
  );
  const [selectedRoles, setSelectedRole] = useState<string[]>([]);

  const {control, handleSubmit, clearErrors, setError, setValue, watch} =
    useForm<InputFormParam>({
      defaultValues: {
        productType: addPostData?.requirementList[0],
        product: undefined,
        subProduct: undefined,
        company: undefined,
        roles_id: [],
        state: undefined,
        roles_name: [] as DropDownListParams[],
        budget: requirementInfo?.price?.toString() ?? '',
        description: requirementInfo?.description ?? '',
        other_details: requirementInfo?.other_details ?? '',
        product_id: undefined,
        images: [],
        location: requirementInfo?.address ?? userInfo?.address ?? '',
        product_name: [] as DropDownListParams[],
      },
      resolver: yupResolver(
        validationSchema,
      ) as unknown as Resolver<InputFormParam>,
      mode: 'onChange',
      criteriaMode: 'firstError',
      delayError: 100,
      shouldFocusError: true,
    });

  const imgArr = watch('images') ?? [];

  const pId = watch('product.value');
  const sId = watch('subProduct.value');
  const cId = watch('company.value');

  const onDeletePostImage = useCallback(
    async (id: string) => {
      try {
        const formdata = new FormData();
        formdata.append('id', id ?? '');
        formdata.append('type', type ?? '');
        const result = await removePostImage(formdata).unwrap();
        const {status, message} = result;
        if (status) {
        } else {
          toggleMessage(message);
        }
      } catch (error: unknown) {
        const {message} = normalizeApiError(error);
        if (message) {
          toggleMessage(message);
        } else {
          toggleMessage(t('serverError'));
        }
      }
    },
    [removePostImage, t, toggleMessage, type],
  );

  const submitEditForm = useCallback(
    async (data: FormData) => {
      try {
        const result = await editRequirement(data).unwrap();
        const {status, message} = result;
        toggleMessage(message);
        if (status) {
          if (route.params.onGoBack) {
            route.params.onGoBack();
          }
          goBack();
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
    },
    [editRequirement, goBack, route.params, setError, t, toggleMessage],
  );

  const submitBuyerForm = useCallback(
    async (data: FormData) => {
      try {
        const result = await addBuyerRequirement(data).unwrap();
        const {status, message} = result;
        toggleMessage(message);
        if (status) {
          goBack();
          if (route.params.onGoBack) {
            route.params.onGoBack();
          }
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
    },
    [addBuyerRequirement, goBack, route.params, setError, t, toggleMessage],
  );

  const submitSellerForm = useCallback(
    async (data: FormData) => {
      try {
        const result = await addSellerRequirement(data).unwrap();
        const {status, message} = result;
        toggleMessage(message);
        if (status) {
          goBack();
          if (route.params.onGoBack) {
            route.params.onGoBack();
          }
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
    },
    [addSellerRequirement, goBack, route.params, setError, t, toggleMessage],
  );

  const onSubmit = useCallback(
    async (data: InputFormParam) => {
      try {
        if (!data.roles_id || data.roles_id.length === 0) {
          setError('roles_id', {
            type: 'manual',
            message: t('minRolesRequired'),
          });
          return;
        }

        const formData = new FormData();
        formData.append('user_id', userInfo?.id ?? '');
        formData.append('country_id', userInfo?.country_id ?? '');
        formData.append('state_id', userInfo?.state_id ?? '');
        formData.append('city_id', userInfo?.city_id ?? '');
        formData.append('address', data?.location ?? '');
        formData.append('latitude', locationCoords?.latitude ?? '');
        formData.append('longitude', locationCoords?.longitude ?? '');

        if (
          extractedAddress.country &&
          extractedAddress.state &&
          extractedAddress.city
        ) {
          formData.append('country_name', extractedAddress.country);
          formData.append('state_name', extractedAddress.state);
          formData.append('city_name', extractedAddress.city);
        }

        formData.append('requirment_id', data?.productType?.id ?? '');
        formData.append(
          'categories_id',
          data?.company?.id === '' ? data?.company?.value : data?.company?.id,
        );
        formData.append(
          'category_id',
          data?.product?.id === '' ? data.product.value : data?.product?.id,
        );
        formData.append(
          'sub_category_id',
          data?.subProduct?.id === ''
            ? data.subProduct.value
            : data?.subProduct?.id,
        );
        formData.append('role_id', data.roles_id.toString() ?? '');

        let selectedManufacturer: SelectedManufacturerParams[] = [];
        if (data.product_id) {
          data.product_name?.forEach(element => {
            selectedManufacturer.push({
              manufacturer_id: element?.id ?? '',
              manufacturer_name: element?.label,
            });
          });
          formData.append('product_id', JSON.stringify(selectedManufacturer));
        } else {
          formData.append('product_id', '');
        }
        formData.append('price', data?.budget ?? '');
        formData.append('other_details', data?.other_details ?? '');
        formData.append('description', data?.description ?? '');
        if (requirementInfo !== undefined) {
          formData.append('id', requirementInfo.id ?? '');
          formData.append('type', type ?? '');
        }
        if (data.images && data.images.length > 0) {
          data.images?.forEach(el => {
            if (el.id === '') {
              if (validField(el.uri) && el.uri) {
                const name = el.uri.split('/').pop() ?? 'images.jpg';
                const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
                formData.append('images[]', {
                  uri: el.uri,
                  name,
                  type: `image/${ext}`,
                });
              }
            }
          });
        }

        if (requirementInfo !== undefined) {
          submitEditForm(formData);
        } else {
          if (type === 'buyer') {
            submitBuyerForm(formData);
          } else {
            submitSellerForm(formData);
          }
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
    },
    [
      userInfo?.id,
      userInfo?.country_id,
      userInfo?.city_id,
      userInfo?.state_id,
      requirementInfo,
      setError,
      type,
      submitEditForm,
      submitBuyerForm,
      submitSellerForm,
      toggleMessage,
      t,
    ],
  );

  const handleProductInput = useCallback(
    (input?: string) => {
      const trimmedName = input?.trim();
      if (!trimmedName) {
        return;
      }

      const productExists = productList.some(
        product => product.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (productExists) {
        toggleMessage(t('productNameAlreadyExists'));
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName,
        id: '',
      };
      setProductList(old => [formattedValue, ...old]);
    },
    [productList, t, toggleMessage],
  );

  const handleSubProductInput = useCallback(
    (input?: string) => {
      const trimmedName = input?.trim();
      if (!trimmedName) {
        return;
      }

      const subProductExists = subProductList.some(
        product => product.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (subProductExists) {
        toggleMessage(t('subProductNameAlreadyExists'));
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName,
        id: '',
      };
      setSubProductList(old => [formattedValue, ...old]);
    },
    [subProductList, t, toggleMessage],
  );

  const handleDealerCompanyInput = useCallback(
    (input?: string) => {
      const trimmedName = input?.trim();
      if (!trimmedName) {
        return;
      }

      const companyExists = dealerCompanyList.some(
        company => company.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (companyExists) {
        toggleMessage(t('companyAlreadyExists'));
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName,
        id: '',
      };
      setDealerCompanyList(old => [formattedValue, ...old]);
    },
    [dealerCompanyList, t, toggleMessage],
  );

  const handleAddProduct = useCallback(
    (input?: string) => {
      const trimmedName = input?.trim();
      if (!trimmedName) {
        return;
      }

      const companyExists = manufacturerList.some(
        company => company.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (companyExists) {
        toggleMessage(t('manufacturerNameAlreadyExists'));
        return;
      }
      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName,
        id: '',
      };
      setManufacturerList(old => [formattedValue, ...old]);
      manufacturerRef.current?.clearSearch();
    },
    [manufacturerList, t, toggleMessage],
  );

  useEffect(() => {
    if (requirementInfo !== undefined) {
      if (requirementInfo?.images && requirementInfo.images.length > 0) {
        setValue(
          'images',
          requirementInfo.images.map(img => ({
            uri: img.image_url ?? '',
            id: (img.id ?? '').toString(),
          })),
        );
      }
      locationCoords = {
        latitude: requirementInfo?.latitude ?? 0,
        longitude: requirementInfo?.longitude ?? 0,
      };
      if (requirementInfo.state_name !== '') {
        setValue('state', {
          label: requirementInfo.state_name ?? '',
          value: requirementInfo.state_name ?? '',
          id: requirementInfo.state_id,
        });
      }
      if (requirementInfo.requirment_name !== '') {
        setValue('productType', {
          label: requirementInfo.requirment_name ?? '',
          value: requirementInfo.requirment_name ?? '',
          id: requirementInfo.requirment_id,
        });
      }
      if (requirementInfo.category_id !== undefined) {
        setValue('product', {
          label: requirementInfo.category_name ?? '',
          value: requirementInfo.category_name ?? '',
          id: requirementInfo.category_id,
        });
      }
      if (
        requirementInfo.sub_category_id !== undefined &&
        requirementInfo.sub_category_id !== null &&
        requirementInfo.sub_category_id !== 0
      ) {
        setValue('subProduct', {
          label: requirementInfo.sub_category_name ?? '',
          value: requirementInfo.sub_category_name ?? '',
          id: requirementInfo.sub_category_id,
        });
      }
      if (requirementInfo.categories_id !== undefined) {
        setValue('company', {
          label: requirementInfo.main_category_name ?? '',
          value: requirementInfo.main_category_name ?? '',
          id: requirementInfo.categories_id,
        });
      }

      if (
        requirementInfo.roles_id !== undefined &&
        requirementInfo.roles_id !== null
      ) {
        const rIds = requirementInfo.roles_id.split(',');
        setSelectedRole(rIds);
        setValue('roles_id', rIds);

        if (
          requirementInfo.selected_role &&
          requirementInfo.selected_role.length > 0
        ) {
          const pickedRoles = requirementInfo.selected_role.map(el => ({
            label: el.name ?? '',
            value: el.name ?? '',
            id: el.id ?? '',
          }));
          if (pickedRoles.length > 0) {
            slugArray = requirementInfo.selected_role
              .map(selectedRole => {
                return selectedRole?.slug?.trim() !== ''
                  ? selectedRole?.slug
                  : null;
              })
              .filter(
                (slug): slug is string =>
                  typeof slug === 'string' && slug.trim() !== '',
              );
            setValue('roles_name', pickedRoles);
          }
        }
      }

      if (
        requirementInfo.product_id !== undefined &&
        requirementInfo.product_id !== null
      ) {
        const categoryId = requirementInfo.product_id.split(',');
        setSelectedCategory(categoryId);

        setValue('product_id', categoryId);

        if (
          requirementInfo?.what_manufacturer &&
          requirementInfo?.what_manufacturer.length > 0
        ) {
          const selected = requirementInfo?.what_manufacturer.map(el => ({
            label: el.value ?? '',
            value: el.value ?? '',
            id: el.id ?? '',
          }));
          if (selected.length > 0) {
            setValue('product_name', selected);
          }
        }
      }
    } else {
      locationCoords = {
        latitude: userInfo?.latitude ?? 0,
        longitude: userInfo?.longitude ?? 0,
      };
      setValue('location', userInfo?.address);
    }
  }, [
    requirementInfo,
    setValue,
    userInfo?.address,
    userInfo?.latitude,
    userInfo?.longitude,
  ]);

  useEffect(() => {
    if (requirementInfo !== undefined) {
      if (requirementInfo.category_id !== undefined) {
        getSubCategoryList({
          user_id: userInfo?.id?.toString() ?? '',
          category_id: requirementInfo.category_id?.toString() ?? '',
        });
      }
    }
  }, [requirementInfo, userInfo?.id, getSubCategoryList]);

  useEffect(() => {
    if (
      rolesArray !== undefined &&
      rolesArray !== null &&
      rolesArray.length > 0
    ) {
      let roles: DropDownListParams[] = [];
      rolesArray.forEach(element => {
        roles?.push({
          label: element.name ?? '',
          value: element.name ?? '',
          id: element.id ?? '',
        });
      });
      setRoleList(roles);
    }
  }, [rolesArray]);

  useEffect(() => {
    if (typeOfManufacturerData) {
      setManufacturerList(typeOfManufacturerData ?? []);
    }
    return () => {};
  }, [typeOfManufacturerData]);

  useEffect(() => {
    if (addPostData) {
      setProductList(addPostData?.categories ?? []);
      setDealerCompanyList(addPostData?.mainCategory ?? []);
      setValue('productType', addPostData?.requirementList[0]);
    }
    return () => {};
  }, [addPostData, setValue]);

  useEffect(() => {
    if (subCategoryData) {
      setSubProductList(subCategoryData ?? []);
    }
  }, [subCategoryData]);

  return (
    <View style={[VS.flex_1, CommonStyle.bgWhite]}>
      <CommonHeader
        title={`${requirementInfo !== undefined ? 'Edit' : 'Add'} Requirements`}
        withBackArrow
      />
      {isLoading ? (
        <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={[AppStyle.flexGrow]}
          showsVerticalScrollIndicator={false}
          ScrollViewComponent={ScrollView}
          alwaysBounceVertical={false}>
          <View style={[VS.flex_1, VS.ph_16, VS.gap_10]}>
            <>
              <Text
                style={[TS.fs_15, TS.tt_capitalize]}
                fontWeight="quickSandMedium">
                {t('productType')}
              </Text>
              <Controller
                control={control}
                name="productType"
                render={({field: {value, onChange}}) => (
                  <CustomRadioGroup
                    options={addPostData?.requirementList ?? []}
                    value={value?.value}
                    onChange={onChange}
                  />
                )}
              />
            </>
            <CustomDropDownList
              options={productList ?? []}
              title={t('addOtherProduct')}
              headerTitle={t('product')}
              isSearchable
              placeholder={t('selectProduct')}
              control={control}
              fieldName="product"
              selected={pId}
              onAddPress={handleProductInput}
              displayValue={val => val.label}
              onPress={() => {
                clearErrors('product');
              }}
              isAdd={true}
              onSelect={val => {
                setSubProductList([]);
                setValue('subProduct', undefined);
                getSubCategoryList({
                  user_id: userInfo?.id?.toString() ?? '',
                  category_id: val.id?.toString() ?? '',
                });
              }}
              withClear
              onClear={() => {
                setSubProductList([]);
                clearErrors(['product', 'subProduct']);
                setValue('product', undefined, {shouldValidate: false});
                setValue('subProduct', undefined, {shouldValidate: false});
              }}
            />

            <CustomDropDownList
              fieldName="subProduct"
              control={control}
              options={subProductList ?? []}
              title={t('selectSubProduct')}
              isSearchable
              selected={sId}
              headerTitle={t('subProduct')}
              placeholder={t('selectSubProduct')}
              onAddPress={handleSubProductInput}
              displayValue={val => val.label}
              isAdd={true}
              onPress={() => {
                clearErrors('subProduct');
              }}
              onSelect={() => {}}
              withClear
              onClear={() => {
                setValue('subProduct', undefined);
              }}
            />

            <CustomDropDownList
              fieldName="company"
              control={control}
              options={dealerCompanyList ?? []}
              title={t('addOtherCompany')}
              headerTitle={t('company')}
              placeholder={t('selectCompany')}
              displayValue={val => val.label}
              onAddPress={handleDealerCompanyInput}
              isAdd={true}
              selected={cId}
              onSelect={() => {}}
              onPress={() => {
                clearErrors('company');
              }}
              withClear
              onClear={() => {
                setValue('company', undefined);
              }}
            />

            <CustomMultiDropDownList
              options={roleList ?? []}
              headerTitle={t('whoCanSeeThisPost')}
              placeholder={t('select')}
              fieldName="roles_name"
              title={t('select')}
              allowCustomEntry={false}
              isSearchable={true}
              selected={selectedRoles}
              onSelect={() => {}}
              onCloseDropDown={(roles: DropDownListParams[]) => {
                const companyIds = roles.map(company => String(company.id));
                setValue('roles_id', companyIds);
                setValue('roles_name', roles);
                slugArray = roles
                  .map(selectedRole => {
                    const found = rolesArray?.find(
                      role => String(role.id) === String(selectedRole.id),
                    );
                    return typeof found?.slug === 'string' &&
                      found.slug.trim() !== ''
                      ? found.slug
                      : null;
                  })
                  .filter(
                    (slug): slug is string =>
                      typeof slug === 'string' && slug.trim() !== '',
                  );
                setSelectedRole(companyIds);
                clearErrors('roles_name');
              }}
              control={control}
            />
            {(userInfo?.roles?.some(role => role.slug === 'manufacturer') ||
              slugArray?.includes('manufacturer')) && (
              <CustomMultiDropDownList
                ref={manufacturerRef}
                options={manufacturerList ?? []}
                headerTitle={t('typeOfManufacturer')}
                placeholder={t('select')}
                fieldName="product_name"
                title={t('register:forms.whatManufacturer.enterNew')}
                allowCustomEntry={true}
                onAddPress={handleAddProduct}
                isSearchable={false}
                selected={selectedCategory}
                onSelect={() => {}}
                onCloseDropDown={(selected: DropDownListParams[]) => {
                  const companyIds = selected.map(company =>
                    String(company.id),
                  );
                  setValue('product_name', selected);
                  setValue('product_id', companyIds);
                  setSelectedCategory(companyIds);
                }}
                control={control}
              />
            )}

            <InputBoxRHF
              fieldName="budget"
              control={control}
              keyboardType="numeric"
              headerComponent={
                <InputHeader
                  title={type === 'seller' ? t('price') : t('budget')}
                  textWeight="quickSandMedium"
                />
              }
              placeholder={`${t('enter')} ${
                type === 'seller' ? t('price') : t('budget')
              }`}
              maxLength={10}
              sanitizeInput={text => text.replace(/[^0-9.]/g, '')}
            />

            <InputBoxRHF
              fieldName="other_details"
              control={control}
              headerComponent={
                <InputHeader
                  title={t('productDetails')}
                  textWeight="quickSandMedium"
                />
              }
              placeholder={t('enterProductDetails')}
              multiline={true}
              textInputStyle={[Styles.descriptionInput, VS.pt_15]}
            />

            <SelectionInputRHF
              fieldName="location"
              control={control}
              headerComponent={
                <InputHeader
                  title={t('location')}
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
                      country?: string;
                      state?: string;
                      city?: string;
                      postalCode?: string;
                    };
                  }) => {
                    extractedAddress = locationData.address;
                    requestAnimationFrame(() => {
                      setValue('location', locationData.address.fullAddress);
                      locationCoords = locationData.coordinates;
                      locationPickerRef.current = false;
                    });
                  },
                });
              }}
              renderRightIcon={<Icons.Location />}
              placeholder={t('selectLocation')}
            />

            <SelectionInput
              onPress={() => {
                Keyboard.dismiss();
                sheetRef?.current?.onPresent();
              }}
              headerComponent={
                <InputHeader title={t('image')} textWeight="quickSandMedium" />
              }
              placeholder={t('uploadFile')}
              renderRightIcon={<Icons.Uploader />}
            />

            <Controller
              control={control}
              name="images"
              render={({field, fieldState: {error}}) => (
                <View>
                  <View style={[VS.fd_row, VS.fw_wrap, VS.gap_10]}>
                    {field.value?.map((el, index) => {
                      return (
                        <View key={index}>
                          <ProgressImage
                            source={{uri: el.uri}}
                            imageStyle={[VS.br_15]}
                            containerStyle={[Styles.shopImageContainer]}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              const newImgArr = imgArr.filter(
                                (_, i) => i !== index,
                              );
                              setValue('images', newImgArr);
                              if (el.id !== '') {
                                onDeletePostImage(el.id);
                              }
                            }}
                            style={[
                              Styles.shopImageDelete,
                              VS.pt_5,
                              VS.ai_center,
                              VS.jc_center,
                            ]}>
                            <Icons.Delete />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                  {error?.message && (
                    <Text style={[TS.fs_12, CommonStyle.textRed]}>
                      {error?.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <CustomButton
              buttonTitle={t('submit')}
              isLoading={
                addingBuyerRequirement || addingSellerRequirement || editLoading
              }
              onPress={handleSubmit(onSubmit)}
              wrapperStyle={[VS.mv_20]}
            />
          </View>
        </KeyboardAwareScrollView>
      )}

      <CustomBottomSheet ref={sheetRef}>
        <UploadMedia
          croppingOptions={{
            cropperCircleOverlay: false,
            freeStyleCropEnabled: true,
            multiple: true,
          }}
          onSelectMedia={result => {
            if (result !== null) {
              const resultArray = Array.isArray(result) ? result : [result];
              const validImgArr = resultArray.filter(
                img => img && img.path && img.path.trim() !== '',
              );
              const newImgArr = [...imgArr, ...validImgArr];
              clearErrors('images');
              setValue(
                'images',
                newImgArr.map(img => ({
                  uri: img.path ?? img.uri ?? '',
                  id: img.id ?? '',
                })),
              );
            }
          }}
          onCloseAction={() => sheetRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
    </View>
  );
};

export default AddPostScreen;
