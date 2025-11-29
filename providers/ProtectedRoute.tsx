"use client"
import React from 'react';
import useAuth from '@/hooks/useAuth';
import { useGetAuthStateQuery } from '@/redux/apis/authApi';
import { useNavigationHook } from '@/hooks/useNavigationHook';
import Loading from '@/components/reusable/Loading';

const ProtectedRoute = ({ children }: {
    children: React.ReactNode
}) => {
    const { router } = useNavigationHook();

    // ** Destructure the new synchronous flag ** \\
    const { authState } = useAuth(); 

    // ** The result updates the isAuthenticated flag in your Redux store via extraReducer ** \\
    const { isLoading, isFetching } = useGetAuthStateQuery();

    // ** Combine all loading indicators ** \\
    const isPending = isLoading || isFetching;

    React.useEffect(() => {
        // ** Finished checking AND the user is NOT authenticated ** \\
 
        if (!isPending && !authState.isAuthenticated) {
            router.replace("/"); 
        }
    }, [isPending, authState.isAuthenticated, router]);

    // ** Still checking authentication status (blocks FOUC) ** \\
    if (isPending || !authState.isAuthenticated) {
        return (
            <Loading />
        )
    }

    // ** Finished checking AND the user is NOT authenticated ** \\
    if (!authState.isAuthenticated) {
        // ** Return loading/null while the redirect takes effect **
        return (
            <Loading />
        )
    }

    // ** Finished checking AND the user IS authenticated ** \\
    return <>{children}</>;
};

export default ProtectedRoute;