import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, baseQueryWithReauth } from "../apiSettings";
import { AnalysisSchema } from "../slices/analysisSlice";

export type UnionType = string | number | boolean | object | any[] | null | undefined;
export interface NewAnalysisData {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint: string;
    headers: { key?: string; value?: UnionType }[];
    queryParams: { key?: string; value?: UnionType }[];
    body?: string;
};

export interface ExpectedPaginationData {
    page?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    status?: string;
    searchQuery?: string;
}

export interface PaginationData<T> {
    offset: number;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    items: T;
};

// ** Api definition ** \\
export const analysisApi = createApi({
    reducerPath: "analysisApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        newAnalysis: builder.mutation<ApiResponse, NewAnalysisData>({
            query: (body) => ({
                url: "/response/analysis",
                method: "POST",
                body,
            })
        }),

        saveAnalysis: builder.mutation<ApiResponse, AnalysisSchema>({
            query: (body) => ({
                url: "/response/analysis/save",
                method: "POST",
                body
            })
        }),

        fetchSavedAnalysisDetails: builder.query<ApiResponse, ExpectedPaginationData>({
            query: (body) => {
                const baseUrl = "/response/analysis";
                const params = new URLSearchParams();

                if (body.page) params.set("page", body.page);
                if (body.method) params.set("method", body.method);
                if (body.status) params.set("status", body.status);
                if (body.searchQuery) params.set("searchQuery", body.searchQuery);

                const queryString = params.toString();

                return queryString
                    ? `${baseUrl}?${queryString}`
                    : baseUrl;
            }

        }),

        getSingleAnalysisDetails: builder.query<ApiResponse, { analysisId: string }>({
            query: (body) => `/response/analysis/${body.analysisId}`
        }),

        deleteAnalysisDetails: builder.mutation<ApiResponse, { analysisId: string }>({
            query: (body) => ({
                url: `/response/analysis/${body.analysisId}`,
                method: "DELETE"
            })
        }),

        enableOrDisableAiAnalysis: builder.mutation<ApiResponse, void>({
            query: () => ({
                url: "/response/analysis/ai",
                method: "PATCH"
            })
        })
    }),
});

export const {
    useNewAnalysisMutation,
    useSaveAnalysisMutation,
    useLazyFetchSavedAnalysisDetailsQuery,
    useLazyGetSingleAnalysisDetailsQuery,
    useDeleteAnalysisDetailsMutation,
    useEnableOrDisableAiAnalysisMutation
} = analysisApi