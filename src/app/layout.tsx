import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CDSS - Clinical Decision Support System",
  description: "AI-powered clinical decision support for healthcare professionals. GDPR-compliant, explainable AI for diagnostic assistance.",
  keywords: ["clinical decision support", "CDSS", "healthcare AI", "diagnostic support", "medical AI"],
  authors: [{ name: "Arishadvarga Team" }],
  robots: "noindex, nofollow", // Medical software should not be indexed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
