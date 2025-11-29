import React, { useContext } from "react";
import { handleScroll, navItems } from "./Header";
import Link from "next/link";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import useRedux from "@/hooks/useRedux";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppSelector } from "@/redux/store";

const MobileNavigation = (): React.ReactElement => {
    const { mutateTrigger } = useRedux();

    // ** Context to handle authType switching ** \\
    const { setAuthType } = useContext(AuthContext);

    // ** Users auth state ** \\
    const {
        authState
    } = useAppSelector((state) => state.user);
    return (
        <div className="w-full p-4 rounded-lg flex flex-col gap-6">
            <header className="text-2xl text-white font-bold tracking-tight
            flex items-center justify-between">
                Navigation
                <Button
                    onClick={() => mutateTrigger("navigation", false)}
                    size="icon-sm"
                    className="bg-transparent hover:bg-accent text-white rounded-lg cursor-pointer"
                >
                    <XIcon />
                </Button>
            </header>

            {/* NavLinks */}
            <main className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                            mutateTrigger("navigation", false);
                            return handleScroll(e, item.href)
                        }}
                        className="font-medium transition-colors duration-200 hover:bg-accent/50
                    p-2 rounded-sm text-muted-foreground hover:text-white"
                    >
                        {item.name}
                    </Link>
                ))}
            </main>

            {!authState.isAuthenticated && (
                <footer>
                    <Button onClick={() => {
                        mutateTrigger("navigation", false);
                        setAuthType("signup");
                        return mutateTrigger("auth", true)
                    }} className="w-full cursor-pointer"
                    >
                        Try for Free
                    </Button>
                </footer>
            )}
        </div>
    );
};

export default MobileNavigation;