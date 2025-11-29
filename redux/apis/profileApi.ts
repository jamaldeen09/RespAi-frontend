import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, baseQueryWithReauth } from "../apiSettings";


export interface UserProfile {
    _id: string;
    fullname: string;
    email: string;
    credits: number;
    plan: "starter" | "pro" | "enterprise";
    role: "creator" | "admin" | "user";
    createdAt: string,
    updatedAt: string,
}


// ** Api definition ** \\
export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getProfile: builder.query<ApiResponse, void>({
            query: () => "/profile/me"
        }),
        editProfile: builder.mutation<ApiResponse, {
            firstname?: string;
            lastname?: string;
            avatar?: string;
        }>({
            query: (body) => ({
                url: "/profile/me",
                method: "PATCH",
                body,
            })
        })
    }),
});

export const {
    useGetProfileQuery,
    useEditProfileMutation,
} = profileApi