type UniversalI18nStrings = {
  [lang: string]: UniversalI18nLang;
};

type UniversalI18nLang = {
  [key: string]: UniversalI18nLang | string;
};

type UniversalI18nOptions<T> = {
  defaultLanguage: keyof T;
};

type ToFunction<T, P extends string = typeof prefix> = {
  [key in keyof T]: T[key] extends string
    ? ToFunctionString<key, P>
    : ToFunction<T[key], P>;
};

type ToFunctionString<
  K,
  P extends string = typeof prefix
> = K extends `${P}${string}`
  ? (variables: Record<string, any>) => string
  : string;

const prefix = "$";

const ToFunction = <S extends UniversalI18nStrings>(
  strings: UniversalI18nLang
): ToFunction<S[keyof S]> => {
  const s: any = strings;
  Object.entries(strings).map(([key, value]) => {
    s[key] =
      typeof value === "string"
        ? ToFunctionString(key, value)
        : ToFunction(value);
  });

  return s as ToFunction<S[keyof S]>;
};

const ToFunctionString = (key: string, value: string) =>
  key.startsWith(prefix)
    ? (variables: Record<string, any>) =>
        value.replace(/{{(.+)}}/g, (m, i) => variables[i] || m)
    : value;

class UniversalI18n<Strings extends UniversalI18nStrings> {
  private strings: Strings;

  currentLanguage: keyof Strings = "en";
  private currentStrings: ToFunction<Strings[keyof Strings]>;

  readonly options: UniversalI18nOptions<Strings> = {
    defaultLanguage: "en",
  };

  constructor(
    strings: Strings,
    options?: Partial<UniversalI18nOptions<Strings>>
  ) {
    this.strings = strings;

    this.options = {
      ...this.options,
      ...options,
    };

    this.currentLanguage = this.options.defaultLanguage;
    this.currentStrings = this.s;
  }

  get s(): ToFunction<Strings[keyof Strings]> {
    this.currentStrings = ToFunction<Strings>(
      this.strings[this.currentLanguage]
    );
    return this.currentStrings;
  }

  get = (key: string, variables?: Record<string, any>): string => {
    const parts = key.split(".");
    const res = parts.reduce((word: any, part: string) => word[part] || "", this.currentStrings);

    if(!res) return key;

    switch (typeof res) {
      case "string":
        return res;
      default:
        if (!variables) return key;
        return res(variables);
    }
  };

  getLanguages = (): (keyof Strings)[] => Object.keys(this.strings);

  getUserLanguage = (languages: string | readonly string[]): keyof Strings => {
    if (!languages) return this.options.defaultLanguage;

    const defaultLocale = `${`${languages}`.match(
      /[a-zA-Z]+(?=-|_|,|;)?/
    )}`.toLowerCase() as keyof Strings;

    if (this.getLanguages().includes(defaultLocale)) return defaultLocale;

    return this.options.defaultLanguage;
  };
}

export default UniversalI18n;
