"use client";
import { Button } from "../ui/button";
import { Clock, LayoutDashboard, LogOut, X } from "lucide-react";
import Link from "next/link";
import { useNavigationHook } from "@/hooks/useNavigationHook";
import CustomAvatar from "../reusable/CustomAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion"
import useRedux from "@/hooks/useRedux";
import useResizer from "@/hooks/useResizer";
import { useAppSelector } from "@/redux/store";


// ** Sidebar content ** \\
const SidebarContent = (): React.ReactElement => {
  // ** Custom hook to extract pathname ** \\
  const { pathname, router } = useNavigationHook();
  const { mutateTrigger } = useRedux();

  // ** Check if it's lg screen ** \\
  const { isDesiredScreen: isLgScreen } = useResizer(1280);

  // ** Sidebar links ** \\
  const sidebarLinks = [
    {
      link: "Analyzer",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      link: "History",
      icon: <Clock className="h-4 w-4" />,
      href: "/dashboard/history",
      isActive: pathname === "/dashboard/history",
    },
  ];

  // ** Profile ** \\
  const userProfile = useAppSelector((state) => state.user.profile)
  return (
    <>
      {/* Logo */}
      <header className="flex items-center gap-2 
       text-primary border-b border-border py-2 
  justify-between px-3">
        <div className="flex items-center gap-2">
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
          {/* Show text on lg screens */}
          {isLgScreen && (
            <p className="text-white text-sm font-medium block xl:hidden">RespAi</p>
          )}
        </div>

        {isLgScreen && (
          <Button
            onClick={() => mutateTrigger("sidebarNavigation", false)}
            variant="ghost"
            className="cursor-pointer hover:bg-accent border-border border hover:text-primary"
            size="icon-sm"
          >
            <X />
          </Button>
        )}
      </header>

      {/* Sidebar links */}
      <main className="flex-1 flex flex-col gap-3 mt-4 lg:gap-2">
        {sidebarLinks.map((link) => (
          isLgScreen ? (
            // ** LG SCREEN: Full link with text ** \\
            <Link
              onClick={() => mutateTrigger("sidebarNavigation", false)}
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer text-white hover:bg-accent 
                ${link.isActive && "bg-accent"} lg:w-full`}
            >
              {link.icon}
              <span className="block xl:hidden">{link.link}</span>
            </Link>
          ) : (
            // XL SCREEN: Icon only with tooltip
            <Tooltip key={link.href}>
              <TooltipTrigger onClick={() => mutateTrigger("sidebarNavigation", false)}>
                <Link
                  href={link.href}
                  className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 cursor-pointer text-white hover:bg-accent 
                    ${link.isActive && "bg-accent"}`}
                >
                  {link.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-accent text-white"
              >
                <p>{link.link}</p>
              </TooltipContent>
            </Tooltip>
          )
        ))}
      </main>

      {/* Footer */}
      <footer className="h-fit flex flex-col gap-3 justify-center items-center lg:flex-col lg:gap-2">
        {/* Logout button */}
        {isLgScreen ? (
          // ** LG SCREEN: Full button with text ** \\
          <button onClick={() => {
            mutateTrigger("sidebarNavigation", false);
            mutateTrigger("logoutConfirmation", true);
          }} className="flex items-center gap-3 rounded-md text-sm 
          font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
          disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer bg-transparent text-white 
          hover:bg-accent w-full xl:w-fit">
            <LogOut className="w-4 h-4" />
            <span className="block xl:hidden">Logout</span>
          </button>
        ) : (
          // ** XL SCREEN: Icon only with tooltip ** \\
          <Tooltip>
            <TooltipTrigger onClick={() => mutateTrigger("logoutConfirmation", true)}>
              <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 cursor-pointer bg-transparent text-white hover:bg-accent">
                <LogOut className="w-4 h-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-accent text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Profile */}
        {isLgScreen ? (
          // ** LG SCREEN: Full profile with text ** \\
          <button
            onClick={() => {
              router.push("/dashboard/profile");
              mutateTrigger("sidebarNavigation", false);
            }}
            className={`flex items-center gap-3 rounded-md text-sm 
          font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 
          focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-3 
          cursor-pointer text-white hover:bg-accent w-full xl:w-fit 
          ${pathname === "/dashboard/profile" ? "bg-accent" : "bg-transparent"}`}
          >
            <CustomAvatar
              src={userProfile.avatar || "https://github.com/shadcn.png"}
              fallback="Avatar"
              size="xs"
            />
            <span className="block xl:hidden">Profile</span>
          </button>
        ) : (
          // ** XL SCREEN: Icon only with tooltip ** \\
          <Tooltip>
            <TooltipTrigger>
              <span
                onClick={() => router.push("/dashboard/profile")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 cursor-pointer bg-transparent text-white hover:bg-accent">
                <CustomAvatar
                  src={userProfile.avatar || "https://github.com/shadcn.png"}
                  fallback="Avatar"
                  size="xs"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-accent text-white">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        )}
      </footer>
    </>
  )
};


const Sidebar = (): React.ReactElement => {
  const { getTrigger, mutateTrigger } = useRedux();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="xl:flex flex-col justify-between w-fit px-2 py-4 hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {getTrigger("sidebarNavigation") && (
          <motion.div
            onClick={() => mutateTrigger("sidebarNavigation", false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="inset-0 fixed top-0 z-50 bg-background/80 px-4 sm:px-0 backdrop-blur-md block xl:hidden"
          >
            <motion.aside
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                type: "tween",
                ease: "easeOut",
                duration: 0.2
              }}
              className="flex xl:hidden flex-col justify-between w-60 px-2 py-4 fixed left-0 top-0 h-full bg-background border-r border-border z-50
              "
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
