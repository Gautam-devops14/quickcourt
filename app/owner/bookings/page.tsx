"use client";
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { BookingStatus } from '@/types';
import Link from 'next/link';

export default function OwnerBookingsPage() {
  const { facilities, courts, bookings, users, currentUser } = useStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const currentOwnerId = currentUser?.id ?? 'o1';
  const ownerFacilities = facilities.filter(f => f.ownerId === currentOwnerId);
  const facilityIds = ownerFacilities.map(f => f.id);
  const ownerBookings = bookings.filter(b => facilityIds.includes(b.facilityId));
  
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');

  const filteredBookings = ownerBookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesFacility = selectedFacility === 'ALL' || b.facilityId === selectedFacility;
    return matchesStatus && matchesFacility;
  });

  const confirmedCount = ownerBookings.filter(b => b.status === 'CONFIRMED').length;
  const completedCount = ownerBookings.filter(b => b.status === 'COMPLETED').length;
  const cancelledCount = ownerBookings.filter(b => b.status === 'CANCELLED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Booking Ledger & Revenue</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              Transactions
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-3xl">
            Monitor confirmed reservations, track daily revenue streams, and verify upcoming gate turnstile allocations.
          </p>
        </div>
      </div>

      {/* Control Strip */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <input className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Search by Booking ID, Athlete Name, or PIN..." type="text" />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-body-md">search</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative">
              <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="appearance-none bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-3 pr-8 py-2 font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary">
                <option value="ALL">All Facilities</option>
                {ownerFacilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-body-md">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'ALL' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}>
              All Bookings ({ownerBookings.length})
            </button>
            <button onClick={() => setStatusFilter('CONFIRMED')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'CONFIRMED' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}>
              Confirmed ({confirmedCount})
            </button>
            <button onClick={() => setStatusFilter('COMPLETED')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'COMPLETED' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}>
              Completed ({completedCount})
            </button>
            <button onClick={() => setStatusFilter('CANCELLED')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'CANCELLED' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}>
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>
      </section>

      {/* Bookings Table */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
                <th className="py-3.5 px-4 whitespace-nowrap">Booking ID & Player</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Facility & Arena</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Court</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Amount (₹)</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-outline">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => {
                  const facility = ownerFacilities.find(f => f.id === b.facilityId);
                  const court = courts.find(c => c.id === b.courtId);
                  const user = users.find(u => u.id === b.userId);
                  
                  return (
                    <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-label-sm uppercase">
                            {user?.name.slice(0, 2) || 'US'}
                          </div>
                          <div>
                            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">{user?.name}</div>
                            <div className="text-outline text-label-sm">#{b.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-on-surface font-medium">{facility?.name}</div>
                        <div className="text-outline text-label-sm">{facility?.location}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-on-surface">{court?.name}</div>
                        <div className="text-outline text-label-sm">{court?.sport}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-on-surface">₹{b.totalAmount ?? b.amount}</div>
                        <div className="text-[11px] text-emerald-800 font-semibold">Paid: ₹{b.advanceAmount ?? b.amount}</div>
                        {b.remainingAmount && b.remainingAmount > 0 ? (
                          <div className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                            ₹{b.remainingAmount} Due at Desk
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3.5 px-4">
                        {b.status === 'CONFIRMED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-secondary/15 text-secondary border border-secondary/30">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Confirmed
                          </span>
                        )}
                        {b.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant">
                            Completed
                          </span>
                        )}
                        {b.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-error-container text-on-error-container border border-error">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === b.id ? null : b.id)}
                            className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface" 
                            title="Actions"
                          >
                            <span className="material-symbols-outlined text-headline-sm">more_vert</span>
                          </button>

                          {activeMenuId === b.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                              <div className="absolute right-0 mt-1 w-44 rounded-lg bg-surface-container-lowest shadow-lg border border-outline-variant py-1 z-20 text-left">
                                <Link
                                  href={`/bookings/${b.id}`}
                                  className="flex items-center gap-2 px-3.5 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                                  onClick={() => setActiveMenuId(null)}
                                >
                                  <span className="material-symbols-outlined text-base text-primary">confirmation_number</span>
                                  <span>View Details</span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    window.print();
                                  }}
                                  className="w-full flex items-center gap-2 px-3.5 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                                >
                                  <span className="material-symbols-outlined text-base text-outline">print</span>
                                  <span>Print Booking</span>
                                </button>
                                <a
                                  href={`mailto:${user?.email || 'player@quickcourt.in'}?subject=QuickCourt%20Booking%20${b.id}`}
                                  className="flex items-center gap-2 px-3.5 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                                  onClick={() => setActiveMenuId(null)}
                                >
                                  <span className="material-symbols-outlined text-base text-outline">mail</span>
                                  <span>Contact Player</span>
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
