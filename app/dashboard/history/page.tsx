'use client';

import SidebarNavbar from '@/components/dashboard/SidebarNavbar';
import { SavedAnalysisCard } from '@/components/reusable/SavedAnalysisCard';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigationHook } from '@/hooks/useNavigationHook';
import { ExpectedPaginationData, PaginationData, useLazyFetchSavedAnalysisDetailsQuery } from '@/redux/apis/analysisApi';
import { initialBatchOfAnalysisResults, LazyLoadedAnalysisDetailData, setAnalysisBeingDeleted, setSingleAnalysisId } from '@/redux/slices/analysisSlice';
import { useAppSelector } from '@/redux/store';
import { Filter, X } from 'lucide-react';
import { useEffect, useRef, useState, useMemo, useContext } from 'react'; 
import { debounce, DebouncedFunc } from "lodash"
import { callToast } from '@/providers/SonnerProvider';
import { ApiResponse } from '@/redux/apiSettings';
import useRedux from '@/hooks/useRedux';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { PaginationContext } from '@/contexts/PaginationContext';
import { SavedAnalysisCardSkeleton } from '@/components/reusable/SavedAnalysisCardSkeleton';
import { httpStatusCodes } from '@/data/httpStatusCodes';

type MethodState = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined;
export default function HistoryPage() {
  // ** Storage for received analysis ** \\
  const { analysisHistory } = useAppSelector((state) => state.analysis);

  // ** Dispatch and mutate trigger** \\
  const {
    dispatch,
    mutateTrigger
  } = useRedux()

  // ** Router and search params and pathname ** \\
  const {
    searchParams,
    pathname,
    router,
  } = useNavigationHook();

  // ** State to store pagination data ** \\
  const [paginationData, setPaginationData] = useState<PaginationData<LazyLoadedAnalysisDetailData[]> | null>(null);

  // ** Filters ** \\
  const {
    filters,
    setFilters,
    method,
    setMethod,
    status,
    setStatus,
    searchQuery,
    setSearchQuery,
  } = useContext(PaginationContext)

  const mutateFilters = (args: ExpectedPaginationData) => {
    setFilters(prev => ({ ...prev, ...args }));
  };

  // ** Params being stored: page ** \\
  const page = searchParams.get("page") || "1";


  // ** Sanitizing filters ** \\
  useEffect(() => {
    const isHistoryOrProfilePage = pathname === "/dashboard/history" || pathname === "/dashboard/profile";
    if (!isHistoryOrProfilePage) return;

    // * New params ** \\
    const newParams = new URLSearchParams(searchParams.toString());

    // ** --- PAGE ----------------------------------------------------- ** \\
    // ** Invalid page handling ** \\
    const parsedPage = parseInt(page);
    if (!parsedPage || isNaN(parsedPage) || parsedPage < 1 || page === "1") {
      newParams.set("page", "1");
    }

    // ** --- METHOD --------------------------------------------------- ** \\
    const validMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

    // ** Checks for if method state is set to undefined and deletes params ** \\
    if (!method) {
      newParams.delete("method");
    }

    // ** Invalid method handling ** \\
    else if (!validMethods.includes(method)) {
      newParams.set("method", "GET");
    }

    // ** Replace method if valid ** \\
    else {
      newParams.set("method", method);
    }

    // ** --- STATUS --------------------------------------------------- ** \\
    const parsedStatus = parseInt(status);

    // ** Invalid status handling ** \\
    if (status && isNaN(parsedStatus)) {
      newParams.set("status", "200");
    }

    // ** Changes status in params if change has been sensed from state ** \\
    else if (status) {
      newParams.set("status", status);
    }

    // ** Checks for if status state is empty and deletes params ** \\
    else {
      newParams.delete("status");
    }

    // ** --- SEARCH QUERY --------------------------------------------- ** \\
    if (searchQuery) newParams.set("searchQuery", searchQuery);
    else newParams.delete("searchQuery");

    // ** Apply changes if different
    if (newParams.toString() !== searchParams.toString()) {
      router.replace(`?${newParams.toString()}`);
    }
  }, [page, method, status, searchQuery]);


  // ** Rtk query hook to get saved analysis lazily ** \\
  const [fetchSavedAnalysis, {
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    data,
  }] = useLazyFetchSavedAnalysisDetailsQuery();

  // ** Useful variables to show ui states (loading, error occured etc...) ** \\
  const isGettingSavedAnalysis = isFetching || isLoading;

  const hasError = isError || error;
  const isLoadingState = isGettingSavedAnalysis || (!paginationData && !hasError);

  // ** UseEffect to handle saved analysis fetch ** \\
  useEffect(() => {
    let isComponentMounted = true;

    if (isSuccess) {
      const expectedDataFormat = data.data as {
        paginationData: PaginationData<LazyLoadedAnalysisDetailData[]>
      };

      if (isComponentMounted) {
        setPaginationData(expectedDataFormat.paginationData);
        dispatch(initialBatchOfAnalysisResults(expectedDataFormat.paginationData.items));
      }
    }

    if (isError && error && "data" in error) {
      const extractedErrorMessage = (error.data as ApiResponse).message;
      if (isComponentMounted) callToast("error", extractedErrorMessage)
    }
    return () => { isComponentMounted = false }
  }, [
    isSuccess,
    isError,
    error,
    data,
    callToast
  ]);

  // ** UseEffect to add filters ** \\
  useEffect(() => {
    let isComponentMounted = true;

    if (page && !isNaN(parseInt(page))) {
      mutateFilters({ page });
    }

    if (method && ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      mutateFilters({ method });
    }

    if (searchQuery) {
      mutateFilters({ searchQuery })
    }

    if (status && !isNaN(parseInt(status))) {
      mutateFilters({ status })
    }
    return () => { isComponentMounted = false }
  }, [page, method, searchQuery, status]);


  // ** Ref to prevent re making the debounce function when this component re renders ** \\
  const fetchSavedAnalysisDebounceRef = useRef<DebouncedFunc<(args: ExpectedPaginationData) => void>>(
    debounce((args: ExpectedPaginationData) => {
      fetchSavedAnalysis(args);
    }, 300)
  );

  // ** Call function ** \\
  useEffect(() => {
    fetchSavedAnalysisDebounceRef.current.cancel()
    let isComponentMounted = true;

    if (isComponentMounted) {
      fetchSavedAnalysisDebounceRef.current({
        searchQuery,
        method,
        status,
        page
      });
    }
    return () => { isComponentMounted = false }
  }, [filters]);

  // ** Refs clean up ** \\
  useEffect(() => {
    return () => {
      fetchSavedAnalysisDebounceRef.current.cancel()
    };
  }, []);


  // ** Resets filters ** \\
  const resetFilters = () => {
    // ** Clear local UI state immediately ** \\
    setSearchQuery('');
    setMethod(undefined);
    setStatus('');
    setFilters({});

    // ** Wrap reset in set timeout to bypass race conditions ** \\
    setTimeout(() => {
      const freshParams = new URLSearchParams(searchParams.toString());
      freshParams.set("page", "1");
      freshParams.delete("searchQuery");
      freshParams.delete("method");
      freshParams.delete("status");

      router.replace(`?${freshParams.toString()}`);
    }, 0);
  }

  // ** ======= Pagination helpers ======== ** \\
  const getVisiblePages = (): number => {
    if (!paginationData) return 1;

    return paginationData.totalPages;
  };

  // ** ===== Determine if any user-applied filter is active ===== **\\
  const areFiltersActive = useMemo(() => {
    // ** Check page ** \\
    if (page && !isNaN(parseInt(page))) return true;

    // ** Check Search Query ** \\
    if (searchQuery && searchQuery.trim().length > 0) return true;

    // ** Check Method ** \\
    if (method) return true;

    // ** Check Status (must be a non-empty string) ** \\
    if (status && status.length > 0) return true;

    // ** If none of the filtering parameters are set, filters are not active. ** \\
    return false;
  }, [searchQuery, method, status,]);

  // ** Used to view an analysis ** \\
  const viewSingleAnalysis = (id: string) => {
    mutateTrigger("savedAnalysis", true);
    return dispatch(setSingleAnalysisId(id))
  };

  // ** Used to delete an analysis ** \\
  const deleteSingleAnalysis = (id: string) => {
    mutateTrigger("requestDeletionConfirmation", true);
    return dispatch(setAnalysisBeingDeleted(id))
  }
  return (
    <div className="min-h-screen relative w-full">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30" />

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 border border-border/20" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 max-w-7xl element-scrollable-hidden-scrollbar h-full overflow-hidden overflow-y-auto">
        <SidebarNavbar />

        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">History</h1>
          <p className="text-muted-foreground text-sm lg:text-lg">View and filter your saved API analyses.</p>
        </header>

        {/* Filter Toolbar */}
        <div className="mb-8 rounded-2xl  bg-card backdrop-blur-sm border border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm h-12 w-full rounded-xl border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Search by endpoint or ai analysis"
              />
            </div>

            {/* Method Dropdown */}
            <Select
              value={method || ""}
              onValueChange={(value) => setMethod(value as MethodState)}
            >
              {/* Add 'group' to the trigger to help position the icon */}
              <SelectTrigger className={`${method && "[&>svg]:hidden"} relative w-full md:w-40 border border-input bg-input text-foreground rounded-xl custom-select-trigger group`}>
                <SelectValue placeholder="Methods" />

                {/* Conditionally render the X icon if a value exists */}
                {method && (
                  <span
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMethod(undefined);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer opacity-50 hover:opacity-100 z-10
                  hover:bg-accent rounded-lg bg-transparent w-6 h-6 transition-all duration-200">
                    <X />
                  </span>
                )}
              </SelectTrigger>

              <SelectContent>
                {/* No "None" option needed here anymore */}
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                  <SelectItem value={m} key={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status dropdown */}
            <Select
              value={status || ""}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger className={`${status && "[&>svg]:hidden"} relative w-full md:w-40 border border-input bg-input text-foreground rounded-xl custom-select-trigger group`}>
                <SelectValue placeholder="Status code">
                  {status ? status : "Status code"}
                </SelectValue>

                {/* Conditionally render the X icon if a value exists */}
                {status && (
                  <span
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatus('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer opacity-50 hover:opacity-100 z-10
        hover:bg-accent rounded-lg bg-transparent w-6 h-6 transition-all duration-200">
                    <X />
                  </span>
                )}
              </SelectTrigger>

              <SelectContent>
                {httpStatusCodes.map((statusOption) => (
                  <SelectItem value={statusOption.value} key={statusOption.value}>
                    {statusOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ui states */}
        {hasError && !isGettingSavedAnalysis ? (
          <div
            className="flex justify-center items-center py-16  rounded-2xl"
          >
            {/* Content */}
            <Empty>
              <EmptyHeader className="text-center">
                <div className="flex justify-center ">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <X className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <EmptyTitle className="text-red-500 mt-4">
                  Something went wrong
                </EmptyTitle>
                <EmptyDescription className="text-muted-foreground">
                  An error occurred while loading your saved analyses.
                  Please try again shortly.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className="mt-6">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-xl"
                >
                  Retry
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : isLoadingState ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 9 }).map((_, i) => (<SavedAnalysisCardSkeleton key={i} />))}
          </div>
        ) : analysisHistory.length <= 0 ? (
          <div
            className="flex justify-center items-center py-16 overflow-hidden"
          >
            {/* Content */}
            {areFiltersActive ? (
              <Empty>
                <EmptyHeader className="text-center">
                  <EmptyMedia variant="icon">
                    <Filter className="w-8 h-8 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="text-foreground mt-4">
                    No matching analyses
                  </EmptyTitle>
                  <EmptyDescription className="text-muted-foreground">
                    We couldn't find any analyses that match your filter criteria. Try different search terms or filter values.
                  </EmptyDescription>
                </EmptyHeader>

                <EmptyContent className="mt-6 flex gap-2">
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent rounded-xl cursor-pointer"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <Empty>
                <EmptyHeader className="text-center">
                  <EmptyMedia variant="icon">
                    <X />
                  </EmptyMedia>
                  <EmptyTitle className="text-foreground mt-4">
                    No analysis history yet
                  </EmptyTitle>
                  <EmptyDescription className="text-muted-foreground">
                    Your saved API analyses will appear here. Start analyzing your endpoints to build your history.
                  </EmptyDescription>
                </EmptyHeader>

                <EmptyContent className="mt-6">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl cursor-pointer">
                    Run First Analysis
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {analysisHistory.map((savedAnalysis) => (
              <SavedAnalysisCard
                key={savedAnalysis._id}
                _id={savedAnalysis._id}
                response={savedAnalysis.response}
                request={savedAnalysis.request}
                aiAnalysis={savedAnalysis.aiAnalysis}
                createdAt={savedAnalysis.createdAt}
                updatedAt={savedAnalysis.updatedAt}
                cost={savedAnalysis.cost}
                onViewSavedAnalysisCard={() => viewSingleAnalysis(savedAnalysis._id)}
                onDelete={() => deleteSingleAnalysis(savedAnalysis._id)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center items-center">
          {isLoading || !paginationData || analysisHistory.length <= 0 ? null : (
            <Pagination>
              <PaginationContent className="flex items-center space-x-2">
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    className={`border border-input bg-input text-foreground rounded-xl transition-colors 
                      ${Math.max(parseInt(page), 1) > 1
                        ? 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                        : 'opacity-50 cursor-not-allowed hover:bg-input'
                      }`}
                    onClick={() => {
                      const numericPage = Math.max(parseInt(page), 1);
                      if (numericPage <= 1) return;

                      const updatedPage = numericPage - 1;
                      const freshParams = new URLSearchParams(searchParams.toString());
                      freshParams.set("page", updatedPage.toString());
                      router.replace(`?${freshParams.toString()}`);
                    }}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from({ length: getVisiblePages() }).map((_, i: number) => {
                  const currentPage = i + 1;
                  const numericPage = Math.max(parseInt(page), 1);
                  const isCurrentPageActive = currentPage === numericPage;

                  return (
                    <PaginationItem key={currentPage}>
                      <PaginationLink

                        onClick={() => {
                          const freshParams = new URLSearchParams(searchParams.toString());
                          freshParams.set("page", Math.max(currentPage, 1).toString());
                          router.replace(`?${freshParams.toString()}`);
                        }}
                        isActive={isCurrentPageActive}
                        className={`border rounded-xl transition-colors  
                     ${isCurrentPageActive ? "border-ring hover:bg-primary/90 text-primary-foreground bg-primary/90 hover:text-primary-foreground cursor-default" :
                            "border-input bg-input text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          }`}
                      >
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {/* Ellipsis if needed */}
                {paginationData.totalPages > 5 && Math.max(parseInt(page), 1) < paginationData.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis className="text-muted-foreground" />
                  </PaginationItem>
                )}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      const numericPage = Math.max(parseInt(page), 1);
                      if (numericPage >= paginationData.totalPages) return;

                      const updatedPage = numericPage + 1;
                      const freshParams = new URLSearchParams(searchParams.toString());
                      freshParams.set("page", updatedPage.toString());
                      router.replace(`?${freshParams.toString()}`);
                    }}
                    className={`border border-input bg-input text-foreground rounded-xl transition-colors 
                   ${Math.max(parseInt(page), 1) < Math.max(paginationData.totalPages, 1)
                        ? 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                        : 'opacity-50 cursor-not-allowed hover:bg-input'
                      }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
    </div>
  );
}