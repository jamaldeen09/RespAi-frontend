const ActionableFixes = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden p-6">
      <div className="relative z-10 text-center space-y-4">
        <div className="text-3xl font-bold text-green-400">✓</div>
        <div className="text-sm text-muted-foreground">Fix Ready</div>
        <div className="text-xs text-primary font-medium p-3 bg-primary/10 rounded">
          "Add Authorization header"
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-transparent to-transparent opacity-50" />
    </div>
  )
}

export default ActionableFixes