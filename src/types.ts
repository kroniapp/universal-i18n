import {ParseRegExp, MatchRegExp} from "type-level-regexp";

type ExtractPropertyName<T extends string[]> = T[number] extends `{{${infer U}}}` ? U : never;

export type GetVariables<V extends string> = ExtractPropertyName<NonNullable<MatchRegExp<V, ParseRegExp<"{{[^}]+}}">, "g">>>;

export type HasVariables<V extends string> = MatchRegExp<V, ParseRegExp<"{{[^}]+}}">, never> extends null ? false : true;

export type TypescriptI18nStrings = {
  [lang: string]: TypescriptI18nLang;
};

export type TypescriptI18nLang = {
  [key: string]: TypescriptI18nLang | string;
};

export type TypescriptI18nOptions<CurrentLanguage> = {
  defaultLanguage: CurrentLanguage;
};

export type ToFunction<S> = {
  [key in keyof S]: S[key] extends string ? ToFunctionString<S[key]> : ToFunction<S[key]>;
};

export type ToFunctionString<V extends string> = HasVariables<V> extends true ? (variables: Record<GetVariables<V>, any>) => string : V;
