"use client"
import React from "react";
import { Toaster } from "sonner"
import { toast } from "sonner";

// ** Custom function to call sonners toast ** \\
export const callToast = (
    variant: "success" | "error" | "info" | "warning",
    message: string,
    duration?: number,
) => {
    const effectiveDuration = duration || 3000;

    toast[variant](message, {
        duration: effectiveDuration,
    });
};


// ** Provides the next js app with a toaster that makes it possible to see the toast after being called ** \\
export const SonnerProvider = React.memo(({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    return (
        <>
            <Toaster
                theme="dark"
                richColors
                position="bottom-right"
                style={{ fontFamily: "poppins" }}
            />
            {children}
        </>
    );
});

