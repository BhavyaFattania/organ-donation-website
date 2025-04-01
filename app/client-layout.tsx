"use client";

import { ThemeProvider } from "@/components/theme-provider";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            storageKey="organ-donation-theme"
            enableSystem
        >
            {children}
        </ThemeProvider>
    );
}