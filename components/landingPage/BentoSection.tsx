import AIErrorDiagnosis from "./bento/AiErrorDiagnosis"
import RealtimeResponseAnalysis from "./bento/RealTimeResponseAnalysis"
import JSONValidation from "./bento/JSONValidation"
import ActionableFixes from "./bento/ActionableFixes"
import { ComponentType } from "react"
import { ApiRequestManager } from "./bento/ApiRequestManager"
import { AnalysisTogglePreview } from "./bento/AnalysisTogglePreview"

// ** Bento card ** \\
const BentoCard = ({ title, description, Component }: {
  title: string;
  description: string;
  Component: ComponentType;
}) => (
  <div className="overflow-hidden rounded-2xl border border-white/20 flex flex-col justify-start items-start relative">
    {/* Background with blur effect */}
    <div
      className="absolute inset-0 rounded-2xl"
      style={{
        background: "rgba(231, 236, 235, 0.08)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    {/* Additional subtle gradient overlay */}
    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-2xl" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7">
          {title} <br />
          <span className="text-muted-foreground">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch h-72 relative -mt-0.5 z-10">
      <Component />
    </div>
  </div>
)

export const BentoSection = () => {
  // ** Card data ** \\
  const cards = [
    {
      title: "Save & Manage API Requests",
      description: "Store requests, re-run them, and delete old ones anytime.",
      Component: ApiRequestManager,
    },
    {
      title: "Analysis Toggle (Credit Saver Mode)",
      description: "Control when AI analysis runs to avoid unnecessary credit use.",
      Component: AnalysisTogglePreview,
    },
    {
      title: "AI-Powered Error Diagnosis",
      description: "Explain cryptic 500, 401, and 403 errors in plain English.",
      Component: AIErrorDiagnosis,
    },
    {
      title: "Real-time Response Analysis",
      description: "Instant insights as you test API endpoints.",
      Component: RealtimeResponseAnalysis,
    },
    {
      title: "JSON Structure Validation",
      description: "Pinpoint malformed data and syntax issues fast.",
      Component: JSONValidation,
    },
    {
      title: "Actionable Fix Suggestions",
      description: "Clear next steps to resolve issues instantly.",
      Component: ActionableFixes,
    },
  ]

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-20 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              Complete API Debugging Toolkit
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Everything you need to understand API responses, fix errors instantly, and debug with confidence.
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

