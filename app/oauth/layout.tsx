import ProtectedPublicRoute from "@/providers/ProtectedPublicRoute";
import React from "react";

const layout = React.memo(({ children }: {
    children: React.ReactElement
}): React.ReactElement => {

    return (
        <ProtectedPublicRoute>
            {children}
        </ProtectedPublicRoute>
    )
});

export default layout;