import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Code, Brain, Calendar, X } from 'lucide-react';
import { SingleAnalysisDetailSchema } from '@/redux/slices/analysisSlice';
import { UnionType, useLazyGetSingleAnalysisDetailsQuery } from '@/redux/apis/analysisApi';
import { CopyButton } from '../reusable/CopyButton';
import { useAppSelector } from '@/redux/store';
import { ApiResponse } from '@/redux/apiSettings';
import { callToast } from '@/providers/SonnerProvider';
import { Button } from '../ui/button';
import useRedux from '@/hooks/useRedux';
import { Spinner } from '../ui/spinner';
import { getHttpStatusCodeLabel } from '@/data/httpStatusCodes';

// ** Tab type ** \\
type AnalysisTab = 'request' | 'response' | "Ai Analysis";

// ** Empty State Component ** \\
const EmptyAnalysisState: React.FC<{ error?: string }> = ({ error }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
                {error ? 'Failed to Load Analysis' : 'No Analysis Data'}
            </h3>
            <p className="text-muted-foreground max-w-md">
                {error || 'Unable to load the analysis details.'}
            </p>
        </div>
    );
};

interface KeyValueDisplayProps {
    data: Array<{ key: string; value: UnionType }>;
    title: string;
}

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = React.memo(({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground capitalize">{title}</h4>
                <p className="text-sm text-muted-foreground">No {title.toLowerCase()}</p>
            </div>
        );
    }

    return (
        <div className="mb-6 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3 capitalize">{title}</h4>
            <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Header */}
                <div className="flex bg-muted border-b border-border">
                    <div className="flex-1 px-4 py-3 font-medium text-foreground text-sm">Key</div>
                    <div className="flex-1 px-4 py-3 font-medium text-foreground text-sm">Value</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex">
                            <div className="flex-1 px-4 py-3 text-foreground text-xs font-medium">
                                {item.key}
                            </div>
                            <div className="flex-1 px-4 py-3">
                                <span className="text-foreground break-all text-xs">
                                    {String(item.value)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});


// ** JSON Body Display *8 \\
interface JsonBodyDisplayProps {
    body: string | null;
    title: string;
}

const JsonBodyDisplay: React.FC<JsonBodyDisplayProps> = React.memo(({ body, title }) => {
    const formatJSON = useCallback((data: string | null): string => {
        if (!data) return 'No data';
        try {
            const parsed = JSON.parse(data);
            return JSON.stringify(parsed, null, 5);
        } catch {
            return data;
        }
    }, []);

    if (!body) {
        return (
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground">No body provided</p>
            </div>
        );
    }

    const formattedBody = formatJSON(body);

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">{title}</h4>
            <div className="relative element-scrollable-hidden-scrollbar">
                <pre style={{ fontFamily: "poppins" }} className="p-4 rounded bg-card border border-border text-sm text-foreground overflow-x-auto max-h-96
                element-scrollable-hidden-scrollbar">
                    {formattedBody}
                </pre>
                <div className="absolute top-3 right-3">
                    <CopyButton text={formattedBody} />
                </div>
            </div>
        </div>
    );
});

