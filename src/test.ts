import I18n from "./";

const en = {
  hello: "Hello {{name}}",
  goodbye: "Goodbye",
  onlyEnglish: "Only english",
  test: {
    working: "Working"
  }
} as const;

const it = {
  hello: "Ciao {{name}}",
  goodbye: "Addio",
  test: {
    working: "Funziona"
  }
} as const;

const lang = new I18n(
  {en, it},
  {
    defaultLanguage: "en"
  }
);

lang.currentLanguage = "it";
const t = lang.s;

console.log(t.goodbye);
console.log(t.hello({name: "Andrea"}));
console.log(lang.get("test.working"));
console.log(t.onlyEnglish);
console.log(lang.languages);
