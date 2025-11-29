"use client"
import { callToast } from "@/providers/SonnerProvider";
import { AuthCredentials, useSignupMutation } from "@/redux/apis/authApi";
import { ApiResponse } from "@/redux/apiSettings";
import { AuthState, initAuthState } from "@/redux/slices/userSlice";
import { useEffect } from "react";
import useRedux from "./useRedux";
import { ApiActionData } from "./useAuth";
import { useNavigationHook } from "./useNavigationHook";


const useSignup = (): ApiActionData<AuthCredentials["signup"]> => {
    // ** Custom hook to easily access dispatch ** \\
    const { dispatch, mutateTrigger } = useRedux();

    // ** Router ** \\
    const { router } = useNavigationHook();

    // ** Rtk query hook for sign up/registration ** \\
    const [signup, {
        isLoading,
        isSuccess,
        isError,
        error,
        data,
    }] = useSignupMutation();

    // ** Custom Function to handle signup ** \\
    const handleSignup = async (values: AuthCredentials["signup"]) => {
        try {
            await signup(values);
        } catch (err) {
            console.error(`Error occured in "handleSignup" function in file "useAuth.tsx": ${err}`);
            callToast("error", "An unexpected error occured while trying to create your account, please try again shortly");
        }
    };

    useEffect(() => {
        let isComponentMounted = true;

        // ** Successfull cases ** \\
        if (isSuccess) {
            const expectedDataFormat = data.data as {
                auth: Omit<AuthState, "isAuthenticated">;
                tokens: { accessToken: string; refreshToken: string };
            };

            if (isComponentMounted) {
                dispatch(initAuthState({
                    authState: expectedDataFormat.auth,
                    tokens: expectedDataFormat.tokens,
                }));
                router.push("/dashboard");
                mutateTrigger("auth", false);
            }
        };

        // ** Failure cases ** \\
        if (isError && error && "data" in error) {
            const expectedErrorFormat = error.data as ApiResponse;
            const errorMessage: string = expectedErrorFormat.message;

            if (isComponentMounted) {
                callToast("error", errorMessage);
            }
        };

        // ** Cleanup function ** \\
        return () => { isComponentMounted = false }
    }, [
        isSuccess,
        isError,
        error,
        data,
        callToast,
        dispatch,
    ]);

    return {
        createEffect: handleSignup,
        isLoading,
        isError,
        error,
        isSuccess,
        data,
    }
};

export default useSignup;