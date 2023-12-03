import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import "../styles/globals.css";
import ToastProvider from "@/providers/toast-provider";
import SessionProvider from "@/providers/session-provider";
import { ModalProviders } from "@/providers/modal-providers";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToastProvider />
          <ModalProviders />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}