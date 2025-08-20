import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import PrivyProviderWrapper from './providers/PrivyProviders';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated ClashDisplay font configuration to match available files
const clashDisplay = localFont({
  src: [
    {
      path: '../public/fonts/ClashDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/ClashDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-clash-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PaySlab - Nigerian Trade Finance Platform",
  description: "Blockchain-powered Nigerian trade platform with NGN to USDC conversion and smart contract escrow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${clashDisplay.variable} antialiased`}
      >
        <PrivyProviderWrapper>
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}