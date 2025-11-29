const JSONValidation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden p-6">
      <div className="relative z-10 text-center space-y-4">
        <div className="text-3xl font-bold text-red-400">❌</div>
        <div className="text-sm text-muted-foreground">Invalid JSON</div>
        <div className="text-xs text-primary font-medium p-3 bg-primary/10 rounded">
          "Missing comma on line 5"
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-transparent to-transparent opacity-50" />
    </div>
  )
}

export default JSONValidation