"use client"
import React, { createContext } from "react";

interface AuthContextSchema {
    authType: "signup" | "login";
    setAuthType: React.Dispatch<React.SetStateAction<"signup" | "login">>;
};

// ** Context to handle changing auth types seemlessly ** \\
export const AuthContext = createContext<AuthContextSchema>({
    authType: "signup",
    setAuthType: () => { }
});


// ** Auth context provider ** \\
export const AuthContextProvider = React.memo(({ children }: { children: React.ReactNode }) => {
    const [authType, setAuthType] = React.useState<"signup" | "login">("signup");

    return (
        <AuthContext.Provider
            value={{ 
                authType, 
                setAuthType 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
});