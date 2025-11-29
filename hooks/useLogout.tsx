"use client"
import { authApi, useLogoutMutation } from "@/redux/apis/authApi";
import { ApiActionData } from "./useAuth";
import { callToast } from "@/providers/SonnerProvider";
import { useEffect } from "react";
import useRedux from "./useRedux";
import { logout } from "@/redux/slices/userSlice";
import { ApiResponse } from "@/redux/apiSettings";
import { profileApi } from "@/redux/apis/profileApi";
import { analysisApi } from "@/redux/apis/analysisApi";

const useLogout = (): ApiActionData => {
    // ** Custom hook to easily access dispatch ** \\
    const { dispatch, mutateTrigger } = useRedux();

    // ** Rtk query hook for logout ** \\
    const [logUserOut,
        {
            isLoading,
            isSuccess,
            isError,
            error,
            data,
        }
    ] = useLogoutMutation();

    // ** Custom Function to handle logout ** \\
    const handleLogout = async () => {
        try {
            const res = await logUserOut().unwrap();

            dispatch(logout());
            dispatch(profileApi.util.resetApiState());
            dispatch(analysisApi.util.resetApiState());

            mutateTrigger("logoutConfirmation", false);
            callToast("success", res.message);
        } catch (err: unknown) {
            const msg =
                (err as { data: ApiResponse | null })?.data?.message || "An unexpected error occurred while logging out.";
            callToast("error", msg);
        }
    };

    return {
        createEffect: handleLogout,
        isLoading,
        isError,
        error,
        isSuccess,
        data,
    }
};

export default useLogout;