"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from "react";

import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/';
  const [role, setRole] = useState<'USER' | 'OWNER'>('USER');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/otp?redirect=' + encodeURIComponent(redirect));
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
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Welcome back</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Select your account profile to manage court reservations and real-time schedules.</p>
          </div>

          <div className="mb-6 p-1 bg-surface-container-low border border-outline-variant/70 rounded-xl grid grid-cols-2 gap-1" role="tablist">
            <button 
              onClick={() => setRole('USER')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-label-md text-label-md transition-all focus:outline-none ${role === 'USER' ? 'text-surface-container-lowest bg-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Player / Athlete</span>
            </button>
            <button 
              onClick={() => setRole('OWNER')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-label-md text-label-md transition-all focus:outline-none ${role === 'OWNER' ? 'text-surface-container-lowest bg-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">stadium</span>
              <span>Facility Host</span>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold" htmlFor="identifier">
                Email or Mobile Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                </div>
                <input required className="w-full h-[44px] pl-10 pr-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline placeholder:font-normal focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors outline-none" id="identifier" name="identifier" placeholder="player@quickcourt.in or +91 98765 43210" type="text" />
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
                <input required className="w-full h-[44px] pl-10 pr-11 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline placeholder:font-normal focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors outline-none" id="password" name="password" placeholder="••••••••••••" type={showPassword ? 'text' : 'password'} />
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
                <span>Sign In to QuickCourt</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="relative my-6 text-center">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60"></div>
            </div>
            <div className="relative flex justify-center text-center">
              <span className="bg-surface-container-lowest px-3 font-label-sm text-label-sm text-on-surface-variant">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="h-[42px] px-3 bg-surface-container-lowest border border-outline-variant hover:border-outline hover:bg-surface-bright rounded-xl font-label-md text-label-md text-on-surface flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.99] focus:outline-none" type="button">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Google</span>
            </button>
            <button className="h-[42px] px-3 bg-surface-container-lowest border border-outline-variant hover:border-outline hover:bg-surface-bright rounded-xl font-label-md text-label-md text-on-surface flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.99] focus:outline-none" type="button">
              <svg className="w-4 h-4 fill-current text-on-surface" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-7.4-11.22-12.63-23.77-15.7-37.66-3.07-13.88-3.41-26.69-1.02-38.42 2.72-13.32 8.79-24.16 18.2-32.53 9.41-8.37 20.35-12.67 32.83-12.89 4.35 0 9.29.98 14.82 2.94 5.53 1.96 9.61 3.2 12.24 3.73 2.83-.53 7.02-1.85 12.56-3.95 5.54-2.1 10.23-3.04 14.07-2.82 12.7.65 23.23 5.37 31.6 14.15-10.99 6.64-16.32 15.82-16 27.53.33 9.36 4.14 17.29 11.44 23.82 7.3 6.53 15.89 10.34 25.79 11.43-2.18 6.64-4.89 13.06-8.14 19.27zM119.22 33.15c0-7.39 2.62-14.34 7.84-20.85 5.23-6.52 11.75-10.87 19.57-13.06.33 1.09.49 2.18.49 3.27 0 7.39-2.73 14.51-8.17 21.36-5.44 6.85-12.08 11.26-19.92 13.23-.22-1.31-.34-2.4-.34-3.28z"></path>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="mt-8 pt-5 border-t border-outline-variant/60 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don&apos;t have a QuickCourt account? 
              <Link href="/signup" className="font-label-md text-label-md text-primary font-bold hover:underline ml-1 inline-block">
                Create Account
              </Link>
            </p>
          </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}