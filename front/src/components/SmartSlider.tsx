import Slider from '@react-native-community/slider';
import {TS, VS} from '@theme';
import {Scale} from '@util';
import React, {memo, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import {Text} from './TextView';

const {width} = Dimensions.get('window');

type SmartSliderProps = {
  initialValue?: number;
  onComplete: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  trackColor?: string;
  thumbColor?: string;
  sliderWidth?: number;
  showValue?: boolean;
};

const SmartSliderComponent = ({
  initialValue = 0,
  onComplete,
  min = 0,
  max = 100,
  step = 1,
  trackColor = '#2196F3',
  thumbColor = '#2196F3',
  sliderWidth = width * 0.5 - Scale(30),
  showValue = false,
}: SmartSliderProps) => {
  const {t} = useTranslation('generic');
  const [value, setValue] = useState(initialValue);

  const handleSlidingComplete = useCallback(
    (val: number) => {
      onComplete(val);
    },
    [onComplete],
  );

  return (
    <View style={[VS.jc_center, VS.gap_10, VS.pv_15, VS.ph_15]}>
      {showValue && (
        <Text style={[TS.fs_14, TS.ta_left]}>
          {t('distance', {distance: value})}
        </Text>
      )}
      <Slider
        value={value}
        onValueChange={setValue}
        onSlidingComplete={handleSlidingComplete}
        minimumValue={min}
        maximumValue={max}
        step={step}
        style={{width: sliderWidth}}
        thumbTintColor={thumbColor}
        maximumTrackTintColor={trackColor}
        minimumTrackTintColor={trackColor}
      />
    </View>
  );
};

const SmartSlider = memo(SmartSliderComponent);

export {SmartSlider};
