"use client";
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { facilities, users, bookings } = useStore();

  const pendingCount = facilities.filter(f => f.status === 'PENDING').length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const totalBookings = bookings.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Admin Operations Center</h1>
            <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-primary/20">
              System Wide Operations
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-3xl">
            Monitor Ahmedabad regional facility compliance, track transaction flow, and manage active platform participants.
          </p>
        </div>
      </div>

      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users?role=ALL" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between hover:border-primary transition-all cursor-pointer shadow-sm group">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold group-hover:text-primary transition-colors">Total Active Users</span>
            <span className="material-symbols-outlined text-primary">group</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-xl text-headline-xl font-bold text-on-surface">{activeUsers}</span>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
              <span>Platform Athletes & Owners</span>
              <span className="text-primary font-bold">View List →</span>
            </div>
          </div>
        </Link>
        <Link href="/admin/approvals" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between hover:border-primary transition-all cursor-pointer shadow-sm group">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold group-hover:text-primary transition-colors">Total Facilities</span>
            <span className="material-symbols-outlined text-primary">domain</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-xl text-headline-xl font-bold text-on-surface">{facilities.length}</span>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
              <span>Verified & Pending Venues</span>
              <span className="text-primary font-bold">Manage →</span>
            </div>
          </div>
        </Link>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">System Bookings</span>
            <span className="material-symbols-outlined text-primary">book_online</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-xl text-headline-xl font-bold text-on-surface">{totalBookings}</span>
            <div className="flex items-center text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
              <span>Cumulative Reservations</span>
            </div>
          </div>
        </div>
        <Link href="/admin/approvals" className="bg-error-container/20 border-2 border-error/30 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-error transition-all group">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold group-hover:text-error transition-colors">Urgent Compliance</span>
            <span className="material-symbols-outlined text-error">priority_high</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-xl text-headline-xl font-bold text-error">{pendingCount}</span>
            <div className="flex items-center gap-1.5 mt-1 font-label-sm text-label-sm text-error font-semibold">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span>Pending Reviews</span>
            </div>
            <div className="pt-2 border-t border-error/20 text-on-surface-variant font-body-sm text-[12px] flex items-center justify-between">
              <span>{pendingCount} waiting action</span>
              <span className="text-primary font-bold">Review →</span>
            </div>
          </div>
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {/* Pending Approvals */}
          <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Pending Facility Verification</h2>
                  {pendingCount > 0 && <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[11px] font-bold">{pendingCount} Action Required</span>}
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Physical inspection checklist, Fire NOC, and municipal zoning validation</p>
              </div>
            </div>

            <div className="divide-y divide-outline-variant/60 mt-2">
              {facilities.filter(f => f.status === 'PENDING').length === 0 ? (
                <div className="py-8 text-center text-outline">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">task_alt</span>
                  No pending facilities in the queue.
                </div>
              ) : (
                facilities.filter(f => f.status === 'PENDING').map(facility => (
                  <div key={facility.id} className="py-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0 text-primary">
                          <span className="material-symbols-outlined">sports_tennis</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{facility.name}</h3>
                            <span className="px-2 py-0.5 rounded text-label-sm font-label-sm bg-primary-fixed text-on-primary-fixed font-semibold">
                              New Submission
                            </span>
                            <span className="text-label-sm text-outline">• {facility.location}</span>
                          </div>
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            Awaiting physical inspection audit and photo compliance review.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Link href={`/admin/approvals/${facility.id}`} className="h-9 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Review Compliance
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Recent Bookings Feed (mock functionality for dashboard) */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-4">Latest System Bookings</h3>
            <div className="space-y-4">
              {bookings.slice(0, 3).map(b => (
                <div key={b.id} className="flex items-center gap-3 border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                    {(users.find(u => u.id === b.userId)?.name || 'US').slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-body-sm font-medium text-on-surface">Booking #{b.id.slice(0, 8)}</div>
                    <div className="text-xs text-outline">{facilities.find(f => f.id === b.facilityId)?.name}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-body-sm font-bold text-on-surface">₹{b.totalAmount ?? b.amount}</div>
                    <div className="text-[10px] text-emerald-800 font-semibold">Paid: ₹{b.advanceAmount ?? b.amount}</div>
                    <div className={`text-[10px] font-bold ${b.status === 'CONFIRMED' ? 'text-emerald-700' : b.status === 'CANCELLED' ? 'text-error' : 'text-on-surface-variant'}`}>{b.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
