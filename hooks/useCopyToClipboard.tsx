"use client"
import { useCallback, useState } from "react";

// ** Copy to clipboard utility ** \\
export const useCopyToClipboard = () => {
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, []);

    return { 
        copied, 
        copyToClipboard 
    };
};