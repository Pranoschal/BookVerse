"use client"
import type React from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { BooksProvider } from "../contexts/booksContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <BooksProvider>
          <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
        </BooksProvider>
    </div>
  );
}
