"use client"
import { Spinner } from "@/components/ui/spinner";
import { useNavigationHook } from "@/hooks/useNavigationHook";
import useRedux from "@/hooks/useRedux";
import { callToast } from "@/providers/SonnerProvider";
import { initAuthState } from "@/redux/slices/userSlice";
import React, { useEffect } from "react";

const page = (): React.ReactElement => {
    // ** Custom hook to easily access dispatch ** \\
    const { dispatch } = useRedux();
    const { router, searchParams } = useNavigationHook();

    useEffect(() => {
        let isComponentMounted = true;

        // ** Extracted data from url ** \\
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userId = searchParams.get('userId');
        const fullname = searchParams.get('fullname');
        if (accessToken && refreshToken && userId && fullname) {
            if (isComponentMounted) {
                const decodedData = {
                    accessToken: decodeURIComponent(accessToken),
                    refreshToken: decodeURIComponent(refreshToken),
                    fullname: decodeURIComponent(fullname),
                    userId: decodeURIComponent(userId),
                };

                dispatch(initAuthState({
                    authState: {
                        userId: decodedData.userId,
                        fullname: decodedData.fullname
                    },
                    tokens: {
                        accessToken: decodedData.accessToken,
                        refreshToken: decodedData.refreshToken
                    }
                }));
            }
        } else {
            router.push('/');
            callToast("error", "Missing tokens");
        }

        // ** Clean up function ** \\
        return () => { isComponentMounted = false }
    }, [searchParams, dispatch, router, callToast]);
    return (
        <div className="flex justify-center items-center bg-background h-screen">
            <div className="flex flex-col justify-center items-center gap-2">
                <Spinner className="size-7 text-primary" />
                <p className="text-center text-sm text-primary">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
};

export default page;