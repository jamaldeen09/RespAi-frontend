"use client"
import { AuthCredentials, useLoginMutation } from "@/redux/apis/authApi";
import { ApiActionData } from "./useAuth";
import { callToast } from "@/providers/SonnerProvider";
import { useEffect } from "react";
import { AuthState, initAuthState } from "@/redux/slices/userSlice";
import useRedux from "./useRedux";
import { ApiResponse } from "@/redux/apiSettings";
import { useNavigationHook } from "./useNavigationHook";

const useLogin = (): ApiActionData<AuthCredentials["login"]> => {
    // ** Custom hook to easily access dispatch ** \\
    const { dispatch, mutateTrigger } = useRedux();

    // ** Router ** \\
    const { router } = useNavigationHook();

    // ** Rtk query hook for login ** \\
    const [login, {
        isLoading,
        isSuccess,
        isError,
        error,
        data,
    }] = useLoginMutation();

    // ** Custom Function to handle login ** \\
    const handleLogin = async (values: AuthCredentials["login"]) => {
        try {
            await login(values);
        } catch (err) {
            console.error(`Error occured in "handleLogout" function in file "useAuth.tsx": ${err}`);
            callToast("error", "An unexpected error occured while trying to login to your account, please try again shortly");
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
        router,
    ]);
    return {
        createEffect: handleLogin,
        isLoading,
        isError,
        error,
        isSuccess,
        data,
    }
};

export default useLogin;