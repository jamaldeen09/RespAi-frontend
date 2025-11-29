"use client"
import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext } from "react";
import Signup from "./Signup";
import Login from "./Login";

const Auth = (): React.ReactElement => {
    // ** Context to handle authType switching ** \\
    const { authType } = useContext(AuthContext);

    // ** Function to conditionally render an auth component ** \\
    const renderAuthComponent = (): React.ReactElement => {
        if (authType === "signup") return <Signup />
        if (authType === "login") return <Login />

        // ** If authType isnt signup or login render signup component as default ** \\
        return <Signup />
    }
    return (
        <div className="w-full">{renderAuthComponent()}</div>
    );
};

export default Auth;