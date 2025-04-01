import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout"; // New client-side component

export const metadata: Metadata = {
  title: "LifeGift",
  description: "Created By Team Catalyst",
  generator: "BabaYaga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}