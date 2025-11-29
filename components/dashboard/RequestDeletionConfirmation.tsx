import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/store';
import useRedux from '@/hooks/useRedux';
import { useDeleteAnalysisDetailsMutation } from '@/redux/apis/analysisApi';
import { useContext, useEffect } from 'react';
import { callToast } from '@/providers/SonnerProvider';
import { ApiResponse } from '@/redux/apiSettings';
import { PaginationContext } from '@/contexts/PaginationContext';
import { useNavigationHook } from '@/hooks/useNavigationHook';
import { Spinner } from '../ui/spinner';

const RequestDeletionConfirmation = () => {
  const analysisBeingDeleted = useAppSelector((state) => state.analysis.analysisBeingDeleted);
  const {
    mutateTrigger
  } = useRedux();

  // ** Rtk query hook ** \\
  const [
    deleteAnalysis,
    { isLoading, isError, error, data, isSuccess }
  ] = useDeleteAnalysisDetailsMutation();

  const handleDeleteAnalysis = async () => {
    try {
      await deleteAnalysis({ analysisId: analysisBeingDeleted });
    } catch (err) {
      console.error(`Error occured in "handleDeleteAnalysis" function in file "ConfirmAnalysisDeletion.tsx": ${err}`);
      callToast("error", "An unexpected error occured while trying to delete this analysis, please try again shortly")
    }
  }

  // ** Pagination context ** \\
  const {
    setFilters,
    setMethod,
    setSearchQuery,
    setStatus
  } = useContext(PaginationContext);
  const {
    searchParams,
    router,
  } = useNavigationHook();
  const newParams = new URLSearchParams(searchParams.toString());

  // ** UseEffect to handle both successfull and error cases ** \\
  useEffect(() => {
    let isComponentMounted = true;

    if (isSuccess) {
      if (isComponentMounted) {

        // ** Clearing filters ** \\
        setFilters({});
        setSearchQuery('');
        setMethod(undefined);
        setStatus('');

        // ** Mutating params ** \\
        newParams.set("page", "1");
        newParams.delete("searchQuery");
        newParams.delete("method");
        newParams.delete("status");
        router.replace(`?${newParams.toString()}`);

        // ** Disable modal + toast message ** \\
        callToast("success", data.message)
        mutateTrigger("requestDeletionConfirmation", false);
      }
    };

    if (isError && error && "data" in error) {
      const expectedErrorMessage = (error.data as ApiResponse).message;
      if (isComponentMounted) {
        callToast("error", expectedErrorMessage);
      }
    }
    return () => { isComponentMounted = false }
  }, [
    isSuccess,
    isError,
    error,
    data,
    router,
    callToast
  ]);
  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Delete Request?
        </h2>
        <p className="text-muted-foreground text-sm">
          This action cannot be undone and will permanently remove this request.
        </p>
      </div>

      {/* Warning Note */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium mb-1">Heads up</p>
            <p className="text-muted-foreground text-xs">
              All associated data including request logs, response details, and AI analysis will be permanently deleted.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => mutateTrigger("requestDeletionConfirmation", false)}
          variant="outline"
          className="flex-1 cursor-pointer border-border hover:bg-muted/50"
        >
          <X className="w-4 h-4 mr-2" />
          Keep
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleDeleteAnalysis}
          className="disabled:bg-red-950 disabled:text-red-600 flex-1 cursor-pointer hover:bg-red-950 hover:text-red-600 bg-background border border-border text-destructive-foreground "
        >
          {isLoading ? (
            <>
              <Spinner />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 />
              Delete
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RequestDeletionConfirmation;