export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Minimal Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary font-bold font-headline-sm">
            Q
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">QuickCourt</span>
        </a>
      </header>
      
      {/* Main Content Area */}
      {children}
    </div>
  );
}

