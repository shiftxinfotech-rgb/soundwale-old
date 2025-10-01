import {FilterData, FilterType, Selections} from '@data';
import {VS} from '@theme';
import React from 'react';
import {View} from 'react-native';
import TypeCompanies from './TypeCompanies';
import TypeLocations from './TypeLocations';
import TypeModel from './TypeModel';
import TypePriceRange from './TypePriceRange';
import TypeProducts from './TypeProducts';
import TypeRequirement from './TypeRequirement';

import {SmartSlider} from '@components';

type Props = {
  activeType: FilterType;
  filterData: FilterData | undefined;
  selections: Selections;
  onSelectionChange: <T extends FilterType>(
    type: T,
    selected: Selections[T],
  ) => void;
};

export default function RightPartView({
  activeType,
  filterData,
  selections,
  onSelectionChange,
}: Props) {
  if (activeType === 'products') {
    return (
      <View style={[VS.flex_1]}>
        <TypeProducts
          preSelectedCategoryIds={selections?.products?.categoryIds ?? []}
          preSelectedSubCategoryIds={selections?.products?.subCategoryIds ?? []}
          categories={filterData?.category ?? []}
          onSelect={({categoryId, subCategoryId}) => {
            onSelectionChange('products', {
              categoryIds: categoryId
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0),
              subCategoryIds: subCategoryId
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0),
            });
          }}
        />
      </View>
    );
  }

  if (activeType === 'companies') {
    return (
      <View style={[VS.flex_1]}>
        <TypeCompanies
          preSelectedIds={selections.companies}
          companies={filterData?.main_category ?? []}
          onSelect={payload =>
            onSelectionChange(
              'companies',
              payload
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0),
            )
          }
        />
      </View>
    );
  }

  if (activeType === 'model') {
    return (
      <View style={[VS.flex_1]}>
        <TypeModel
          preSelectedIds={selections.model ?? []}
          model={filterData?.model ?? []}
          onSelect={payload =>
            onSelectionChange(
              'model',
              payload
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0),
            )
          }
        />
      </View>
    );
  }
  if (activeType === 'location') {
    return (
      <View style={[VS.flex_1]}>
        <TypeLocations
          preSelectedIds={selections.location}
          cities={filterData?.city ?? []}
          onSelect={payload =>
            onSelectionChange(
              'location',
              payload
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0),
            )
          }
        />
      </View>
    );
  }
  if (activeType === 'product_type') {
    return (
      <View style={[VS.flex_1]}>
        <TypeRequirement
          preSelectedId={selections.product_type ?? ''}
          requirements={filterData?.requirement_type ?? []}
          onSelect={payload => {
            onSelectionChange('product_type', payload.value?.toString() ?? '');
          }}
        />
      </View>
    );
  }
  if (activeType === 'budget_range') {
    return (
      <View style={[VS.flex_1]}>
        <TypePriceRange
          preSelectedValue={
            selections.budget_range ? selections.budget_range.join(',') : ''
          }
          range={filterData?.price ?? {}}
          onSelect={payload =>
            onSelectionChange(
              'budget_range',
              payload
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0),
            )
          }
        />
      </View>
    );
  }

  if (activeType === 'location_range') {
    return (
      <View style={[VS.flex_1]}>
        <SmartSlider
          initialValue={
            selections.location_range ? Number(selections.location_range) : 0
          }
          showValue={true}
          onComplete={value => {
            onSelectionChange('location_range', value.toString());
          }}
        />
      </View>
    );
  }

  return <View style={[VS.flex_1]} />;
}
