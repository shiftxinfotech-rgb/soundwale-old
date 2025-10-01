import {CheckMarkItem, GenericFlatList} from '@components';
import {CityBean} from '@data';
import {AppStyle, TS, VS} from '@theme';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Styles} from './Styles';

type Props = {
  cities: CityBean[];
  preSelectedIds: (string | number)[];
  onSelect: (payload: string) => void;
};

export default function TypeLocations({
  cities,
  preSelectedIds,
  onSelect,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const normalizedIds = preSelectedIds.map(String);
    setSelectedIds(normalizedIds);
  }, [preSelectedIds]);

  const toggleItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        let newSelected: string[];

        if (id === 'all') {
          const allCityIds = cities
            .filter(city => city.id !== 'all')
            .map(city => String(city.id));
          const allSelected = allCityIds.every(cityId => prev.includes(cityId));

          if (allSelected) {
            newSelected = [];
          } else {
            newSelected = allCityIds;
          }
        } else {
          if (prev.includes(id)) {
            newSelected = prev.filter(v => v !== id);
          } else {
            newSelected = [...prev, id];
          }
        }

        onSelect(newSelected.join(','));
        return newSelected;
      });
    },
    [onSelect, cities],
  );

  const isChecked = useCallback(
    (id: string) => {
      if (id === 'all') {
        const allCityIds = cities
          .filter(city => city.id !== 'all')
          .map(city => String(city.id));
        return allCityIds.every(cityId => selectedIds.includes(cityId));
      }
      return selectedIds.includes(id);
    },
    [selectedIds, cities],
  );

  const renderItem = useCallback(
    ({item}: {item: CityBean}) => {
      const id = String(item.id);
      return (
        <View style={[VS.gap_11]}>
          <CheckMarkItem
            isChecked={isChecked(id)}
            containerStyle={Styles.checkMark}
            title={item.city_name ?? ''}
            textStyle={[TS.lh_14]}
            onPress={() => toggleItem(id)}
          />
        </View>
      );
    },
    [isChecked, toggleItem],
  );

  return (
    <View style={[VS.flex_1]}>
      <GenericFlatList
        data={cities}
        contentContainerStyle={[
          AppStyle.flexGrow,
          VS.gap_14,
          VS.pt_22,
          VS.ph_18,
        ]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
