// ** Loading Skeleton Component ** \\
export const SavedAnalysisSkeleton: React.FC = () => {
    return (
        <div className="max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="shrink-0 p-6 border-b border-border">
                <div className="text-center mb-4">
                    <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 border-b border-border">
                <div className="flex">
                    {['request', 'response', 'Ai Analysis'].map((tab) => (
                        <div key={tab} className="flex-1 h-12 bg-muted"></div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto element-scrollable-hidden-scrollbar">
                <div className="p-6">
                    {/* Request Tab Content */}
                    <div className="space-y-6">
                        {/* Method & Endpoint Card */}
                        <div className="p-4 rounded border border-border bg-card">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-12 bg-muted rounded"></div>
                                <div className="h-5 flex-1 bg-muted rounded"></div>
                            </div>
                        </div>

                        {/* Headers Section */}
                        <div className="mb-6 rounded-lg">
                            <div className="h-5 w-16 bg-muted rounded mb-3"></div>
                            <div className="border border-border rounded-lg overflow-hidden bg-card">
                                <div className="flex bg-muted border-b border-border">
                                    <div className="flex-1 px-4 py-3">
                                        <div className="h-4 w-12 bg-muted-foreground/30 rounded"></div>
                                    </div>
                                    <div className="flex-1 px-4 py-3">
                                        <div className="h-4 w-16 bg-muted-foreground/30 rounded"></div>
                                    </div>
                                </div>
                                <div className="divide-y divide-border">
                                    {[1, 2, 3, 4].map((row) => (
                                        <div key={row} className="flex">
                                            <div className="flex-1 px-4 py-3">
                                                <div className="h-4 w-24 bg-muted rounded"></div>
                                            </div>
                                            <div className="flex-1 px-4 py-3">
                                                <div className="h-4 w-40 bg-muted rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Query Parameters Section */}
                        <div className="mb-6 rounded-lg">
                            <div className="h-5 w-32 bg-muted rounded mb-3"></div>
                            <div className="border border-border rounded-lg overflow-hidden bg-card">
                                <div className="flex bg-muted border-b border-border">
                                    <div className="flex-1 px-4 py-3">
                                        <div className="h-4 w-12 bg-muted-foreground/30 rounded"></div>
                                    </div>
                                    <div className="flex-1 px-4 py-3">
                                        <div className="h-4 w-16 bg-muted-foreground/30 rounded"></div>
                                    </div>
                                </div>
                                <div className="divide-y divide-border">
                                    {[1, 2, 3].map((row) => (
                                        <div key={row} className="flex">
                                            <div className="flex-1 px-4 py-3">
                                                <div className="h-4 w-20 bg-muted rounded"></div>
                                            </div>
                                            <div className="flex-1 px-4 py-3">
                                                <div className="h-4 w-16 bg-muted rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Request Body Section */}
                        <div className="space-y-3">
                            <div className="h-5 w-24 bg-muted rounded"></div>
                            <div className="relative p-4 rounded bg-card border border-border">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="h-4 bg-muted rounded w-5/6"></div>
                                    <div className="h-4 bg-muted rounded w-4/5"></div>
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <div className="h-8 w-8 bg-muted rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Tab Content */}
                    <div className="space-y-6  mt-6">
                        {/* AI Analysis Card */}
                        <div className="p-6 rounded border border-border bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-5 w-5 bg-muted rounded"></div>
                                <div className="h-5 w-24 bg-muted rounded"></div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-11/12"></div>
                                <div className="h-4 bg-muted rounded w-10/12"></div>
                                <div className="h-4 bg-muted rounded w-4/5"></div>
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                            </div>
                            <div className="h-9 w-20 bg-muted rounded"></div>
                        </div>

                        {/* Cost & Created Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded border border-border bg-card">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-4 w-4 bg-muted rounded"></div>
                                    <div className="h-4 w-12 bg-muted rounded"></div>
                                </div>
                                <div className="h-5 w-16 bg-muted rounded"></div>
                            </div>
                            <div className="p-4 rounded border border-border bg-card">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-4 w-4 bg-muted rounded"></div>
                                    <div className="h-4 w-16 bg-muted rounded"></div>
                                </div>
                                <div className="h-5 w-40 bg-muted rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};