import {CustomRadioGroup} from '@components';
import {DropDownListParams, Price} from '@data';
import {VS} from '@theme';
import {formatCurrency} from '@util';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';

type Props = {
  range: Price;
  preSelectedValue?: string;
  onSelect: (value: string) => void;
};

function createAdaptivePriceRanges(
  minPrice: number,
  maxPrice: number,
  maxOptions: number = 8,
): DropDownListParams[] {
  const totalRange = maxPrice - minPrice;
  const roughStep = Math.ceil(totalRange / (maxOptions - 1));

  // Normalize step to nearest logical round value
  const getRoundedStep = (step: number) => {
    if (step <= 1000) {
      return 1000;
    }
    if (step <= 5000) {
      return 5000;
    }
    if (step <= 10000) {
      return 10000;
    }
    if (step <= 50000) {
      return 50000;
    }
    return 100000;
  };

  const step = getRoundedStep(roughStep);

  const ranges: DropDownListParams[] = [];
  let start = minPrice;

  while (start + step < maxPrice && ranges.length < maxOptions - 1) {
    const end = start + step - 1;
    ranges.push({
      label: `${formatCurrency(start, 'INR')} - ${formatCurrency(end, 'INR')}`,
      value: `${start}-${end}`,
    });
    start = end + 1;
  }

  ranges.push({
    label: `${formatCurrency(start, 'INR')} or more`,
    value: `${start}-more`,
  });

  return ranges;
}

export default function TypePriceRange({
  range: {max, min},
  preSelectedValue,
  onSelect,
}: Props) {
  const options = useMemo(
    () => createAdaptivePriceRanges(min ?? 0, max ?? 0),
    [max, min],
  );
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    preSelectedValue,
  );

  useEffect(() => {
    if (preSelectedValue) {
      const parts = preSelectedValue.split(',');
      const displayValue =
        parts.length === 2 && parts[1] === max?.toString()
          ? `${parts[0]}-more`
          : parts.length === 2
          ? `${parts[0]}-${parts[1]}`
          : `${parts[0]}-more`;
      setSelectedValue(displayValue);
    } else {
      setSelectedValue(undefined);
    }
  }, [preSelectedValue, max]);

  const handleChange = (value: DropDownListParams) => {
    setSelectedValue(value.value);
    const [minStr, maxStr] = value.value.split('-');
    const finalValue =
      maxStr === 'more'
        ? `${minStr},${max?.toString() || 'more'}`
        : `${minStr},${maxStr}`;

    onSelect(finalValue);
  };

  // Ensure selectedValue is properly formatted for the radio group
  const radioValue = useMemo(() => {
    if (!selectedValue) {
      return undefined;
    }

    // If it's already in the correct format (e.g., "50200-more"), return as is
    if (selectedValue.includes('-')) {
      return selectedValue;
    }

    // If it's in the comma format (e.g., "50200,100000"), convert to radio format
    const parts = selectedValue.split(',');
    if (parts.length === 2) {
      const [minStr, maxStr] = parts;
      return maxStr === max?.toString()
        ? `${minStr}-more`
        : `${minStr}-${maxStr}`;
    }

    return selectedValue;
  }, [selectedValue, max]);

  return (
    <View style={[VS.flex_1, VS.pt_22, VS.ph_5]}>
      <CustomRadioGroup
        options={options}
        value={radioValue}
        onChange={handleChange}
        containerStyle={[VS.fd_column, VS.ai_start]}
        itemContainerStyle={[VS.ai_start, VS.jc_start]}
      />
    </View>
  );
}
