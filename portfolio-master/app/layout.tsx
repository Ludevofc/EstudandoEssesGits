import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.scss'
import { DeviceContextProvider } from './context/DeviceContext'
import Header from './components/regular/Header'
import Footer from './components/regular/Footer'
import { LanguageContextProvider } from './context/LanguageContext'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jullie Paixão',
  description: 'Fullstack Developer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <LanguageContextProvider>
          <DeviceContextProvider>
            <Header />
            {children}
            <Footer />
          </DeviceContextProvider>
        </LanguageContextProvider>
      </body>
    </html>
  )
}
