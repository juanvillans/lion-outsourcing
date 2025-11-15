import {Locales, type IntlayerConfig} from 'intlayer';

const config: IntlayerConfig = {
    internationalization: {
        defaultLocale: Locales.SPANISH,
        locales: [
            Locales.ENGLISH,
            Locales.SPANISH,
            Locales.FRENCH
        ]
    },
    routing: {
        mode: 'prefix-all'
    }
}

export default config;

