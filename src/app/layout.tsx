import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Iracambi Raiz Verde — Transparência Ambiental',
  description: 'Acompanhe em tempo real como cada doação vira floresta. ONG Iracambi — Rosário da Limeira, MG.',
  openGraph: {
    title: 'Iracambi Raiz Verde',
    description: 'Reflorestamento da Mata Atlântica com transparência total.',
    images: ['/iracambi-logo.jpeg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
