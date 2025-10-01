import {Icons} from '@assets';
import {ComponentStyles, CustomButton, InputBox, Text} from '@components';
import {Colors, CommonStyle, TS, VS} from '@theme';
import {normalizeApiError, Scale, setField} from '@util';
import {TouchableOpacity, View} from 'react-native';
import {Styles} from './Styles';
import {useAddDirectoryReviewMutation} from '@services';
import React, {useCallback, useState} from 'react';
import {useToggleSnackBar} from '@hooks';
import {useTranslation} from 'react-i18next';

type AddReviewProps = {
  onClose: () => void;
  selectedRating: number;
  relevant_id: string;
  onSelectedRating: (rating: number) => void;
  userName: string;
  onSuccessCallback: () => void;
};

export default function AddReview({
  onClose,
  selectedRating,
  onSelectedRating,
  userName,
  relevant_id,
  onSuccessCallback,
}: AddReviewProps) {
  const [review, setReview] = useState('');
  const {t} = useTranslation(['generic']);
  const [addCatalogues, {isLoading}] = useAddDirectoryReviewMutation();
  const {toggleMessage} = useToggleSnackBar();

  const onSubmit = useCallback(async () => {
    if (selectedRating === -1) {
      toggleMessage(t('pleaseSelectRating'));
      return;
    }
    try {
      const formData = new FormData();

      formData.append('type', 'directory');
      formData.append('relevant_id', relevant_id ?? '');
      formData.append('rating', selectedRating.toString());
      formData.append('message', review);

      const result = await addCatalogues(formData).unwrap();
      const {status, message} = result;
      if (status) {
        onSuccessCallback();
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
    addCatalogues,
    onSuccessCallback,
    relevant_id,
    review,
    selectedRating,
    t,
    toggleMessage,
  ]);
  return (
    <View>
      <View
        style={[
          VS.fd_row,
          VS.ai_center,
          VS.pv_17,
          VS.ph_21,
          VS.jc_space_between,
          CommonStyle.bgPrimary,
          ComponentStyles.modalHeader,
          Styles.addReviewHeader,
        ]}>
        <Text
          fontWeight="bold"
          style={[TS.fs_18, CommonStyle.textWhite, TS.lh_22]}>
          {t('ratingReview')}
        </Text>
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
          onPress={onClose}
          activeOpacity={0.8}>
          <Icons.Close color={Colors.white} size={Scale(16)} />
        </TouchableOpacity>
      </View>
      <View style={[VS.pv_16, VS.ph_17]}>
        <Text fontWeight="bold" style={[TS.fs_19, TS.tt_capitalize, TS.lh_23]}>
          {setField(userName)}
        </Text>
        <Text
          fontWeight="regular"
          style={[TS.fs_15, TS.lh_11, CommonStyle.textDimGray, VS.pt_11]}>
          {t('shareExperience')}
        </Text>

        <View style={[VS.ai_center, VS.fd_row, VS.gap_5, VS.mt_15]}>
          {Array(5)
            .fill(0)
            .map((_, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (selectedRating === 0) {
                      onSelectedRating(-1);
                    } else {
                      onSelectedRating(index);
                    }
                  }}>
                  <Icons.Star
                    size={23}
                    color={
                      selectedRating >= index ? Colors.amber : Colors.silverGray
                    }
                  />
                </TouchableOpacity>
              );
            })}
        </View>
        <InputBox
          placeholder={t('writeReview')}
          value={review}
          onChangeText={setReview}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          parentStyle={[VS.mt_15]}
          textInputStyle={[
            {height: Scale(97), textAlignVertical: 'top'},
            VS.pt_15,
          ]}
        />
        <CustomButton
          buttonTitle={t('submit')}
          isLoading={isLoading}
          onPress={() => {
            onSubmit();
          }}
          wrapperStyle={[VS.mt_15]}
        />
      </View>
    </View>
  );
}
