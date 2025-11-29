"use client"
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/redux/store";
import { CheckCheck, Copy, Triangle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { callToast } from "@/providers/SonnerProvider";
import useAuth from "@/hooks/useAuth";
import { ApiResponse } from "@/redux/apiSettings";
import useTypewriter from "@/hooks/useTypewriter";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useSaveAnalysisMutation } from "@/redux/apis/analysisApi";
import useRedux from "@/hooks/useRedux";
import { AnalysisSchema, clearAnalysisResult } from "@/redux/slices/analysisSlice";
import { logout } from "@/redux/slices/userSlice";
import { Spinner } from "../ui/spinner";
import { CopyButton } from "../reusable/CopyButton";
import { getHttpStatusCodeLabel } from "@/data/httpStatusCodes";

interface AnalysisResultsProps {
    isLoading: boolean;
    isError: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
    isSuccess: boolean,
    failedAnalysisUi: (
        title: string,
        description?: string,
        validationErrors?: Array<{ field: string; message: string }>
    ) => React.ReactElement;
}

const AnalysisResults = ({
    isLoading,
    isError,
    error,
    isSuccess,
    failedAnalysisUi,
}: AnalysisResultsProps): React.ReactElement => {

    // ** Global states (redux toolkit) ** \\
    const {
        analysis
    } = useAppSelector((state) => state.analysis);
    const {
        profile
    } = useAppSelector((state) => state.user)

    // ** Loca states ** \\
    const [activeTab, setActiveTab] = useState<string>(
        !analysis ? "" : "analysis"
    );
    const [openRequestHeaders, setOpenRequestHeaders] = useState<boolean>(true);
    const [openResponseHeaders, setOpenResponseHeaders] = useState<boolean>(false);
    const [isCopyingAiTextToClipboard, setIsCopyingAiTextToClipboad] = useState<boolean>(false);

    // ** Custom hook used for extracting validation errors *8 \\
    const { extractValidationErrors } = useAuth();
    const newAnalysisValidationErrors = extractValidationErrors(error);
    const typeWriterAiText = useTypewriter(analysis?.aiAnalysis || "Unknown", 4);

    // ** UseEffect to change activeTabs if isSuccess ** \\
    useEffect(() => {
        let isComponentMounted = true;
        if (isSuccess) {
            if (!profile.enableAiAnalysis) {
                if (isComponentMounted) setActiveTab("response");
            } else if (profile.credits > 1) {
                if (isComponentMounted) setActiveTab("analysis");
            } else {
                if (isComponentMounted) setActiveTab("response");
            }
        };
        return () => { isComponentMounted = false };
    }, [isSuccess]);

    const errorMessage = (): string => {
        if (!error || !("data" in error)) return "Analysis Failed";
        const extractedMessage = (error?.data as ApiResponse).message;

        return extractedMessage;
    };

    /** 
     @param {string} text - The text being copied to clipboard
     @param {string} successMessage - Success message to show after successfully copying text to clipboard
     @returns {Promise<void>}
    */
    const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
        setIsCopyingAiTextToClipboad(true);
        try {
            await navigator.clipboard.writeText(text);
            callToast("success", successMessage);
        } catch (err) {
            callToast("error", "Failed to copy to clipboard");
        } finally {
            setTimeout(() => setIsCopyingAiTextToClipboad(false), 2000)
        }
    };

    // ** Copies ai analysis ** \\
    const copyAIText = () =>
        copyToClipboard(analysis?.aiAnalysis || "Unknown", "AI analysis copied to clipboard!");

    // ** Renders req or response tabs content ** \\
    /** 
     @param {"request" | "response"} type - Determines if the function renders tab content for request tab or response tab
     @returns {React.ReactElement}
    */

    const renderReqOrResTabsContent = (
        type: "request" | "response"
    ): React.ReactElement => {
        return (
            <>
                <div onClick={() => {
                    if (type === "request") {
                        return setOpenRequestHeaders(!openRequestHeaders)
                    } else {
                        return setOpenResponseHeaders(!openResponseHeaders)
                    }
                }}
                    className={`${(
                        type === "request" ? openRequestHeaders : openResponseHeaders
                    ) ? "bg-[#24282b]" : "bg-transparent hover:bg-[#24282b]"} w-full transition-all duration-200 flex items-center gap-2 p-2 rounded-lg`}>
                    <Triangle
                        className={`text-accent size-3 ${(
                            type === "request" ? openRequestHeaders : openResponseHeaders
                        ) ? "rotate-90" : "rotate-180"}`}
                        fill="#3e3e41"
                    />
                    <div className="flex items-center gap-4 text-xs hover:cursor-default">
                        <strong className={`
                            ${type === "request" ? "text-primary" : `${analysis?.response && analysis.response.status >= 200 && analysis.response.status < 300 ? "text-primary" : "text-red-600"}`}`}>
                            {(
                                type === "request" ? analysis?.request.method :
                                    analysis?.response.status) || "Unknown"
                            }
                            {type === "response" && (
                                getHttpStatusCodeLabel((analysis?.response.status || "").toString())
                            )}
                        </strong>
                        <p className="text-foreground/70">{analysis?.request.endpoint || "Unknown"} {`${type === "request" && openRequestHeaders ? `(${analysis?.request.headers.length} headers)` :
                            type === "response" && openResponseHeaders ? `(${analysis?.response.headers.length} headers)` : ""
                            }`}</p>
                    </div>
                </div>

                {/* Headers */}
                {
                    (type === "request" ? openRequestHeaders : openResponseHeaders) && (
                        <div className="h-fit w-full flex flex-col gap-2 text-sm pl-7">
                            {((type === "request" ? analysis?.request.headers! : analysis?.response.headers!) || []).map((header) => (
                                <div key={header.key} className="border-b border-border gap-30 flex text-primary py-2 text-xs overflow-x-auto element-scrollable-hidden-scrollbar mt-2
                                
                                ">
                                    <p className="text-primary">{header.key}</p>
                                    <p className="text-muted-foreground">{JSON.stringify(header.value)}</p>
                                </div>
                            ))}
                        </div>
                    )
                }

                {/* Body */}
                {type === "response" && (
                    <div className="w-full mt-6 pl-7">
                        <div className="rounded-lg border-border border relative">
                            <div className="flex items-center justify-end absolute right-3 top-2">
                                <CopyButton
                                    text={JSON.stringify(analysis?.response.body, null, 4) || ""}
                                    className=""
                                />
                            </div>
                            <div className="p-4">
                                <pre style={{ fontFamily: "poppins" }} className="text-foreground whitespace-pre-wrap text-sm leading-relaxed overflow-x-auto element-scrollable-hidden-scrollbar">

                                    {JSON.stringify(analysis?.response.body, null, 4) || "{ unknown: unknown }"}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    };

    // ** User profile ** \\
    const user = useAppSelector((state) => state.user.profile)

    // ** ===== Saving analysis ==== ** \\
    // ** Dispatch ** \\
    const { dispatch } = useRedux();

    // ** Rtk query hook ** \\
    const [saveAnalysis, {
        isLoading: isSavingAnalysis,
        isError: failedToSaveAnalysis,
        error: receivedErrorInSaveAnalysis,
        isSuccess: successfullySavedAnalysis,
        data: receivedDataInSaveAnalysis,
    }] = useSaveAnalysisMutation();

    // ** Validation errors ** \\
    const saveAnalysisValidationErrors = extractValidationErrors(receivedErrorInSaveAnalysis);

    // ** UseEffect to handle both successfull and error messages after request has been made ** \\
    useEffect(() => {
        let isComponentMounted = true;
        if (successfullySavedAnalysis && isComponentMounted) {
            // ** Clear previous analysis to prevent duplication ** \\
            dispatch(clearAnalysisResult());

            // ** Toast with the success message from backend server ** \\
            callToast("success", receivedDataInSaveAnalysis.message);
        };

        if (failedToSaveAnalysis && receivedErrorInSaveAnalysis && "data" in receivedErrorInSaveAnalysis) {
            const expectedErrorMessage = (receivedErrorInSaveAnalysis.data as ApiResponse).message;
            const status = receivedErrorInSaveAnalysis.status;

            if ((status === 401 || status === 403) && isComponentMounted) {
                dispatch(logout());
            } else {
                callToast("error", expectedErrorMessage);
            }
        };
        return () => { isComponentMounted = false }
    }, [
        failedToSaveAnalysis,
        receivedErrorInSaveAnalysis,
        successfullySavedAnalysis,
        receivedDataInSaveAnalysis,
        dispatch,
        callToast
    ]);

    // ** Function to actually trigger analysis save ** \\
    const handleSaveAnalysis = async () => {
        if (!analysis) return;
        try {
            const getAnalysisData = (): AnalysisSchema => {
                if (analysis.aiAnalysis) return {
                    ...analysis,
                    response: {
                        ...analysis.response,
                        body: JSON.stringify(analysis.response.body)
                    }
                };

                return {
                    request: analysis.request,
                    cost: analysis.cost,
                    response: {
                        ...analysis.response,
                        body: JSON.stringify(analysis.response.body)
                    }
                }
            };

            // ** Function to save analysis ** \\
            await saveAnalysis(getAnalysisData());
        } catch (err) {
            console.error(`Error occured in function "handleSaveAnalysis" in file "AnalysisResults.tsx": ${err}`);
            callToast("error", "An unexpected error occured while trying to save your requested analysis, please try again later");
        }
    };

    // ** Formats users credit refill date to a certain format ** \\
    const formatDateReadable = (isoDateString: string): string => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // ** Renders tABS TRIGGER
    const renderTabsTrigger = () => {
        const tabListClasses = `data-[state=active]:bg-muted/50 data-[state=active]:text-white text-foreground/75 flex-1 xs:flex-none text-xs px-2`
        const tabsTriggers = [
            {
                id: 1,
                value: "analysis",
                name: "Ai analysis",
            },
            {
                id: 2,
                value: "request",
                name: "Request",
                extraDetail: analysis?.request && analysis.request.method && (<strong className="text-primary">{analysis.request?.method || "Unknown"}</strong>)
            },
            {
                id: 3,
                value: "response",
                name: "Response",
                extraDetail: analysis?.response && analysis.response.status && (<strong className={`${analysis?.response && analysis.response.status >= 200 && analysis.response.status < 300 ? "text-primary" : "text-red-600"}`}>
                    {analysis.response.status || "Unknown"}
                </strong>)
            },
        ]
        return (
            tabsTriggers.map((tabTrigger) => (
                <TabsTrigger
                    disabled={!analysis}
                    key={tabTrigger.id}
                    value={tabTrigger.value}
                    className={tabListClasses}
                >
                    {tabTrigger.name}{" "}{tabTrigger.extraDetail}
                </TabsTrigger>
            ))
        )
    };
    return (
        <div className="flex-1 bg-muted/20 border-border border rounded-b-xl lg:rounded-r-xl p-2 lg:rounded-l-none
        overflow-y-auto element-scrollable-hidden-scrollbar
        max-h-[810px] overflow-x-hidden">
            {/* HTTPie-style Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full"
            >
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent p-1">
                        {renderTabsTrigger()}

                    </TabsList>
                    {analysis && (
                        <Button
                            disabled={isSavingAnalysis}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-accent text-xs cursor-pointer"
                            onClick={handleSaveAnalysis}
                        >
                            {isSavingAnalysis && (<Spinner />)}
                            {isSavingAnalysis ? "Saving..." : "Save"}
                        </Button>
                    )}
                </div>
                {/* Request Tab Content */}
                {(isError || error || receivedErrorInSaveAnalysis || failedToSaveAnalysis) ? (
                    // ** Error ui for failed analysis ** \\
                    failedAnalysisUi(
                        errorMessage(),
                        undefined,
                        ([...newAnalysisValidationErrors, ...saveAnalysisValidationErrors])
                    )
                ) : isLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="flex flex-col gap-4 items-center text-center">
                            <div className="bg-accent w-14 h-14 flex justify-center items-center rounded-full">
                                <Spinner className="size-8" />
                            </div>
                            <p className="text-sm">Transaction in progress...</p>
                        </div>
                    </div>
                ) : !analysis ? (
                    <div className="h-full 
                    flex justify-center items-center">

                        <div className="flex flex-col gap-4 items-center text-center">
                            <div className="bg-accent flex justify-center items-center rounded-full w-14 h-14">
                                <X className="size-9" />
                            </div>
                            <p className="font-normal text-sm">Not sent</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* AI Analysis Tab Content */}
                        <TabsContent value="analysis" className="flex-1 py-4">
                            <div className="h-full bg-muted/20 rounded-lg border border-border p-4 overflow-auto">
                                {!user.enableAiAnalysis || analysis?.info === "ai_disabled" ? (
                                    <div className="h-full flex justify-center items-center">
                                        <div className="flex flex-col gap-2 items-center justify-center text-center w-full max-w-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="var(--color-muted-foreground)"
                                                className="size-10"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                                />
                                            </svg>

                                            <div className="flex-1 space-y-2">
                                                <h4 className="text-sm font-semibold">AI Analysis Disabled</h4>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    AI analysis for your requests is currently turned off. You won't lose credits for API requests until you enable it again.
                                                </p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    You can re-enable AI analysis anytime from your <strong>Profile</strong> page to get detailed AI analyses for your requests.
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                ) : analysis?.info && analysis.info === "insufficient_credits" ? (
                                    // ** Not enough credits - compact version ** \\
                                    <div className="h-full 
                                    flex justify-center items-center">
                                        <div className="flex flex-col gap-2
                                        items-center justify-center text-center w-full max-w-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="oklch(57.7% 0.245 27.325)"
                                                className="size-10"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                                />
                                            </svg>

                                            <div className="flex-1 space-y-2">
                                                <h4 className="text-sm font-semibold">Not Enough Credits</h4>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    AI analysis for this request requires additional credits. You will receive 50 extra credits on {formatDateReadable(user.creditRefillDate)}.
                                                </p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    Note: This automatic refill is temporary. If RespAi gains enough traffic in the first 10–20 days, we will integrate a real purchase system for credits.
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                ) : analysis.info && analysis.info === "analysis_error" ? (
                                    // ** Analysis error - compact version ** \\
                                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-red-800 mb-1">Analysis Unavailable</h4>
                                            <p className="text-sm text-red-700">
                                                We couldn't generate AI insights for this request. Please try again later.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // ** Normal AI analysis content ** \\
                                    <div className="w-full h-full flex flex-col gap-4">
                                        {/* Header with copy button */}
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-semibold text-muted-foreground">AI Insights</h4>
                                            <Button
                                                disabled={isCopyingAiTextToClipboard}
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 hover:bg-accent cursor-pointer"
                                                onClick={copyAIText}
                                            >
                                                {isCopyingAiTextToClipboard ? <CheckCheck /> : <Copy />}
                                            </Button>
                                        </div>

                                        {/* AI Analysis Content */}
                                        <div className="overflow-auto h-full p-2 whitespace-pre-wrap text-sm text-foreground element-scrollable-hidden-scrollbar">
                                            {typeWriterAiText || "Generating AI analysis..."}
                                        </div>
                                    </div>

                                )}
                            </div>
                        </TabsContent>

                        {/* Request */}
                        <TabsContent value="request" className="flex-1 py-4">
                            {renderReqOrResTabsContent("request")}
                        </TabsContent>

                        {/* Response */}
                        <TabsContent value="response" className="flex-1 py-4">
                            {renderReqOrResTabsContent("response")}
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
};

export default AnalysisResults;