import {CategoryBean} from './CategoryParams';
import {CityBean, DealerBean} from './UtilityParams';

export type FilterResponseBean = {
  status?: boolean;
  data?: FilterData;
};

export type FilterData = {
  price?: Price;
  city?: CityBean[];
  main_category?: DealerBean[];
  requirement_type?: Category[];
  category?: Category[];
  sub_category?: Category[];
  model?: Category[];
  radius?: string;
};

export type Category = {
  sub_category?: CategoryBean[];
} & CategoryBean;

export type Price = {
  min?: number;
  max?: number;
};

export const FILTER_TYPES = [
  'products',
  'companies',
  'location',
  'product_type',
  'budget_range',
  'model',
  'location_range',
] as const;

export type FilterType = (typeof FILTER_TYPES)[number];

export type FilterTypeParam = {
  label: string;
  value: string;
  count: number;
  id: FilterType;
};

export type ProductsSelection = {
  categoryIds: string[];
  subCategoryIds: string[];
};

export type Selections = {
  products: ProductsSelection;
  companies: string[];
  location: string[];
  product_type?: string;
  budget_range?: string[];
  model?: string[];
  location_range?: string;
};

export type FilterScreenParams = {
  type: 'buyer' | 'seller' | 'directory';
  preFilters?: Selections;
  onGoBack: (selected: Selections) => void;
};
