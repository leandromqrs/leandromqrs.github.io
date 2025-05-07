import { ui, defaultLang } from './ui';

export function getLangFromUrl(urlString: string) {
    const url = new URL(urlString);
    const langParam = url.searchParams.get('lang');
    if (langParam && langParam in ui) {
        return langParam as keyof typeof ui;
    }
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}