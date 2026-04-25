import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Onkar Shinde — AI / ML Engineer",
  description:
    "Portfolio of Onkar Shinde — AI/ML developer specializing in agentic AI, RAG systems, computer vision, and NLP. Based in Pune, India.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "LangGraph",
    "RAG",
    "Computer Vision",
    "LangChain",
    "Agentic AI",
    "HuggingFace",
    "Onkar Shinde",
    "DY Patil"
  ],
  openGraph: {
    title: "Onkar Shinde — AI / ML Engineer",
    description:
      "Building intelligent systems that reason, adapt, and ship.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Fira+Code:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* suppressHydrationWarning prevents false positives from browser
          extensions that inject attributes (Grammarly, LastPass, etc.) */}
      <body suppressHydrationWarning>
        {/* ClientProviders bundles all ssr:false dynamic imports into one
            Client Component — required by Next.js 16 App Router */}
        <ClientProviders />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
