import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//@ts-ignore
import translationEN from "../../resources/locals/english/string.json";
//@ts-ignore
import translationHI from "../../resources/locals/spanish/string.json";
import translationPT from "../../resources/locals/portuguese/string.json";
import { LANGUAGE } from "../constants";
import { AppLanguage } from "../typings/enums/AppLanguage";
import { platformLanguage } from "../utils/PlatFormUtils";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @description The default internationalization (i18n) util for the complete application. We are currently using
 * i18next as our internationalization solution. It exposes two primary functions that we are using:
 * 1. t: Used for translating any given key - https://www.i18next.com/overview/api#t
 * 2. changeLanguage: Used to change the language preference in the i18n instance
 * - https://www.i18next.com/overview/api#changelanguage
 *
 * Advanced translation function operations beyond regular key lookup and fallbacks:
 * Interpolation {{placeholders}}: https://www.i18next.com/translation-function/interpolation
 * Plurals: https://www.i18next.com/translation-function/plurals
 * Nesting: https://www.i18next.com/translation-function/nesting
 */
i18n
  // detect user language
  // learn more: https://github.com/DylanVann/i18next-react-native-language-detector
  // .use(i18nextReactNative)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    lng: platformLanguage,
    fallbackLng: LANGUAGE.DEFAULT_LANGUAGE,
    debug: true,
    resources: {
      [AppLanguage.ENGLISH]: {
        translation: translationEN,
      },
      [AppLanguage.SPANISH]: {
        translation: translationHI,
      },
      [AppLanguage.PORTUGUESE]: {
        translation: translationPT,
      },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    /**
     * allow keys to be phrases having `:`, `.`
     * https://github.com/i18next/react-i18next/issues/387
     */
    nsSeparator: false,
    keySeparator: false,
  })
  .catch((error: Error) => {
    // TODO: add metrics
  });

/**
 * @description Return the language preference for the user, which is decided in the following order:
 * 1. Fetch stored language from Async storage (currently it is at device level and not customerId specific).
 * 2. Get the current OS level language preference of the customer and check if it is part of our supported language.
 * 3. If current OS language is not supported, fallback to default language (en-IN for now).
 */
export const getUserLanguagePreference = async () => {
  const storedLanguage = await AsyncStorage.getItem("myAppLanguagePreference");

  const appOSLang = isSupportedLanguage(platformLanguage)
    ? platformLanguage
    : LANGUAGE.DEFAULT_LANGUAGE;

  return storedLanguage ? storedLanguage : appOSLang;
};

/**
 * @description This stores the passed language preference in the app async storage for later retrival across sessions.
 * @param language the language to store as the user preference for the app.
 */
export const persistUserLanguagePreference = (language: string) => {};

/**
 * @description Returns a boolean response to indicate whether the passed language code is supported in the
 * Merchant App or not.
 * @param languageCode the input language code in xx-YY format.
 */
export const isSupportedLanguage = (languageCode: string) =>
  //@ts-ignore
  Object.values(AppLanguage).includes(languageCode);

export default i18n;
