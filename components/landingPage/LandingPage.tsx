import ProtectedPublicRoute from "@/providers/ProtectedPublicRoute";
import { AnimatedSection } from "./AnimatedSection";
import APIResponseDemo from "./ApiResponseDemo";
import { BentoSection } from "./BentoSection";
import { CTASection } from "./CTASection";
import { DashboardPreview } from "./DashboardPreview";
import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { LiveDemoSection } from "./LiveDemoSection";

export const LandingPage = () => {
    return (
        <ProtectedPublicRoute>
            <div className="min-h-screen bg-background relative overflow-hidden">
                <div className="relative z-10">

                    {/* Hero section + dashboard preview */}
                    <main className="max-w-[1320px] mx-auto relative">
                        <HeroSection />

                        {/* Dashboard Preview - Fixed Positioning */}
                        <div className="relative -mt-20 md:-mt-48 lg:-mt-60  z-30 px-4">
                            <AnimatedSection>
                                <DashboardPreview />
                            </AnimatedSection>
                        </div>
                    </main>

                    {/* Other parts */}
                    <div className="pt-32 md:pt-48 lg:pt-60 xl:pt-80">

                        {/* Api response demo section */}
                        <AnimatedSection className="relative z-10" delay={0.15}>
                            <APIResponseDemo />
                        </AnimatedSection>

                        {/* Bento section */}
                        <AnimatedSection id="features-section" className="relative z-10 max-w-[1320px] mx-auto mt-16" delay={0.2}>
                            <BentoSection />
                        </AnimatedSection>

                        {/* Live demo section */}
                        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
                            <LiveDemoSection />
                        </AnimatedSection>

                        {/* CTA section */}
                        <AnimatedSection id="cta-section" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
                            <CTASection />
                        </AnimatedSection>

                        {/* Footer section */}
                        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
                            <FooterSection />
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </ProtectedPublicRoute>
    )
}
