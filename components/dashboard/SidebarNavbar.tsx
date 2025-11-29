"use client"
import { useAppSelector } from "@/redux/store";
import { useNavigationHook } from "@/hooks/useNavigationHook";
import HarmBurgerMenu from "../reusable/HarmBurgerMenu";

const SidebarNavbar = (): React.ReactElement => {
    const profile = useAppSelector((state) => state.user.profile);
    const { pathname } = useNavigationHook();

    const isHistoryPage = pathname === "/dashboard/history";
    return (
        <nav className={`${isHistoryPage ? "mb-9" : "px-4"} bg-background`}>
            <div className="flex items-center justify-between">
                {/* Logo */}
                <span className="text-primary flex items-center gap-2 xl:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                        />
                    </svg>
                    <p className="text-white">RespAi</p>
                </span>

                {/* Credits and Menu */}
                <div className="flex items-center gap-4">

                    {/* Credits Display */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-lg border border-border">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm text-foreground font-medium">
                            <span className="text-white">Credits:</span> {profile.credits}
                        </span>
                    </div>

                    {/* Hamburger Menu */}
                    <HarmBurgerMenu />
                </div>
            </div>
        </nav>
    );
};

export default SidebarNavbar;