import type React from "react";
import type { Metadata,Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { BooksProvider } from "./contexts/booksContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const viewport : Viewport = {
  width : 'device-width',
  initialScale : 1,
  maximumScale : 2,
  userScalable : true
}

export const metadata: Metadata = {
  title: "BookVerse - Your Reading Universe",
  description:
    "Curate your personal library, track your reading journey, and explore endless stories in your own BookVerse",
  generator: "v0.dev",
  icons: {
    icon: "/bookverse.png", // Path relative to the public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BooksProvider>
      <html lang="en">
        <body className={inter.className} >
          <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
          <Toaster />
        </body>
      </html>
    </BooksProvider>
  );
}
