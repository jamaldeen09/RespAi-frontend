import { Poppins } from 'next/font/google';
import "./globals.css";
import { NextFont } from 'next/dist/compiled/@next/font';
import { Metadata } from 'next';
import ReduxProvider from '@/providers/ReduxProvider';
import ModalsProvider from '@/providers/ModalsProvider';
import { SonnerProvider } from '@/providers/SonnerProvider';
import ContextsProvider from '@/providers/ContextsProvider';
import { Suspense } from 'react';
import Loading from '@/components/reusable/Loading';

// ** Global font being used ** \\
const poppins: NextFont = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// ** Meta data (contains stuff like app title, description etc...) generally helps SEO ** \\
export const metadata: Metadata = {
  title: "RespAi",
  description: "AI-powered explanations for any API response",
};

// ** Root layout (renders the whole app, components etc.. as "children") ** \\
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="RespAi" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={poppins.className}>
        <Suspense fallback={<Loading />}>
          <ReduxProvider>
            <SonnerProvider>
              <ContextsProvider>
                <ModalsProvider>
                  {children}
                </ModalsProvider>
              </ContextsProvider>
            </SonnerProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
