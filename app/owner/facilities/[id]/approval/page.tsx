"use client";
import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function FacilityApprovalStatusPage({ params }: { params: { id: string } }) {
  const { facilities, courts, resubmitFacility } = useStore();
  const router = useRouter();

  const facility = facilities.find(f => f.id === params.id);
  if (!facility) return notFound();

  const facilityCourts = courts.filter(c => c.facilityId === facility.id);

  const handleResubmit = () => {
    resubmitFacility(facility.id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Status & Verification Hub</h1>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Track inspection workflows, compliance audits, and platform listing status.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/owner/facilities" className="h-11 px-4 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Main Status Container */}
      {facility.status === 'REJECTED' && (
        <section className="bg-surface-container-lowest border-2 border-error/20 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-error/5 border-b border-error/20 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">cancel</span>
                VERIFICATION REJECTED
              </span>
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{facility.name}</h2>
                <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  {facility.location}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="rounded-xl bg-error-container/20 border border-error/40 border-l-2 p-5 space-y-3.5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-lg bg-error text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </span>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-error-container flex items-center gap-1.5">
                      <span>Rejection & Compliance Notice</span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-white/80 border border-error/30">
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  <strong className="text-error font-semibold">Inspector Feedback: </strong>
                  &quot;{facility.rejectionReason || "Requirements not met during verification."}&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href={`/owner/facilities/${facility.id}/edit`} className="w-full sm:w-auto h-11 px-5 rounded-lg bg-primary text-on-primary font-label-lg font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">edit</span>
                <span>Fix Issues & Edit Facility</span>
              </Link>
              <button onClick={handleResubmit} className="w-full sm:w-auto h-11 px-5 rounded-lg border border-outline-variant hover:bg-surface-container font-label-lg font-bold text-on-surface transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
                <span>Resubmit for Review</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {facility.status === 'PENDING' && (
        <section className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-bold uppercase tracking-wider border border-outline-variant">
                <span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
                PENDING — Field Audit Scheduled
              </span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">{facility.name}</h4>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{facility.location}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/50 space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-on-surface">Verification Milestones</span>
                <span className="text-primary">Step 3 of 4: Physical Audit</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <div className="h-1.5 rounded-full bg-secondary"></div>
                <div className="h-1.5 rounded-full bg-secondary"></div>
                <div className="h-1.5 rounded-full bg-primary animate-pulse"></div>
                <div className="h-1.5 rounded-full bg-outline-variant/50"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {facility.status === 'APPROVED' && (
        <section className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-white text-[11px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                APPROVED & LIVE ON QUICKCOURT
              </span>
              <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">{facility.name}</h4>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{facility.location}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/50 space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                <span>Audit Certificate: <strong className="text-on-surface">QC-CERT-2024-LIVE</strong></span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-outline-variant/60">
              <Link href={`/owner/facilities/${facility.id}/courts`} className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container text-white text-[13px] font-bold flex items-center justify-center gap-1.5 max-w-xs">
                <span className="material-symbols-outlined text-[16px]">sports_tennis</span>
                <span>Manage Courts</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {facility.status === 'DRAFT' && (
        <section className="bg-surface-container-lowest border border-dashed border-outline/80 rounded-xl p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">edit_note</span>
                DRAFT
              </span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">{facility.name}</h4>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{facility.location}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-outline-variant/60 flex items-center gap-2">
              <Link href={`/owner/facilities/${facility.id}/edit`} className="h-9 px-3 rounded-lg border border-outline-variant text-[13px] font-semibold hover:bg-surface-container text-on-surface flex items-center gap-1">
                Continue Setup
              </Link>
              <button onClick={handleResubmit} className="h-9 px-3 rounded-lg bg-primary text-white text-[13px] font-bold hover:bg-primary-container">
                Submit for Approval
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
