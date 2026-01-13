import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
	internationalization: {
		locales: [Locales.CHINESE_SIMPLIFIED_CHINA, Locales.ENGLISH],
		defaultLocale: Locales.CHINESE_SIMPLIFIED_CHINA,
	},
};

export default config;
