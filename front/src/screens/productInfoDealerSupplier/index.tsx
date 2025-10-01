import {
  CommonHeader,
  Container,
  CustomButton,
  CustomMultiDropDownList,
} from '@components';
import {
  DropDownListParams,
  NavigationParamStack,
  ProductInfoDealerSupplierFormParam,
  SelectedCompanyParams,
  SelectedProductParams,
  SelectedSubProductParams,
} from '@data';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToggleSnackBar} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  useGetAddPostDataQuery,
  useLazyGetSubCategoryListQuery,
  useUpdateBusinessSpecificFieldsMutation,
} from '@services';
import {AppStyle, VS} from '@theme';
import {normalizeApiError} from '@util';
import React, {useCallback, useEffect, useState} from 'react';
import {Resolver, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({});

type AddProductRentalRouteProp = RouteProp<
  NavigationParamStack,
  'ProductInfoDealerSupplier'
>;

let catArray: DropDownListParams[] = [];
let subCatArray: DropDownListParams[] = [];

const ProductInfoDealerSupplier: React.FC<{
  route: AddProductRentalRouteProp;
}> = ({route}) => {
  const {t} = useTranslation(['generic', 'register', 'profile']);
  const profileData = (route?.params && route?.params?.profileData) ?? null;
  const {goBack} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {toggleMessage} = useToggleSnackBar();
  const [editBusinessProfile, {isLoading}] =
    useUpdateBusinessSpecificFieldsMutation();
  const {data: addPostData} = useGetAddPostDataQuery(
    profileData?.id?.toString() ?? '',
  );
  const [getSubCategoryList, {data: subCategoryData}] =
    useLazyGetSubCategoryListQuery();

  const [dealerCompanyList, setDealerCompanyList] = useState<
    DropDownListParams[]
  >([]);
  const [productList, setProductList] = useState<DropDownListParams[]>([]);
  const [subProductList, setSubProductList] = useState<DropDownListParams[]>(
    [],
  );

  const {control, handleSubmit, setValue, setError, watch} =
    useForm<ProductInfoDealerSupplierFormParam>({
      defaultValues: {
        companies_id: [],
        category_id: [],
        sub_category_id: [],
        companies_name: [] as DropDownListParams[],
        categories_name: [] as DropDownListParams[],
        sub_categories_name: [] as DropDownListParams[],
      },
      resolver: yupResolver(
        validationSchema,
      ) as unknown as Resolver<ProductInfoDealerSupplierFormParam>,
      mode: 'onChange',
    });

  const selectedCompany = watch('companies_id');
  const selectedCategory = watch('category_id');
  const selectedSubCategory = watch('sub_category_id');

  useEffect(() => {
    if (subCategoryData) {
      setSubProductList(subCategoryData ?? []);
    }
  }, [subCategoryData]);

  useEffect(() => {
    if (addPostData) {
      setProductList(addPostData?.categories ?? []);
      setDealerCompanyList(addPostData?.mainCategory ?? []);
    }
  }, [addPostData]);

  const onSubmit = async (data: ProductInfoDealerSupplierFormParam) => {
    try {
      const formdata = new FormData();
      formdata.append('id', profileData?.id ?? '');
      let companyArray: SelectedCompanyParams[] = [];
      if (data.companies_name) {
        data.companies_name.forEach(element => {
          companyArray.push({
            company_id: element?.id ?? '',
            company_name: element?.label,
          });
        });
        formdata.append('companies_id', JSON.stringify(companyArray));
      } else {
        formdata.append('companies_id', '');
      }

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
            setError(field as keyof ProductInfoDealerSupplierFormParam, {
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

  const handleAddCompany = useCallback(
    (text?: string) => {
      const trimmedName = text?.trim();
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

  const handleAddSubProduct = useCallback(
    (text?: string) => {
      const trimmedName = text?.trim();
      if (!trimmedName) {
        return;
      }

      const companyExists = subProductList.some(
        company => company.label.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (companyExists) {
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

  useEffect(() => {
    try {
      const {business_data} = profileData || {};
      if (Array.isArray(business_data) && business_data.length > 0) {
        const first = business_data[0];
        if (first?.companies_id) {
          const companyIds = first.companies_id.split(',');
          setValue('companies_id', companyIds);

          if (
            addPostData?.mainCategory &&
            addPostData?.mainCategory.length > 0
          ) {
            const selectedCompanies = addPostData?.mainCategory.filter(
              company => companyIds.includes(String(company.value)),
            );
            if (selectedCompanies.length > 0) {
              setValue('companies_name', selectedCompanies);
            }
          }
        }

        if (first?.category_id) {
          const categoryId = first.category_id.split(',');
          setValue('category_id', categoryId);
          const categoryNames = first.category_names;
          if (Array.isArray(categoryNames) && categoryNames.length > 0) {
            setValue(
              'categories_name',
              categoryNames.map(item => ({
                id: item.id,
                label: item.value,
                value: item.value,
              })),
            );
            getSubCategoryList({
              user_id: profileData?.id?.toString() ?? '',
              category_id: categoryId.join(','),
            });
          }
        }

        if (first?.sub_category_id) {
          const subcategoryId = first.sub_category_id.split(',');
          setValue('sub_category_id', subcategoryId);
          const subCategoryNames = first.sub_category_names;
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
      }
    } catch (error) {}
  }, [addPostData?.mainCategory, getSubCategoryList, profileData, setValue]);

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader
          title={t('productInformation')}
          withBackArrow
          withChatNotification={false}
        />
        <KeyboardAwareScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={[
            AppStyle.flexGrow,
            VS.ph_16,
            VS.pv_10,
            VS.gap_10,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={'interactive'}
          ScrollViewComponent={ScrollView}>
          <CustomMultiDropDownList
            options={dealerCompanyList ?? []}
            headerTitle={
              profileData?.roles?.some(r => ['dealer'].includes(r.slug ?? ''))
                ? t('dealerOfCompany')
                : t('companies')
            }
            placeholder={
              profileData?.roles?.some(r => ['dealer'].includes(r.slug ?? ''))
                ? t('selectDealerOfCompany')
                : t('selectCompanies')
            }
            fieldName="companies_name"
            title={
              profileData?.roles?.some(r => ['dealer'].includes(r.slug ?? ''))
                ? t('enterDealerOfCompany')
                : t('enterCompanies')
            }
            allowCustomEntry={true}
            onAddPress={handleAddCompany}
            isSearchable={false}
            selected={selectedCompany}
            onSelect={() => {}}
            onCloseDropDown={(selectedCompanies: DropDownListParams[]) => {
              const companyIds = selectedCompanies.map(company =>
                String(company.id),
              );
              setValue('companies_name', selectedCompanies);
              setValue('companies_id', companyIds);
            }}
            control={control}
          />
          <CustomMultiDropDownList
            options={productList ?? []}
            headerTitle={
              profileData?.roles?.some(role => role.slug === 'manufacturer')
                ? t('register:forms.whatManufacturer.label')
                : t('profile:selectProduct')
            }
            placeholder={
              profileData?.roles?.some(role => role.slug === 'manufacturer')
                ? t('register:forms.whatManufacturer.placeholder')
                : t('profile:selectProduct')
            }
            fieldName="categories_name"
            title={
              profileData?.roles?.some(role => role.slug === 'manufacturer')
                ? t('register:forms.whatManufacturer.enterNew')
                : t('register:forms.whatManufacturer.enterNewProduct')
            }
            allowCustomEntry={true}
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
              getSubCategoryList({
                user_id: profileData?.id?.toString() ?? '',
                category_id: companyIds.join(','),
              });
            }}
            control={control}
          />
          <CustomMultiDropDownList
            options={subProductList ?? []}
            headerTitle={t('profile:selectSubProduct')}
            placeholder={t('profile:selectSubProduct')}
            fieldName="sub_categories_name"
            title={t('profile:enterNewSubProduct')}
            onAddPress={handleAddSubProduct}
            allowCustomEntry={true}
            isSearchable={true}
            selected={selectedSubCategory}
            onSelect={(selected: DropDownListParams[]) => {
              subCatArray = selected;
            }}
            onCloseDropDown={() => {
              const companyIds = subCatArray.map(company => String(company.id));
              setValue('sub_categories_name', subCatArray);
              setValue('sub_category_id', companyIds);
            }}
            control={control}
          />
        </KeyboardAwareScrollView>
        <CustomButton
          buttonTitle={t('profile:save')}
          isLoading={isLoading}
          wrapperStyle={[VS.mv_20, VS.mh_15]}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Container>
  );
};

export default ProductInfoDealerSupplier;
