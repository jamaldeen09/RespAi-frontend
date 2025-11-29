"use client"
import type React from "react"
import { useState } from "react"
import { ChevronDown, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ** Demo data  ** \\
const demoData = [
    {
        scenario: "Vague 500 Error",
        before: `{
  "error": {
    "code": 500,
    "message": "Internal server error",
    "details": "Unexpected token"
  }
}`,
        after: `✓ Status 500: Server failed to process request
✓ Root Cause: JSON parsing failed at line 3
✓ Solution: Validate request body syntax
✓ Time Saved: ~45 minutes debugging`,
        analysis: "The server encountered malformed JSON in your request body. Check for syntax errors or missing commas."
    },
    {
        scenario: "Authentication Failure",
        before: `{
  "error": {
    "code": 401,
    "message": "Unauthorized"
  }
}`,
        after: `✓ Status 401: Authentication required
✓ Issue: Missing Authorization header
✓ Required: Bearer token with 'read:api' scope
✓ Fix: Add 'Authorization: Bearer your_token'`,
        analysis: "Your request is missing proper authentication credentials. Include a valid Bearer token in the Authorization header."
    },
    {
        scenario: "Rate Limit Hit",
        before: `{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error"
  }
}`,
        after: `✓ Status: Rate limit exceeded
✓ Current: 98/100 requests this hour
✓ Reset: 15 minutes from now
✓ Solution: Implement exponential backoff`,
        analysis: "You've hit the API rate limit. Wait for the reset period or upgrade your plan for higher limits."
    },
    {
        scenario: "Malformed JSON Response",
        before: `SyntaxError: Unexpected token 'u' at position 45`,
        after: `✓ Issue: Malformed JSON at character 45
✓ Problem: Unexpected 'undefined' value
✓ Location: Response body, line 2, column 15
✓ Fix: Validate API response structure`,
        analysis: "The API returned invalid JSON. This often happens when the server returns undefined values or incorrect content-type headers."
    },
    {
        scenario: "CORS Policy Block",
        before: `Access to fetch at 'https://api.example.com' from origin 
'https://yourapp.com' has been blocked by CORS policy`,
        after: `✓ Issue: Cross-Origin Request Blocked
✓ Problem: Missing CORS headers
✓ Solution: Configure CORS on server or use proxy
✓ Quick Fix: Add 'mode: cors' to fetch request`,
        analysis: "The browser blocked your request due to CORS policy. The API server needs to include proper CORS headers for your domain."
    },
    {
        scenario: "Database Connection Issue",
        before: `{
  "error": "Connection timeout",
  "code": "ETIMEDOUT"
}`,
        after: `✓ Status: Database connection failed
✓ Issue: Network timeout after 30s
✓ Possible: Database overload or network issue
✓ Solution: Check database status, retry with backoff`,
        analysis: "The request timed out while waiting for database response. This could indicate database performance issues or network connectivity problems."
    },
]

// ** Demo item props ** \\
interface DemoItemProps {
    scenario: string
    before: string
    after: string
    analysis: string
    isOpen: boolean
    onToggle: () => void
}

const DemoItem = ({ scenario, before, after, analysis, isOpen, onToggle }: DemoItemProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        onToggle()
    }

    return (
        <div
            className="w-full bg-[rgba(231,236,235,0.08)] shadow-[0px_2px_4px_rgba(0,0,0,0.16)] overflow-hidden rounded-[10px] outline-1 outline-border -outline-offset-1 cursor-pointer hover:bg-[rgba(231,236,235,0.12)] transition-colors duration-200"
            onClick={handleClick}
        >
            {/* Header Section */}
            <div className="w-full px-5 py-[18px] pr-4 flex justify-between items-center gap-5 text-left hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-200">
                <div className="flex-1 text-foreground text-base font-medium leading-6 wrap-break-word">
                    {scenario}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                </motion.div>
            </div>

            {/* Content Section */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        initial={{
                            opacity: 0,
                            height: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto"
                        }}
                        exit={{
                            opacity: 0,
                            height: 0
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-[18px] pt-2">
                            <div className="space-y-4">
                                {/* Before & After Comparison */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                                            <X className="w-4 h-4" />
                                            Without Resp AI
                                        </div>
                                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto text-foreground/80 hover:bg-muted/80 transition-colors duration-150">
                                            {before}
                                        </pre>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                            <Check className="w-4 h-4" />
                                            With Resp AI
                                        </div>
                                        <pre className="text-xs bg-primary/10 p-3 rounded-lg overflow-x-auto text-foreground whitespace-pre-wrap border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-colors duration-150">
                                            {after}
                                        </pre>
                                    </div>
                                </div>

                                {/* Analysis Section */}
                                <div className="pt-2">
                                    <div className="text-sm font-medium text-foreground mb-2">AI Analysis:</div>
                                    <div className="text-foreground/80 text-sm leading-6 bg-card/50 p-3 rounded-lg border border-border hover:bg-card/70 transition-colors duration-150">
                                        {analysis}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export const LiveDemoSection = () => {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems)
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index)
        } else {
            newOpenItems.add(index)
        }
        setOpenItems(newOpenItems)
    }

    return (
        <section className="w-full pt-[66px] pb-20 md:pb-40 px-5 relative flex flex-col justify-center items-center">
            <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[100px] z-0" />
            <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
                <div className="flex flex-col justify-start items-center gap-4">
                    <h2 className="w-full max-w-[435px] text-center text-foreground text-4xl font-semibold leading-10 wrap-break-word">
                        See Resp AI in Action
                    </h2>
                    <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] wrap-break-word">
                        Transform confusing API errors into clear, actionable insights instantly
                    </p>
                </div>
            </div>
            <div className="w-full max-w-[800px] pt-0.5 pb-10 flex flex-col justify-start items-start gap-4 relative z-10">
                {demoData.map((demo, index) => (
                    <DemoItem
                        key={index}
                        {...demo}
                        isOpen={openItems.has(index)}
                        onToggle={() => toggleItem(index)}
                    />
                ))}
            </div>
        </section>
    )
}