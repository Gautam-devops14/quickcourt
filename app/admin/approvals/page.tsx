"use client";
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

export default function AdminApprovalsPage() {
  const { facilities, users, courts } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredFacilities = facilities.filter(f => {
    if (statusFilter === 'ALL') return true;
    return f.status === statusFilter;
  }).sort((a, b) => {
    // Sort logic: Pending first
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return 0;
  });

  const pendingCount = facilities.filter(f => f.status === 'PENDING').length;
  const approvedCount = facilities.filter(f => f.status === 'APPROVED').length;
  const rejectedCount = facilities.filter(f => f.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Facility Verification Hub</h1>
            <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-primary/20">
              Audit Operations
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-3xl">
            Review submitted facilities, verify compliance and physical inspection audits, and issue operational approvals.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Search Application ID, Owner, or Zone..." type="text" />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">search</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'ALL' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              All Submissions ({facilities.length})
            </button>
            <button onClick={() => setStatusFilter('PENDING')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'PENDING' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              Action Required ({pendingCount})
            </button>
            <button onClick={() => setStatusFilter('APPROVED')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'APPROVED' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              Verified Live ({approvedCount})
            </button>
            <button onClick={() => setStatusFilter('REJECTED')} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'REJECTED' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/60 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4">Facility Owner</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Sports & Courts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-body-sm font-body-sm">
              {filteredFacilities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-outline">
                    No facilities found.
                  </td>
                </tr>
              ) : (
                filteredFacilities.map(facility => {
                  const owner = users.find(u => u.id === facility.ownerId);
                  const facilityCourts = courts.filter(c => c.facilityId === facility.id);
                  return (
                    <tr key={facility.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">domain</span>
                          </div>
                          <div>
                            <div className="font-semibold text-on-surface flex items-center gap-1.5">
                              <span>{facility.name}</span>
                            </div>
                            <div className="text-[11px] text-on-surface-variant font-mono">ID: {facility.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-on-surface">{owner?.name || 'Unknown Owner'}</div>
                        <div className="text-[11px] text-on-surface-variant">{owner?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-on-surface">{facility.location}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {facility.sports.map(s => (
                            <span key={s} className="bg-surface-container-low border border-outline-variant px-1.5 py-0.5 rounded text-[11px] font-medium text-on-surface">
                              {s}
                            </span>
                          ))}
                          <span className="bg-surface-container-low border border-outline-variant px-1.5 py-0.5 rounded text-[11px] font-medium text-on-surface">{facilityCourts.length} Courts</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {facility.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-amber-50 text-amber-900 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            Pending Review
                          </span>
                        )}
                        {facility.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-emerald-50 text-emerald-900 border border-emerald-300">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Approved
                          </span>
                        )}
                        {facility.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-error-container text-on-error-container border border-error/50">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            Rejected
                          </span>
                        )}
                        {facility.status === 'DRAFT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-surface-container text-outline border border-outline-variant">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/approvals/${facility.id}`} className="px-3 py-1.5 bg-primary-container text-on-primary hover:bg-primary rounded-lg text-label-md font-label-md font-semibold transition-colors">
                            {facility.status === 'PENDING' ? 'Review Submission' : 'View Details'}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
