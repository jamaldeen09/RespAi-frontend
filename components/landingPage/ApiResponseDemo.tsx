"use client"
import useRedux from "@/hooks/useRedux";
import { useAppSelector } from "@/redux/store";

const APIResponseDemo = () => {
  // ** After explanation ** \\
  const afterExplanation =
    "Your API returned a 500 error because there's malformed JSON in the response body. The parser encountered an 'undefined' token, which isn't valid JSON. This typically means your server is trying to serialize an undefined value or there's a syntax error in the response template."

  // ** Action steps ** \\
  const actionSteps = [
    "Check your response serializer for undefined values",
    "Add null coalescing or optional chaining to prevent undefined",
    "Use a JSON linter to validate your response structure",
    "Add try-catch around the response generation code",
  ];

  // ** Function to mutate signup trigger ** \\
  const { mutateTrigger } = useRedux();

  // ** Users auth state ** \\
  const {
    authState
  } = useAppSelector((state) => state.user);
  return (
    <section className="w-full px-5 py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-foreground text-4xl md:text-5xl lg:text-6xl font-semibold">
            From Confusion to Clarity
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            See how Resp AI transforms cryptic API errors into clear, actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Before - Confusing Error */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="text-foreground font-semibold text-lg">Without Resp AI</h3>
            </div>
            <div className="bg-background border border-white/10 rounded-lg p-6 text-sm">
              <div className="text-red-400 mb-4">HTTP 500 Error</div>
              <div className="text-foreground/60 space-y-2">
                <div className="text-yellow-400">{"{"}</div>
                <div className="ml-4">
                  <span className="text-primary">"error"</span>
                  <span className="text-foreground">: {" {"}</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">"code"</span>
                  <span className="text-foreground">: </span>
                  <span className="text-blue-400">500</span>
                  <span className="text-foreground">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">"message"</span>
                  <span className="text-foreground">: </span>
                  <span className="text-green-400">"Internal server error"</span>
                  <span className="text-foreground">,</span>
                </div>
                <div className="ml-8">
                  <span className="text-primary">"details"</span>
                  <span className="text-foreground">: </span>
                  <span className="text-green-400">"Unexpected token 'undefined'"</span>
                </div>
                <div className="ml-4">
                  <span className="text-foreground">{"}"}</span>
                </div>
                <div className="text-yellow-400">{"}"}</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm italic">
              You're left wondering: What does this mean? Where do I even start debugging?
            </p>
          </div>

          {/* After - Clear Explanation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="text-foreground font-semibold text-lg">With Resp AI</h3>
            </div>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-foreground font-semibold">What Happened</p>
                <p className="text-foreground/80 text-sm leading-relaxed">{afterExplanation}</p>
              </div>

              <div className="pt-4 border-t border-primary/20">
                <p className="text-foreground font-semibold mb-3">Next Steps</p>
                <ul className="space-y-2">
                  {actionSteps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="text-primary font-semibold shrink-0">{index + 1}</span>
                      <span className="text-foreground/80">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-primary/20">
                <p className="text-foreground font-semibold mb-2">Type</p>
                <div className="inline-block bg-primary/20 px-3 py-1 rounded text-sm text-primary font-medium">
                  JSON Parsing Error
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 md:mt-16">
          {!authState.isAuthenticated && (
            <button
              onClick={() => mutateTrigger("auth", true)}
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-white/10 transition-all"
            >
              Try Resp AI Now
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default APIResponseDemo
