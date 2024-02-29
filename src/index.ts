import type {TypescriptI18nStrings, TypescriptI18nLang, TypescriptI18nOptions} from "./types.js";

export class TypescriptI18n<Strings extends TypescriptI18nStrings, CurrentLanguage extends keyof Strings> {
  private readonly strings: Strings;

  private _currentLanguage: keyof Strings = "en";
  private currentStrings: Strings[CurrentLanguage];

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
  }

  get s(): Strings[CurrentLanguage] {
    return this.currentStrings;
  }

  get = (key: string, variables?: any): string => {
    let res = key.split(".").reduce((word: any, part: string) => word[part] || "", this.currentStrings);

    if (!res || (typeof res === "function" && !variables)) return key;

    if (typeof res === "function") return res(variables);

    return res;
  };

  get languages(): (keyof Strings)[] {
    return Object.keys(this.strings);
  }

  get currentLanguage(): keyof Strings {
    return this._currentLanguage;
  }

  set currentLanguage(val: keyof Strings) {
    this._currentLanguage = val;
    this.currentStrings = this.getCurrentStrings(this.strings[val]);
  }

  private getCurrentStrings = (strings: TypescriptI18nLang, defaultStrings?: TypescriptI18nLang) => {
    const s: any = {...(defaultStrings || this.strings[this.options.defaultLanguage])};
    Object.entries(strings).map(([key, value]) => {
      s[key] = typeof value === "object" && !Array.isArray(value) ? this.getCurrentStrings(value, s[key]) : value;
    });

    return s;
  };

  getUserLanguage = (languages: string | readonly string[]): keyof Strings => {
    if (!languages) return this.options.defaultLanguage;

    const language = `${`${languages}`.match(/[a-zA-Z]+(?=-|_|,|;)?/)}`.toLowerCase() as keyof Strings;

    if (!this.languages.includes(language)) return this.options.defaultLanguage;

    return language;
  };
}
