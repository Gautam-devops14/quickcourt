import { TopNavAdmin } from "@/components/shared/TopNavAdmin";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex flex-col min-h-screen bg-surface">
        <TopNavAdmin />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

