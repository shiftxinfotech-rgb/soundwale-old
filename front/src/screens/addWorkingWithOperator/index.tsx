import {Icons} from '@assets';
import {
  CommonHeader,
  Container,
  CustomButton,
  InputBoxRHF,
  Text,
} from '@components';
import {AddWorkingWithOperatorFormParam, NavigationParamStack} from '@data';
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

type AddWorkingWithOperatorRouteProp = RouteProp<
  NavigationParamStack,
  'AddWorkingWithOperator'
>;

const AddWorkingWithOperator: React.FC<{
  route: AddWorkingWithOperatorRouteProp;
}> = ({route}) => {
  const {t} = useTranslation(['generic']);
  const profileData = (route?.params && route?.params?.profileData) ?? null;
  const {goBack} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {toggleMessage} = useToggleSnackBar();
  const [editBusinessProfile, {isLoading}] =
    useUpdateBusinessSpecificFieldsMutation();

  const validationSchema = Yup.object().shape({
    working_with: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().required(t('generic:isRequired', {field: 'Name'})),
      }),
    ),
  });

  const {control, handleSubmit, setValue, setError, watch} =
    useForm<AddWorkingWithOperatorFormParam>({
      defaultValues: {
        working_with: [],
      },
      resolver: yupResolver(validationSchema as any),
      mode: 'onChange',
      criteriaMode: 'firstError',
      delayError: 100,
      shouldFocusError: true,
    });

  const {
    fields: workingWithFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'working_with',
  });

  const workingWithInfo = watch('working_with');
  const onSubmit = async (data: AddWorkingWithOperatorFormParam) => {
    // Validate all fields before submission
    const hasInvalid = (data.working_with || []).some(item => {
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
      if (data?.working_with && data?.working_with?.length > 0) {
        formdata.append('working_with', JSON.stringify(data.working_with));
      } else {
        formdata.append('working_with', '');
      }
      console.log('formdata', JSON.stringify(formdata, null, 2));
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
            setError(field as keyof AddWorkingWithOperatorFormParam, {
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

  const addWorkingWithField = useCallback(() => {
    append({id: Date.now().toString(), value: ''});
  }, [append]);

  // Only run validation when user clicks Add More
  const handleAddMorePress = useCallback(() => {
    let hasEmpty = false;

    if (workingWithInfo && workingWithInfo.length > 0) {
      for (let i = 0; i < workingWithInfo.length; i++) {
        const item = workingWithInfo[i];
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
    addWorkingWithField();
  }, [workingWithInfo, toggleMessage, t, addWorkingWithField]);

  useEffect(() => {
    try {
      const {business_data} = profileData || {};
      if (Array.isArray(business_data) && business_data.length > 0) {
        const {working_with} = business_data[0] || {};
        if (working_with && validField(working_with)) {
          let workingWithArray = JSON.parse(working_with);
          if (Array.isArray(workingWithArray)) {
            if (
              workingWithArray.length > 0 &&
              typeof workingWithArray[0] === 'string'
            ) {
              workingWithArray = workingWithArray.map((item: string) => ({
                id:
                  Date.now().toString() +
                  Math.random().toString(36).substring(2, 8),
                value: item,
              }));
            } else if (
              workingWithArray.length > 0 &&
              typeof workingWithArray[0] === 'object' &&
              (workingWithArray[0].id === undefined ||
                workingWithArray[0].value === undefined)
            ) {
              workingWithArray = workingWithArray.map((item: any) => ({
                id:
                  item.id ??
                  Date.now().toString() +
                    Math.random().toString(36).substring(2, 8),
                value: item.value ?? (typeof item === 'string' ? item : ''),
              }));
            }
          } else {
            workingWithArray = [{id: Date.now().toString(), value: ''}];
          }
          setValue('working_with', workingWithArray);
        } else {
          setValue('working_with', [{id: Date.now().toString(), value: ''}]);
        }
      } else {
        setValue('working_with', [{id: Date.now().toString(), value: ''}]);
      }
    } catch (error) {
      setValue('working_with', [{id: Date.now().toString(), value: ''}]);
    }
  }, [profileData, setValue]);

  return (
    <Container>
      <View style={[VS.flex_1]}>
        <CommonHeader
          title={t('addWorkingWith')}
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
              {t('workingWith')}
            </Text>
            <TouchableOpacity
              onPress={handleAddMorePress}
              activeOpacity={1}
              style={[VS.ph_12, VS.pv_8, CommonStyle.bgPrimary, VS.br_8]}>
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
            {workingWithFields.map((field, idx) => (
              <View key={field.id} style={[VS.fd_row, VS.ai_start, VS.mb_8]}>
                <InputBoxRHF
                  fieldName={`working_with.${idx}.value`}
                  control={control}
                  placeholder={t('enterWorkingWithName')}
                  parentStyle={[VS.flex_1]}
                />
                <TouchableOpacity
                  onPress={() => remove(idx)}
                  style={[VS.ml_8, VS.mt_15]}>
                  <Icons.Close size={18} />
                </TouchableOpacity>
              </View>
            ))}
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

export default AddWorkingWithOperator;
