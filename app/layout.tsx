import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'FloatChat - AI-Powered Ocean Data Discovery',
  description: 'Conversational interface for ARGO oceanographic dataset exploration and visualization',
  keywords: 'oceanography, ARGO, data visualization, AI, chat interface, marine science',
  authors: [{ name: 'FloatChat Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full light" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans h-full antialiased bg-white text-black`}>
        <ThemeProvider
          defaultTheme="light"
          storageKey="floatchat-ui-theme"
        >
          <div className="min-h-full bg-white">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}