// ** Helper function to format timestamp *8 \\
const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const SavedAnalysis: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AnalysisTab>('request');
    const [analysis, setAnalysis] = useState<SingleAnalysisDetailSchema | null>(null);
    const singleAnalysisId = useAppSelector((state) => state.analysis.singleAnalysisId);
    const {
        mutateTrigger
    } = useRedux();

    // ** Rtk query hook ** \\
    const [
        getAnalysisDetail,
        { isLoading, isError, error, data, isSuccess, isFetching }
    ] = useLazyGetSingleAnalysisDetailsQuery();

    useEffect(() => console.log("ANALYSIS: ", analysis), [analysis])

    // ** UseEffect to trigger fetch for single analysis if singleAnalysisId change ** \\
    useEffect(() => {
        let isComponentMounted = true;
        if (isComponentMounted && (singleAnalysisId && singleAnalysisId.trim() !== "")) {
            getAnalysisDetail({ analysisId: singleAnalysisId })
        };

        return () => { isComponentMounted = false }
    }, [singleAnalysisId])

    // ** UseEffect to handle successfull and error cases in analysis detail fetch ** \\
    useEffect(() => {
        let isComponentMounted = true;

        if (isSuccess) {
            const expectedDataFormat = data.data as { analysisDetails: SingleAnalysisDetailSchema }
            if (isComponentMounted) setAnalysis(expectedDataFormat.analysisDetails)
        }

        if (isError && error && "data" in error) {
            const expectedErrorMessage = (error.data as ApiResponse).message;
            if (isComponentMounted) callToast("error", expectedErrorMessage);
        };
        return () => { isComponentMounted = false }
    }, [
        isSuccess,
        isError,
        error,
        data,
        callToast
    ])

    // ** Load state determiner ** \\
    const isGettingSavedAnalysis = isLoading || isFetching;
    const shouldShowError =
        !isGettingSavedAnalysis &&
        (error || isError || !analysis);

    // ** Loading state ** \\
    if (isGettingSavedAnalysis || (!analysis && !error && !isError)) {
        return (
            <div className={`h-full md:h-[80vh] flex justify-center items-center`}>
                <div className="flex flex-col justify-center items-center text-center gap-2">
                    <Spinner className="text-primary size-6" />
                    <p className="text-primary">Loading...</p>

                    <Button
                        onClick={() => mutateTrigger("savedAnalysis", false)}
                        size="sm"
                        className="bg-primary text-black cursor-pointer hover:bg-primary/90 mt-6 md:hidden"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    if (shouldShowError) {
        return (
            <div className="p-6">
                <EmptyAnalysisState error="Failed to load analysis data." />
            </div>
        );
    }
    return (
        <div className={`h-full ${"md:max-h-[80vh]"
            } overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className="shrink-0 p-6 border-b border-border">
                <div className="flex items-center justify-between md:block md:text-center mb-4">
                    <h2 className="text-2xl font-bold text-primary">
                        Analysis Details
                    </h2>

                    <Button
                        variant="outline"
                        className="cursor-pointer md:hidden"
                        size="icon-sm"
                        onClick={() => mutateTrigger("savedAnalysis", false)}
                    >
                        <X />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 border-b border-border">
                <div className="flex">
                    {(['request', 'response', 'Ai Analysis'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 flex-1 transition-colors ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${"overflow-y-auto md:overflow-y-auto"
                } element-scrollable-hidden-scrollbar`}>
                <div className="p-6">
                    {activeTab === 'request' && (
                        <div className="space-y-6">
                            <div className="p-4 rounded border border-border bg-card">
                                <div className="flex items-center gap-3 ">
                                    <strong className="text-primary">{analysis?.request?.method || "Unknown"}</strong>
                                    <span className="text-sm text-foreground break-all flex-1">
                                        {
                                            (analysis?.request?.queryParams || []).length > 0 ?
                                                (analysis?.request?.endpoint || "").split("?").join("") :
                                                (analysis?.request?.endpoint || "")
                                        }
                                    </span>
                                </div>
                            </div>
                            <KeyValueDisplay data={(analysis?.request?.headers || [])} title="Headers" />
                            <KeyValueDisplay data={(analysis?.request?.queryParams || [])} title="Query Parameters" />
                            <JsonBodyDisplay body={(analysis?.request?.body || "")} title="Request Body" />
                        </div>
                    )}

                    {activeTab === 'response' && (
                        <div className="space-y-6">
                            <div className="p-4 rounded border border-border bg-card">
                                <div className="flex items-center gap-3">
                                    <strong className={`text-sm ${(analysis?.response?.status || 0) >= 200 && (analysis?.response?.status || 0) < 300 ? "text-primary" : "text-red-600"}`}>
                                        {(analysis?.response?.status || 0)}
                                        {getHttpStatusCodeLabel((analysis?.response?.status)?.toString() || "Unknown")}
                                    </strong>
                                    {(analysis?.response?.headers || []).length >= 1 && (
                                        <span className="text-xs text-muted-foreground">
                                            {`(${(analysis?.response?.headers || []).length} ${(analysis?.response?.headers || []).length === 1 ? "header" : "headers"})`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <KeyValueDisplay data={analysis?.response?.headers || []} title="Headers" />
                            <JsonBodyDisplay body={analysis?.response?.body || ""} title="Response Body" />
                        </div>
                    )}

                    {activeTab === "Ai Analysis" && (
                        <div className="space-y-6">
                            <div className="p-6 rounded border border-border bg-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <Brain className="w-5 h-5 text-primary" />
                                    <h4 className="font-medium text-primary">AI Analysis</h4>
                                </div>
                                <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">
                                    {analysis?.aiAnalysis || "None"}
                                </p>
                                {analysis?.aiAnalysis && (
                                    <div className="mt-4">
                                        <CopyButton text={analysis?.aiAnalysis || ""} />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded border border-border bg-card">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-foreground">Cost</span>
                                    </div>
                                    <p className="text-sm text-foreground">
                                        {
                                            analysis?.cost
                                        }{" "}
                                        {analysis?.cost && analysis?.cost === 1 ? "credit" : "credits"}
                                    </p>
                                </div>

                                <div className="p-4 rounded border border-border bg-card">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-foreground">Created</span>
                                    </div>
                                    <p className="text-sm text-foreground">{formatTimestamp(analysis?.createdAt || new Date().toISOString())}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedAnalysis;