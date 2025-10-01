import {Icons} from '@assets';
import {ProgressImage, Text} from '@components';
import {ContactBean} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {Scale} from '@util';
import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {
  isValidImageUrl,
  openEmail,
  openPhoneCall,
  setField,
} from '../../../util/CommonHelper';
import {Styles} from './Styles';

type Props = {
  info: ContactBean;
  userImage: string;
};

export const ContactItem = ({info, userImage}: Props) => {
  const {name, mobile_number, type, w_mobile_number, email} = info;
  return (
    <View style={[VS.fd_row, VS.ai_center, VS.jc_space_between]}>
      <View style={[VS.fd_row, VS.ai_center, VS.flex_1, VS.gap_10]}>
        <View
          style={[
            Styles.directoryImage,
            AppStyle.hideOverFlow,
            CommonStyle.bgPaleGray,
            VS.br_30,
          ]}>
          {isValidImageUrl(userImage) && (
            <ProgressImage
              source={{uri: userImage}}
              mode="cover"
              containerStyle={[Styles.directoryImage]}
            />
          )}
        </View>

        <View style={[VS.flex_1, VS.gap_5]}>
          <Text
            fontWeight="semiBold"
            style={[TS.fs_15, TS.lh_18, CommonStyle.textBlack]}>
            {setField(name)}
          </Text>
          <Text
            fontWeight="medium"
            style={[TS.fs_14, TS.lh_17, CommonStyle.textBlueGray]}>
            {setField(type)}
          </Text>
        </View>
      </View>
      <View
        style={[VS.fd_row, VS.ai_center, VS.jc_center, VS.gap_15, VS.pr_18]}>
        {mobile_number !== undefined &&
          mobile_number !== null &&
          mobile_number !== '' && (
            <TouchableOpacity onPress={() => openPhoneCall(mobile_number)}>
              <Icons.CallNow
                color={Colors.primary}
                width={Scale(22)}
                height={Scale(22)}
              />
            </TouchableOpacity>
          )}
        {w_mobile_number !== undefined &&
          w_mobile_number !== null &&
          w_mobile_number !== '' && (
            <TouchableOpacity
              onPress={async () => {
                const message = `Hey! I have just found your profile on Soundwale. I am ${name}`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `whatsapp://send?phone=${w_mobile_number}&text=${encodedMessage}`;
                try {
                  await Linking.openURL(whatsappURL);
                } catch (error) {
                  console.error('An error occurred', error);
                }
              }}>
              <Icons.WhatsAppLine color={Colors.primary} size={Scale(22)} />
            </TouchableOpacity>
          )}
        {email !== undefined && email !== null && email !== '' && (
          <TouchableOpacity onPress={() => openEmail(email)}>
            <Icons.Email color={Colors.primary} size={Scale(22)} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
