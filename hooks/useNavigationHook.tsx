"use client"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";

// ** Return type of the custom hook defined ** \\
export interface UseNavigationHookReturnType {
  router: AppRouterInstance;
  pathname: string;
  routeToPage: (page: string) => void;
  searchParams: ReadonlyURLSearchParams;
}

// ** Custom hook to return next js objects that helps in navigation etc.. ** \\
export const useNavigationHook = (): UseNavigationHookReturnType => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeToPage = (page: string) => router.push(page);


  return {
    router,
    pathname,
    routeToPage,
    searchParams,
  };
};


