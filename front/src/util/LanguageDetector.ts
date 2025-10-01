import {reduxStorage} from './StorageHelper';
import {Keys} from './Constants';
import {LanguageDetectorAsyncModule} from 'i18next';

export const LanguageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: function (
    callback: (lng: string | readonly string[] | undefined) => void | undefined,
  ): void | Promise<string | readonly string[] | undefined> {
    callback('en');
  },
  cacheUserLanguage: (language: string) => {
    reduxStorage.setItem(Keys.LOCALE, language);
  },
};
