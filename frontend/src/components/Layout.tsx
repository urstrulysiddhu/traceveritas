import React from 'react';

const Header = () => (
  <header className="h-12 bg-surface/90 backdrop-blur-sm border-b border-ui-border flex items-center justify-between px-6 shrink-0 relative z-20">
    <div className="flex items-center gap-3">
      <h1 className="text-sm font-bold tracking-widest text-ink">TRACEVERITAS</h1>
      <span className="text-ui-border h-4 border-l"></span>
      <p className="text-[10px] text-muted font-mono tracking-widest uppercase mt-0.5">Food Safety Intelligence</p>
    </div>
    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-maroon">
      <span className="w-1.5 h-1.5 rounded-none bg-maroon animate-pulse"></span>
      NEO4J LIVE
    </div>
  </header>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col text-ink font-sans bg-transparent">
      <Header />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-[95%] mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
