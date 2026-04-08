const DashboardHeader = () => {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-primary gold-glow tracking-tight">AltBots</h1>
        <span className="text-sm text-muted-foreground hidden sm:inline">Portfolio Intelligence Monitor</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="hidden md:inline">Last Sweep: April 8, 2026</span>
        <span className="hidden md:inline">|</span>
        <span>8 Managers Active</span>
        <span>|</span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
          </span>
          1 Alert
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
