"use client"
import React, { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import useRedux from "@/hooks/useRedux"
import { AuthContext } from "@/contexts/AuthContext"
import { useAppSelector } from "@/redux/store"


// ** Nav items/links ** \\
export const navItems = [
  { name: "Features", href: "#features-section" },
  { name: "Get Started", href: "#cta-section" },
]

// ** Function to handle scroll to a section ** \\
export const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  const targetId = href.substring(1)
  const targetElement = document.getElementById(targetId)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" })
  }
};

export const Header = () => {
  // ** Function to mutate navigation trigger ** \\
  const { mutateTrigger } = useRedux();

  // ** Context to handle authType switching ** \\
  const { setAuthType } = useContext(AuthContext);

  // ** Users auth state ** \\
  const {
    authState
  } = useAppSelector((state) => state.user);
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-background text-primary rounded-[50px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            <span className="text-foreground text-xl font-semibold">
              RespAI
            </span>
          </div>

          {/* Desktop Navbar */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-accent/50"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          {!authState.isAuthenticated && (
            <Button onClick={() => {
              setAuthType("signup");
              return mutateTrigger("auth", true)
            }} className="cursor-pointer hidden md:block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105">
              Try for Free
            </Button>
          )}

          {/* Mobile Menu */}
          <Button
            onClick={() => mutateTrigger("navigation", true)}
            className="cursor-pointer hover:bg-accent bg-transparent md:hidden text-white"
          >
            <Menu />
          </Button>
        </div>
      </div>
    </header>
  )
}