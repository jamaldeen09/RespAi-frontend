export const AnalysisTogglePreview = () => {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden">
        <div className="z-10 space-y-4 text-center">
          <div className="text-muted-foreground text-sm">AI Analysis</div>
          <div className="text-lg font-bold text-primary">OFF</div>
          <div className="text-xs bg-primary/10 p-2 rounded">
            “Save credits by toggling off analysis”
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-transparent opacity-40" />
      </div>
    )
  }
  