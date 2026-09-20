"use client";
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

export default function AdminProfilePage() {
  const { currentUser } = useStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm font-body-sm text-on-surface-variant border-b border-outline-variant/40 pb-3">
        <div className="flex items-center gap-2 text-label-md font-label-md">
          <Link href="/admin" className="hover:text-on-surface">Admin Portal</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Admin Profile & Security Settings</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface text-label-sm font-label-sm border border-outline-variant/60">
            <span className="material-symbols-outlined text-primary text-[14px]">shield</span>
            Gov-Node: QCA-SVR-W04
          </span>
          <span className="text-label-sm font-label-sm text-on-surface-variant">Standard Time: IST</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">Admin Profile & Operations Credentials</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1 max-w-3xl">
            Manage municipal supervisory identity, two-factor authentication, AMC field ops signing authority, and active system session tokens across Ahmedabad.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low text-label-lg font-label-lg transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Edit Profile</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-lg font-label-lg shadow-sm">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Save Changes</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-error border border-error-container hover:bg-error-container/30 transition-colors text-label-lg font-label-lg" title="Sign out session">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">Identity Details</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface-container-high border-2 border-primary-container text-on-surface flex items-center justify-center text-xl font-bold">
              {currentUser?.name?.slice(0, 1) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-headline-sm text-on-surface font-bold">{currentUser?.name || 'Admin User'}</h4>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary-container text-on-secondary-container uppercase">Tier-1 Admin</span>
              </div>
              <p className="text-body-sm font-body-sm text-outline mt-1">{currentUser?.email || 'admin@quickcourt.in'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-on-surface-variant font-semibold">Assigned Administrative Jurisdiction</label>
              <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">location_on</span>
                <span className="font-medium truncate">AMC (Central, West & North Zones)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
                <h3 className="text-headline-sm font-headline-sm text-on-surface">Municipal Authority</h3>
              </div>
              <span className="text-label-sm font-label-sm text-secondary bg-secondary-container/20 px-2 py-0.5 rounded font-bold">DELEGATED</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Authority Tier</span>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
                <div className="text-label-lg font-label-lg text-primary font-bold">Tier-1 Super Admin & AMC Enforcement Officer</div>
                <div className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Full municipal override & dispatch authority across 48 sports venues.</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Signing Privileges</span>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
                <p className="text-body-sm font-body-sm text-on-surface font-medium leading-relaxed">
                  Authorized to issue AMC Sports Compliance Certificates and approve or reject commercial facility venue registrations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">lock_clock</span>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">Security, 2FA & Active Sessions</h3>
            </div>
            <span className="text-label-sm font-label-sm text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Zero-Trust Enforced
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div>
                <div className="text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Master Password</div>
                <div className="text-body-md font-body-md font-semibold text-on-surface mt-0.5">Last updated 18 days ago</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface text-label-md font-label-md text-on-surface transition-colors shadow-sm">
                Change
              </button>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">2FA Authentication</span>
                  <span className="bg-secondary text-on-primary text-[10px] font-bold px-1.5 py-0.2 rounded">ENABLED</span>
                </div>
                <div className="text-body-md font-body-md font-semibold text-on-surface mt-0.5">Hardware Token & SMS OTP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
