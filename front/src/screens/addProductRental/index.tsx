import {Icons} from '@assets';
import {
  CommonHeader,
  Container,
  CustomButton,
  CustomDropDownList,
  Text,
} from '@components';
import {
  AddProductRentalFormParams,
  DropDownListParams,
  NavigationParamStack,
} from '@data';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToggleSnackBar} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {nanoid} from '@reduxjs/toolkit';
import {
  useGetAddPostDataQuery,
  useLazyGetModelListQuery,
  useUpdateBusinessSpecificFieldsMutation,
} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {normalizeApiError, validField} from '@util';
import React, {useCallback, useEffect, useState} from 'react';
import {Resolver, useFieldArray, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import * as Yup from 'yup';
import {Styles} from './Styles';

const validationSchema = Yup.object().shape({});

type AddProductRentalRouteProp = RouteProp<
  NavigationParamStack,
  'AddProductRental'
>;

type ProductInfoPros = {
  id?: string;
  company_id: DropDownListParams | string | number | undefined;
  product_id: DropDownListParams | string | number | undefined;
  model_id: DropDownListParams | string | number | undefined;
  company_name: string;
  product_name: string;
  model_name: string;
};

const AddRentalProduct: React.FC<{route: AddProductRentalRouteProp}> = ({
  route,
}) => {
  const {t} = useTranslation(['generic']);
  const profileData = (route?.params && route?.params?.profileData) ?? null;
  const {addListener, goBack} =
    useNavigation<NavigationProp<NavigationParamStack>>();
  const {toggleMessage} = useToggleSnackBar();

  const [editBusinessProfile, {isLoading}] =
    useUpdateBusinessSpecificFieldsMutation();
  const [getModelList, {data: modelData}] = useLazyGetModelListQuery();
  const {data: addPostData} = useGetAddPostDataQuery(
    profileData?.id?.toString() ?? '',
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [dealerCompanyList, setDealerCompanyList] = useState<
    DropDownListParams[]
  >([]);
  const [productList, setProductList] = useState<DropDownListParams[]>([]);
  const [modelList, setModelList] = useState<DropDownListParams[]>([]);

  const {control, handleSubmit, setValue, setError, watch} =
    useForm<AddProductRentalFormParams>({
      defaultValues: {
        product_info: [],
      },
      resolver: yupResolver(
        validationSchema,
      ) as unknown as Resolver<AddProductRentalFormParams>,
      mode: 'onChange',
    });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'product_info',
  });

  const pInfo = watch('product_info');

  useEffect(() => {
    const listener = addListener('focus', () => {
      getModelList(profileData?.id?.toString() ?? '');
    });
    return () => listener();
  }, [addListener, profileData, getModelList]);

  useEffect(() => {
    if (modelData && modelData?.length > 0) {
      setModelList(modelData ?? []);
    }
    return () => {};
  }, [modelData]);

  useEffect(() => {
    if (addPostData) {
      setProductList(addPostData?.categories ?? []);
      setDealerCompanyList(addPostData?.mainCategory ?? []);
    }
  }, [addPostData]);

  const onSubmit = async (data: AddProductRentalFormParams) => {
    // Validate all fields before submission
    const hasInvalid = (data.product_info || []).some(item => {
      const isValidProductId =
        item.product_id?.id !== undefined &&
        item.product_id?.id !== null &&
        item.product_id?.id !== '';

      const isValidCompanyId =
        item.company_id?.id !== undefined &&
        item.company_id?.id !== null &&
        item.company_id?.id !== '';

      const isValidModelId =
        item.model_id?.id !== undefined &&
        item.model_id?.id !== null &&
        item.model_id?.id !== '';
      return !(isValidProductId && isValidCompanyId && isValidModelId);
    });
    if (hasInvalid) {
      toggleMessage(t('generic:pleaseFillAllFields'));
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append('id', profileData?.id ?? '');
      let productInfo: ProductInfoPros[] = [];
      if (data?.product_info && data?.product_info?.length > 0) {
        data.product_info?.forEach(item => {
          const isCustomProduct =
            typeof item.product_id?.id === 'string' &&
            item.product_id.id.startsWith('cust_');
          const isCustomCompany =
            typeof item.company_id?.id === 'string' &&
            item.company_id.id.startsWith('cust_');
          const isCustomModel =
            typeof item.model_id?.id === 'string' &&
            item.model_id.id.startsWith('cust_');

          productInfo.push({
            product_id: isCustomProduct ? '' : item.product_id?.id ?? '',
            company_id: isCustomCompany ? '' : item.company_id?.id ?? '',
            model_id: isCustomModel ? '' : item.model_id?.id ?? '',

            product_name: isCustomProduct
              ? item.product_id?.label ?? ''
              : item.product_id?.value ?? '',

            company_name: isCustomCompany
              ? item.company_id?.label ?? ''
              : item.company_id?.value ?? '',

            model_name: isCustomModel
              ? item.model_id?.label ?? ''
              : item.model_id?.value ?? '',
          });
        });
        formdata.append('product_info', JSON.stringify(productInfo));
      } else {
        formdata.append('product_info', '');
      }

      console.log('formData', JSON.stringify(formdata, null, 2));

      const result = await editBusinessProfile(formdata).unwrap();
      const {status, message} = result;
      toggleMessage(message);
      if (status) {
        goBack();
      }
    } catch (error: unknown) {
      const {message, errors: fieldErrors} = normalizeApiError(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof AddProductRentalFormParams, {
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

  const addNewProduct = useCallback(() => {
    const newField = {
      id: Date.now().toString(),
      company_id: {
        label: t('selectCompany'),
        value: '',
        id: '',
      } as DropDownListParams,
      product_id: {
        label: t('selectProduct'),
        value: '',
        id: '',
      } as DropDownListParams,
      product_name: '',
      company_name: '',
      model_name: '',
      model_id: {
        label: t('selectModel'),
        value: '',
        id: '',
      } as DropDownListParams,
    };
    append(newField);
  }, [append, t]);

  // Only run validation when user clicks Add More
  const handleAddMorePress = useCallback(() => {
    let hasEmpty = false;
    if (pInfo && pInfo.length > 0) {
      for (let i = 0; i < pInfo.length; i++) {
        const item = pInfo[i];
        if (
          !item.product_id ||
          !item.product_id.id ||
          item.product_id.id === '' ||
          !item.company_id ||
          !item.company_id.id ||
          item.company_id.id === '' ||
          !item.model_id ||
          !item.model_id.id ||
          item.model_id.id === ''
        ) {
          hasEmpty = true;
          break;
        }
      }
    }
    if (hasEmpty) {
      toggleMessage(t('generic:pleaseSelectAllFieldsBeforeAdding'));
      return;
    }
    addNewProduct();
  }, [pInfo, toggleMessage, t, addNewProduct]);

  const handleAddProduct = useCallback(
    (input?: string) => {
      const trimmedName = input?.trim();
      if (!trimmedName) {
        return;
      }

      const companyExists = productList.some(
        company => company.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (companyExists) {
        toggleMessage(t('productNameAlreadyExists'));
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName.toLowerCase().replace(/\s+/g, '_'),
        id: `cust_${nanoid(6)}`,
      };
      setProductList(old => [formattedValue, ...old]);
    },
    [productList, t, toggleMessage],
  );

  const handleModelAdd = useCallback(
    (input?: string) => {
      const trimmedName = input?.trim();
      if (!trimmedName) {
        return;
      }

      const modelExits = modelList.some(
        company => company.label.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (modelExits) {
        toggleMessage(t('modelNameAlreadyExists'));
        return;
      }

      const formattedValue: DropDownListParams = {
        label: trimmedName,
        value: trimmedName.toLowerCase().replace(/\s+/g, '_'),
        id: `cust_${nanoid(6)}`,
      };
      setModelList(old => [formattedValue, ...old]);
    },
    [modelList, t, toggleMessage],
  );

  const handleAddCompany = useCallback(
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
        value: trimmedName.toLowerCase().replace(/\s+/g, '_'),
        id: `cust_${nanoid(6)}`,
      };
      setDealerCompanyList(old => [formattedValue, ...old]);
    },
    [dealerCompanyList, t, toggleMessage],
  );

  useEffect(() => {
    try {
      const {business_data} = profileData || {};
      if (Array.isArray(business_data) && business_data.length > 0) {
        const {product_info} = business_data[0] || {};
        if (product_info && validField(product_info)) {
          const array = JSON.parse(product_info);
          console.log('array', JSON.stringify(array, null, 2));

          const mappedFields = array.map((item: ProductInfoPros) => ({
            id: item.id || nanoid(6),
            company_id: {
              label: item.company_name || t('selectCompany'),
              value: item.company_name || '',
              id: item.company_id || '',
            },
            product_id: {
              label: item.product_name || t('selectProduct'),
              value: item.product_name || '',
              id: item.product_id || '',
            },
            model_id: {
              label: item.model_name || t('selectModel'),
              value: item.model_name || '',
              id: item.model_id || '',
            },
            company_name: item.company_name || '',
            product_name: item.product_name || '',
            model_name: item.model_name || '',
          }));
          setValue('product_info', mappedFields);
        } else {
          addNewProduct();
        }
      } else {
        addNewProduct();
      }
    } catch (error) {}
  }, [addNewProduct, profileData, setValue, t]);

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader
          title={t('addProduct')}
          withBackArrow
          withChatNotification={false}
        />
        <View style={[VS.ph_16, VS.pv_10, VS.flex_1]}>
          <View
            style={[
              VS.fd_row,
              VS.gap_10,
              VS.jc_space_between,
              VS.ai_center,
              VS.mb_16,
            ]}>
            <Text style={[TS.fs_15, VS.mb_8]} fontWeight="quickSandMedium">
              {t('productInformation')}
            </Text>
            <TouchableOpacity
              onPress={handleAddMorePress}
              style={[VS.ph_12, VS.pv_8, CommonStyle.bgPrimary, VS.br_8]}>
              <Text
                style={[TS.fs_14, CommonStyle.textWhite]}
                fontWeight="medium">
                {t('addMore')}
              </Text>
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView
            alwaysBounceVertical={false}
            style={[VS.flex_1]}
            contentContainerStyle={[AppStyle.flexGrow, VS.pv_10]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'interactive'}
            ScrollViewComponent={ScrollView}>
            <View style={[VS.flex_1]}>
              {fields.map((item, idx) => (
                <View
                  key={item.id}
                  style={[
                    VS.mb_10,
                    VS.ph_15,
                    VS.pv_10,
                    VS.br_10,
                    CommonStyle.shadowBox,
                    {backgroundColor: Colors.primary},
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={15}
                    onPress={() => remove(idx)}
                    style={Styles.deleteIcon}>
                    <Icons.Close color={Colors.white} size={18} />
                  </TouchableOpacity>
                  <CustomDropDownList
                    key={`product-${item.id}`}
                    options={productList ?? []}
                    isAdd
                    isSearchable
                    onAddPress={handleAddProduct}
                    headerTitle={t('product')}
                    headerStyle={[CommonStyle.textWhite]}
                    placeholder={t('selectProduct')}
                    selected={item.product_name}
                    fieldName={`product_info.${idx}.product_id`}
                    title={t('selectProduct')}
                    displayValue={val => val.label}
                    onSelect={() => {}}
                    control={control}
                  />

                  <CustomDropDownList
                    key={`company-${item.id}`}
                    options={dealerCompanyList ?? []}
                    isAdd
                    isSearchable
                    onAddPress={handleAddCompany}
                    headerTitle={t('company')}
                    headerStyle={[CommonStyle.textWhite]}
                    placeholder={t('selectCompany')}
                    selected={item.company_name}
                    fieldName={`product_info.${idx}.company_id`}
                    title={t('selectCompany')}
                    displayValue={val => val.label}
                    onSelect={() => {}}
                    control={control}
                  />

                  <CustomDropDownList
                    key={`model-${item.id}`}
                    options={modelList ?? []}
                    isAdd
                    isSearchable
                    onAddPress={handleModelAdd}
                    headerTitle={t('model')}
                    headerStyle={[CommonStyle.textWhite]}
                    placeholder={t('selectModel')}
                    selected={item.model_name}
                    fieldName={`product_info.${idx}.model_id`}
                    title={t('selectModel')}
                    displayValue={val => val.label}
                    onSelect={() => {}}
                    control={control}
                  />
                </View>
              ))}
            </View>
          </KeyboardAwareScrollView>
        </View>
        <CustomButton
          buttonTitle={t('submit')}
          isLoading={isLoading}
          wrapperStyle={[VS.mb_20, VS.mh_15]}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Container>
  );
};

export default AddRentalProduct;
