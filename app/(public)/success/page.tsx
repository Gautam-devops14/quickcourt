"use client"
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';

// Generate a deterministic booking reference from the latest booking
function generateRef(id: string) {
  return `QC-${id.replace(/\D/g, '').slice(0, 5).padStart(5, '0')}-IN`;
}

export default function SuccessPage() {
  const { bookings, facilities, courts } = useStore();

  // Get the most recently confirmed booking
  const latestBooking = [...bookings]
    .filter(b => b.status === 'CONFIRMED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const court = latestBooking ? courts.find(c => c.id === latestBooking.courtId) : null;
  const facility = court ? facilities.find(f => f.id === court.facilityId) : null;
  const bookingRef = latestBooking ? generateRef(latestBooking.id) : 'QC-00000-IN';

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingRef);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT 8-Column Zone */}
        <div className="lg:col-span-8 space-y-6">

          {/* Core Success Headline Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-secondary-container/30 border border-primary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-label-sm font-label-sm font-semibold bg-secondary-container/30 text-on-secondary-container border border-primary/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                    TURNSTILE AUTHORIZED
                  </span>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">
                    Confirmed at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h1 className="text-headline-xl font-headline-xl text-on-surface mb-2 tracking-tight font-bold">
                  Reservation Confirmed & Turnstile Synced!
                </h1>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Your court access PIN and digital pass have been activated. A confirmation SMS and receipt have been dispatched to your mobile number (+91 ••••• 12834).
                </p>

                {/* Booking Reference Bar */}
                <div className="mt-5 p-3.5 bg-surface border border-outline-variant rounded-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">confirmation_number</span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Booking Reference:</span>
                    <span className="font-mono text-label-lg font-label-lg text-primary font-bold">#{bookingRef}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary-container hover:text-primary font-semibold transition-colors duration-150"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>Copy Reference</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Facility & Match Schedule Details Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8">
            <div className="border-b border-outline-variant pb-4 mb-6 flex items-center justify-between">
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">stadium</span>
                Facility & Match Schedule Details
              </h2>
              <span className="text-label-sm font-label-sm text-primary-container font-semibold bg-secondary-container/20 px-2 py-1 rounded">
                Verified Partner
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-label-sm font-label-sm text-on-surface-variant block uppercase">Venue & Location</span>
                <p className="text-label-lg font-label-lg text-on-surface font-semibold">{facility?.name ?? 'Ahmedabad Sports Arena'}</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant flex items-start gap-1">
                  <span className="material-symbols-outlined text-xs mt-0.5">location_on</span>
                  {facility?.location ?? 'SG Highway, Ahmedabad, Gujarat'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-label-sm font-label-sm text-on-surface-variant block uppercase">Discipline & Environment</span>
                <p className="text-label-lg font-label-lg text-on-surface font-semibold">{court?.sport ?? 'Badminton'}</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">ac_unit</span>
                  Indoor Climate Controlled
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-outline-variant/50">
                <span className="text-label-sm font-label-sm text-on-surface-variant block uppercase">Court Specification</span>
                <p className="text-label-lg font-label-lg text-primary font-bold">{court?.name ?? 'Court 1'}</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Premium Court Surface</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-outline-variant/50">
                <span className="text-label-sm font-label-sm text-on-surface-variant block uppercase">Scheduled Time Block</span>
                <div className="flex items-center gap-2">
                  <span className="text-label-lg font-label-lg text-on-surface font-semibold">{latestBooking?.date ?? 'Today'}</span>
                </div>
                <p className="text-label-md font-label-md text-primary-container font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  60 Minutes Session
                </p>
              </div>
            </div>

            {/* Financial Statement */}
            <div className="mt-6 pt-4 border-t border-outline-variant flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Paid via Instant UPI / Mock Gateway</p>
                <p className="text-label-sm font-label-sm text-secondary font-medium">Zero QuickCourt Platform Markup Guarantee</p>
              </div>
              <div className="text-right">
                <span className="text-body-sm font-body-sm text-on-surface-variant block">Total Amount Settled</span>
                <span className="text-headline-md font-headline-md font-bold text-primary">
                  ₹{latestBooking?.amount ?? 0} INR
                </span>
              </div>
            </div>
          </div>

          {/* Venue Rules & Compliance Advisory */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary-container text-2xl shrink-0 mt-0.5">info</span>
            <div className="space-y-1">
              <h3 className="text-label-lg font-label-lg text-on-surface font-semibold">Strict Facility Protocols</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                Only authentic <strong>non-marking gum rubber court shoes</strong> are permitted past the green turnstiles. Arrive with adequate time for wristband collection.
                Only authentic <strong>non-marking gum rubber court shoes</strong> are permitted past the access gates. Arrive with adequate time for wristband collection.
              </p>
              <p className="text-body-sm font-body-sm text-on-surface-variant pt-1">
                Front Desk support hotline:{' '}
                <a className="text-primary font-semibold hover:underline" href="tel:+917940012100">+91 79 4001 2100</a> (Ext. 2)
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT 4-Column Zone */}
        <div className="lg:col-span-4 space-y-6">

          {/* Confirmed Match Check-In Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-surface-container text-on-surface px-5 py-4 flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">confirmation_number</span>
                <span className="text-label-lg font-bold tracking-wide">CONFIRMED PASS</span>
              </div>
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                #{bookingRef}
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Check-in steps */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                  <span className="text-on-surface-variant font-medium">Assigned Arena:</span>
                  <span className="font-bold text-on-surface">{facility?.name ?? 'Ahmedabad Sports Arena'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                  <span className="text-on-surface-variant font-medium">Allocated Court:</span>
                  <span className="font-bold text-primary">{court?.name ?? 'Court 1'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                  <span className="text-on-surface-variant font-medium">Payment Type:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {latestBooking?.paymentType === 'ADVANCE_20' ? '20% Security Advance' : '100% Full Payment'}
                  </span>
                </div>
                {latestBooking?.remainingAmount && latestBooking.remainingAmount > 0 ? (
                  <div className="flex justify-between items-center text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="font-bold">Remaining at Venue Desk:</span>
                    <span className="font-extrabold text-sm">₹{latestBooking.remainingAmount}</span>
                  </div>
                ) : null}
              </div>

              {/* Front Desk Instructions */}
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60 text-center">
                <p className="text-xs font-bold text-on-surface flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">storefront</span>
                  Show Ref #{bookingRef} at Venue Reception
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Arrive 10 minutes prior to kickoff for racquet and wristband check-in.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-1">
                <Link href="/bookings" className="w-full h-11 bg-primary hover:bg-primary-hover text-on-primary font-label-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-lg">event_note</span>
                  View in My Bookings
                </Link>
                <Link href="/" className="w-full h-11 bg-surface-container-lowest hover:bg-surface border border-outline-variant text-on-surface font-label-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-all">
                  <span className="material-symbols-outlined text-lg">home</span>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* On-Site Navigation */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-label-md font-label-md font-bold text-on-surface uppercase">On-Site Navigation</span>
              <span className="material-symbols-outlined text-primary-container">directions</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Enter through <strong>North Entrance B</strong>. Follow court lines toward your assigned court. Gear lockers are located immediately to the right of Turnstile #2.
            </p>
            <a className="text-label-sm font-label-sm text-primary font-semibold hover:underline inline-flex items-center gap-1" href="https://maps.google.com" target="_blank" rel="noreferrer">
              Open in Maps
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
