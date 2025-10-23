'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function LanguageSwitcher() {
  const pathname = usePathname()

  // Check if pathname is /en/... or /ko/... or /es/...
  const currentLang = pathname?.startsWith('/ko')
    ? 'ko'
    : pathname?.startsWith('/es')
    ? 'es'
    : 'en'

  // Convert /ko/about -> /en/about
  const switchPath = (newLang: string) => {
    if (!pathname) return `/${newLang}`
    const pathWithoutLang = pathname.replace(/^\/(en|ko|es)/, '')
    return `/${newLang}${pathWithoutLang}`
  }

  return (
    <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
      <Link
        href={switchPath('en')}
        className={`px-4 py-2 rounded-md transition-all ${
          currentLang === 'en'
            ? 'bg-purple-500 text-white font-semibold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        English
      </Link>
      <Link
        href={switchPath('ko')}
        className={`px-4 py-2 rounded-md transition-all ${
          currentLang === 'ko'
            ? 'bg-purple-500 text-white font-semibold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        한국어
      </Link>
      <Link
        href={switchPath('es')}
        className={`px-4 py-2 rounded-md transition-all ${
          currentLang === 'es'
            ? 'bg-purple-500 text-white font-semibold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Español
      </Link>
    </div>
  )
}
