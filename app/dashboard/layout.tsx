import Sidebar from "@/components/dashboard/Sidebar";
import ProfileProvider from "@/providers/ProfileProvider";
import ProtectedRoute from "@/providers/ProtectedRoute";
import React from "react";

const layout = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    return (
        <ProtectedRoute>
            <ProfileProvider>
                <div className="h-screen bg-background flex">
                    <Sidebar />
                    {children}
                </div>
            </ProfileProvider>
        </ProtectedRoute>
    )
};

export default layout;