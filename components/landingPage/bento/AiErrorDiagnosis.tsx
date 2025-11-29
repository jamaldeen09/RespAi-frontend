const AIErrorDiagnosis = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden p-6">
      <div className="relative z-10 text-center space-y-3">
        <div className="text-3xl font-bold text-red-400">500</div>
        <div className="text-sm text-muted-foreground">Internal Server Error</div>
        <div className="text-xs text-primary font-medium mt-4 p-3 bg-primary/10 rounded">
          "JSON parsing failed on line 42"
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-transparent to-transparent opacity-50" />
    </div>
  )
}

export default AIErrorDiagnosis;
