import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import ClientInitializer from "@/components/ClientInitializer";

export const metadata: Metadata = {
  title: "IKAI HR - CV Analysis Platform",
  description: "AI-powered CV analysis and recruitment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalErrorBoundary>
          <ErrorBoundary>
            <ClientInitializer />
            {children}
          </ErrorBoundary>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
