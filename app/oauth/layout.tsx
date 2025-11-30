import ProtectedPublicRoute from "@/providers/ProtectedPublicRoute";
import React from "react";


const layout = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {

    return (
        <ProtectedPublicRoute>
            {children}
        </ProtectedPublicRoute>
    )
};

export default layout;