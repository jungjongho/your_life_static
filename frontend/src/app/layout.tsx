import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '내 인생 통계 | My Life Stats',
  description: '생년월일로 알아보는 나의 인생 통계',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
        {children}
      </body>
    </html>
  )
}
