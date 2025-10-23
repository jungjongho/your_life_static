import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ko', 'es']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  // 1. Check if URL has a language
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameLocale) return pathnameLocale

  // 2. Check cookie for preferred language
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 3. Check Accept-Language header (browser settings)
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Prefer Korean
    if (acceptLanguage.includes('ko')) return 'ko'
    // Prefer Spanish
    if (acceptLanguage.includes('es')) return 'es'
    // Prefer English
    if (acceptLanguage.includes('en')) return 'en'
  }

  // 4. Default (English)
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // If language path already exists, pass through
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // If root path or path without language, add language and redirect
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  // Save selected language in cookie
  const response = NextResponse.redirect(newUrl)
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
