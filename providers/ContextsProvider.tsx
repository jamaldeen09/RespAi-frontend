"use client"
import { AuthContextProvider } from "@/contexts/AuthContext";
import { PaginationContextProvider } from "@/contexts/PaginationContext";
import React from "react";

const ContextsProvider = React.memo(({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <AuthContextProvider>
      <PaginationContextProvider>
        {children}
      </PaginationContextProvider>
    </AuthContextProvider>
  );
});

export default ContextsProvider;