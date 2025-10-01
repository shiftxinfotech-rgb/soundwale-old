import {Icons} from '@assets';
import {
  CommonHeader,
  Container,
  CustomButton,
  InputBoxRHF,
  Text,
} from '@components';
import {AddTechniciansFormParam, NavigationParamStack} from '@data';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToggleSnackBar} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useUpdateBusinessSpecificFieldsMutation} from '@services';
import {AppStyle, CommonStyle, TS, VS} from '@theme';
import {normalizeApiError, validField} from '@util';
import React, {useCallback, useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import * as Yup from 'yup';

type AddTechniciansRouteProp = RouteProp<
  NavigationParamStack,
  'AddTechnicians'
>;

const AddTechnicians: React.FC<{
  route: AddTechniciansRouteProp;
}> = ({route}) => {
  const {t} = useTranslation(['generic']);
  const profileData = (route?.params && route?.params?.profileData) ?? null;
  const {goBack} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {toggleMessage} = useToggleSnackBar();
  const [editBusinessProfile, {isLoading}] =
    useUpdateBusinessSpecificFieldsMutation();

  const validationSchema = Yup.object().shape({
    your_best_engineer: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().required(t('generic:isRequired', {field: 'Name'})),
      }),
    ),
  });

  const {control, handleSubmit, setValue, setError, watch} =
    useForm<AddTechniciansFormParam>({
      defaultValues: {
        your_best_engineer: [],
      },
      resolver: yupResolver(validationSchema as any),
      mode: 'onChange',
      criteriaMode: 'firstError',
      delayError: 100,
      shouldFocusError: true,
    });

  const {
    fields: bestEngineerFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'your_best_engineer',
  });

  const techniciansInfo = watch('your_best_engineer');

  const onSubmit = async (data: AddTechniciansFormParam) => {
    // Validate all fields before submission
    const hasInvalid = (data.your_best_engineer || []).some(item => {
      const isValidValue = item.value && item.value.trim() !== '';
      return !isValidValue;
    });

    if (hasInvalid) {
      toggleMessage(t('generic:pleaseFillAllFields'));
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('id', profileData?.id ?? '');
      if (data?.your_best_engineer && data?.your_best_engineer?.length > 0) {
        formdata.append(
          'your_best_engineer',
          JSON.stringify(data.your_best_engineer),
        );
      } else {
        formdata.append('your_best_engineer', '');
      }
      console.log('formdata', JSON.stringify(formdata, null, 2));
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
            setError(field as keyof AddTechniciansFormParam, {
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

  const addEngineerWithField = useCallback(() => {
    append({id: Date.now().toString(), value: ''});
  }, [append]);

  // Only run validation when user clicks Add More
  const handleAddMorePress = useCallback(() => {
    let hasEmpty = false;

    if (techniciansInfo && techniciansInfo.length > 0) {
      for (let i = 0; i < techniciansInfo.length; i++) {
        const item = techniciansInfo[i];
        if (!item.value || item.value.trim() === '') {
          hasEmpty = true;
          break;
        }
      }
    }

    if (hasEmpty) {
      toggleMessage(t('generic:pleaseFillAllFields'));
      return;
    }
    addEngineerWithField();
  }, [techniciansInfo, toggleMessage, t, addEngineerWithField]);

  useEffect(() => {
    try {
      const {business_data} = profileData || {};
      if (Array.isArray(business_data) && business_data.length > 0) {
        const {your_best_engineer} = business_data[0] || {};
        if (your_best_engineer && validField(your_best_engineer)) {
          let engineerWithArray = JSON.parse(your_best_engineer);
          if (Array.isArray(engineerWithArray)) {
            if (
              engineerWithArray.length > 0 &&
              typeof engineerWithArray[0] === 'string'
            ) {
              engineerWithArray = engineerWithArray.map((item: string) => ({
                id:
                  Date.now().toString() +
                  Math.random().toString(36).substring(2, 8),
                value: item,
              }));
            } else if (
              engineerWithArray.length > 0 &&
              typeof engineerWithArray[0] === 'object' &&
              (engineerWithArray[0].id === undefined ||
                engineerWithArray[0].value === undefined)
            ) {
              engineerWithArray = engineerWithArray.map((item: any) => ({
                id:
                  item.id ??
                  Date.now().toString() +
                    Math.random().toString(36).substring(2, 8),
                value: item.value ?? (typeof item === 'string' ? item : ''),
              }));
            }
          } else {
            engineerWithArray = [{id: Date.now().toString(), value: ''}];
          }
          setValue('your_best_engineer', engineerWithArray);
        } else {
          setValue('your_best_engineer', [
            {id: Date.now().toString(), value: ''},
          ]);
        }
      } else {
        setValue('your_best_engineer', [
          {id: Date.now().toString(), value: ''},
        ]);
      }
    } catch (error) {
      setValue('your_best_engineer', [{id: Date.now().toString(), value: ''}]);
    }
  }, [profileData, setValue]);

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader
          title={t('addHighlight')}
          withBackArrow
          withChatNotification={false}
        />
        <View style={[VS.flex_1, VS.ph_16, VS.pv_10]}>
          <View
            style={[
              VS.fd_row,
              VS.gap_10,
              VS.jc_space_between,
              VS.ai_center,
              VS.mb_16,
            ]}>
            <Text
              fontWeight="quickSandMedium"
              style={[TS.fs_15, CommonStyle.textBlack, TS.lh_26]}>
              {t('studentInfoInHarmony')}
            </Text>
            <TouchableOpacity
              style={[VS.ph_12, VS.pv_8, CommonStyle.bgPrimary, VS.br_8]}
              onPress={handleAddMorePress}
              activeOpacity={1}>
              <Text
                fontWeight="medium"
                style={[TS.fs_14, CommonStyle.textWhite]}>
                {t('addMore')}
              </Text>
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView
            alwaysBounceVertical={false}
            style={[VS.flex_1]}
            contentContainerStyle={[AppStyle.flexGrow]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'interactive'}
            ScrollViewComponent={ScrollView}>
            <View>
              {bestEngineerFields.map((field, idx) => (
                <View key={field.id} style={[VS.fd_row, VS.ai_start, VS.mb_8]}>
                  <InputBoxRHF
                    fieldName={`your_best_engineer.${idx}.value`}
                    control={control}
                    placeholder={t('enterName')}
                    parentStyle={[VS.flex_1]}
                  />
                  <TouchableOpacity
                    onPress={() => remove(idx)}
                    style={[VS.ml_8, VS.mt_15]}>
                    <Icons.Close size={18} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </KeyboardAwareScrollView>
        </View>
        <CustomButton
          buttonTitle={t('submit')}
          isLoading={isLoading}
          wrapperStyle={[VS.mv_20, VS.mh_15]}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Container>
  );
};

export default AddTechnicians;
