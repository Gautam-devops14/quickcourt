"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

export default function OtpPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-[440px] mx-auto">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm p-6 sm:p-8 relative">
          
          <div className="mb-6">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Verify Identity</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-2 leading-relaxed">
              For your security, please enter the 6-digit access code sent to your registered device.
            </p>
            
            <div className="mt-3 p-2.5 rounded-lg bg-surface-container-low/70 border border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px] text-primary">mark_email_read</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">+91 98765 43210 • p***@quickcourt.in</span>
              </div>
              <button className="font-label-sm text-label-sm text-primary hover:text-secondary font-bold underline underline-offset-2 shrink-0 ml-2" type="button">
                Edit
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                One-Time Security Token
              </label>
              
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                <div className="relative">
                  <input readOnly className="otp-digit w-full h-14 sm:h-16 text-center font-headline-xl text-headline-xl font-bold text-on-surface bg-surface-container-lowest border-2 border-primary-container rounded-xl focus:outline-none transition-all duration-150 shadow-sm" type="text" value="4" />
                </div>
                <div className="relative">
                  <input readOnly className="otp-digit w-full h-14 sm:h-16 text-center font-headline-xl text-headline-xl font-bold text-on-surface bg-surface-container-lowest border-2 border-primary-container rounded-xl focus:outline-none transition-all duration-150 shadow-sm" type="text" value="8" />
                </div>
                <div className="relative">
                  <input ref={inputRef} required className="otp-digit w-full h-14 sm:h-16 text-center font-headline-xl text-headline-xl font-bold text-on-surface bg-surface-container-lowest border-2 border-primary-container rounded-xl ring-4 ring-secondary-container/40 focus:outline-none transition-all duration-150 shadow-sm" maxLength={1} type="text" />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-container rounded-full animate-pulse"></span>
                </div>
                <div className="relative">
                  <input className="otp-digit w-full h-14 sm:h-16 text-center font-headline-xl text-headline-xl font-bold text-on-surface bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-container focus:ring-4 focus:ring-secondary-container/40 focus:outline-none transition-all duration-150" maxLength={1} type="text" />
                </div>
                <div className="relative">
                  <input className="otp-digit w-full h-14 sm:h-16 text-center font-headline-xl text-headline-xl font-bold text-on-surface bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-container focus:ring-4 focus:ring-secondary-container/40 focus:outline-none transition-all duration-150" maxLength={1} type="text" />
                </div>
                <div className="relative">
                  <input className="otp-digit w-full h-14 sm:h-16 text-center font-headline-xl text-headline-xl font-bold text-on-surface bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary-container focus:ring-4 focus:ring-secondary-container/40 focus:outline-none transition-all duration-150" maxLength={1} type="text" />
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm px-1">
                <span className="flex items-center gap-1 text-[12px]">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
                  Passphrase active for 5 minutes
                </span>
                <span className="text-[12px] font-mono font-medium text-outline">Token #QC-84920</span>
              </div>
            </div>

            <button className="w-full h-12 bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99] group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" type="submit">
              <span>Verify & Continue</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-150 group-hover:translate-x-1">arrow_forward</span>
            </button>

            <div className="pt-2 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Didn&apos;t receive a code?
              </span>
              <div className="flex items-center gap-2">
                <button className="font-label-md text-label-md text-outline cursor-not-allowed transition-colors duration-150 flex items-center gap-1.5" disabled type="button">
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>Resend in <span className="font-semibold text-on-surface">0:42</span></span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 flex flex-col gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant px-1 font-bold">
                Alternative Methods
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-9 px-2.5 bg-surface-container-lowest hover:bg-surface-bright border border-outline-variant/60 rounded-lg flex items-center justify-center gap-1.5 text-on-surface font-label-sm text-label-sm transition-colors duration-150" type="button">
                  <span className="material-symbols-outlined text-[16px] text-primary">phonelink_lock</span>
                  <span className="truncate">Authenticator App</span>
                </button>
                <button className="h-9 px-2.5 bg-surface-container-lowest hover:bg-surface-bright border border-outline-variant/60 rounded-lg flex items-center justify-center gap-1.5 text-on-surface font-label-sm text-label-sm transition-colors duration-150" type="button">
                  <span className="material-symbols-outlined text-[16px] text-primary">sms</span>
                  <span className="truncate">Send via SMS</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 px-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">256-Bit SSL Encrypted</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Bank-tier facility security</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[18px]">nfc</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">Turnstile Pass Sync</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Instant gate permissions</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">Verified Identity</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">Global athlete registry</span>
          </div>
        </div>
      </div>
    </main>
  );
}
