import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { BooksProvider } from "./contexts/booksContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookVerse - Your Reading Universe",
  description:
    "Curate your personal library, track your reading journey, and explore endless stories in your own BookVerse",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BooksProvider>
          <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
        </BooksProvider>
      </body>
    </html>
  );
}
