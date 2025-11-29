"use client"
import { ApiActionData } from "./useAuth";
import useRedux from "./useRedux";
import { callToast } from "@/providers/SonnerProvider";
import { disableOrEnableAiAnalysisReducer } from "@/redux/slices/userSlice";
import { useEffect } from "react";
import { ApiResponse } from "@/redux/apiSettings";
import { useEnableOrDisableAiAnalysisMutation } from "@/redux/apis/analysisApi";
import { clearAnalysisResult } from "@/redux/slices/analysisSlice";

const useDisableOrEnableAiAnalysis = (): ApiActionData => {
    // ** Custom hook to easily access dispatch ** \\
    const { dispatch } = useRedux();

    // ** Rtk query hook ** \\
    const [enableOrDisableAiAnalysis, {
        isLoading,
        isSuccess,
        isError,
        error,
        data,
    }] = useEnableOrDisableAiAnalysisMutation();

    // ** Function to trigger action ** \\
    const handleEnableOrDisableAiAnalysis = async () => {
        try {
            await enableOrDisableAiAnalysis();
        } catch (err) {
            console.error(`Error occured in "handleEnableOrDisableAiAnalysis controller" in file "useDisableOrEnableAiAnalysisMutation": ${err}`);
            callToast("error", "An unexpected error occured while trying to disable/enable ai analysis, please try again shortly")
        }
    };

    //    ** Function to handle successfull cases ** \\
    const uponSuccessfulAction = () => {
        if (!isSuccess) return;

        callToast("success", data.message);
        dispatch(disableOrEnableAiAnalysisReducer());
        dispatch(clearAnalysisResult());
    };

    // ** UseEffect to track error and successful cases and perform specific actions based on if api fetch is successfull or failed ** \\
    useEffect(() => {
        let isComponentMounted = true;
        if (isSuccess) {
            if (isComponentMounted) {
                uponSuccessfulAction();
            }
        }

        if (isError && error && "data" in error) {
            const expectedErrorFormat = error.data as ApiResponse;
            callToast("error", expectedErrorFormat.message);
        }
    }, [
        isSuccess,
        isError,
        error,
        data,
        callToast,
    ]);

    return {
        createEffect: handleEnableOrDisableAiAnalysis,
        isLoading,
        isSuccess,
        isError,
        error,
        data,
    }
};

export default useDisableOrEnableAiAnalysis;