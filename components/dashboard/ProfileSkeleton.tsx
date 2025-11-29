"use client"
import { Card, CardContent, CardHeader } from "../ui/card";

export const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen w-full">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="animate-pulse space-y-8">
                    {/* Header Skeleton */}
                    <div className="text-center space-y-4">
                        <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
                    </div>

                    {/* Main Card Skeleton */}
                    <Card>
                        <CardHeader className="text-center pb-8">
                            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
                            <div className="h-6 bg-muted rounded w-40 mx-auto mb-2"></div>
                            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-20"></div>
                                        <div className="h-8 bg-muted rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};