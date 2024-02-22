export type TypescriptI18nStrings = {
  [lang: string]: TypescriptI18nLang;
};

export type TypescriptI18nLang = {
  [key: string]: TypescriptI18nLang | string | ((variables: any) => string);
};

export type TypescriptI18nOptions<CurrentLanguage> = {
  defaultLanguage: CurrentLanguage;
};
