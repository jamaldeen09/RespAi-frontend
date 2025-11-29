export const ApiRequestManager = () => {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden">
        <div className="z-10 space-y-3 text-xs font-medium">
          <div className="p-2 bg-primary/10 rounded">GET /users → saved</div>
          <div className="p-2 bg-primary/10 rounded">POST /login → saved</div>
          <div className="p-2 bg-primary/10 rounded text-red-400">DELETE /post/12 → removed</div>
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-40" />
      </div>
    )
  }
  