"use client"
import useRedux from "@/hooks/useRedux";
import React from "react";
import { Button } from "../ui/button";

const HarmBurgerMenu = (): React.ReactElement => {
    const {
        mutateTrigger
    } = useRedux();
    return (
        <Button
            type="button"
            onClick={() => mutateTrigger("sidebarNavigation", true)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 cursor-pointer hover:bg-accent border border-border xl:hidden"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
            </svg>
        </Button>
    );
};

export default HarmBurgerMenu;