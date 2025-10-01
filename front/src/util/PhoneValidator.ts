import {CountryCodeParams} from '@data';
import phone from 'phone';
import * as Yup from 'yup';

declare module 'yup' {
  export interface StringSchema {
    phone(countryCode: CountryCodeParams, errorMessage?: string): StringSchema;
  }
}

const YUP_PHONE_METHOD = 'phone';

Yup.addMethod(
  Yup.string,
  YUP_PHONE_METHOD,
  function yupPhone(countryCode: CountryCodeParams, errorMessage: string) {
    return this.test(YUP_PHONE_METHOD, errorMessage, (value?: string) => {
      try {
        if (value === undefined || value === '') {
          return true;
        }

        const result = phone(`${countryCode.dial_code} ${value}`);
        return result.isValid;
      } catch {
        return false;
      }
    });
  },
);
