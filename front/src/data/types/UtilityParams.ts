import {RoleBean} from './RoleParam';

export type RoleListResponse = {
  status?: boolean;
  data?: RoleBean[];
};
export type RequirementListResponse = {
  status?: boolean;
  data?: RequirementBean[];
};
export type RequirementBean = {
  id?: number;
  name?: string;
};

export type CountryStateResponse = {
  status?: boolean;
  message?: string;
  statusCode?: number;
  data?: CountryStateBean[];
};

export type CountryStateBean = {
  id?: number;
  name?: string;
  states?: StateItemBean[];
};

export type StateItemBean = {
  name?: string;
  id?: number;
};

export type DealerCompanyResponse = {
  status?: boolean;
  data?: DealerBean[];
};

export type DealerBean = {
  id?: number;
  name?: string;
  image?: string;
  status?: number;
  image_url?: string;
};

export type UtilityResponse = {
  countryStateList: DropDownListParams[];
  dealerList: DropDownListParams[];
};

export type CountryListResponse = {
  status?: boolean;
  message?: string;
  statusCode?: number;
  data?: CountryBean[];
};

export type CountryBean = {
  id?: number;
  country_name?: string;
};

export type StateListResponse = {
  status?: boolean;
  message?: string;
  statusCode?: number;
  data?: StateBean[];
};

export type StateBean = {
  id?: number;
  state_name?: string;
};

export type CityListResponse = {
  status?: boolean;
  message?: string;
  statusCode?: number;
  data?: CityBean[];
};

export type CityBean = {
  id?: number | string;
  city_name?: string;
};

export type DropDownListParams = {
  id?: number | string;
  label: string;
  value: string;
};

export type ImageBean = {
  id?: number;
  name?: string;
  image?: string;
  status?: number;
  image_url?: string;
};
