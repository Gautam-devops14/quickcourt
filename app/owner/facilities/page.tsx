"use client";
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

export default function FacilityManagementPage() {
  const { facilities, courts, currentUser } = useStore();
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'DRAFT' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentOwnerId = currentUser?.id ?? 'o1';
  const ownerFacilities = facilities.filter(f => f.ownerId === currentOwnerId);

  const approvedCount = ownerFacilities.filter(f => f.status === 'APPROVED').length;
  const pendingCount = ownerFacilities.filter(f => f.status === 'PENDING').length;
  const draftCount = ownerFacilities.filter(f => f.status === 'DRAFT').length;
  const rejectedCount = ownerFacilities.filter(f => f.status === 'REJECTED').length;

  const filteredFacilities = ownerFacilities.filter(f => {
    if (filter !== 'ALL' && f.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Facility Management</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              QuickCourt Partner Portal
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-2xl">
            Configure court specifications, set hourly rates, manage online booking rules, and submit locations for verification.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search facility name or location..." 
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-sm font-body-sm text-on-surface" 
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline-variant">search</span>
          </div>
          <Link href="/owner/facilities/new" className="w-full sm:w-auto h-11 px-5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add_location_alt</span>
            Add Facility
          </Link>
        </div>
      </div>

      {/* Filter Tabs & View Toggles Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant p-2 rounded-lg">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-md text-label-sm font-label-sm font-semibold whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            All Facilities ({ownerFacilities.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-md text-label-sm font-label-sm font-semibold whitespace-nowrap transition-colors ${filter === 'APPROVED' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            Approved & Active ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-md text-label-sm font-label-sm font-semibold whitespace-nowrap transition-colors ${filter === 'PENDING' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            Pending Verification ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('DRAFT')}
            className={`px-3 py-1.5 rounded-md text-label-sm font-label-sm font-semibold whitespace-nowrap transition-colors ${filter === 'DRAFT' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            Draft Setup ({draftCount})
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-md text-label-sm font-label-sm font-semibold whitespace-nowrap transition-colors ${filter === 'REJECTED' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            Action Required / Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Facilities Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFacilities.length === 0 ? (
          <div className="col-span-1 md:col-span-2 py-12 text-center text-outline">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">stadium</span>
            <p className="text-body-md">No facilities found. Click &quot;Add Facility&quot; to begin.</p>
          </div>
        ) : (
          filteredFacilities.map(facility => {
            const facilityCourts = courts.filter(c => c.facilityId === facility.id);
            const activeCourts = facilityCourts.filter(c => c.status === 'ACTIVE').length;
            const avgRate = facilityCourts.length > 0 
              ? Math.round(facilityCourts.reduce((acc, c) => acc + c.pricePerHour, 0) / facilityCourts.length)
              : 0;

            let statusBadge = null;
            if (facility.status === 'APPROVED') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-secondary text-label-sm font-label-sm font-semibold border border-secondary-container">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>Approved • Live</span>
                </span>
              );
            } else if (facility.status === 'PENDING') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm font-semibold border border-outline-variant">
                  <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                  <span>Verification Pending</span>
                </span>
              );
            } else if (facility.status === 'REJECTED') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm font-label-sm font-semibold border border-error">
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  <span>Action Required</span>
                </span>
              );
            } else {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-outline text-label-sm font-label-sm border border-outline-variant">
                  <span className="material-symbols-outlined text-[13px]">edit_document</span>
                  <span>Draft</span>
                </span>
              );
            }

            return (
              <div key={facility.id} className={`bg-surface-container-lowest rounded-lg border ${facility.status === 'REJECTED' ? 'border-error' : 'border-outline-variant'} p-5 flex flex-col justify-between hover:border-primary transition-all duration-150`}>
                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/owner/facilities/${facility.id}`}>
                          <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface hover:text-primary transition-colors">{facility.name}</h3>
                        </Link>
                        {statusBadge}
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-outline">location_on</span>
                        <span>{facility.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Classification Chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {facility.sports.map(sport => (
                      <span key={sport} className="px-2.5 py-1 rounded bg-surface border border-outline-variant/70 text-label-sm font-label-sm text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-primary">sports</span>
                        <span>{sport}</span>
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded bg-surface-container-high text-label-sm font-label-sm text-on-surface font-medium">
                      {facilityCourts.length} Courts Total ({activeCourts} Active)
                    </span>
                  </div>

                  {/* Reject Reason Banner (if rejected) */}
                  {facility.status === 'REJECTED' && (
                    <div className="mt-4 p-3 bg-error-container/30 border border-error text-error text-body-sm font-body-sm rounded-lg flex items-start gap-2">
                      <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
                      <div>
                        <strong>Verification Failed:</strong> {facility.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* Metrics Strip */}
                  <div className="mt-5 grid grid-cols-3 gap-3 p-3 bg-surface rounded-md border border-outline-variant/40 text-center">
                    <div>
                      <span className="text-[11px] text-on-surface-variant block font-medium">Avg Slot Rate</span>
                      <span className="text-label-lg font-label-lg text-on-surface">₹{avgRate} / hr</span>
                    </div>
                    <div className="border-x border-outline-variant/40">
                      <span className="text-[11px] text-on-surface-variant block font-medium">Status</span>
                      <span className="text-label-lg font-label-lg text-secondary font-bold">{facility.status}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-on-surface-variant block font-medium">Courts</span>
                      <span className="text-label-lg font-label-lg text-on-surface">{facilityCourts.length} Registered</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Strip */}
                <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/owner/facilities/${facility.id}/approval`} className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors underline-offset-4 hover:underline">
                      Status & Verif
                    </Link>
                    <span className="text-outline-variant">•</span>
                    <Link href={`/owner/facilities/${facility.id}/edit`} className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors hover:underline">
                      Edit
                    </Link>
                  </div>
                  <Link href={`/owner/facilities/${facility.id}/courts`} className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-primary-container text-on-primary text-label-md font-label-md hover:bg-primary transition-colors shadow-xs">
                    <span className="material-symbols-outlined text-[17px]">grid_view</span>
                    <span>Manage Courts</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
