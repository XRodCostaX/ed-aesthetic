import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Ed Aesthetic | Gestão Clínica & Atendimento Inteligente',
  description:
    'Sistema Integrado de Gestão, Agenda Anti No-Show, Prontuário com Antes & Depois e Blindagem de Estoque de Alta Precisão para a Ed Aesthetic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF9F6]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
