"use client"
import useRedux from "@/hooks/useRedux";
import { useGetProfileQuery } from "@/redux/apis/profileApi";
import { ApiResponse } from "@/redux/apiSettings";
import { initProfile, Profile } from "@/redux/slices/userSlice";
import React from "react";
import { callToast } from "./SonnerProvider";
import Loading from "@/components/reusable/Loading";

const ProfileProvider = React.memo(({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    const { dispatch } = useRedux();

    // ** Rtk query hook for profile fetching ** \\
    const {
        isLoading,
        isFetching,
        isError,
        error,
        isSuccess,
        data,
    } = useGetProfileQuery(
        undefined,
        { refetchOnMountOrArgChange: true }
    );

    // ** UseEffect to handle both successfull and failed cases ** \\
    React.useEffect(() => {
        let isComponentMounted = true;
        if (isSuccess) {
            // ** Extract profile data from data object ** \\
            const expectedDataFormat = data.data as { profile: Profile };
            if (isComponentMounted) dispatch(initProfile(expectedDataFormat.profile));
        }

        if (isError && error && "data" in error) {
            const expectedErrorFormat = error.data as ApiResponse;


            if (isComponentMounted) callToast("error", expectedErrorFormat.message);

        }
        return () => { isComponentMounted = false }
    }, [
        isSuccess,
        isError,
        error,
        data,
        dispatch,
        callToast
    ]);

    if (isLoading || isFetching)
        return <Loading />;

    if (isSuccess && (isLoading || isFetching))
        return <Loading />

    return <>{children}</>
});

export default ProfileProvider;