import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ko: () => import('./ko.json').then((module) => module.default),
  es: () => import('./es.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const getDictionary = async (locale: Locale) => {
  // If invalid locale, use default (en)
  if (!dictionaries[locale]) {
    return dictionaries.en()
  }
  return dictionaries[locale]()
}

// Dictionary type definition
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
