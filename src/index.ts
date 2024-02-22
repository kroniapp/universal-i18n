import type {TypescriptI18nStrings, TypescriptI18nLang, TypescriptI18nOptions, ToFunction, GetVariables, ToFunctionString} from "./types";

export class TypescriptI18n<Strings extends TypescriptI18nStrings, CurrentLanguage extends keyof Strings> {
  private readonly strings: Strings;

  currentLanguage: keyof Strings = "en";
  private currentStrings: ToFunction<Strings[CurrentLanguage]>;

  private readonly options: TypescriptI18nOptions<keyof Strings> = {
    defaultLanguage: "en"
  };

  constructor(strings: Strings, options?: Partial<TypescriptI18nOptions<CurrentLanguage>>) {
    this.strings = strings;

    this.options = {
      ...this.options,
      ...options
    };

    this.currentLanguage = this.options.defaultLanguage;
    this.currentStrings = this.s;
  }

  get s(): ToFunction<Strings[CurrentLanguage]> {
    this.currentStrings = this.toFunction<Strings[CurrentLanguage]>(this.strings[this.currentLanguage]);
    return this.currentStrings;
  }

  get = (key: string, variables?: Record<string, any>): string => {
    let res = key.split(".").reduce((word: any, part: string) => word[part] || "", this.currentStrings);

    if (!res) res = key.split(".").reduce((word: any, part: string) => word[part] || "", this.strings[this.options.defaultLanguage]);

    if (!res) return key;

    if (typeof res === "string") return res;

    if (!variables) return key;

    return res(variables);
  };

  get languages(): (keyof Strings)[] {
    return Object.keys(this.strings);
  }

  getUserLanguage = (languages: string | readonly string[]): keyof Strings => {
    if (!languages) return this.options.defaultLanguage;

    const language = `${`${languages}`.match(/[a-zA-Z]+(?=-|_|,|;)?/)}`.toLowerCase() as keyof Strings;

    if (!this.languages.includes(language)) return this.options.defaultLanguage;

    return language;
  };

  private toFunction = <S extends TypescriptI18nLang>(strings: TypescriptI18nLang, defaultStrings?: TypescriptI18nLang): ToFunction<S> => {
    const s: any = defaultStrings || this.strings[this.options.defaultLanguage];
    Object.entries(strings).map(([key, value]) => {
      s[key] = typeof value === "string" ? this.toFunctionString(value) : this.toFunction(value, s[key]);
    });

    return s as ToFunction<S>;
  };

  private toFunctionString = <V extends string>(value: V): ToFunctionString<V> =>
    (/{{([^}]+)}}/.exec(value)
      ? (variables: Record<GetVariables<V>, any>) => value.replace(/{{([^}]+)}}/g, (match, variable) => variables[variable] || match)
      : value) as ToFunctionString<V>;
}
