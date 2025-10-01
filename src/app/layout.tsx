import { Inter } from 'next/font/google';
import "./globals.css";
import { ToastProvider } from '@/components/ui/toast';
import ClientWalletProvider from '@/components/ClientWalletProvider';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Lucky Wheel Game',
  description: 'U3ID lucky wheel game with Universal Account',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWalletProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ClientWalletProvider>
      </body>
    </html>
  );
}
