"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/otp');
  };

  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-[460px] mx-auto">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm p-6 sm:p-8 relative">
          
          <div className="mb-6">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Create your account</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-2">Join QuickCourt to instantly book verified sports facilities across the city.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="firstName">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[19px]">person</span>
                  </div>
                  <input required className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-3.5 py-2.5 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" id="firstName" name="firstName" placeholder="Alex" type="text" />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="lastName">Last Name</label>
                <input required className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2.5 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" id="lastName" name="lastName" placeholder="Morgan" type="text" />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[19px]">mail</span>
                </div>
                <input required className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-3.5 py-2.5 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" id="email" name="email" placeholder="player@quickcourt.in" type="email" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="phone">Mobile Phone Number</label>
                <span className="text-label-sm font-label-sm text-secondary font-medium">SMS Verification</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[19px]">phone</span>
                </div>
                <input required className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-3.5 py-2.5 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" id="phone" name="phone" placeholder="+91 98765 43210" type="tel" />
              </div>
              <p className="mt-1.5 text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                <span>Used for instant SMS match booking pass delivery</span>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                <span className="text-body-sm font-body-sm text-outline">Min 8 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                </div>
                <input required className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-10 py-2.5 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" id="password" name="password" placeholder="Minimum 8 characters" type={showPassword ? 'text' : 'password'} />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface focus:outline-none" title="Toggle password visibility" type="button">
                  <span className="material-symbols-outlined text-[19px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="pt-1 pb-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="flex items-center h-5 mt-0.5">
                  <input defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer transition" id="terms" type="checkbox" />
                </div>
                <span className="text-body-sm font-body-sm text-on-surface-variant leading-snug">
                  I agree to the QuickCourt 
                  <a className="text-primary font-medium underline hover:text-primary-container ml-1" href="#">Terms of Service</a> 
                  and 
                  <a className="text-primary font-medium underline hover:text-primary-container ml-1" href="#">Privacy Policy</a>
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button className="w-full h-11 bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99]" type="submit">
                <span>Create QuickCourt Account</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-container-lowest px-3 font-label-sm text-label-sm text-outline uppercase tracking-wider">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface text-on-surface font-label-md text-label-md transition-colors" type="button">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"></path>
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
              </svg>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface text-on-surface font-label-md text-label-md transition-colors" type="button">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.65-1.24z"></path>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
            <p className="text-body-md font-body-md text-on-surface-variant">
              Already have a QuickCourt account? 
              <Link href="/login" className="text-primary font-semibold hover:text-primary-container underline decoration-primary/40 underline-offset-4 transition-colors ml-1">Sign In</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 px-2">
          <div className="flex items-center justify-center gap-1.5 text-center">
            <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-center border-x border-outline-variant/60">
            <span className="material-symbols-outlined text-secondary text-[18px]">contactless</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Turnstile Pass Sync</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-center">
            <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Zero Markup Booking</span>
          </div>
        </div>
      </div>
    </main>
  );
}

