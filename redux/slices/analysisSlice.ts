import { UnionType } from './../apis/analysisApi';
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// ** Schema ** \\
export interface AnalysisSchema {
    response: {
        body: unknown;
        headers: { key: string; value: UnionType }[];
        status: number;
    };
    request: {
        headers: { key: string; value: UnionType }[];
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        endpoint: string;
    };
    aiAnalysis?: string;
    info?: "insufficient_credits" | "analysis_error" | "ai_disabled";
    cost: number;
    credits?: number;
};

export interface SingleAnalysisDetailSchema {
    _id: string;
    request: {
        endpoint: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        headers: { key: string; value: UnionType }[];
        queryParams: { key: string; value: UnionType }[];
        body: string | null;
    },
    response: {
        status: number;
        headers: { key: string; value: UnionType }[];
        body: string | null;
    }
    aiAnalysis?: string;
    cost: number;
    createdAt: string;
    updatedAt: string;
};


export interface LazyLoadedAnalysisDetailData {
    _id: string;
    response: {
        status: number;
    };
    request: {
        endpoint: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    };
    aiAnalysis?: string;
    cost: number;
    createdAt: string;
    updatedAt: string;
};

export interface ControllerRenderPropsGeneric {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint: string;
    headers: {
        key?: string;
        value?: string;
    }[];
    queryParams: {
        key?: string;
        value?: string;
    }[];
    body?: string | undefined;
};

interface AnalysisSliceInitialState {
    analysis: AnalysisSchema | null;
    analysisHistory: LazyLoadedAnalysisDetailData[];
    singleAnalysisId: string;
    analysisBeingDeleted: string;
};

const initialState: AnalysisSliceInitialState = {
    analysis: null,
    analysisHistory: [],
    singleAnalysisId: "",
    analysisBeingDeleted: "",
};

// ** Slice ** \\
export const analysisSlice = createSlice({
    initialState,
    name: "analysis",
    reducers: {
        newAnalysisResult: (state, action: PayloadAction<AnalysisSchema>) => {
            if (!action.payload) return;
            state.analysis = action.payload;
        },
        clearAnalysisResult: (state) => {
            state.analysis = null;
        },
        initialBatchOfAnalysisResults: (state, action: PayloadAction<LazyLoadedAnalysisDetailData[]>) => {
            state.analysisHistory = action.payload
        },
        setSingleAnalysisId: (state, action: PayloadAction<string>) => {
            state.singleAnalysisId = action.payload;
        },
        setAnalysisBeingDeleted: (state, action: PayloadAction<string>) => {
            state.analysisBeingDeleted = action.payload;
        }
    }
});

export const {
    newAnalysisResult,
    clearAnalysisResult,
    initialBatchOfAnalysisResults,
    setSingleAnalysisId,
    setAnalysisBeingDeleted,
} = analysisSlice.actions;

