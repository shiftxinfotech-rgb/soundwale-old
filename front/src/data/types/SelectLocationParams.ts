import {LatLng} from '@util';

export type SelectLocationScreenParams = {
  onGoBack?: (locationData: {
    coordinates: LatLng;
    address: {
      fullAddress: string;
      country?: string;
      state?: string;
      city?: string;
      postalCode?: string;
    };
  }) => void;
};
