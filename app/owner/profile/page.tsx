"use client";
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OwnerProfilePage() {
  const { currentUser, facilities, updateUser, signOut } = useStore();
  const router = useRouter();
  
  const currentOwnerId = currentUser?.id ?? 'o1';
  const ownerFacilities = facilities.filter(f => f.ownerId === currentOwnerId);

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const handleSave = () => {
    if (!name.trim()) {
      setMessage('Name cannot be empty.');
      return;
    }
    updateUser({ name, email });
    setMessage('Profile updated successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Owner Account Settings</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              System Admin
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Manage your personal profile, settlement accounts, API keys, and notification preferences.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {message && (
            <span className={`text-label-md font-bold px-3 py-1.5 rounded-lg ${
              message.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-error-container/30 text-error'
            }`}>
              {message}
            </span>
          )}
          <button onClick={handleLogout} className="h-11 px-4 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-error-container/30 hover:border-error hover:text-error transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign Out
          </button>
          <button onClick={handleSave} className="h-11 px-6 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">save</span>
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Identity Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 md:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Primary Contact Credentials</h2>
              </div>
              <span className="material-symbols-outlined text-primary">badge</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/40">
              <div className="w-20 h-20 rounded-xl object-cover border-2 border-primary-container shadow-sm flex items-center justify-center bg-surface-container-highest text-3xl font-bold text-outline">
                {currentUser?.name?.slice(0, 1) || 'O'}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{currentUser?.name || 'Owner User'}</h3>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-fixed-variant font-semibold">Verified Partner</span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Owner ID: #{currentUser?.id || 'o1'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Portfolio Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Facilities Managed</span>
                <span className="font-bold text-on-surface">{ownerFacilities.length}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Active Courts</span>
                <span className="font-bold text-on-surface">Multiple</span>
              </div>
            </div>
            <Link href="/owner/facilities" className="w-full inline-flex justify-center py-2 bg-surface-container-low hover:bg-surface-container rounded-lg border border-outline-variant font-label-md transition-colors">
              Go to Facilities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
