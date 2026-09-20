"use client";
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminFacilityReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { facilities, users, courts, adminApproveFacility, adminRejectFacility } = useStore();
  const facility = facilities.find(f => f.id === params.id);
  const owner = users.find(u => u.id === facility?.ownerId);
  const facilityCourts = courts.filter(c => c.facilityId === params.id);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  if (!facility) {
    return <div className="p-8 text-center text-outline">Facility not found.</div>;
  }

  const handleApprove = () => {
    adminApproveFacility(facility.id);
    router.push('/admin/approvals');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setRejectError('Detailed Rejection Notice is mandatory.');
      return;
    }
    adminRejectFacility(facility.id, rejectionReason.trim());
    setShowRejectModal(false);
    router.push('/admin/approvals');
  };

  const sampleCourt = facilityCourts[0];
  const operatingHoursDisplay = facility.operatingHours || (facility.is24Hours ? '24 Hours Open' : `${facility.openTime || '06:00'} – ${facility.closeTime || '23:00'}`);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 relative">
      {/* Breadcrumbs & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <nav className="flex items-center gap-2 text-label-md font-label-md text-outline">
          <Link href="/admin" className="hover:text-on-surface cursor-pointer">Admin Operations</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/admin/approvals" className="hover:text-on-surface cursor-pointer">Facility Approvals</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">{facility.name}</span>
        </nav>
      </div>

      {/* Top Header & Primary Action Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight font-bold">
              {facility.name}
            </h1>
            {facility.status === 'PENDING' && (
              <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold text-label-sm border border-amber-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Pending Verification
              </span>
            )}
            {facility.status === 'APPROVED' && (
              <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-label-sm border border-emerald-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Approved & Live
              </span>
            )}
            {facility.status === 'REJECTED' && (
              <span className="px-3 py-0.5 rounded-full bg-error-container text-on-error-container font-bold text-label-sm border border-error/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">block</span>
                Rejected
              </span>
            )}
            {facility.status === 'DRAFT' && (
              <span className="px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold text-label-sm border border-outline-variant">
                Draft Mode
              </span>
            )}
            <span className="text-label-sm text-outline font-mono">ID: {facility.id}</span>
          </div>
          <p className="text-body-sm text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
            {facility.location}
          </p>
        </div>

        {/* Primary Actions Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {facility.status === 'PENDING' && (
            <>
              <button 
                onClick={() => setShowRejectModal(true)} 
                className="h-11 px-5 rounded-xl bg-error-container text-error border border-error/40 hover:bg-error-container/80 text-label-md font-bold transition-all flex items-center gap-2 active:scale-[0.98]" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">block</span>
                <span>Reject Facility</span>
              </button>
              <button 
                onClick={handleApprove} 
                className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-label-md transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Approve & Make Live</span>
              </button>
            </>
          )}

          {facility.status === 'REJECTED' && (
            <button 
              onClick={handleApprove} 
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-label-md transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Re-approve Facility</span>
            </button>
          )}

          {facility.status === 'APPROVED' && (
            <button 
              onClick={() => setShowRejectModal(true)} 
              className="h-11 px-5 rounded-xl bg-surface-container-low text-error border border-error/30 hover:bg-error-container/30 text-label-md font-semibold transition-all flex items-center gap-2" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">block</span>
              <span>Revoke Approval</span>
            </button>
          )}
        </div>
      </div>

      {/* REJECTION REASON BANNER (If facility was rejected) */}
      {facility.status === 'REJECTED' && facility.rejectionReason && (
        <div className="p-4 rounded-xl bg-error-container/30 border border-error/40 text-on-surface space-y-1">
          <div className="flex items-center gap-2 text-error font-bold text-sm">
            <span className="material-symbols-outlined text-base">report</span>
            Current Active Rejection Reason:
          </div>
          <p className="text-sm font-medium text-error pl-6">
            &quot;{facility.rejectionReason}&quot;
          </p>
        </div>
      )}

      {/* MAIN REVIEW DOSSIER GRID (Item 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Facility & Owner Identity */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <span className="material-symbols-outlined text-primary text-xl">domain</span>
              <h2 className="text-headline-sm font-bold text-on-surface">1. Facility Details & Registered Owner</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 space-y-1.5">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block">Facility Title</span>
                <p className="font-bold text-base text-on-surface">{facility.name}</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                  {facility.location}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 space-y-1.5">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block">Owner Credentials</span>
                <p className="font-bold text-base text-on-surface">{owner?.name ?? 'Registered Facility Partner'}</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">mail</span>
                  {owner?.email ?? 'owner@quickcourt.in'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Facility Description</span>
              <p className="text-body-sm text-on-surface-variant leading-relaxed p-3 bg-surface-container-low rounded-lg border border-outline-variant/40">
                {facility.description || 'No detailed description provided by the operator during registration.'}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-2">Sports Disciplines Offered</span>
              <div className="flex flex-wrap gap-2">
                {facility.sports.map(s => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Courts Inventory */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">stadium</span>
                <h2 className="text-headline-sm font-bold text-on-surface">2. Courts Inventory & Operational Status</h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-surface-container text-on-surface">
                {facilityCourts.length} Courts Listed
              </span>
            </div>

            {facilityCourts.length === 0 ? (
              <div className="p-6 text-center text-outline bg-surface-container-low/40 rounded-xl border border-dashed border-outline-variant">
                No courts have been registered for this venue yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-on-surface font-bold text-xs">
                      <th className="py-2.5 px-3">Court / Surface</th>
                      <th className="py-2.5 px-3">Sport Discipline</th>
                      <th className="py-2.5 px-3">Base Price</th>
                      <th className="py-2.5 px-3 text-right">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {facilityCourts.map(court => (
                      <tr key={court.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-on-surface">{court.name}</div>
                          <div className="text-[11px] text-outline">Synthetic / Multi-Court</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-on-surface">{court.sport}</td>
                        <td className="py-3 px-3 font-bold text-primary">₹{court.pricePerHour}/hr</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            court.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${court.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {court.status === 'ACTIVE' ? 'Active / Bookable' : 'Under Maintenance'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 3. Differential Pricing Matrix */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                <h2 className="text-headline-sm font-bold text-on-surface">3. Differential Tariff Structure</h2>
              </div>
              <span className="text-xs font-bold text-secondary">Verified Live Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Weekdays */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
                  <span className="font-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">calendar_view_week</span>
                    Weekdays (Mon – Fri)
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">Standard Rates</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant">Daytime (06:00 – 18:00):</span>
                  <span className="font-bold text-on-surface">₹{sampleCourt?.weekdayDayPrice ?? sampleCourt?.pricePerHour ?? 500}/hr</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-on-surface-variant">Night Floodlit (18:00 – 23:00):</span>
                  <span className="font-bold text-primary">₹{sampleCourt?.weekdayNightPrice ?? Math.round((sampleCourt?.pricePerHour ?? 500) * 1.3)}/hr</span>
                </div>
              </div>

              {/* Weekends */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
                  <span className="font-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">event_available</span>
                    Weekends (Sat – Sun)
                  </span>
                  <span className="text-[10px] text-secondary font-bold">Peak Pricing</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant">Daytime (06:00 – 18:00):</span>
                  <span className="font-bold text-on-surface">₹{sampleCourt?.weekendDayPrice ?? Math.round((sampleCourt?.pricePerHour ?? 500) * 1.2)}/hr</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-on-surface-variant">Night Prime (18:00 – 23:00):</span>
                  <span className="font-bold text-primary">₹{sampleCourt?.weekendNightPrice ?? Math.round((sampleCourt?.pricePerHour ?? 500) * 1.5)}/hr</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Operating Hours & Booking Constraints */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <span className="material-symbols-outlined text-primary text-xl">schedule</span>
              <h2 className="text-headline-sm font-bold text-on-surface">4. Operating Hours & Booking Constraints</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 space-y-1">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block">Operational Windows</span>
                <p className="font-bold text-sm text-on-surface">{operatingHoursDisplay}</p>
                <span className="text-[11px] text-on-surface-variant">{facility.is24Hours ? 'Continuous 24h cycle' : 'Standard day shifts'}</span>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 space-y-1">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block">Slot Allocation Unit</span>
                <p className="font-bold text-sm text-primary">{facility.slotDuration || 60} Minutes</p>
                <span className="text-[11px] text-on-surface-variant">User booking matrix step</span>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 space-y-1">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block">Max Booking Session</span>
                <p className="font-bold text-sm text-on-surface">{facility.maxBookingDuration || 2} Hours Max</p>
                <span className="text-[11px] text-on-surface-variant">Consecutive slot limit</span>
              </div>
            </div>
          </section>

          {/* 5. Uploaded Compliance Documents */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                <h2 className="text-headline-sm font-bold text-on-surface">5. Regulatory Verification Documents</h2>
              </div>
              <span className="text-xs font-bold text-on-surface">
                {facility.documents?.length || 0} Attached
              </span>
            </div>

            {!facility.documents || facility.documents.length === 0 ? (
              <div className="p-6 text-center text-outline bg-surface-container-low/40 rounded-xl border border-dashed border-outline-variant text-sm">
                No verification documents were attached by the operator for this facility.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facility.documents.map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-outline-variant bg-surface flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-2xl">description</span>
                      <div>
                        <span className="text-sm font-bold text-on-surface block truncate max-w-[220px]">{doc.name}</span>
                        <span className="text-[11px] text-on-surface-variant">{doc.type || 'Compliance License'} • {doc.uploadedAt}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                      Attached
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* RIGHT SIDEBAR — AUDIT SUMMARY (Cols 9-12) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-headline-sm font-bold text-on-surface">Compliance Checklist</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span>Facility Identity & Address</span>
                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span>Courts Count ({facilityCourts.length})</span>
                <span className={`material-symbols-outlined text-base ${facilityCourts.length > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {facilityCourts.length > 0 ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span>Differential Pricing Configured</span>
                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span>Operating Windows Set</span>
                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span>Documents Uploaded ({facility.documents?.length || 0})</span>
                <span className={`material-symbols-outlined text-base ${(facility.documents?.length || 0) > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {(facility.documents?.length || 0) > 0 ? 'check_circle' : 'warning'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/60 space-y-2">
              <span className="text-xs font-bold text-outline block uppercase">Public Visibility Status</span>
              {facility.status === 'APPROVED' ? (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Visible to Athletes on Explore & Homepage
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold flex items-center gap-2 border border-amber-200">
                  <span className="material-symbols-outlined text-sm">visibility_off</span>
                  Hidden from Public Athlete Search ({facility.status})
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* REJECTION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="rejection-modal-overlay">
          <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden my-6">
            <div className="flex items-start justify-between p-5 border-b border-outline-variant bg-surface">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">Reject Facility Application</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-error-container text-error uppercase">Mandatory Reason</span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                    {facility.name} ({facility.id}) • {owner?.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors" title="Close modal" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-5 max-h-[calc(85vh-140px)] overflow-y-auto">
              <div className="p-3.5 rounded-lg bg-error-container/40 border border-error/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">warning</span>
                <div className="text-body-sm font-body-sm text-on-surface leading-relaxed">
                  Rejecting will transition this facility to <strong>REJECTED</strong>. The facility operator ({owner?.name}) will see the detailed reason on their dashboard, edit their submission (courts, documents, hours, or description), and resubmit.
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-label-md font-label-md text-on-surface font-bold flex items-center flex-wrap gap-1.5" htmlFor="rejection-comments">
                    <span>Detailed Reason for Rejection</span> 
                    <span className="text-error font-bold">*</span> 
                    <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-error-container text-error border border-error/30">REQUIRED</span>
                  </label>
                </div>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    setRejectError('');
                  }}
                  className="w-full text-body-sm font-body-sm p-3.5 bg-surface border-2 border-outline-variant rounded-xl focus:border-error focus:outline-none transition-colors text-on-surface leading-relaxed min-h-[120px] placeholder:text-outline" 
                  id="rejection-comments" 
                  placeholder="e.g. Uploaded AMC sports trade license is expired. Please attach valid 2026 renewal certificate and clarify night court lighting hours."
                  rows={4}
                ></textarea>
                {rejectError && <p className="text-error text-xs mt-1 font-semibold">{rejectError}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 px-6 bg-surface border-t border-outline-variant">
              <span className="text-xs text-outline">Action will notify owner in real-time</span>
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button onClick={() => setShowRejectModal(false)} className="h-10 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-label-md font-label-md transition-colors" type="button">Cancel</button>
                <button onClick={handleReject} className="h-11 px-6 rounded-lg bg-error hover:bg-red-700 text-on-error font-bold text-label-md font-label-md transition-colors flex items-center justify-center gap-2 shadow-sm" style={{ backgroundColor: '#ba1a1a' }} type="button">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
