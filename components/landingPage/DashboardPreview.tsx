export const DashboardPreview = () => {
  return (
    <div className="w-full max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[1160px] mx-auto">
      <div className="bg-primary/10 rounded-2xl p-2 md:p-3 lg:p-4 shadow-2xl border border-border/20">
        <div className="relative rounded-xl overflow-hidden shadow-lg">

          <video
            src="/videos/dashboard-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain rounded-lg"
          />

          {/* Optional overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-background/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
