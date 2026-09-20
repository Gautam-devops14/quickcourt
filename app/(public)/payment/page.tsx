"use client"
import { useState, useEffect, Suspense } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

function PaymentContent() {
  const formatTime = (t: string) => {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const searchParams = useSearchParams();
  const paymentTypeParam = searchParams.get('type') === 'ADVANCE_20' ? 'ADVANCE_20' : 'FULL';

  const { cartSlot, cartSlots, facilities, courts, confirmBooking } = useStore();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(7 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = String(Math.floor(countdown / 60)).padStart(2, '0');
  const secs = String(countdown % 60).padStart(2, '0');

  const activeSlots = cartSlots.length > 0 ? cartSlots : (cartSlot ? [cartSlot] : []);

  if (activeSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">payment</span>
        <h2 className="font-headline-lg text-on-surface mb-2">No active booking</h2>
        <p className="text-on-surface-variant font-body-md mb-6">Start by selecting a venue and time slot.</p>
        <Link href="/explore" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md">Explore Venues</Link>
      </div>
    );
  }

  const firstSlot = activeSlots[0];
  const court = courts.find(c => c.id === firstSlot.courtId);
  const facility = facilities.find(f => f.id === court?.facilityId);

  const totalHours = activeSlots.length;
  const courtRate = activeSlots.reduce((sum, s) => sum + (s.calculatedPrice || court?.pricePerHour || 0), 0);
  const gst = Math.round(courtRate * 0.18);
  const total = courtRate + gst;
  const isAdvance = paymentTypeParam === 'ADVANCE_20';
  const advanceAmount = Math.round(total * 0.2);
  const amountToChargeNow = isAdvance ? advanceAmount : total;
  const remainingAtVenue = isAdvance ? (total - advanceAmount) : 0;

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1500));
    confirmBooking(amountToChargeNow, {
      totalAmount: total,
      paymentType: isAdvance ? 'ADVANCE_20' : 'FULL',
    });
    router.push('/success');
  };

  const TAB_CONFIG: { key: PaymentMethod; icon: string; label: string; sub: string }[] = [
    { key: 'upi', icon: 'qr_code_scanner', label: 'UPI / Instant QR', sub: 'GPay, PhonePe, Paytm' },
    { key: 'card', icon: 'credit_card', label: 'Credit / Debit Card', sub: 'Visa, MC, Rupay' },
    { key: 'netbanking', icon: 'account_balance', label: 'Net Banking', sub: 'SBI, HDFC, ICICI' },
  ];

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-6 lg:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Payment Methods — 7 cols */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Simulation Notice Banner */}
          <div className="bg-surface-container-low border border-primary-container/20 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">info</span>
            <div>
              <h1 className="text-label-lg font-label-lg text-primary-container font-bold">
                Simulated Payment Gateway — For Demonstration & Testing Only
              </h1>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                No real funds will be charged. Choose any test method below to generate a valid automated turnstile entry barcode and confirmation voucher.
              </p>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-6">
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">Select Payment Method</h2>
              <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
                End-to-End Encrypted
              </span>
            </div>

            {/* Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {TAB_CONFIG.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setMethod(tab.key)}
                  type="button"
                  className={`p-3.5 text-left rounded-xl border-2 transition-all relative flex flex-col justify-between h-24
                    ${method === tab.key
                      ? 'border-primary-container bg-surface-container-low'
                      : 'border-outline-variant bg-surface-container-lowest hover:border-outline'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`material-symbols-outlined ${method === tab.key ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                      {tab.icon}
                    </span>
                    {method === tab.key ? (
                      <span className="w-4 h-4 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px]">
                        <span className="material-symbols-outlined text-xs">check</span>
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-outline"></span>
                    )}
                  </div>
                  <div>
                    <span className="block text-label-md font-label-md text-on-surface font-bold">{tab.label}</span>
                    <span className="block text-[11px] text-on-surface-variant">{tab.sub}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* UPI Form */}
            {method === 'upi' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                  <span className="text-label-sm font-label-sm font-semibold text-on-surface-variant">Supported apps:</span>
                  {['Google Pay', 'PhonePe', 'Paytm UPI'].map(app => (
                    <span key={app} className="px-2 py-0.5 bg-surface-container-lowest border border-outline-variant rounded text-label-sm font-label-sm text-on-surface font-semibold">{app}</span>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="block text-label-sm font-label-sm text-on-surface font-semibold" htmlFor="upi-id">
                    Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-[42px] px-3 pr-24 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                      id="upi-id"
                      placeholder="username@bank"
                      type="text"
                      defaultValue="player@okaxis"
                    />
                    <div className="absolute right-2.5 top-2.5 flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Verified</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-on-surface-variant">A payment notification will be pushed to your test UPI application.</p>
                </div>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-outline-variant"></div>
                  <span className="flex-shrink mx-4 text-label-sm font-label-sm text-outline uppercase font-semibold">or scan and pay</span>
                  <div className="flex-grow border-t border-outline-variant"></div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border border-dashed border-outline rounded-xl bg-surface-container-low/50">
                  <div className="w-28 h-28 bg-surface-container-lowest border border-outline-variant rounded-lg p-2 flex items-center justify-center shadow-xs">
                    <div className="w-full h-full border-4 border-on-surface p-1 relative flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-on-surface"></div>
                        <div className="w-5 h-5 bg-on-surface"></div>
                      </div>
                      <div className="flex justify-center items-center">
                        <span className="material-symbols-outlined text-primary-container text-lg">sports_tennis</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-on-surface"></div>
                        <div className="w-2 h-2 bg-on-surface self-end"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-1.5">
                    <div className="text-label-md font-label-md text-on-surface font-bold">Scan Court Booking QR with any UPI App</div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">Instant confirmation: QR remains dynamic and auto-refreshes with the 8-minute slot hold window.</p>
                    <div className="inline-flex items-center gap-1.5 text-label-sm font-label-sm text-secondary font-semibold">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      Zero processing fees applies on QuickCourt UPI
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card Form */}
            {method === 'card' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                  <span className="text-label-sm font-label-sm text-on-surface-variant">Accepted Networks:</span>
                  <div className="flex items-center gap-2">
                    {['VISA', 'Mastercard', 'AMEX'].map(n => (
                      <span key={n} className="px-2 py-0.5 bg-surface-container-lowest border border-outline-variant rounded text-label-sm font-label-sm font-bold text-tertiary">{n}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-label-sm font-label-sm text-on-surface font-semibold" htmlFor="card-holder">Cardholder Name</label>
                  <input className="w-full h-[42px] px-3 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none" id="card-holder" type="text" defaultValue="PLAYER ONE" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-label-sm font-label-sm text-on-surface font-semibold" htmlFor="card-num">Card Number</label>
                  <div className="relative">
                    <input className="w-full h-[42px] px-3 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-mono" id="card-num" type="text" defaultValue="4532 •••• •••• 4920" />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-xl">credit_card</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-label-sm font-label-sm text-on-surface font-semibold" htmlFor="card-exp">Expiry Date</label>
                    <input className="w-full h-[42px] px-3 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-mono" id="card-exp" placeholder="MM/YY" type="text" defaultValue="08/28" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-label-sm font-label-sm text-on-surface font-semibold" htmlFor="card-cvv">CVV / CVC</label>
                    <div className="relative">
                      <input className="w-full h-[42px] px-3 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-mono" id="card-cvv" maxLength={4} placeholder="123" type="password" />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-lg">help</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Form */}
            {method === 'netbanking' && (
              <div className="space-y-4">
                <label className="block text-label-sm font-label-sm text-on-surface font-semibold">Select Mock Bank or Institutional Account</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['SBI Netbanking', 'HDFC Direct', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Other Banks...'].map((bank, i) => (
                    <button key={bank} type="button" className={`p-3 border rounded-lg text-left text-label-sm font-label-sm font-semibold transition-all
                      ${i === 0 ? 'border-primary-container bg-surface-container-low text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'}`}>
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action */}
            <div className="pt-6 mt-6 border-t border-outline-variant space-y-3">
              <button
                onClick={handlePay}
                disabled={isProcessing}
                type="button"
                className="w-full h-[44px] bg-primary hover:bg-primary-hover active:scale-[0.99] text-on-primary font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 transition-all font-semibold shadow-xs disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">lock</span>
                    <span>Pay ₹{amountToChargeNow} Now {isAdvance && '(20% Advance)'}</span>
                  </>
                )}
              </button>
              <Link
                href="/checkout"
                className="w-full h-[44px] bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant text-on-surface font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 transition-all font-semibold"
              >
                Cancel & Return to Summary
              </Link>
              <p className="text-center text-[12px] text-on-surface-variant pt-1">
                Immediate gate turnstile PIN and NFC access pass will be generated upon confirmation.
              </p>
            </div>
          </div>

          {/* Security & Guarantee Badges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: 'shield', label: 'PCI-DSS Compliant', sub: 'Simulated token vault' },
              { icon: 'pin', label: 'Instant Turnstile PIN', sub: 'Automated court doors' },
              { icon: 'currency_exchange', label: '100% Refundable', sub: 'Up to 2 hrs prior' },
            ].map(badge => (
              <div key={badge.label} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary-container text-xl">{badge.icon}</span>
                <div>
                  <div className="text-label-sm font-label-sm font-bold text-on-surface">{badge.label}</div>
                  <div className="text-[11px] text-on-surface-variant">{badge.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary — 5 cols */}
        <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">

          {/* Slot Hold Countdown */}
          <div className="bg-surface-container-lowest border-2 border-secondary/40 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-xl" style={{ animation: 'spin 3s linear infinite' }}>timer</span>
              <div>
                <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Slot Hold Expiration</span>
                <span className="text-label-md font-label-md text-on-surface font-semibold">Court reserved temporarily</span>
              </div>
            </div>
            <div className="bg-secondary-container/30 px-3 py-1.5 rounded-lg border border-secondary/20">
              <span className="font-mono text-headline-sm font-headline-sm font-bold text-on-secondary-container">{mins}:{secs}</span>
            </div>
          </div>

          {/* Venue Details & Match Specs */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant">
              <div>
                <span className="text-[11px] font-bold text-primary-container uppercase tracking-wider bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant">Confirmed Slot Hold</span>
                <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface mt-1.5">{facility?.name}</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">location_on</span> {facility?.location}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-xl">sports_tennis</span>
              </div>
            </div>

            {/* Court & Session Tags */}
            <div className="grid grid-cols-2 gap-3 py-1">
              <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant">
                <span className="block text-[11px] text-on-surface-variant font-medium">Court Assignment</span>
                <span className="block text-label-md font-label-md text-on-surface font-bold">{court?.name}</span>
                <span className="block text-[11px] text-secondary font-semibold">{court?.sport}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant">
                <span className="block text-[11px] text-on-surface-variant font-medium">Schedule Window</span>
                <span className="block text-label-md font-label-md text-on-surface font-bold">{firstSlot.date}</span>
                <span className="block text-[11px] text-on-surface-variant">
                  {activeSlots.map(s => `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`).join(', ')}
                </span>
              </div>
            </div>

            {/* Price Matrix Breakdown */}
            <div className="pt-2 border-t border-outline-variant space-y-2.5">
              <div className="text-label-sm font-label-sm font-bold text-on-surface">Cost Breakdown</div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>Court Desk Rate ({totalHours} {totalHours === 1 ? 'hr' : 'hrs'})</span>
                <span className="font-medium text-on-surface">₹{courtRate}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span>QuickCourt Platform Fee</span>
                  <span className="text-[10px] font-bold bg-secondary-container text-secondary px-1.5 py-0.5 rounded">ZERO FEE</span>
                </div>
                <span className="font-medium text-secondary font-semibold">₹0.00</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>GST & Sports Facility Tax (18%)</span>
                <span className="font-medium text-on-surface">₹{gst}</span>
              </div>
              <div className="pt-3 border-t border-outline-variant space-y-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="block text-label-lg font-label-lg font-bold text-on-surface">Total Order Value</span>
                    <span className="text-[11px] text-on-surface-variant">Includes all facility permits</span>
                  </div>
                  <div className="text-right">
                    <span className="text-headline-md font-headline-md font-bold text-on-surface">₹{total}</span>
                    <span className="block text-[11px] text-on-surface-variant uppercase font-medium">INR</span>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-label-sm font-bold text-primary block">
                      {isAdvance ? 'Advance Due Now (20%)' : 'Full Payment Due Now'}
                    </span>
                    {isAdvance && (
                      <span className="text-body-xs text-on-surface-variant">
                        Remaining ₹{remainingAtVenue} payable at venue
                      </span>
                    )}
                  </div>
                  <span className="text-headline-lg font-headline-lg font-extrabold text-primary">
                    ₹{amountToChargeNow}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Notice */}
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-base mt-0.5">flash_on</span>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Upon successful simulated payment, turnstile PIN & digital pass will be issued immediately to your registered phone.
              </p>
            </div>
          </div>

          {/* Venue Access Widget */}
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-outline text-2xl">sports_score</span>
            <div className="text-[12px] text-on-surface-variant leading-snug">
              <span className="font-bold text-on-surface">Player Guidance:</span> Locker room access opens 15 minutes before slot start. Non-marking court shoes strictly required.
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

