import uz from './uz'
import ru from './ru'
import { Locale } from './config'

const translations = { uz, ru }

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.uz
}

export type { Locale }
export { uz, ru }
