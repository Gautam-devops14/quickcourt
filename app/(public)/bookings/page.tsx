"use client"
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';
import { useState } from 'react';
import { TimeSlot } from '@/types';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

type TabState = 'Upcoming' | 'Completed' | 'Cancelled';

export default function BookingsPage() {
  const formatTime = (t: string) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr === 0 ? 12 : hr}:${m || '00'} ${hr >= 12 ? 'PM' : 'AM'}`;
};

  const { bookings, facilities, courts, slots, cancelBooking, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<TabState>('Upcoming');

  // If no user, mock to the first user
  const currentUserId = currentUser?.id ?? 'u1';

  // Filter bookings for current user
  const userBookings = bookings.filter(b => b.userId === currentUserId);
  
  // Categorize based on status
  // For 'Upcoming' vs 'Completed' we can use status CONFIRMED and the date/time, 
  // but for simplicity in UI mock, let's say:
  // Upcoming = CONFIRMED (in real app, we'd check date > now)
  // Completed = COMPLETED (or old CONFIRMED)
  // Cancelled = CANCELLED
  
  // Actually, we'll just use status for now. Since the mock data only has CONFIRMED and CANCELLED, 
  // we'll treat all CONFIRMED as 'Upcoming' for the demo unless we explicitly added a COMPLETED status.
  const upcomingBookings = userBookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = userBookings.filter(b => b.status === 'COMPLETED'); // assuming we add this later if needed
  const cancelledBookings = userBookings.filter(b => b.status === 'CANCELLED');

  const getDisplayedBookings = () => {
    if (activeTab === 'Upcoming') return upcomingBookings;
    if (activeTab === 'Completed') return completedBookings;
    return cancelledBookings;
  };

  const displayedBookings = getDisplayedBookings();

  // Helper to format date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      cancelBooking(bookingId);
    }
  };

  return (
    <ProtectedRoute>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-body-sm font-body-sm text-outline mb-4">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">My Bookings</span>
      </nav>

      {/* Page Header & Global Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-headline-xl font-headline-xl text-on-surface">My Reservations & Passes</h1>
            <span className="inline-flex items-center gap-1 bg-surface-container-high text-primary px-2.5 py-0.5 rounded-full text-label-sm font-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Live Gate Sync Active
            </span>
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
            Manage your upcoming court access, match booking passes, past receipts, and cancellations.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="inline-flex items-center gap-2 h-[42px] px-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-label-lg font-label-lg transition-all active:scale-[0.99]" type="button">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Tax Invoices
          </button>
          <Link href="/explore" className="inline-flex items-center gap-2 h-[42px] px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-label-lg font-label-lg transition-all shadow-sm active:scale-[0.99]">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Book New Court
          </Link>
        </div>
      </div>

      {/* Booking Status Navigation Tabs */}
      <div className="flex items-center border-b border-outline-variant space-x-8 mb-8 mt-6" role="tablist">
        {(['Upcoming', 'Completed', 'Cancelled'] as TabState[]).map(tab => {
          const isActive = activeTab === tab;
          const count = tab === 'Upcoming' ? upcomingBookings.length : tab === 'Completed' ? completedBookings.length : cancelledBookings.length;
          return (
            <button
              key={tab}
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 font-medium text-label-lg flex items-center gap-2 transition-all
                ${isActive ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              role="tab"
              type="button"
            >
              <span>{tab}</span>
              <span className={`text-label-sm px-2 py-0.5 rounded-full ${isActive ? 'bg-primary text-surface-container-lowest' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bookings Feed */}
        <section className="lg:col-span-8 space-y-6">
          {displayedBookings.length === 0 ? (
            <div className="py-12 text-center text-outline">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">event_busy</span>
              <p className="text-body-md">No {activeTab.toLowerCase()} bookings found.</p>
            </div>
          ) : (
            displayedBookings.map((booking, index) => {
              const court = courts.find(c => c.id === booking.courtId);
              const facility = facilities.find(f => f.id === court?.facilityId);
              const bookingSlots = slots.filter(s => booking.slotIds.includes(s.id));
              const firstSlot = bookingSlots[0];
              const lastSlot = bookingSlots[bookingSlots.length - 1];
              const timeString = firstSlot && lastSlot ? `${formatTime(firstSlot.startTime)} – ${formatTime(lastSlot.endTime)}` : 'Time TBA';
              const duration = bookingSlots.length * 60; // Assuming 60min slots
              const bookingRef = `QC-${booking.id.replace(/\D/g, '').slice(0, 5).padStart(5, '0')}-${court?.sport.substring(0,2).toUpperCase() || 'IN'}`;
              
              if (activeTab === 'Upcoming') {
                const isFirst = index === 0;
                return (
                  <article key={booking.id} className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm transition-all hover:border-primary ${isFirst ? 'border-2 border-primary/40' : 'border border-outline-variant'}`}>
                    {isFirst && (
                      <div className="bg-primary text-on-primary px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-label-md font-label-md">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
                          <span className="font-bold tracking-wide">UPCOMING MATCH</span>
                        </div>
                        <div className="flex items-center gap-3 text-on-primary-container text-body-sm">
                          <span className="flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Desk Confirmed & Active
                          </span>
                          <span>•</span>
                          <span className="font-mono text-surface-container-lowest font-bold">#{bookingRef}</span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-surface-container text-primary font-bold px-2 py-0.5 rounded text-label-sm">{court?.sport}</span>
                            <span className="text-body-sm text-outline">Premium Court Surface • {court?.name}</span>
                            {!isFirst && (
                              <span className="bg-surface-container-low text-secondary font-medium px-2 py-0.5 rounded text-label-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                Booking Confirmed
                              </span>
                            )}
                          </div>
                          <Link href={`/bookings/${booking.id}`}>
                            <h2 className="text-headline-md font-headline-md text-on-surface hover:text-primary transition-colors">{facility?.name}</h2>
                          </Link>
                          <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> {facility?.location}
                          </p>
                        </div>
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-headline-md font-headline-md font-bold text-on-surface block">
                            ₹{booking.totalAmount ?? booking.amount}
                          </span>
                          <span className="text-label-sm text-outline block">#{bookingRef}</span>
                          {booking.remainingAmount && booking.remainingAmount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                              ₹{booking.remainingAmount} Due at Venue
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                              <span className="material-symbols-outlined text-[13px]">check</span>
                              Paid in Full
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 p-4 rounded-xl bg-surface border border-outline-variant/60 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                          </div>
                          <div>
                            <span className="text-label-sm text-outline block">MATCH SCHEDULE</span>
                            <span className="text-label-md font-bold text-on-surface">{formatDate(booking.date)}</span>
                            <span className="text-body-sm text-on-surface-variant block">{timeString} ({duration} min)</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                          </div>
                          <div>
                            <span className="text-label-sm text-outline block">ALLOCATED COURT</span>
                            <span className="text-label-md font-bold text-on-surface">{court?.name}</span>
                            <span className="text-body-sm text-on-surface-variant block">{court?.sport}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                          </div>
                          <div className="flex-1 text-xs">
                            <span className="text-label-sm text-outline block">SETTLEMENT</span>
                            <div className="flex justify-between items-center mt-0.5">
                              <span className="text-on-surface-variant">Paid:</span>
                              <span className="font-bold text-emerald-800">₹{booking.advanceAmount ?? booking.amount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-on-surface-variant">Venue Dues:</span>
                              <span className="font-bold text-on-surface">₹{booking.remainingAmount ?? 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-body-sm">
                          <button className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-label-md" type="button">
                            <span className="material-symbols-outlined text-[16px]">group_add</span>
                            Invite Teammates & Split Bill
                          </button>
                          <span className="text-outline">|</span>
                          <button onClick={() => handleCancel(booking.id)} className="text-error hover:underline text-label-md font-medium" type="button">
                            Cancel Reservation
                          </button>
                          <span className="text-[11px] text-outline hidden sm:inline">(100% refund up to 2h prior)</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Link href={`/bookings/${booking.id}`} className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-label-md transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
              
              if (activeTab === 'Completed') {
                return (
                  <article key={booking.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 rounded text-label-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Session Completed
                          </span>
                          <span className="text-body-sm text-outline">{court?.sport} • {court?.name}</span>
                        </div>
                        <h3 className="text-headline-md font-headline-md text-on-surface font-bold">{facility?.name}</h3>
                        <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> {facility?.location}
                        </p>
                        <p className="text-body-xs text-on-surface-variant mt-1">Played on {formatDate(booking.date)} ({timeString})</p>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="text-headline-md font-headline-md font-bold text-on-surface block">₹{booking.amount}</span>
                        <span className="text-label-sm text-outline block">#{bookingRef}</span>
                      </div>
                    </div>

                    {/* Post-Play Rating Prompt */}
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-label-md font-bold text-on-surface">Please rate {facility?.name}&apos;s court quality</p>
                        <p className="text-body-xs text-on-surface-variant">How was your playing experience on {court?.name}?</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => {
                              // Trigger rating in store
                              if (booking.id) {
                                alert(`Thank you for rating ${facility?.name} ${star} stars!`);
                              }
                            }}
                            className="p-1 text-outline hover:text-amber-500 transition-colors"
                            title={`Rate ${star} star`}
                          >
                            <span className="material-symbols-outlined text-2xl hover:scale-110 transition-transform">star</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/60 text-body-sm">
                      <Link href={`/bookings/${booking.id}`} className="text-primary hover:underline font-semibold flex items-center gap-1">
                        <span>View Receipt & Match Log</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                      <Link href={`/venue/${facility?.id}/book`} className="text-primary hover:underline font-semibold">
                        Book Again
                      </Link>
                    </div>
                  </article>
                );
              }

              if (activeTab === 'Cancelled') {
                return (
                  <article key={booking.id} className="bg-surface-container-lowest/70 border border-outline-variant rounded-xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-error-container text-error px-2 py-0.5 rounded text-label-sm font-semibold">Cancelled</span>
                          <span className="text-body-sm text-outline">Originally booked for {formatDate(booking.date)}</span>
                        </div>
                        <h3 className="text-headline-sm font-headline-sm text-on-surface line-through opacity-75">{facility?.name} — {court?.name}</h3>
                        <p className="text-body-sm text-secondary font-medium flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span> 
                          Refunded ₹{booking.amount} to original payment method
                        </p>
                      </div>
                      <Link href={`/bookings/${booking.id}`} className="h-[34px] px-3.5 rounded border border-outline-variant hover:bg-surface-container-low text-on-surface-variant text-body-sm flex items-center">
                        View Cancellation Log
                      </Link>
                    </div>
                  </article>
                );
              }
              
              return null;
            })
          )}
        </section>

        {/* Right Column: Athlete Guidelines */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-bold text-headline-sm mb-3">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
              <span>Arrival Protocol</span>
            </div>
            <ul className="space-y-3 text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-primary text-label-sm shrink-0 mt-0.5 font-bold">1</span>
                <div><strong className="text-on-surface">Arrive 10-15m Early:</strong> Check in at reception 15 minutes before your scheduled match block.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-primary text-label-sm shrink-0 mt-0.5 font-bold">2</span>
                <div><strong className="text-on-surface">Non-Marking Shoes Required:</strong> All indoor courts require gum-rubber non-marking soles.</div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-primary text-label-sm shrink-0 mt-0.5 font-bold">3</span>
                <div><strong className="text-on-surface">Desk Verification:</strong> Show your Booking Reference ID at the facility reception for immediate court assignment.</div>
              </li>
            </ul>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
              </span>
              <div>
                <h3 className="text-label-lg font-bold text-on-surface">Immediate Venue Dispatch</h3>
                <p className="text-body-sm text-on-surface-variant mt-0.5">Need help locating your court or lights coordination?</p>
              </div>
            </div>
            <div className="mt-4 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/80">
              <span className="text-label-sm text-outline block">DIRECT DUTY MANAGER LINE</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-headline-sm font-headline-sm font-bold text-primary font-mono">+91 79 4001 2100</span>
                <span className="text-[11px] font-bold text-secondary bg-surface-container-low px-1.5 py-0.5 rounded">24/7 ON-SITE</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
    </ProtectedRoute>
  );
}
