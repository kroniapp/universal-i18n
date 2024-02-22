import {TypescriptI18n} from "./";

const en = {
  count: (items: string[]) => `${items.length} items`,
  hello: ({name}) => `Hello ${name}`,
  goodbye: "Goodbye",
  onlyEnglish: "Only english",
  test: {
    working: "Working"
  }
};

const it = {
  count: (items: string[]) => `${items.length} elementi`,
  hello: ({name}) => `Ciao ${name}`,
  goodbye: "Addio",
  test: {
    working: "Funziona"
  }
};

const lang = new TypescriptI18n(
  {en, it},
  {
    defaultLanguage: "en"
  }
);

lang.currentLanguage = "it";
const t = lang.s;

console.log(t.goodbye);
console.log(t.hello({name: "Andrea"}));
console.log(t.count(["elemento 1", "elemento 2"]));
console.log(lang.get("test.working"));
console.log(t.onlyEnglish);
console.log(lang.get("hello", {name: "Andrea"}));
console.log(lang.languages);
