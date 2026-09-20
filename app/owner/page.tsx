"use client";
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

export default function OwnerDashboard() {
  const { facilities, courts, slots, bookings, currentUser } = useStore();

  const currentOwnerId = currentUser?.id ?? 'o1';
  const ownerFacilities = facilities.filter(f => f.ownerId === currentOwnerId);
  const facilityIds = ownerFacilities.map(f => f.id);
  const ownerCourts = courts.filter(c => facilityIds.includes(c.facilityId));
  const courtIds = ownerCourts.map(c => c.id);
  const ownerSlots = slots.filter(s => courtIds.includes(s.courtId));
  const ownerBookings = bookings.filter(b => facilityIds.includes(b.facilityId));

  const totalRevenue = ownerBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingApprovals = ownerFacilities.filter(f => f.status === 'PENDING').length;
  const activeCourts = ownerCourts.filter(c => c.status === 'ACTIVE').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todaySlots = ownerSlots.filter(s => s.date === today);
  const bookedToday = todaySlots.filter(s => s.status === 'BOOKED').length;
  const fillRate = todaySlots.length ? Math.round((bookedToday / todaySlots.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface">Owner Dashboard</h1>
          <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            QuickCourt Certified Partner • {ownerFacilities.length} Facilities Online
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="h-11 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-label-lg hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Jump to Date
          </button>
          <button className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add_location_alt</span>
            <Link href="/owner/facilities/new">New Facility Setup</Link>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Gross Sales */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col justify-between hover:border-primary transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Today&apos;s Ledger Output</span>
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
          </div>
          <div className="mt-3">
            <span className="font-headline-xl text-headline-xl font-bold text-on-surface">₹{totalRevenue}</span>
            <div className="flex items-center gap-1.5 text-secondary text-label-sm font-label-sm mt-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>12.4% vs last week</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Fill Rate */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col justify-between hover:border-primary transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Prime Slot Fill Rate</span>
            <span className="material-symbols-outlined text-primary">pie_chart</span>
          </div>
          <div className="mt-3">
            <span className="font-headline-xl text-headline-xl font-bold text-on-surface">{fillRate}%</span>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
              <span>Today&apos;s Roster: <strong className="text-on-surface">{todaySlots.length} Slots</strong></span>
            </div>
          </div>
        </div>

        {/* KPI 3: Live Utilization */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col justify-between hover:border-primary transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Active Courts</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm font-label-sm font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Live Peak
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl font-bold text-on-surface">{activeCourts} / {ownerCourts.length} Courts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> In-play</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col justify-between hover:border-error transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Pending Approvals</span>
            <div className="p-2 bg-error-container text-on-error-container rounded-lg">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl font-bold text-on-surface">{pendingApprovals} Requests</span>
              {pendingApprovals > 0 && <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-bold">Action Needed</span>}
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
              <Link href="/owner/facilities" className="text-[11px] font-semibold text-primary">Manage Approvals</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Occupancy & Revenue Pace</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Daily utilization curves across morning regulars and evening league rushes.</p>
              </div>
            </div>
            
            {/* Visual Bar chart Mock */}
            <div className="mt-6">
              <div className="h-48 flex items-end justify-between gap-1.5 pt-6 pb-2 px-1 border-b border-outline-variant">
                {[60, 85, 45, 30, 20, 15, 30, 50, 75, 90, 85, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end">
                    <div className="w-full bg-primary-container rounded-t transition-all group-hover:bg-primary" style={{ height: `${h}%` }}></div>
                    <span className="text-[10px] text-on-surface-variant">{6+i}H</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mb-4">Quick Links</h2>
            <div className="flex flex-col gap-3">
              <Link href="/owner/facilities" className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant">
                <span className="material-symbols-outlined text-primary">stadium</span>
                <span className="font-label-md text-on-surface font-semibold">Manage Facilities</span>
              </Link>
              <Link href="/owner/schedule" className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                <span className="font-label-md text-on-surface font-semibold">Time Slot Master Schedule</span>
              </Link>
              <Link href="/owner/bookings" className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant">
                <span className="material-symbols-outlined text-primary">assignment</span>
                <span className="font-label-md text-on-surface font-semibold">Booking Ledger</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
