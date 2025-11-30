import Sidebar from "@/components/dashboard/Sidebar";
import Loading from "@/components/reusable/Loading";
import ProfileProvider from "@/providers/ProfileProvider";
import ProtectedRoute from "@/providers/ProtectedRoute";
import React, { Suspense } from "react";

const layout = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    return (
        <Suspense fallback={<Loading />}>
            <ProtectedRoute>
                <ProfileProvider>
                    <div className="h-screen bg-background flex">
                        <Sidebar />
                        {children}
                    </div>
                </ProfileProvider>
            </ProtectedRoute>
        </Suspense>
    )
};

export default layout;