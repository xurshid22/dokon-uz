export const i18nConfig = {
  defaultLocale: 'uz' as const,
  locales: ['uz', 'ru'] as const,
}

export type Locale = (typeof i18nConfig.locales)[number]
