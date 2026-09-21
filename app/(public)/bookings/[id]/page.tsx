"use client"
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const formatTime = (t: string) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr === 0 ? 12 : hr}:${m || '00'} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const { bookings, facilities, courts, slots, cancelBooking, rescheduleBooking } = useStore();
  const router = useRouter();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferPhone, setTransferPhone] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [selectedNewSlot, setSelectedNewSlot] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const booking = bookings.find(b => b.id === params.id);
  if (!booking) return notFound();

  const court = courts.find(c => c.id === booking.courtId);
  const facility = facilities.find(f => f.id === booking.facilityId);
  const bookingSlots = slots.filter(s => booking.slotIds.includes(s.id));
  
  if (!court || !facility) return notFound();

  const firstSlot = bookingSlots[0];
  const lastSlot = bookingSlots[bookingSlots.length - 1];
  const timeString = firstSlot && lastSlot ? `${formatTime(firstSlot.startTime)} – ${formatTime(lastSlot.endTime)}` : '07:00 PM – 08:00 PM';
  const duration = (bookingSlots.length || 1) * 60; // Assumes 60m slots
  
  const bookingRef = `QC-${booking.id.replace(/\D/g, '').slice(0, 5).padStart(5, '0')}-${court.sport.substring(0,2).toUpperCase()}`;

  // Helper to format date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const handleCancel = () => {
    if (confirm(`Confirm cancellation of Booking #${bookingRef}? Your ₹${booking.amount} will be refunded instantly.`)) {
      cancelBooking(booking.id);
      router.push('/bookings');
    }
  };

  const isCancelled = booking.status === 'CANCELLED';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `QuickCourt Booking #${bookingRef}`,
      text: `Join me for ${court.sport} at ${facility.name} on ${formatDate(booking.date)} (${timeString})!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // user aborted
      }
    } else {
      navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${court.sport} Match at ${facility.name}`);
    const details = encodeURIComponent(`Booking Ref: #${bookingRef}\nCourt: ${court.name}\nVenue: ${facility.name}, ${facility.location}`);
    const location = encodeURIComponent(`${facility.name}, ${facility.location}`);
    
    // Construct Google Calendar Link
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  // Alternative available slots for rescheduling
  const availableAltSlots = slots.filter(s => s.courtId === court.id && s.status === 'AVAILABLE');

  const handleConfirmReschedule = () => {
    if (!selectedNewSlot) return;
    rescheduleBooking(booking.id, selectedNewSlot);
    setShowRescheduleModal(false);
    alert('Booking rescheduled successfully!');
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferPhone) return;
    setTransferSuccess(true);
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferSuccess(false);
      setTransferPhone('');
      alert(`Booking #${bookingRef} transferred to +91 ${transferPhone}!`);
    }, 1200);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 space-y-6">
      {/* BREADCRUMBS & CONTEXT NAV */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            Home
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="hover:text-primary transition-colors cursor-default">Athlete Portal</span>
          <span className="text-outline-variant">/</span>
          <Link href="/bookings" className="hover:text-primary transition-colors">My Bookings</Link>
          <span className="text-outline-variant">/</span>
          <span className={`font-semibold ${isCancelled ? 'text-on-surface-variant line-through' : 'text-on-surface text-primary'}`}>
            Booking #{bookingRef}
          </span>
        </nav>
        <Link href="/bookings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to My Bookings
        </Link>
      </div>

      {/* PAGE HEADER */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface-container text-tertiary font-label-sm text-label-sm tracking-wider font-bold">
                REF: #{bookingRef}
              </span>
              {isCancelled ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-container/30 border border-error/40 text-error font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  Cancelled & Refunded
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 border border-secondary/40 text-on-secondary-container font-label-md text-label-md font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  Confirmed Booking
                </div>
              )}
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Booking Details — {facility.name}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">pin_drop</span> 
              {facility.location}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98] transition-all font-label-lg text-label-lg font-semibold"
            >
              <span className="material-symbols-outlined text-primary">print</span>
              Print Ticket
            </button>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98] transition-all font-label-lg text-label-lg"
            >
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Tax Invoice
            </button>
            {!isCancelled && (
              <>
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98] transition-all font-label-lg text-label-lg"
                >
                  <span className="material-symbols-outlined text-secondary">calendar_month</span>
                  Add to Calendar
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98] transition-all font-label-lg text-label-lg"
                >
                  <span className="material-symbols-outlined text-primary">{copiedLink ? 'check' : 'share'}</span>
                  {copiedLink ? 'Link Copied!' : 'Share'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {/* Match & Court Overview Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant gap-2">
              <div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sports_score</span>
                Match & Court Specification
              </div>
              {!isCancelled && (
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  Upcoming Match
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 relative rounded-xl overflow-hidden border border-outline-variant h-44 md:h-auto bg-surface-container-low flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant opacity-50">stadium</span>
                <span className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-0.5 rounded font-label-sm text-label-sm font-bold tracking-wider">
                  {court.name}
                </span>
              </div>
              <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-secondary font-bold tracking-wider">PREMIUM TIER</span>
                    <span className="text-on-surface-variant font-label-md text-label-md">{duration} Min Session</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">{court.name} — Premium Surface</h3>
                  <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">
                    Premium indoor court surface. Climate controlled with LED floodlight arrays.
                  </p>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60 grid grid-cols-2 gap-2 text-on-surface font-label-md text-label-md">
                  <div>
                    <span className="block text-on-surface-variant font-body-sm text-body-sm">Schedule Window</span>
                    <span className="font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                      {timeString}
                    </span>
                  </div>
                  <div>
                    <span className="block text-on-surface-variant font-body-sm text-body-sm">Date & Discipline</span>
                    <span className="font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">event</span>
                      {formatDate(booking.date)} • {court.sport}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment & Settlement Ledger */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                Payment & Settlement Ledger
              </h2>
              {isCancelled ? (
                <div className="flex items-center gap-1.5 text-error font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>money_off</span>
                  Fully Refunded
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Paid via QuickCourt MockGateway
                </div>
              )}
            </div>

            <div className="space-y-2.5 font-body-sm text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Court Desk Standard Rate</span>
                <span className="font-medium text-on-surface font-body-md text-body-md">₹{court.pricePerHour}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant items-center">
                <span className="inline-flex items-center gap-1">
                  QuickCourt Platform Convenience Fee
                  <span className="px-1.5 py-0.25 text-[10px] bg-secondary-container/40 text-on-secondary-container rounded font-bold">ZERO MARKUP</span>
                </span>
                <span className="font-medium text-secondary font-body-md text-body-md">₹0.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>State / GST Sports Facility Tax (18%)</span>
                <span className="font-medium text-on-surface font-body-md text-body-md">₹{Math.round(court.pricePerHour * 0.18)}</span>
              </div>
              
              <div className="pt-3 border-t border-outline-variant/60 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-on-surface font-semibold text-sm">Total Booking Value</span>
                  <span className="text-base font-bold text-on-surface">₹{booking.totalAmount ?? booking.amount}</span>
                </div>
                <div className="flex justify-between items-baseline text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="font-bold text-xs">Amount Paid (Online Advance)</span>
                  <span className="font-extrabold text-sm">₹{booking.advanceAmount ?? booking.amount}</span>
                </div>
                <div className="flex justify-between items-baseline text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/60">
                  <span className="text-xs font-semibold">Remaining Due at Venue Desk</span>
                  <span className="font-bold text-sm text-on-surface">₹{booking.remainingAmount ?? 0}</span>
                </div>
              </div>
            </div>

            {!isCancelled && (
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">group</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-semibold text-on-surface">Split with Squad</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Share payment link with teammates</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md font-semibold transition-all">
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Invite Teammates
                </button>
              </div>
            )}
          </section>

          {/* Facility Access Protocols */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                Facility Access Protocols & Rules
              </h2>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Standard Rules</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/60">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">footprint</span>
                <div>
                  <h4 className="font-semibold text-on-surface font-label-md text-label-md">Footwear Mandate</h4>
                  <p className="text-on-surface-variant font-body-sm text-body-sm mt-0.5">Strict non-marking gum-rubber indoor shoes required on matting.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/60">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">door_open</span>
                <div>
                  <h4 className="font-semibold text-on-surface font-label-md text-label-md">Check-in Process</h4>
                  <p className="text-on-surface-variant font-body-sm text-body-sm mt-0.5">Please check in at the reception 15 minutes before your scheduled match.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          {/* Court Check-In Details Card */}
          {!isCancelled && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">meeting_room</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Venue Check-in Guide</h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">
                  Reception Desk
                </span>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/80 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-semibold">Booking ID</span>
                  <span className="font-mono font-bold text-primary text-sm">#{bookingRef}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-semibold">Allocated Court</span>
                  <span className="font-bold text-on-surface">{court.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-semibold">Match Slot</span>
                  <span className="font-bold text-on-surface">{timeString}</span>
                </div>
                {booking.remainingAmount && booking.remainingAmount > 0 ? (
                  <div className="pt-2 border-t border-outline-variant/60 flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-semibold">Pay at Desk</span>
                    <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ₹{booking.remainingAmount} Due
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-outline-variant/60 flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-semibold">Payment Status</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Fully Settled (100%)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Present your Booking Reference ID at the facility front desk 10 minutes prior to session commencement for direct court access.
              </p>
            </section>
          )}

          {/* Cancellation & Refund Policy Box */}
          {!isCancelled && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <h2 className="flex items-center gap-2 text-on-surface font-headline-sm text-headline-sm">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_return</span>
                  Refund & Modification
                </h2>
                <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-bold">
                  100% REFUND
                </span>
              </div>
              
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/60 space-y-2 font-body-sm text-body-sm">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">timer</span>
                  <p className="text-on-surface">
                    <strong>Free cancellation window:</strong> Strict 2 hours before kickoff time.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">credit_card</span>
                  <p className="text-on-surface-variant">Full <strong>₹{booking.amount}</strong> will return immediately to original method.</p>
                </div>
              </div>

              {/* Cancellation & Modification Controls */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleCancel}
                  className="w-full bg-error-container text-error hover:bg-error hover:text-on-error border border-error/40 font-label-lg text-label-lg font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  Cancel Booking
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md font-semibold text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base text-primary">update</span>
                    Reschedule
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md font-semibold text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base text-secondary">swap_horiz</span>
                    Transfer
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Emergency Venue Support */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-3 shadow-sm print:hidden">
            <div className="flex items-center gap-2 text-on-surface font-headline-sm text-headline-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>contact_support</span>
              Venue Assistance
            </div>
            <p className="text-on-surface-variant font-body-sm text-body-sm">
              Need urgent court assistance or experiencing lighting delays?
            </p>
            <div className="space-y-2 pt-1 font-body-sm text-body-sm">
              <a className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low transition-colors text-on-surface" href="tel:+919825012834">
                <span className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                  Duty Desk Manager
                </span>
                <span className="font-mono text-primary font-bold">+91 98250 12834</span>
              </a>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/60 bg-surface-container-low/40 text-on-surface">
                <span className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-secondary">support_agent</span>
                  24/7 Gate Dispatch
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-bold">LIVE ONLINE</span>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* TAX INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">Tax Invoice / Receipt</h3>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <div className="space-y-3 text-body-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold text-on-surface">INV-{bookingRef}-2026</span>
              </div>
              <div className="flex justify-between">
                <span>GSTIN / Tax ID:</span>
                <span className="font-mono font-semibold text-on-surface">24AABCS1429B1Z8</span>
              </div>
              <div className="flex justify-between">
                <span>Place of Supply:</span>
                <span className="font-semibold text-on-surface">Gujarat (State Code 24)</span>
              </div>
              <div className="flex justify-between">
                <span>Billed To:</span>
                <span className="font-semibold text-on-surface">Player One (+91 ••••• 12834)</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span>Court Desk Fee:</span>
                <span className="font-semibold text-on-surface">₹{court.pricePerHour}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span className="font-semibold text-on-surface">₹{Math.round(court.pricePerHour * 0.09)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span className="font-semibold text-on-surface">₹{Math.round(court.pricePerHour * 0.09)}</span>
              </div>
              <div className="pt-2 border-t border-outline-variant/60 flex justify-between font-bold text-on-surface text-body-md">
                <span>Total Tax Invoice Value:</span>
                <span className="text-primary">₹{booking.amount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => { setShowInvoiceModal(false); handlePrint(); }}
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-label-md font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Download / Print
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2.5 border border-outline-variant rounded-xl font-label-md text-on-surface hover:bg-surface-container-low"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">update</span>
                <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">Reschedule Booking</h3>
              </div>
              <button onClick={() => setShowRescheduleModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              Select another open time slot for <strong>{court.name}</strong> without any change fees:
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {availableAltSlots.length === 0 ? (
                <p className="text-body-sm text-outline p-4 text-center">No alternative slots available for today.</p>
              ) : (
                availableAltSlots.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedNewSlot(s.id)}
                    type="button"
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedNewSlot === s.id
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant bg-surface-container-lowest hover:border-outline text-on-surface'
                    }`}
                  >
                    <span>{formatTime(s.startTime)} – {formatTime(s.endTime)}</span>
                    <span className="text-xs">₹{s.calculatedPrice || court.pricePerHour}</span>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleConfirmReschedule}
                disabled={!selectedNewSlot}
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-label-md font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Confirm Reschedule
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2.5 border border-outline-variant rounded-xl font-label-md text-on-surface hover:bg-surface-container-low"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFER MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">swap_horiz</span>
                <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">Transfer Court Pass</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {transferSuccess ? (
              <div className="p-6 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-secondary animate-bounce">check_circle</span>
                <h4 className="font-bold text-on-surface">Pass Transferred!</h4>
                <p className="text-body-sm text-on-surface-variant">Recipient will receive SMS gate pass with instant court check-in access.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmTransfer} className="space-y-4">
                <p className="text-body-sm text-on-surface-variant">
                  Transfer court reservation and gate pass to a friend&apos;s mobile number.
                </p>
                <div className="space-y-1.5">
                  <label className="text-label-sm font-bold text-on-surface">Recipient Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-outline-variant rounded-l-xl bg-surface-container text-body-sm font-mono text-on-surface-variant">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={transferPhone}
                      onChange={(e) => setTransferPhone(e.target.value)}
                      className="flex-1 p-2.5 border border-outline-variant rounded-r-xl bg-surface-container-lowest text-on-surface outline-none focus:border-primary font-mono text-body-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-secondary text-on-secondary py-2.5 rounded-xl font-label-md font-bold flex items-center justify-center gap-2"
                  >
                    Transfer Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2.5 border border-outline-variant rounded-xl font-label-md text-on-surface hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
