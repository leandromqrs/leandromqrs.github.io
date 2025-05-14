import { defineMiddleware } from 'astro:middleware';
import { 
    getLocale, 
    setLocale, 
    type AvailableLanguageTag 
} from "../paraglide/runtime";

export const onRequest = defineMiddleware((context, next) => {
	const lang = context.params.lang;

    if (lang !== getLocale()) {
        setLocale(lang as AvailableLanguageTag);

        return context.redirect(`/${lang ?? 'en'}`);
    }

    return next();
});

