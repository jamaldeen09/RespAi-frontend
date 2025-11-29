"use client"
import { HTMLInputTypeAttribute } from "react";
import { AuthState } from "@/redux/slices/userSlice";
import { ApiResponse } from "@/redux/apiSettings";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useAppSelector } from "@/redux/store";

export interface FormFieldData<T> {
    name: T;
    inputData: {
        className?: string;
        placeholder: string;
        type: HTMLInputTypeAttribute;
    },
}
// ** Array to hold custom classes for input fields in for field ** \\
const inputClassNames = "rounded-lg h-11 px-4 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"

// ** Form field data ** \\

// ** Login ** \\
export const loginFormFieldData: FormFieldData<"email" | "password">[] = [
    {
        name: "email",
        inputData: {
            className: inputClassNames,
            placeholder: "Email address",
            type: "email",
        }
    },

    {
        name: "password",
        inputData: {
            className: inputClassNames,
            placeholder: "Password",
            type: "password",
        }
    },
];

// ** Signup ** \\
export const signupFormFieldData: FormFieldData<
    "firstname" | "email"
    | "password" | "lastname"
>[] = [
        {
            name: "firstname",
            inputData: {
                className: inputClassNames,
                placeholder: "Firstname",
                type: "text",
            }
        },
        {
            name: "lastname",
            inputData: {
                className: inputClassNames,
                placeholder: "Lastname",
                type: "text",
            }
        },
        ...loginFormFieldData,
    ];

// ** Custom interface to define data provided by rtk query ** \\
export interface ApiActionData <T = unknown> {
    createEffect: (values: T) => void; 
    isLoading: boolean;
    isError: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
    data: ApiResponse | undefined;
    isSuccess: boolean;
    isFetching?: boolean;
    refetch?: unknown;
}

// ** Return type of the custom hook defined ** \\
interface UseAuthReturnType {
    extractValidationErrors: (errorObject: FetchBaseQueryError | SerializedError | undefined) => { field: string; message: string; }[];
    authState: AuthState;
};

// ** Custom hook to make auth actions easier and maintaneable *8 \\
export const useAuth = (): UseAuthReturnType => {

    // ** Users auth state ** \\
    const authState = useAppSelector((state) => state.user.authState);

    // ** Custom function to extract validation errors from an rtk query object ** \\
    const extractValidationErrors = (errorObject: FetchBaseQueryError | SerializedError | undefined): {
        field: string;
        message: string;
    }[] => {
        if (!errorObject || !("data" in errorObject)) return [];

        // ** Confirm if initial error exists ** \\
        const expectedErrorFormat = ((errorObject?.data as ApiResponse)?.error);
        if (!expectedErrorFormat) return [];

        // ** Return errors ** \\
        return (expectedErrorFormat?.details as { errors: { field: string; message: string }[] })?.errors || [];
    };

    return {
        extractValidationErrors,
        authState,
    }
};

export default useAuth;