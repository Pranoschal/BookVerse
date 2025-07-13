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
          <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={true}>{children}</CopilotKit>
    </div>
  );
}
