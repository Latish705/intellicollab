import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "IntelliColab - AI-Powered Team Collaboration",
  description: "A modern, scalable chat platform with AI-enhanced collaboration features. Built with microservices architecture for teams that value innovation and efficiency.",
  keywords: "collaboration, chat, AI, microservices, team communication, real-time messaging",
  authors: [{ name: "IntelliColab Team" }],
  openGraph: {
    title: "IntelliColab - AI-Powered Team Collaboration",
    description: "Transform your team communication with our AI-enhanced collaboration platform",
    type: "website",
    url: "https://intellicollab.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IntelliColab Platform"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliColab - AI-Powered Team Collaboration",
    description: "Transform your team communication with our AI-enhanced collaboration platform",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
