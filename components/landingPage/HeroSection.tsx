"use client"
import { Button } from "@/components/ui/button"
import { Header } from "./Header"
import useRedux from "@/hooks/useRedux";
import { useAppSelector } from "@/redux/store";
import { useNavigationHook } from "@/hooks/useNavigationHook";

export const HeroSection = () => {
  // ** Function to mutate signup trigger ** \\
  const { mutateTrigger } = useRedux();

  // ** Users auth state ** \\
  const {
    authState
  } = useAppSelector((state) => state.user);
  const {
    router
  } = useNavigationHook();
  return (
    <section className="w-full min-h-[400px] md:min-h-[600px] lg:min-h-[810px] flex flex-col items-center justify-center text-center relative rounded-2xl overflow-hidden my-6 py-8 px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">

      {/* Lightweight Gradient Background */}
      <div className="absolute inset-0 z-0">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/30" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        {/* Border effect */}
        <div className="absolute inset-0 rounded-2xl border border-border/20" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 w-full">
        <Header />
      </div>

      {/* Hero Content - PROPERLY CENTERED */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 md:space-y-8 lg:space-y-10 px-4">

        {/* Headline - Now properly centered */}
        <h1 className="text-foreground text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight w-full">
          Stop Guessing What Your API is Thinking
        </h1>

        {/* Subtitle - Proper max-width and centering */}
        <p className="text-muted-foreground text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
          Get crystal-clear explanations for every API response
        </p>

        {/* CTA Button */}
        {authState.isAuthenticated ? (
          <Button
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-white/10 mt-4"
          >
            Dashboard
          </Button>
        ) : (
          <Button onClick={() => mutateTrigger("auth", true)} className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-white/10 mt-4">
            Debug Your API Now
          </Button>
        )}
      </div>
    </section>
  )
}