import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Finance Manager - Gerencie suas Finanças com IA',
  description: 'Controle suas receitas e despesas com nosso assistente virtual inteligente. Dashboard intuitivo, dicas personalizadas e segurança total.',
  keywords: 'finanças pessoais, controle de gastos, assistente virtual, dashboard financeiro',
  authors: [{ name: 'Finance Manager Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}