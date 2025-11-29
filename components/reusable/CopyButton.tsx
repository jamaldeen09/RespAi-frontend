"use client"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { callToast } from "@/providers/SonnerProvider";
import React from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

// ** Copy Button Component ** \\
interface CopyButtonProps {
    text: string;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null;
}

export const CopyButton: React.FC<CopyButtonProps> = React.memo(({ text, className = '', size = "icon-sm" }) => {
    const { copied, copyToClipboard } = useCopyToClipboard();

    React.useEffect(() => {
        let isComponentMounted = true
        if (copied && isComponentMounted) {
            callToast("success", "Successfully copied")
        }

        return () => { isComponentMounted = false }
    }, [copied])
    return (
        <Button
            type="button"
            disabled={copied}
            onClick={() => copyToClipboard(text)}
            size={size}
            variant="outline"
            className={`${className} cursor-pointer`}
        >
            {copied ? (
                <Check />
            ) : (
                <Copy />
            )}
        </Button>
    );
});