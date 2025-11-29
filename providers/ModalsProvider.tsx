"use client"
import Auth from "@/components/auth/Auth";
import EditProfile from "@/components/dashboard/EditProfile";
import LogoutConfirmation from "@/components/dashboard/LogoutConfirmation";
import RequestDeletionConfirmation from "@/components/dashboard/RequestDeletionConfirmation";
import SavedAnalysis from "@/components/dashboard/SavedAnalysis";
import MobileNavigation from "@/components/landingPage/MobileNavigation";
import Modal from "@/components/reusable/Modal";
import useRedux from "@/hooks/useRedux";
import useResizer from "@/hooks/useResizer";
import React from "react";

// ** Provider to render all fixed modals used in the app ** \\
const ModalsProvider = React.memo(({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    const { getTrigger, mutateTrigger } = useRedux();
    const { isDesiredScreen } = useResizer(768)
    return (
        <>
            {/* Logout confirmation modal */}
            <Modal
                trigger={getTrigger("logoutConfirmation")}
                triggerName="logoutConfirmation"
                funcToMutateTrigger={mutateTrigger}
                animationType="scale-into-view"
                overlayStyles="inset-0 fixed top-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-md
              flex justify-center items-center backdrop-blur-md"
                modalStyles="w-full h-fit rounded-lg max-w-xs sm:max-w-md backdrop-blur-md bg-card border border-border"
            >
                <LogoutConfirmation />
            </Modal>

            {/* Edit profile modal */}
            <Modal
                trigger={getTrigger("editProfile")}
                triggerName="editProfile"
                funcToMutateTrigger={mutateTrigger}
                animationType="scale-into-view"
                overlayStyles="inset-0 fixed top-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-md
              flex justify-center items-center backdrop-blur-md"
                modalStyles="w-full h-fit rounded-lg max-w-xs sm:max-w-md backdrop-blur-md bg-card border border-border"
            >
                <EditProfile />
            </Modal>

            {/* Analysis deletion confirmation modal */}
            <Modal
                trigger={getTrigger("requestDeletionConfirmation")}
                triggerName="requestDeletionConfirmation"
                funcToMutateTrigger={mutateTrigger}
                animationType="scale-into-view"
                overlayStyles="inset-0 fixed top-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-md
              flex justify-center items-center backdrop-blur-md"
                modalStyles="w-full h-fit rounded-lg max-w-xs sm:max-w-sm backdrop-blur-md bg-card border border-border"
            >
                <RequestDeletionConfirmation />
            </Modal>


            {/* Saved analysis detail modal */}
            <Modal
                trigger={getTrigger("savedAnalysis")}
                triggerName="savedAnalysis"
                funcToMutateTrigger={mutateTrigger}
                animationType={isDesiredScreen ? "bottom-into-view" : "scale-into-view"}
                overlayStyles="inset-0 fixed top-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-md flex justify-center items-center backdrop-blur-md"
                modalStyles="w-full h-full md:h-fit md:max-h-[80vh] rounded-lg md:max-w-3xl backdrop-blur-md bg-card border border-border md:overflow-hidden"
            >
                <SavedAnalysis />
            </Modal>

            {children}

            {/* Auth modal */}
            <Modal
                trigger={getTrigger("auth")}
                triggerName="auth"
                funcToMutateTrigger={mutateTrigger}
                animationType="scale-into-view"
                overlayStyles="inset-0 fixed top-0 z-50 flex justify-center items-center bg-background/80 px-4 sm:px-0 backdrop-blur-md"
                modalStyles="w-full h-fit rounded-2xl max-w-sm sm:max-w-md backdrop-blur-md bg-card border border-border shadow-xl"
            >
                <Auth />
            </Modal>


            {/* Navigation modal */}
            <Modal
                trigger={getTrigger("navigation")}
                triggerName="navigation"
                funcToMutateTrigger={mutateTrigger}
                animationType="scale-into-view"
                overlayStyles="inset-0 fixed top-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-md flex justify-center items-center
                px-4 sm:px-0 md:hidden backdrop-blur-md"
                modalStyles="w-full h-fit rounded-lg max-w-sm sm:max-w-md backdrop-blur-md bg-card border border-border  md:hidden"
            >
                <MobileNavigation />
            </Modal>
        </>
    );
});

export default ModalsProvider;