"use client"
import Loading from "@/components/reusable/Loading";
import useAuth from "@/hooks/useAuth";
import { useNavigationHook } from "@/hooks/useNavigationHook";
import { useGetAuthStateQuery } from "@/redux/apis/authApi";
import React from "react";

const ProtectedPublicRoute = React.memo(({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  const { router, pathname } = useNavigationHook();
  const REDIRECT_PATH = '/dashboard';

  // ** Destructure the synchronous token check flag ** \\
  const { authState } = useAuth();
  const isOauthPage = pathname === "/oauth";
  const [isMounted, setIsMounted] = React.useState(false);

  // ** Trigger the request (RTK Query deduplication ensures only one request is sent) ** \\
  const { isLoading, isFetching } = useGetAuthStateQuery();
  const isPending = isLoading || isFetching;

  React.useEffect(() => {
    setIsMounted(true);

    // ** Finished checking AND the user IS authenticated ** \\
    if (!isPending && authState.isAuthenticated && isOauthPage) {
      router.push(REDIRECT_PATH);
    };

  }, [isPending, authState.isAuthenticated, router, REDIRECT_PATH]);


  // ** RENDER LOGIC: Hydration Guard and FOUC Check ** \\
  if (isPending) {
    if (!isMounted) {
      return (
        <Loading />
      );
    }

    return (
      <Loading />
    );
  }

  if (authState.isAuthenticated && isOauthPage)
    return (<Loading />);

  // ** Finished checking AND the user IS NOT authenticated ** \\
  return <>{children}</>;
});

export default ProtectedPublicRoute;