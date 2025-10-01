import {CityBean} from './UtilityParams';

export type LocationItemProps = {
  item: string;
  index: number;
};

type BackParams = CityBean & {
  latitude?: number;
  longitude?: number;
};

export type LocationScreenParams = {
  requestFrom: string;
  onGoBack?: (cityInfo: BackParams) => void;
  type: 'buyer' | 'seller';
};

export type ExtractedAddress = {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
};
