import { LazyLoadedAnalysisDetailData } from "@/redux/slices/analysisSlice"
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

export const SavedAnalysisCard = (props: (
    LazyLoadedAnalysisDetailData & {
        onViewSavedAnalysisCard: (id: string) => void;
        onDelete: (id: string) => void;
    }
)): React.ReactElement => {
    // ** Formats date into specific format ** \\
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isSuccess = props.response.status >= 200 && props.response.status < 300;
    return (
        <div
            className="rounded-2xl border border-border bg-card backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
        >
            {/* Header with endpoint and method */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-foreground truncate flex-1 mr-2">{props.request.endpoint}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full`}>
                    {props.request.method}
                </span>
            </div>
 
            {/* Status and date */}
            <div className="flex justify-between items-center mb-4">
                <span className={`text-xs font-medium py-1 rounded-full`}>
                    Status: <span className={`${isSuccess ? "text-primary" : "text-red-600"}`}>{props.response.status}</span>
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(props.createdAt)}</span>
            </div>

            {/* ai Explanation */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 text-ellipsis">{props?.aiAnalysis || "None"}</p>

            {/* Footer with cost and button */}
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Cost: {props.cost} {`${props.cost === 1 ? "credit" : "credits"}`}</span>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => props.onViewSavedAnalysisCard(props._id)}
                        size="sm"
                        className="cursor-pointer"
                    >
                        View
                    </Button>

                    <Button
                        onClick={() => props.onDelete(props._id)}
                        variant="outline"
                        className="text-red-600 hover:text-red-600 hover:bg-red-950 cursor-pointer"
                        size="icon-sm"
                    >
                        <Trash />
                    </Button>
                </div>
            </div>
        </div>
    )
}