import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { getDictionary, type Locale } from '@/dictionaries'
import { DictionaryProvider } from '@/contexts/DictionaryContext'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ko' }, { lang: 'es' }]
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourlife.alldatabox.com'

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: 'website',
      locale: params.lang === 'ko' ? 'ko_KR' : params.lang === 'es' ? 'es_ES' : 'en_US',
      url: `${baseUrl}/${params.lang}`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: dict.metadata.title,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'ko': `${baseUrl}/ko`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(params.lang)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourlife.alldatabox.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: dictionary.metadata.title,
    description: dictionary.metadata.description,
    url: `${baseUrl}/${params.lang}`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: params.lang === 'ko' ? 'ko-KR' : params.lang === 'es' ? 'es-ES' : 'en-US',
  }

  return (
    <html lang={params.lang}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7085764517061443"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
        <DictionaryProvider dictionary={dictionary}>
          {children}
        </DictionaryProvider>
      </body>
    </html>
  )
}
