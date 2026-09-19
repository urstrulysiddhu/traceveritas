import React from 'react';

const Header = () => (
  <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
    <div>
      <h1 className="text-sm font-bold tracking-wider text-slate-900 leading-tight">TRACEVERITAS</h1>
      <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Food Supply Chain Intelligence</p>
    </div>
    <div className="flex items-center gap-2 text-xs text-slate-600">
      System status: <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Connected</span>
    </div>
  </header>
);

const Sidebar = () => {
  const navItems = [
    { name: 'OVERVIEW', active: true },
    { name: 'SUPPLIERS' },
    { name: 'BATCHES' },
    { name: 'KITCHENS' },
    { name: 'DISHES' },
    { name: 'ALERTS' },
  ];

  return (
    <aside className="w-48 bg-slate-50 border-r border-slate-200 shrink-0">
      <nav className="p-6 flex flex-col gap-4">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`text-xs font-semibold tracking-wider ${
              item.active 
                ? 'text-slate-900' 
                : 'text-slate-400'
            }`}
          >
            {item.name}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8 bg-white">
          <div className="max-w-5xl mx-auto space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
