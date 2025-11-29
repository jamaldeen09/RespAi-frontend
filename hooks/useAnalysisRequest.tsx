"use client";
import { NewAnalysisData, useNewAnalysisMutation } from "@/redux/apis/analysisApi";
import { ApiResponse } from "@/redux/apiSettings";
import useRedux from "./useRedux";
import { AnalysisSchema, clearAnalysisResult, newAnalysisResult } from "@/redux/slices/analysisSlice";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { callToast } from "@/providers/SonnerProvider";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { setCredits } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";


// ** Return type of the custom hook defined ** \\
interface UseAnalysisReturnType {
  validateUrl: (url: string) => { isValid: boolean; error?: string };
  failedAnalysisUi: (
    title: string,
    description?: string,
    validationErrors?: Array<{ field: string; message: string }>
  ) => React.ReactElement;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: ApiResponse | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  createEffect: (values: NewAnalysisData) => Promise<void>;
};

const useAnalysisRequest = (): UseAnalysisReturnType => {
  /** 
   @param {string} url - The url being validated
   @returns {{ isValid: boolean; error: string | undefined; }}
*/
  const validateUrl = (url: string): { isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return {
        isValid: false,
        error: "Endpoint URL is required"
      };
    }
    try {
      let urlToValidate = url;
      if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
        urlToValidate = 'https://' + urlToValidate;
      }

      const parsedUrl = new URL(urlToValidate);

      // ** Basic URL structure validation ** \\
      if (!parsedUrl.hostname) {
        return {
          isValid: false,
          error: "Invalid URL: Missing hostname"
        };
      }

      // ** Allow localhost and IP addresses for development ** \\
      if (parsedUrl.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(parsedUrl.hostname)) {
        return { isValid: true };
      }

      // ** Basic domain validation (you can make this stricter if needed) ** \\
      if (!parsedUrl.hostname.includes('.') && parsedUrl.hostname !== 'localhost') {
        return { isValid: false, error: "Invalid URL: Please include a valid domain" };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: "Invalid URL format. Please use a valid URL like: https://api.example.com/endpoint"
      };
    }
  };

  function failedAnalysisUi(
    title: string = "Analysis Failed",
    description?: string,
    validationErrors?: Array<{ field: string; message: string }>
  ) {
    const hasValidationErrors = validationErrors && validationErrors.length > 0;
    return (
      <div className="w-full h-full flex justify-center items-center p-6">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <X className="h-8 w-8 text-destructive" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>

          {/* Validation Errors */}
          {hasValidationErrors ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                Please fix the following errors:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20 text-sm"
                  >
                    <div className="w-2 h-2 bg-destructive rounded-full mt-1.5 shrink-0" />
                    <div className="text-left">
                      <span className="font-medium text-foreground">{error.field}:</span>
                      <span className="text-destructive ml-1">{error.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Generic Error Description */
            description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )
          )}

          {/* Action Suggestion */}
          <p className="text-xs text-muted-foreground mt-4">
            {hasValidationErrors
              ? "Fix the errors above and try again"
              : "Please check your request and try again"
            }
          </p>
        </div>
      </div>
    );
  }

  // ** Custom hook for easy access of dispatch ** \\
  const { dispatch } = useRedux();
  const { credits } = useAppSelector((state) => state.user.profile)

  // ** Rtk query hook ** \\
  const [newAnalysis, {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  }] = useNewAnalysisMutation();
  

  // ** Function to extract data upon successfull analysis ** \\
  const extractAnalysisData = (data: ApiResponse | undefined) => {
    // ** Add null checks ** \\
    if (!data || data === undefined || data === null) return;

    const expectedDataFormat = data?.data as AnalysisSchema
    // ** Update the users credits ** \\
    dispatch(setCredits(expectedDataFormat.credits ? expectedDataFormat.credits : credits));

    // ** Store new data ** \\
    dispatch(newAnalysisResult(expectedDataFormat));
  };

  // ** Function to handle errors upon failed analysis ** \\
  const handleErrorGracefully = (error: FetchBaseQueryError | SerializedError | undefined) => {
    if (!error || error === undefined || error === null || !("data" in error)) return;

    const extractedErrorData = error?.data as ApiResponse | undefined;
    if (!extractedErrorData) return;

    const expectedErrorFormat = error.data as ApiResponse;
    callToast("error", expectedErrorFormat.message);
  };

  // ** Function to trigger api fetch ** \\
  const handleNewAnalysis = async (values: NewAnalysisData) => {
    try {
      const urlValidation = validateUrl(values.endpoint);
      if (!urlValidation.isValid) {
        callToast("error", "Invalid URL format");
        return;
      };

      const filteredData = {
        ...values,
        headers: values.headers.filter(header =>
          header.key?.trim() && ((typeof header.value === "string") ? header.value?.trim() : header.value)
        ),
        queryParams: values.queryParams.filter(param =>
          param.key?.trim() && ((typeof param.value === "string") ? param.value?.trim() : param.value)
        )
      };


      // ** Clear previous analysis result ** \\
      dispatch(clearAnalysisResult());
      await newAnalysis(filteredData);
    } catch (err) {
      console.error(`Error occured in "handleNewAnalysis" in file "useAnalysisRequest.tsx": ${err}`);
      callToast("error", "An unexpected error occured while trying to analyze your requested endpoint, please try again shortly")
    };
  }

  // ** UseEffect to handle both errors and successfull cases ** \\
  useEffect(() => {
    let isComponentMounted = true;

    if (isSuccess) {
      if (isComponentMounted) extractAnalysisData(data);
    };

    if (isError && error && "data" in error) {
      if (isComponentMounted) handleErrorGracefully(error);
    }
    return () => {
      isComponentMounted = false
    }
  }, [
    isSuccess,
    isError,
    error,
    data,
  ])
  return {
    validateUrl,
    failedAnalysisUi,
    isLoading,
    isError,
    error,
    isSuccess,
    createEffect: handleNewAnalysis,
    data,
  }
};

export default useAnalysisRequest;
