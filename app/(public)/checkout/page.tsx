"use client"
import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TimeSlot } from '@/types';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function CheckoutPage() {
  const formatTime = (t: string) => {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const { cartSlot, cartSlots, facilities, courts, unlockSlot } = useStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState(8 * 60 + 42); // 8:42
  const [paymentOption, setPaymentOption] = useState<'FULL' | 'ADVANCE_20'>('ADVANCE_20');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          unlockSlot();
          router.push('/explore');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router, unlockSlot]);

  const mins = String(Math.floor(countdown / 60)).padStart(2, '0');
  const secs = String(countdown % 60).padStart(2, '0');

  const activeSlots: TimeSlot[] = cartSlots.length > 0 ? cartSlots : (cartSlot ? [cartSlot] : []);

  if (activeSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">remove_shopping_cart</span>
        <h2 className="font-headline-lg text-on-surface mb-2">No slot selected</h2>
        <p className="text-on-surface-variant font-body-md mb-6">Select a court and time slot to continue.</p>
        <Link href="/explore" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md">Explore Venues</Link>
      </div>
    );
  }

  const firstSlot = activeSlots[0];
  const court = courts.find(c => c.id === firstSlot.courtId);
  const facility = facilities.find(f => f.id === court?.facilityId);

  // Total rate across all selected slots
  const totalHours = activeSlots.length;
  const courtRate = activeSlots.reduce((sum: number, s: TimeSlot) => sum + (s.calculatedPrice || court?.pricePerHour || 0), 0);
  const gst = Math.round(courtRate * 0.18);
  const total = courtRate + gst;

  // Split Payment Options
  const advanceAmount = Math.round(total * 0.2);
  const payAtVenueAmount = total - advanceAmount;

  return (
    <ProtectedRoute>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 min-h-screen">
      {/* Clean Header Section */}
      <div className="border-b border-outline-variant pb-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-label-sm font-label-sm uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Reservation Lock Active ({totalHours} {totalHours === 1 ? 'Slot' : 'Slots'} Held)
            </div>
            <h1 className="text-headline-xl font-headline-xl text-on-surface font-bold tracking-tight">Review & Confirm Reservation</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">
              Verify your booking details and court allocation before proceeding to payment.
            </p>
          </div>
          <Link href={`/venue/${facility?.id}/book`} className="text-label-md font-semibold text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-base">edit</span>
            Modify Selection
          </Link>
        </div>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN — 8 cols */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Venue & Match Details Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-outline-variant">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary text-on-primary text-label-sm font-label-sm uppercase">Verified Partner</span>
                  <div className="flex items-center gap-1 text-label-md font-label-md text-on-surface">
                    <span className="material-symbols-outlined text-amber-500 text-base">star</span>
                    <span>4.8</span>
                    <span className="text-outline font-normal">(120 reviews)</span>
                  </div>
                </div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface font-bold">{facility?.name}</h2>
                <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-outline text-base">pin_drop</span>
                  {facility?.location}
                </p>
              </div>
              <Link href={`/venue/${facility?.id}/book`} className="text-label-lg font-label-lg text-primary hover:text-on-primary-container transition-colors inline-flex items-center gap-1 self-start">
                <span>Change Court</span>
                <span className="material-symbols-outlined text-base">edit</span>
              </Link>
            </div>

            {/* Match Specs Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-outline-variant">
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-surface-container-high flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">sports_tennis</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Sport & Format</p>
                  <p className="text-body-md font-semibold text-on-surface mt-0.5">{court?.sport}</p>
                  <p className="text-label-sm text-on-surface-variant">Indoor Climate Controlled</p>
                </div>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-surface-container-high flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">grid_view</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Assigned Surface</p>
                  <p className="text-body-md font-semibold text-on-surface mt-0.5">{court?.name}</p>
                  <p className="text-label-sm text-on-surface-variant">Standard Badminton Synthetic / Wood</p>
                </div>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-surface-container-high flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">calendar_today</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Date & Session</p>
                  <p className="text-body-md font-semibold text-on-surface mt-0.5">{new Date(firstSlot.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                  <p className="text-label-sm text-on-surface-variant">{totalHours} Selected Time Slot{totalHours > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-surface-container-high flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">schedule</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Time Windows</p>
                  <p className="text-body-md font-semibold text-on-surface mt-0.5">
                    {activeSlots.map((s: TimeSlot) => `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`).join(', ')}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">{totalHours * 60} Minutes Total Reservation</p>
                </div>
              </div>
            </div>

            {/* Selected Slots Itemized List */}
            <div className="mt-4 pt-2">
              <h4 className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">checklist</span>
                Reserved Slots Breakdown ({totalHours})
              </h4>
              <div className="space-y-2">
                {activeSlots.map((s: TimeSlot, idx: number) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 text-body-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-on-surface">{formatTime(s.startTime)} – {formatTime(s.endTime)}</span>
                      <span className="text-xs text-on-surface-variant">({court?.name})</span>
                    </div>
                    <span className="font-bold text-on-surface">₹{s.calculatedPrice || court?.pricePerHour}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Structure Preference: 20% Advance vs Full Payment */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">Payment Option</h3>
                <p className="text-body-sm text-on-surface-variant">Choose how you want to pay for this reservation</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {/* Option A: 20% Advance */}
              <div
                onClick={() => setPaymentOption('ADVANCE_20')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentOption === 'ADVANCE_20'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-secondary text-[11px] font-bold uppercase">Recommended</span>
                    <h4 className="text-label-lg font-bold text-on-surface mt-1.5">Pay 20% Advance</h4>
                    <p className="text-body-xs text-on-surface-variant mt-1">Pay 20% now to lock slots, pay remaining at venue desk.</p>
                  </div>
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentOption === 'ADVANCE_20'}
                    onChange={() => setPaymentOption('ADVANCE_20')}
                    className="w-4 h-4 text-primary mt-1"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-baseline justify-between">
                  <span className="text-label-sm text-on-surface-variant">Due Now:</span>
                  <span className="text-headline-sm font-extrabold text-primary">₹{advanceAmount}</span>
                </div>
                <div className="flex items-baseline justify-between text-body-xs text-on-surface-variant mt-0.5">
                  <span>Pay at Venue:</span>
                  <span className="font-semibold text-on-surface">₹{payAtVenueAmount}</span>
                </div>
              </div>

              {/* Option B: Full Payment */}
              <div
                onClick={() => setPaymentOption('FULL')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentOption === 'FULL'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase">Zero Dues</span>
                    <h4 className="text-label-lg font-bold text-on-surface mt-1.5">Pay Full 100%</h4>
                    <p className="text-body-xs text-on-surface-variant mt-1">Clear full amount now for express zero-touch venue check-in.</p>
                  </div>
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentOption === 'FULL'}
                    onChange={() => setPaymentOption('FULL')}
                    className="w-4 h-4 text-primary mt-1"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-baseline justify-between">
                  <span className="text-label-sm text-on-surface-variant">Due Now:</span>
                  <span className="text-headline-sm font-extrabold text-primary">₹{total}</span>
                </div>
                <div className="flex items-baseline justify-between text-body-xs text-on-surface-variant mt-0.5">
                  <span>Pay at Venue:</span>
                  <span className="font-semibold text-secondary">₹0.00 (Fully Paid)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Player Information Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-2xl">person_pin</span>
                <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">Primary Booker & Squad Details</h3>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider block">Booked Under</label>
                <p className="text-body-md font-semibold text-on-surface">Player One</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">QuickCourt Member</p>
              </div>
              <div className="space-y-1">
                <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider block">Contact Coordinates</label>
                <p className="text-body-md font-body-md text-on-surface">+91 ••••• 12834</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">player@quickcourt.com</p>
              </div>
            </div>
          </div>

          {/* 4. Cancellation Policy Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
              <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">Cancellation & Facility Guarantees</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">check_circle</span>
                <div className="space-y-1">
                  <h4 className="text-headline-sm font-headline-sm text-on-surface">100% Free Cancellation</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Cancel up to <strong>2 hours prior to start time</strong> for an instant automatic 100% refund of advance paid.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">bolt</span>
                <div className="space-y-1">
                  <h4 className="text-headline-sm font-headline-sm text-on-surface">Operational Shield</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Full facility credit or direct refund if any session delay occurs due to operational issues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — 4 cols sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">

          {/* Countdown Timer */}
          <div className="bg-surface-container-high border border-outline-variant rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-lg animate-pulse">alarm</span>
              <span className="text-body-sm font-medium">Court slot hold expires in:</span>
            </div>
            <span className="text-label-lg font-mono font-bold text-primary bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant">
              {mins}:{secs}
            </span>
          </div>

          {/* Sticky Price Breakdown */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
              <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">Payment Summary</h3>
              <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline">Desk Rate Sync</span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Court Fee ({totalHours} {totalHours === 1 ? 'hr' : 'hrs'})</span>
                <span className="font-semibold text-on-surface">₹{courtRate}</span>
              </div>
              <div className="flex justify-between items-center text-body-md">
                <div className="flex items-center gap-1">
                  <span className="text-on-surface-variant">QuickCourt Platform Fee</span>
                  <span className="text-[10px] bg-secondary-container text-secondary px-1 rounded font-bold uppercase">Zero Fee</span>
                </div>
                <span className="font-semibold text-secondary">₹0.00</span>
              </div>
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">GST & Sports Cess (18%)</span>
                <span className="font-semibold text-on-surface">₹{gst}</span>
              </div>
            </div>

            <div className="border-t border-outline-variant my-2 pt-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-headline-sm font-headline-sm text-on-surface">Total Order Value</span>
                <div className="text-right">
                  <span className="text-headline-lg font-headline-lg text-on-surface font-bold tracking-tight">₹{total}</span>
                </div>
              </div>

              {/* Due Amount Highlight based on payment choice */}
              <div className="p-3.5 bg-surface-container-low rounded-lg border border-primary/20 my-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-label-sm font-bold text-primary uppercase">Amount Due Now</span>
                    <span className="block text-[11px] text-on-surface-variant">
                      {paymentOption === 'ADVANCE_20' ? '20% Security Advance' : '100% Full Payment'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-headline-xl font-headline-xl text-primary font-extrabold tracking-tight">
                      ₹{paymentOption === 'ADVANCE_20' ? advanceAmount : total}
                    </span>
                  </div>
                </div>
                {paymentOption === 'ADVANCE_20' && (
                  <div className="mt-2 pt-2 border-t border-outline-variant/60 flex justify-between text-body-xs text-on-surface-variant">
                    <span>Remaining at Venue Desk:</span>
                    <span className="font-semibold text-on-surface">₹{payAtVenueAmount}</span>
                  </div>
                )}
              </div>
              <p className="text-label-sm text-on-surface-variant">Guaranteed transparent desk checkout. No surprise gate fees.</p>
            </div>

            {/* CTAs */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push(`/payment?type=${paymentOption}&total=${total}&advance=${advanceAmount}`)}
                className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] text-on-primary font-label-lg text-label-lg h-12 px-6 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-sm font-bold"
              >
                <span>Proceed to Pay ₹{paymentOption === 'ADVANCE_20' ? advanceAmount : total}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
              <Link href={`/venue/${facility?.id}/book`} className="w-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface font-label-lg text-label-lg h-11 px-6 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 font-medium">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Back to Time Selection</span>
              </Link>
            </div>

            {/* Security Trust Badges */}
            <div className="mt-6 pt-5 border-t border-outline-variant space-y-2.5">
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-base">lock</span>
                <span>256-Bit Bank Grade TLS Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-base">sync_saved_locally</span>
                <span>Direct Desk Rate Realtime Sync</span>
              </div>
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-base">price_check</span>
                <span>Zero Hidden Gate or Locker Fees</span>
              </div>
            </div>
          </div>

          {/* Venue Help Desk */}
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary">support_agent</span>
              <div>
                <p className="font-semibold text-on-surface">Need immediate venue assistance?</p>
                <p className="text-outline text-xs">Direct desk line: +91 79 4001 2100</p>
              </div>
            </div>
            <button className="text-primary font-label-md text-label-md hover:underline">Call Desk</button>
          </div>
        </div>
      </div>
      </main>
    </ProtectedRoute>
  );
}
