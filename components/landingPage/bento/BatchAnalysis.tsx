const BatchAnalysis = () => {
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden p-6">
        <div className="relative z-10 w-full max-w-md">
          {/* Multiple endpoint visualization */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { status: "success", endpoint: "/api/users" },
              { status: "error", endpoint: "/api/orders" },
              { status: "success", endpoint: "/api/products" },
              { status: "warning", endpoint: "/api/auth" }
            ].map((item, index) => (
              <div key={index} className={`p-3 rounded-lg border backdrop-blur-sm ${
                item.status === "success" ? "bg-green-500/10 border-green-500/20" :
                item.status === "error" ? "bg-red-500/10 border-red-500/20" :
                "bg-yellow-500/10 border-yellow-500/20"
              }`}>
                <div className={`w-2 h-2 rounded-full mb-2 ${
                  item.status === "success" ? "bg-green-400" :
                  item.status === "error" ? "bg-red-400" : "bg-yellow-400"
                }`} />
                <div className="text-xs font-mono text-foreground/80 truncate">
                  {item.endpoint}
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Batch Progress</span>
              <span className="text-primary font-semibold">4/8 APIs</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-1/2 transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    )
}

export default BatchAnalysis