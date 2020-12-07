import enLang from "./entries/en_US";
import roLang from "./entries/ro_RO";
import ruLang from "./entries/ru_RU";

// interface IAppLocale {
//     [key: string]: string
// }
const AppLocale = {
    en: enLang,
    ro: roLang,
    ru: ruLang,
} as { [key: string]: any };

export default AppLocale;
