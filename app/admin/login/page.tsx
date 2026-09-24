"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from "react";

import Link from 'next/link';
import { useStore } from '@/contexts/StoreContext';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, currentUser } = useStore();
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ADMIN') router.push('/admin');
      else if (currentUser.role === 'OWNER') router.push('/owner');
      else router.push('/');
    }
  }, [currentUser, router]);
  const redirect = searchParams?.get('redirect') || '/admin';
  
  // We'll keep role selector visually, but authentication is strictly email+password
  const [role, setRole] = useState<'USER' | 'OWNER'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = login(identifier, password, 'ADMIN');
    if (!result.success || !result.user) {
      setError(result.error || 'Login failed.');
      return;
    }
    
    // Redirect based on user role if no specific redirect is given
    if (redirect === '/') {
      router.push('/');
    } else {
      router.push(redirect);
    }
  };

  return (
    <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-[460px] mx-auto">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-5 border-b border-outline-variant/60 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-surface-container text-primary">
                <span className="material-symbols-outlined text-[16px]">sports_tennis</span>
              </span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-bold">Secure Access Hub</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded">v2.4 Ready</span>
          </div>

          <div className="mb-6 text-left">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Admin Portal Access</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Authorized personnel only.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold" htmlFor="identifier">
                Email or Mobile Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                </div>
                <input required value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full h-[44px] pl-10 pr-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline placeholder:font-normal focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors outline-none" id="identifier" name="identifier" placeholder="admin" type="text" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="password">
                  Password
                </label>
                <a className="font-label-sm text-label-sm text-primary hover:underline transition-all" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <input required value={password} onChange={e => setPassword(e.target.value)} className="w-full h-[44px] pl-10 pr-11 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline placeholder:font-normal focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors outline-none" id="password" name="password" placeholder="••••••••••••" type={showPassword ? 'text' : 'password'} />
                <button onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface focus:outline-none" type="button">
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input defaultChecked className="w-[18px] h-[18px] rounded border-outline-variant text-primary-container focus:ring-primary-container focus:ring-offset-0 focus:ring-1 cursor-pointer" name="remember" type="checkbox" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">Remember this device for 30 days</span>
              </label>
            </div>

            <div className="pt-2">
              <button className="w-full h-[46px] bg-primary-container hover:bg-primary active:bg-primary/95 text-surface-container-lowest font-label-lg text-label-lg font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-1" type="submit">
                <span>Admin Login</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

        </div>
        
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-on-surface-variant">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">nfc</span>
            <span>Instant Booking Sync</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">price_check</span>
            <span>Verified Desk Rates</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}