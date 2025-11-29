"use client"
import { useEditProfileMutation } from "@/redux/apis/profileApi";
import { useEffect } from "react";
import useRedux from "./useRedux";
import { callToast } from "@/providers/SonnerProvider";
import { editUsersProfile } from "@/redux/slices/userSlice";
import { ApiResponse } from "@/redux/apiSettings";
import { ApiActionData } from "./useAuth";

const useEditProfile = (
    watchedValues: {
        firstname?: string;
        lastname?: string;
        avatar?: string;
    },
): ApiActionData<{
    firstname?: string;
    lastname?: string;
    avatar?: string;
}> => {
    // ** Custom hook to easily access dispatch ** \\
    const { dispatch, mutateTrigger } = useRedux();

    // ** Rtk query hook for logout ** \\
    const [editProfile,
        {
            isLoading,
            isSuccess,
            isError,
            error,
            data,
        }
    ] = useEditProfileMutation();

    // ** Custom Function to handle logout ** \\
    const handleEditProfile = async (values: {
        firstname?: string;
        lastname?: string;
        avatar?: string;
    }) => {
        try {
            await editProfile(values);
        } catch (err) {
            console.error(`Error occured in "handleEditProfile" function in file "useEditProfile.tsx": ${err}`);
            callToast("error", "An unexpected error occured while trying to edit your profile, please try again shortly");
        }
    };

    // ** UseEffect to handle successfull and failure cases during profile editing process ** \\
    useEffect(() => {
        let isComponentMounted = true;

        // ** Successfull cases ** \\
        if (isSuccess) {
            if (isComponentMounted) {
                dispatch(editUsersProfile(watchedValues));
                mutateTrigger("editProfile", false);
                callToast("success", data.message);
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
        callToast,
        dispatch,
    ]);

    return {
        createEffect: handleEditProfile,
        isLoading,
        isError,
        error,
        isSuccess,
        data,
    }
};

export default useEditProfile;