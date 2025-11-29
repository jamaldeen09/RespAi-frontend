import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
    error?: {
        code: string,
        statusCode: number,
        details?: unknown,
    };
};

export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        };

        if (refreshToken) {
            headers.set("x-refresh-token", refreshToken);
        };
        return headers;
    },
});

// ** Base query with automatic refresh on 401 **
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            const { logout } = await import("./slices/userSlice");
            api.dispatch(logout());
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "GET",
                headers: { "x-refresh-token": refreshToken },
            },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            const typedResult = (refreshResult.data as ApiResponse).data as { accessToken: string };
            localStorage.setItem("accessToken", typedResult.accessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            const { logout } = await import("./slices/userSlice");
            api.dispatch(logout());
        }
    }

    return result;
};