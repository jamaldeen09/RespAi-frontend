import React from "react";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRedux from "@/hooks/useRedux";
import useLogout from "@/hooks/useLogout";
import { Spinner } from "../ui/spinner";

const LogoutConfirmation = (): React.ReactElement => {
    const { mutateTrigger } = useRedux();

    const {
        createEffect,
        isLoading,
    } = useLogout();
    return (
        <div className="w-full p-6">
            <div className="text-center space-y-4">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <LogOut className="w-8 h-8 text-black" />
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                        Log Out?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You'll need to log in again to continue using RespAi
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        onClick={() => mutateTrigger("logoutConfirmation", false)}
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-accent cursor-pointer"
                    >
                        <X />
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={createEffect}
                        className="flex-1 bg-primary cursor-pointer hover:bg-primary/90 text-black"
                    >
                        {isLoading ? <Spinner /> : <LogOut />}
                        {isLoading ? "Logging out..." : "Log Out"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;