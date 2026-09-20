"use client"
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { currentUser, bookings } = useStore();
  
  // Default to a mock user if not logged in for the UI design preview
  const user = currentUser || {
    name: 'Alex Morgan',
    email: 'player@quickcourt.in',
    role: 'USER',
  };

  const userBookings = bookings.filter(b => b.userId === (currentUser?.id || 'u1'));
  const completedMatches = userBookings.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED').length;
  const totalHours = completedMatches; // Assuming 1 hour per match for mock

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-8 space-y-8">
      {/* Page Header with Headline & Global Action Group */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Athlete Profile & Preferences</h1>
            <span className="bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-secondary-fixed-dim">
              Verified Pro
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-3xl">
            Manage your personal information, court contact credentials for turnstile PIN access, and security.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="h-11 px-4 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-error-container/30 hover:border-error hover:text-error transition-all duration-150 flex items-center gap-2 active:scale-[0.98]" type="button">
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
          <button className="h-11 px-6 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm flex items-center gap-2 active:scale-[0.98]" type="button">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Grid: 2/3 Content Form & 1/3 Summary + Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (8 cols): Personal Details & Notification Cards */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Personal Details Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 md:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Personal & Contact Credentials</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Primary information synchronized across all certified indoor and outdoor venues.</p>
              </div>
              <span className="material-symbols-outlined text-primary">badge</span>
            </div>

            {/* Avatar & Identity Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/40">
              <div className="relative group shrink-0">
                <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=200" alt="Athlete Profile" className="w-20 h-20 rounded-xl object-cover border-2 border-primary-container shadow-sm" />
                <div className="absolute inset-0 bg-inverse-surface/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-on-primary">photo_camera</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{user.name}</h3>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-semibold">Tier 1 Athlete</span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Recommended format: Square JPG or PNG, maximum 5MB.</p>
                <div className="flex items-center gap-3 pt-2">
                  <button className="h-9 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5" type="button">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Upload New Photo
                  </button>
                  <button className="h-9 px-3 rounded-lg text-error hover:bg-error-container/30 font-label-md text-label-md transition-colors flex items-center gap-1.5" type="button">
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">Full Legal Name</label>
                <div className="relative">
                  <input id="fullName" type="text" defaultValue={user.name} className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition" />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline-variant text-lg">person</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
                  <span className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified
                  </span>
                </div>
                <div className="relative">
                  <input id="email" type="email" defaultValue={user.email} className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition" />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline-variant text-lg">mail</span>
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="phone">Mobile Phone Number</label>
                  <span className="flex items-center gap-1 bg-secondary-fixed/50 text-on-secondary-fixed-variant px-2 py-0.5 rounded text-label-sm font-bold">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    SMS Verified
                  </span>
                </div>
                <div className="relative">
                  <input id="phone" type="tel" defaultValue="+91 98250 12834" className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition" />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline-variant text-lg">phone_iphone</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-sm text-secondary">lock_clock</span>
                  Used for immediate SMS turnstile PIN delivery at booked facilities.
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface">Primary Disciplines / Preferred Sports</label>
                <div className="flex flex-wrap gap-2">
                  {['Tennis', 'Pickleball', 'Badminton', '5v5 Football Turf'].map(sport => (
                    <button key={sport} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md border border-primary-container" type="button">
                      <span className="material-symbols-outlined text-sm">sports</span>
                      {sport}
                      <span className="material-symbols-outlined text-sm hover:opacity-75">check</span>
                    </button>
                  ))}
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary font-label-md text-label-md transition-colors" type="button">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Sport
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="skillRating">Athlete Skill Level & Official Rating</label>
                <div className="relative">
                  <input id="skillRating" type="text" defaultValue="Intermediate / Advanced (DUPR 4.25 / BWF Tier 2)" className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition" />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline-variant text-lg">military_tech</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="location">Preferred Play Location / Hub</label>
                <div className="relative">
                  <input id="location" type="text" defaultValue="Ahmedabad, GJ (SG Highway & Prahlad Nagar)" className="w-full h-11 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition" />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline-variant text-lg">location_on</span>
                </div>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-outline-variant/30 space-y-4">
                <span className="block font-label-md text-label-md text-on-surface font-bold">Emergency Venue Contact (Safety Protocol)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="emName">Contact Name & Relationship</label>
                    <input id="emName" type="text" defaultValue="Sarah Morgan (Sister)" className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="emPhone">Emergency Phone Number</label>
                    <input id="emPhone" type="tel" defaultValue="+91 98795 44102" className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Court Pass & Notification Preferences Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Court Pass & Notification Preferences</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Automated delivery systems for gate turnstiles, match alerts, and financial splits.</p>
              </div>
              <span className="material-symbols-outlined text-primary">notifications_active</span>
            </div>

            <div className="divide-y divide-outline-variant/30">
              <div className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Turnstile Gate Sync (4-Digit Instant PIN)</span>
                    <span className="bg-secondary-fixed/50 text-on-secondary-fixed-variant px-2 py-0.5 rounded text-label-sm font-bold">Recommended</span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Automatically dispatch instant SMS and Wallet passes 15 minutes before court reservation starts. Turnstiles unlock upon code entry.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold block">Match Reminder Notifications</span>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Select how early QuickCourt sends warmup reminders and court surface condition updates.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container" />
                      <span className="font-body-sm text-body-sm text-on-surface">15 mins prior</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container" />
                      <span className="font-body-sm text-body-sm text-on-surface">1 hour prior</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container" />
                      <span className="font-body-sm text-body-sm text-on-surface">24 hours prior</span>
                    </label>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant text-xl mt-1">timer</span>
              </div>

              <div className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold block">Auto-Split Payment & Guest Alerts</span>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Instantly request equal court fees from booked teammates and notify them with personal gate barcodes.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Athlete Status, Cred Points & Security Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Athlete Status & Membership Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Athlete Identity</span>
              <span className="material-symbols-outlined text-secondary">sports_score</span>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm font-bold text-primary">Tier 1 Verified Athlete</span>
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                <span>QuickCourt ID:</span>
                <code className="font-mono font-bold text-on-surface bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/40">#QC-ATH-9204</code>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-bold">Court Cred Points</span>
                <span className="font-label-lg text-label-lg font-bold text-primary">420 <span className="text-on-surface-variant font-normal text-xs">/ 500 pts</span></span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: '84%' }}></div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-secondary text-sm">redeem</span>
                <span>80 pts to: <strong className="text-on-surface font-medium">Free 60-min racket stringing</strong></span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/30 text-center">
              <div className="p-2.5 rounded-lg bg-surface-container-low/40 border border-outline-variant/30">
                <span className="block font-headline-md text-headline-md font-bold text-on-surface">{completedMatches}</span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant mt-0.5">Matches</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low/40 border border-outline-variant/30">
                <span className="block font-headline-md text-headline-md font-bold text-on-surface">{totalHours}</span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant mt-0.5">Hours</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low/40 border border-outline-variant/30">
                <span className="block font-headline-md text-headline-md font-bold text-secondary">0%</span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant mt-0.5">No-Show</span>
              </div>
            </div>
          </div>

          {/* Security & Account Actions Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Security & Auth</h3>
              <span className="material-symbols-outlined text-on-surface-variant">shield</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <div>
                  <span className="font-label-md text-label-md text-on-surface block">Password</span>
                  <span className="text-on-surface-variant text-xs">Updated 24 days ago</span>
                </div>
                <button className="text-primary font-label-md text-label-md hover:underline" type="button">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between text-body-sm font-body-sm pt-2 border-t border-outline-variant/20">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md text-on-surface font-bold">2-Factor Auth (2FA)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  </div>
                  <span className="text-on-surface-variant text-xs">Active via SMS & App</span>
                </div>
                <span className="font-label-sm text-label-sm bg-secondary-fixed/50 text-on-secondary-fixed-variant px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-outline-variant/20">
                <span className="font-label-md text-label-md text-on-surface block">Linked Providers</span>
                <div className="flex items-center justify-between p-2 rounded-lg border border-outline-variant/40 bg-surface-container-low/30">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-on-surface">account_circle</span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Google</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border border-outline-variant/40 bg-surface-container-low/30">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-on-surface">devices</span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Apple ID</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Connected
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20">
                <button className="w-full h-10 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2" type="button">
                  <span className="material-symbols-outlined text-base">devices_other</span>
                  Log Out of All Devices
                </button>
              </div>

              <div className="pt-2 text-center">
                <button className="text-error font-body-sm text-body-sm hover:underline inline-flex items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  Deactivate Athlete Account
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
