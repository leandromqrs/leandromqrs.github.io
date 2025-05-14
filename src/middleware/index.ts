import { defineMiddleware } from 'astro:middleware';
import { 
    getLocale, 
    setLocale, 
    locales, 
    baseLocale,
    type AvailableLanguageTag 
} from "../paraglide/runtime";

export const onRequest = defineMiddleware((context, next) => {
    const { request, params } = context;
    const lang = params.lang as AvailableLanguageTag | undefined;
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Se estamos em uma rota com parâmetro de idioma
    if (lang) {
        // Define o idioma atual para o idioma da rota
        if (lang !== getLocale()) {
            setLocale(lang);
        }
        return next();
    }
    
    // Caso contrário, estamos em uma rota sem parâmetro de idioma
    // Precisamos detectar o idioma preferido do navegador
    const acceptLanguage = request.headers.get('accept-language');
    let preferredLang = baseLocale; // Padrão 'en'
    
    if (acceptLanguage) {
        // Parse Accept-Language header para obter idioma preferido
        const browserLangs = acceptLanguage
            .split(',')
            .map(lang => {
                const [tag, priority = '1'] = lang.trim().split(';q=');
                return { tag: tag.toLowerCase(), priority: parseFloat(priority) };
            })
            .sort((a, b) => b.priority - a.priority)
            .map(lang => lang.tag);
            
        // Encontra o primeiro idioma compatível
        for (const browserLang of browserLangs) {
            // Tenta encontrar correspondência exata
            if (locales.includes(browserLang as AvailableLanguageTag)) {
                preferredLang = browserLang as AvailableLanguageTag;
                break;
            }
            
            // Tenta encontrar correspondência pela língua principal (ex: 'pt' matches 'pt-br')
            const mainLang = browserLang.split('-')[0];
            const match = locales.find(locale => locale.startsWith(mainLang));
            if (match) {
                preferredLang = match;
                break;
            }
        }
    }
    
    // Mantém o caminho atual, apenas adicionando o idioma
    /* const pathSegments = pathname.split('/').filter(Boolean);
    const redirectPath = `/${preferredLang}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
    
    return context.redirect(redirectPath); */
    return next();
});

