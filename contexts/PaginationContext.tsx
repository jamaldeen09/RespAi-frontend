"use client"
import { useNavigationHook } from "@/hooks/useNavigationHook";
import { ExpectedPaginationData } from "@/redux/apis/analysisApi";
import { createContext, useState } from "react";

interface PaginationContextSchema {
    filters: ExpectedPaginationData;
    setFilters: React.Dispatch<React.SetStateAction<ExpectedPaginationData>>;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined;
    setMethod: React.Dispatch<React.SetStateAction<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const PaginationContext = createContext<PaginationContextSchema>({
    filters: {},
    setFilters: () => { },
    method: undefined,
    setMethod: () => {},
    searchQuery: "",
    setSearchQuery: () => {},
    status: "",
    setStatus: () => {},
});

export const PaginationContextProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    const {
        searchParams
    } = useNavigationHook();

    const [filters, setFilters] = useState<ExpectedPaginationData>({});
    const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined>(
        searchParams.get("method") as "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined
    );
    const [status, setStatus] = useState<string>(
        searchParams.get("status") || ""
    );
    // ** SearchQuery ** \\
    const [searchQuery, setSearchQuery] = useState<string>(
        searchParams.get("searchQuery") || ""
    );
    return (
        <PaginationContext.Provider value={{ 
            filters, 
            setFilters,
            method,
            setMethod,
            status,
            setStatus,
            searchQuery,
            setSearchQuery,
        }}>
            {children}
        </PaginationContext.Provider>
    )
}