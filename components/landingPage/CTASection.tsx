"use client"
import { Button } from "@/components/ui/button"
import useRedux from "@/hooks/useRedux";
import { useAppSelector } from "@/redux/store";

export const CTASection = () => {
  // ** Function to mutate signup trigger ** \\
  const { mutateTrigger } = useRedux();

  // ** Users auth state ** \\
  const {
    authState
  } = useAppSelector((state) => state.user);
  return (
    <section className="w-full pt-20 md:pt-60 lg:pt-60 pb-10 md:pb-20 px-5 relative flex flex-col justify-center items-center overflow-visible">
      <div className="relative z-10 flex flex-col justify-start items-center gap-9 max-w-4xl mx-auto">
        <div className="flex flex-col justify-start items-center gap-4 text-center">
          <h2 className="text-foreground text-4xl md:text-5xl lg:text-[68px] font-semibold leading-tight md:leading-tight lg:leading-[76px] wrap-break-word max-w-[435px]">
            Coding made effortless
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-medium leading-[18.20px] md:leading-relaxed wrap-break-word max-w-2xl">
            Hear how developers ship products faster, collaborate seamlessly, and build with confidence using Pointer's
            powerful AI tools
          </p>
        </div>

        {!authState.isAuthenticated && (
          <Button
            onClick={() => mutateTrigger("auth", true)}
            className="px-[30px] py-2 bg-secondary text-secondary-foreground text-base font-medium leading-6 rounded-[99px] shadow-[0px_0px_0px_4px_rgba(255,255,255,0.13)] hover:bg-secondary/90 transition-all duration-200"
            size="lg"
          >
            Signup for free
          </Button>
        )}
      </div>
    </section>
  )
}
