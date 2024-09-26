"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}