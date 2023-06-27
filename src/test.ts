import I18n from "./";

const en = {
  $hello: "Hello {{name}}",
  goodbye: "Goodbye",
  test: {
    working: "Working"
  }
};

const it = {
  $hello: "Ciao {{name}}",
  goodbye: "Addio",
  test: {
    working: "Funziona"
  }
};

const lang = new I18n(
  {en, it},
  {
    defaultLanguage: "en"
  }
);

lang.currentLanguage = "it";
const t = lang.s;

console.log(t.goodbye);
console.log(t.$hello({name: "Andrea"}));
console.log(lang.get("test.working"));
console.log(lang.getLanguages());
