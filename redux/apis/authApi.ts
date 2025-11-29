import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, baseQueryWithReauth } from "../apiSettings";


export interface AuthCredentials {
    signup: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
    };

    login: {
        email: string;
        password: string;
    };
};

// ** Api definition ** \\
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        signup: builder.mutation<ApiResponse, AuthCredentials["signup"]>({
            query: (body) => ({
                url: "/auth/signup",
                method: "POST",
                body,
            })
        }),
        login: builder.mutation<ApiResponse, AuthCredentials["login"]>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            })
        }),
        logout: builder.mutation<ApiResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),

        getAuthState: builder.query<ApiResponse, void>({
            query: () => "/auth/me"
        })
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetAuthStateQuery
} = authApi
