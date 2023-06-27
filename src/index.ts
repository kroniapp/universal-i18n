type TypescriptI18nStrings = {
  [lang: string]: TypescriptI18nLang;
};

type TypescriptI18nLang = {
  [key: string]: TypescriptI18nLang | string;
};

type TypescriptI18nOptions<T> = {
  defaultLanguage: keyof T;
};

type ToFunction<S> = {
  [key in keyof S]: S[key] extends string ? ToFunctionString<key> : ToFunction<S[key]>;
};

type ToFunctionString<K> = K extends `${typeof functionPrefix}${string}` ? (variables: Record<string, any>) => string : string;

const ToFunction = <S extends TypescriptI18nStrings>(strings: TypescriptI18nLang): ToFunction<S[keyof S]> => {
  const s: any = strings;
  Object.entries(strings).map(([key, value]) => (s[key] = typeof value === "string" ? ToFunctionString(key, value) : ToFunction(value)));

  return s as ToFunction<S[keyof S]>;
};

const ToFunctionString = (key: string, value: string) =>
  key[0] === functionPrefix ? (variables: Record<string, any>) => value.replace(/{{(.+)}}/g, (m, i) => variables[i] || m) : value;

const functionPrefix = "$";

class TypescriptI18n<Strings extends TypescriptI18nStrings> {
  private strings: Strings;

  currentLanguage: keyof Strings = "en";
  private currentStrings: ToFunction<Strings[keyof Strings]>;

  readonly options: TypescriptI18nOptions<Strings> = {
    defaultLanguage: "en"
  };

  constructor(strings: Strings, options?: Partial<TypescriptI18nOptions<Strings>>) {
    this.strings = strings;

    this.options = {
      ...this.options,
      ...options
    };

    this.currentLanguage = this.options.defaultLanguage;
    this.currentStrings = this.s;
  }

  get s(): ToFunction<Strings[keyof Strings]> {
    this.currentStrings = ToFunction<Strings>(this.strings[this.currentLanguage]);
    return this.currentStrings as ToFunction<Strings[keyof Strings]>;
  }

  get = (key: string, variables?: Record<string, any>): string => {
    const res = key.split(".").reduce((word: any, part: string) => word[part] || "", this.currentStrings);

    if (!res) return key;

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

    const language = `${`${languages}`.match(/[a-zA-Z]+(?=-|_|,|;)?/)}`.toLowerCase() as keyof Strings;

    if (this.getLanguages().includes(language)) return language;

    return this.options.defaultLanguage;
  };
}

export default TypescriptI18n;
