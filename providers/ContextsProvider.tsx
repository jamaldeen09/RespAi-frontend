"use client"
import { AuthContextProvider } from "@/contexts/AuthContext";
import { PaginationContextProvider } from "@/contexts/PaginationContext";
import React from "react";

const ContextsProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <AuthContextProvider>
      <PaginationContextProvider>
        {children}
      </PaginationContextProvider>
    </AuthContextProvider>
  );
};

export default ContextsProvider;