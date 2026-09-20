import { TopNav } from "@/components/shared/TopNav";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopNav />
      <main className="w-full pt-16 min-h-screen pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
