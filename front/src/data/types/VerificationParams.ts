import {CountryCodeParams} from './CountryCodeParams';

export type VerificationScreenParams = {
  mobile_number: string;
  countryCode?: CountryCodeParams;
  code: string;
  email: string;
  lastAuthCode: string;
};
