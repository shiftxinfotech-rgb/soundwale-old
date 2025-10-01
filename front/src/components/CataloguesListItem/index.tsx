import {Icons} from '@assets';
import {CatalogueDatum} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {isValidImageUrl, Scale, setField} from '@util';
import React from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ProgressImage} from '../ProgressImage';
import {Text} from '../TextView';
import {Styles} from './Styles';

type CataloguesListItemProps = {
  bean: CatalogueDatum;
  parentStyle?: StyleProp<ViewStyle>;
  onFavPress?: (id: number) => void;
  isFav?: boolean;
};

export default function CataloguesListItem({
  bean,
  parentStyle,
  onFavPress,
  isFav = true,
}: CataloguesListItemProps) {
  const {image_url, name, other_details, id, is_likes} = bean || {};
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={[
        VS.br_10,
        VS.mh_15,
        VS.bwt_1,
        VS.fd_row,
        VS.jc_space_between,
        VS.ai_center,
        CommonStyle.shadowBox,
        AppStyle.hideOverFlow,
        parentStyle,
        {borderColor: Colors.veryLightGray},
      ]}>
      <View style={[VS.fd_row, VS.ai_center]}>
        <View>
          {isValidImageUrl(image_url) && (
            <ProgressImage
              source={{uri: image_url}}
              containerStyle={[Styles.catalogueImage]}
            />
          )}
          {isFav && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onFavPress?.(id ?? 0)}
              style={[Styles.favoriteContainer, VS.ai_center, VS.jc_center]}>
              <Icons.Heart
                size={Scale(12)}
                color={is_likes === 1 ? Colors.primary : Colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={[VS.ml_15, VS.flex_1]}>
          <Text fontWeight="bold" style={[TS.fs_17]}>
            {setField(name)}
          </Text>
          <Text
            fontWeight="medium"
            style={[TS.fs_13, CommonStyle.textBlueGray, TS.lh_18]}>
            {setField(other_details)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
