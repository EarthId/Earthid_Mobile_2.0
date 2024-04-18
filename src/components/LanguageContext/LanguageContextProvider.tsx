import React, { createContext, useState } from "react";
import { AppLanguage } from "../../typings/enums/AppLanguage";
import i18n, { persistUserLanguagePreference } from "../../utils/i18n";

export const LanguageContext = createContext<any>({});

const LanguageContextProvider = ({ children }: any) => {
  const [languageCode, SetLanguageCode] = useState(AppLanguage.ENGLISH);

  const changeLanguagePreference = async (
    newLanguagePreference: AppLanguage
  ): Promise<void> => {
    if (newLanguagePreference) {
      // Setting language in the local context and MAP Settings
      SetLanguageCode(newLanguagePreference);
      //  artNativeMap.setMAPSettings(mapSettingsConfig(newLanguagePreference));
      await Promise.all([
        i18n.changeLanguage(newLanguagePreference),
        persistUserLanguagePreference(newLanguagePreference), // required for retrieving later
      ]).catch((error: Error) => {});
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        languageCode,
        changeLanguagePreference,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContextProvider;
