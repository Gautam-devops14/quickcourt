"use client"
import { useState, useMemo } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TimeSlot } from '@/types';

export default function BookVenuePage({ params }: { params: { id: string } }) {
  const { facilities, courts, slots, toggleLockSlot, unlockSlot, cartSlots, cartSlot, currentUser } = useStore();
  const router = useRouter();
  
  // Date state (dynamic calendar)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [timeBlockFilter, setTimeBlockFilter] = useState<'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING'>('ALL');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [durationLimitError, setDurationLimitError] = useState<string>('');

  const facility = facilities.find(f => f.id === params.id);

  // Operating parameters
  const maxBookingDuration = facility?.maxBookingDuration || 2; // e.g. 2 hours
  const slotIntervalMinutes = facility?.slotDuration || 60;    // e.g. 60 min
  const maxSlotsAllowed = Math.floor((maxBookingDuration * 60) / slotIntervalMinutes);

  // Active courts with Web Book enabled (Requirement 7)
  const facilityCourts = courts.filter(c => c.facilityId === facility?.id && c.status === 'ACTIVE' && c.webBookEnabled !== false);
  const allFacilityCourts = courts.filter(c => c.facilityId === facility?.id); // for display/status check

  const selectedDateObj = new Date(selectedDate);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const isWeekendSelected = selectedDayOfWeek === 0 || selectedDayOfWeek === 6;

  // Active selected cart slots
  const activeCartSlots: TimeSlot[] = cartSlots.length > 0 ? cartSlots : (cartSlot ? [cartSlot] : []);

  // Handle Date Selection: clear previous cart and re-calculate slots & weekend tag (P0 Item 18)
  const handleSelectDate = (newDate: string) => {
    if (newDate === selectedDate) return;
    // Clear cart slots from previous date
    unlockSlot();
    setDurationLimitError('');
    setSelectedDate(newDate);
  };

  // Generate slots for selected date and operating hours reflecting live booking/lock state
  const facilitySlots = useMemo(() => {
    if (!facility) return [];
    const facilityOpenHour = facility.is24Hours ? 0 : parseInt((facility.openTime || '06:00').split(':')[0]);
    const facilityCloseHour = facility.is24Hours ? 24 : parseInt((facility.closeTime || '23:00').split(':')[0]);

    const generated: TimeSlot[] = [];
    facilityCourts.forEach(c => {
      const startH = c.is24Hours ? 0 : (c.openTime ? parseInt(c.openTime.split(':')[0]) : facilityOpenHour);
      const endH = c.is24Hours ? 24 : (c.closeTime ? parseInt(c.closeTime.split(':')[0]) : facilityCloseHour);

      for (let h = startH; h < endH; h++) {
        const startStr = `${String(h).padStart(2, '0')}:00`;
        const endStr = `${String(h + 1).padStart(2, '0')}:00`;
        const isNight = h >= 18;
        const slotId = `slot-${c.id}-${selectedDate}-${startStr}`;

        // Check central state for this slot on this date
        const centralSlot = slots.find(s => 
          (s.id === slotId || (s.courtId === c.id && s.date === selectedDate && s.startTime === startStr))
        );

        const slotPrice = isWeekendSelected
          ? (isNight ? (c.weekendNightPrice ?? Math.round(c.pricePerHour * 1.5)) : (c.weekendDayPrice ?? Math.round(c.pricePerHour * 1.2)))
          : (isNight ? (c.weekdayNightPrice ?? Math.round(c.pricePerHour * 1.3)) : (c.weekdayDayPrice ?? c.pricePerHour));

        let status: 'AVAILABLE' | 'LOCKED' | 'BOOKED' | 'BLOCKED' = centralSlot ? centralSlot.status : 'AVAILABLE';

        generated.push({
          id: centralSlot ? centralSlot.id : slotId,
          courtId: c.id,
          date: selectedDate,
          startTime: startStr,
          endTime: endStr,
          status,
          isNight,
          isWeekend: isWeekendSelected,
          calculatedPrice: slotPrice
        });
      }
    });
    return generated;
  }, [slots, selectedDate, facilityCourts, facility, isWeekendSelected]);

  if (!facility) return notFound();

  // Time block filter
  const filteredSlots = facilitySlots.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0]);
    if (timeBlockFilter === 'MORNING') return hour >= 6 && hour < 12;
    if (timeBlockFilter === 'AFTERNOON') return hour >= 12 && hour < 17;
    if (timeBlockFilter === 'EVENING') return hour >= 17 && hour < 23;
    return true;
  });

  // Slot click supporting multi-court selection and maxBookingDuration per court (Requirement 3)
  const handleSlotClick = (slotId: string, status: string) => {
    setDurationLimitError('');
    const isCurrentlySelected = activeCartSlots.some(s => s.id === slotId);

    if (isCurrentlySelected) {
      toggleLockSlot(slotId);
      return;
    }

    if (status !== 'AVAILABLE') return;

    const targetSlot = facilitySlots.find(s => s.id === slotId);
    if (!targetSlot) return;

    // Count existing slots selected for THIS SPECIFIC COURT
    const courtSlotsInCart = activeCartSlots.filter(s => s.courtId === targetSlot.courtId);
    if (courtSlotsInCart.length >= maxSlotsAllowed) {
      const courtName = facilityCourts.find(c => c.id === targetSlot.courtId)?.name || 'Court';
      setDurationLimitError(`${courtName} maximum duration reached: ${maxBookingDuration} hours (${maxSlotsAllowed} slots max per court).`);
      return;
    }

    toggleLockSlot(slotId, targetSlot);
  };

  const handleContinue = () => {
    if (activeCartSlots.length === 0) return;
    
    // Check login
    if (!currentUser) {
      router.push(`/login?redirect=/venue/${params.id}/book`);
      return;
    }
    router.push('/checkout');
  };

  // Compute total cart price dynamically
  const totalCartPrice = activeCartSlots.reduce((sum, slot) => {
    const c = courts.find(crt => crt.id === slot.courtId);
    if (!c) return sum;
    const hour = parseInt(slot.startTime.split(':')[0]);
    const isNight = hour >= 18;
    const rate = isWeekendSelected
      ? (isNight ? (c.weekendNightPrice ?? c.pricePerHour) : (c.weekendDayPrice ?? c.pricePerHour))
      : (isNight ? (c.weekdayNightPrice ?? c.pricePerHour) : (c.weekdayDayPrice ?? c.pricePerHour));
    return sum + (slot.calculatedPrice ?? rate);
  }, 0);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const prev = new Date(currentMonthDate);
    prev.setMonth(prev.getMonth() - 1);
    const today = new Date();
    if (prev.getFullYear() < today.getFullYear() || (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())) {
      return;
    }
    setCurrentMonthDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonthDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonthDate(next);
  };

  // 7-day strip from today
  const dateStrip = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const label = isToday ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' });
    const day = `${d.getDate()} ${d.toLocaleDateString('en-IN', { month: 'short' })}`;
    return { iso, label, day, isWeekend: d.getDay() === 0 || d.getDay() === 6 };
  });

  // Reference pricing court
  const sampleCourt = facilityCourts[0] || courts.find(c => c.facilityId === facility.id) || {
    pricePerHour: 500,
    weekdayDayPrice: 500,
    weekdayNightPrice: 650,
    weekendDayPrice: 600,
    weekendNightPrice: 750,
  };

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT MATRIX CANVAS — 8 COLS */}
        <section className="lg:col-span-8 space-y-6">

          {/* UPFRONT PRICING BREAKDOWN CARD */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                <h3 className="text-headline-sm font-bold text-on-surface">Standard Tariff Matrix ({facility.name})</h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant/40">
                {isWeekendSelected ? 'Weekend Active' : 'Weekday Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-3.5 rounded-lg border transition-all ${!isWeekendSelected ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-surface-container-low/60 border-outline-variant/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-primary">calendar_view_week</span>
                    Weekdays (Mon – Fri)
                  </span>
                  {!isWeekendSelected && <span className="text-[10px] bg-primary text-on-primary font-bold px-1.5 py-0.25 rounded">Active Today</span>}
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">wb_sunny</span> Day (06:00 – 18:00)
                  </span>
                  <span className="font-bold text-on-surface">₹{sampleCourt.weekdayDayPrice ?? sampleCourt.pricePerHour}/hr</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">bedtime</span> Night (18:00 – 23:00)
                  </span>
                  <span className="font-bold text-primary">₹{sampleCourt.weekdayNightPrice ?? Math.round(sampleCourt.pricePerHour * 1.3)}/hr</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-lg border transition-all ${isWeekendSelected ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-surface-container-low/60 border-outline-variant/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-primary">event_available</span>
                    Weekends (Sat – Sun)
                  </span>
                  {isWeekendSelected && <span className="text-[10px] bg-secondary text-on-secondary font-bold px-1.5 py-0.25 rounded">Peak Selected</span>}
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">wb_sunny</span> Day (06:00 – 18:00)
                  </span>
                  <span className="font-bold text-on-surface">₹{sampleCourt.weekendDayPrice ?? Math.round(sampleCourt.pricePerHour * 1.2)}/hr</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">bedtime</span> Night + Lighted
                  </span>
                  <span className="font-bold text-primary">₹{sampleCourt.weekendNightPrice ?? Math.round(sampleCourt.pricePerHour * 1.5)}/hr</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-outline-variant/40 text-[11px] text-on-surface-variant">
              <span>Operating Hours: <strong>{facility.is24Hours ? '24 Hours Open' : (facility.operatingHours || `${facility.openTime || '06:00'} – ${facility.closeTime || '23:00'}`)}</strong></span>
              <span>Max Reservation: <strong>{maxBookingDuration} hrs ({maxSlotsAllowed} slots)</strong></span>
            </div>
          </div>

          {/* DATE SELECTION STRIP */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/80 p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">Select Date & Session Range</h2>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowCalendarModal(!showCalendarModal)}
                  className="flex items-center gap-1.5 text-body-sm font-body-sm text-primary hover:text-primary-container px-2.5 py-1 rounded-lg border border-outline-variant hover:border-primary transition-all"
                >
                  <span className="material-symbols-outlined text-sm">event</span>
                  <span className="font-semibold">{currentMonthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                  <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
                </button>

                {showCalendarModal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCalendarModal(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 p-3">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/40">
                        <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-surface-container text-on-surface">
                          <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        <span className="font-bold text-xs text-on-surface">{currentMonthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={handleNextMonth} className="p-1 rounded hover:bg-surface-container text-on-surface">
                          <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-on-surface-variant mb-1">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({ length: 31 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const dateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), dayNum);
                          const dateStr = dateObj.toISOString().split('T')[0];
                          const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));
                          const isChosen = selectedDate === dateStr;
                          return (
                            <button
                              key={dayNum}
                              disabled={isPast}
                              onClick={() => {
                                handleSelectDate(dateStr);
                                setShowCalendarModal(false);
                              }}
                              className={`h-8 rounded flex items-center justify-center font-semibold transition-colors ${
                                isChosen ? 'bg-primary text-on-primary font-bold' : isPast ? 'text-outline-variant cursor-not-allowed' : 'hover:bg-surface-container text-on-surface'
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Date Selector Horizontal Rail */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {dateStrip.map((d) => {
                const isSelected = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    onClick={() => handleSelectDate(d.iso)}
                    className={`flex-shrink-0 w-28 py-2.5 px-2 rounded-xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer
                      ${isSelected
                        ? 'bg-primary-container text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface text-on-surface border-outline-variant hover:border-outline'
                      }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-on-primary-container' : 'text-outline'}`}>{d.label}</span>
                    <span className="text-headline-md font-headline-md font-bold my-0.5">{d.day}</span>
                    <span className={`text-[10px] leading-tight font-semibold px-2 py-0.5 rounded-full mt-1
                      ${isSelected ? 'bg-white/20 text-white' : d.isWeekend ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary-container/30'}`}>
                      {d.isWeekend ? 'Weekend' : 'Weekday'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time Block Filter Bar */}
            <div className="pt-2 border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-label-sm font-label-sm text-outline mr-1">Time Block:</span>
                <button 
                  onClick={() => setTimeBlockFilter('ALL')} 
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${timeBlockFilter === 'ALL' ? 'bg-primary-container text-on-primary border-primary' : 'bg-surface-container-lowest text-outline hover:text-on-surface border-outline-variant'}`}
                >
                  All Day
                </button>
                <button 
                  onClick={() => setTimeBlockFilter('MORNING')} 
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${timeBlockFilter === 'MORNING' ? 'bg-primary-container text-on-primary border-primary' : 'bg-surface-container-lowest text-outline hover:text-on-surface border-outline-variant'}`}
                >
                  Morning (6 AM - 12 PM)
                </button>
                <button 
                  onClick={() => setTimeBlockFilter('AFTERNOON')} 
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${timeBlockFilter === 'AFTERNOON' ? 'bg-primary-container text-on-primary border-primary' : 'bg-surface-container-lowest text-outline hover:text-on-surface border-outline-variant'}`}
                >
                  Afternoon (12 PM - 5 PM)
                </button>
                <button 
                  onClick={() => setTimeBlockFilter('EVENING')} 
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${timeBlockFilter === 'EVENING' ? 'bg-primary-container text-on-primary border-primary' : 'bg-surface-container-lowest text-outline hover:text-on-surface border-outline-variant'}`}
                >
                  Evening (5 PM - 11 PM)
                </button>
              </div>
              <div className="text-label-sm font-label-sm text-outline flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Max {maxBookingDuration} hrs per session
              </div>
            </div>
          </div>

          {/* DURATION LIMIT WARNING BANNER */}
          {durationLimitError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-amber-700">timer_off</span>
              <div className="flex-1">
                <strong>Maximum Duration Limit:</strong> {durationLimitError}
              </div>
            </div>
          )}

          {/* LEGEND */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 px-1 text-label-sm font-label-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border-2 border-outline bg-surface-container-lowest flex items-center justify-center shadow-xs">
                <span className="text-[10px] font-bold text-on-surface">₹</span>
              </div>
              <div><span className="text-on-surface font-bold">Available</span> <span className="text-outline text-xs">(Click to reserve)</span></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary-container text-on-primary flex items-center justify-center border-2 border-primary ring-1 ring-primary">
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <div><span className="text-on-surface font-bold">Selected</span></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-surface-container-highest border border-outline-variant/80 flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-xs">person</span>
              </div>
              <div><span className="text-outline font-semibold">Booked</span></div>
            </div>
          </div>

          {/* COURT SCHEDULE MATRIX */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">

                {/* Show offline maintenance courts notice if any */}
                {allFacilityCourts.some(c => c.status === 'MAINTENANCE') && (
                  <div className="p-3 bg-surface-container-low border-b border-outline-variant/60 flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-amber-600 text-sm">construction</span>
                      Some courts at this facility are undergoing scheduled surface maintenance and unavailable for booking.
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Offline Courts Hidden
                    </span>
                  </div>
                )}

                {/* Active Court Rows */}
                {facilityCourts.length === 0 ? (
                  <div className="p-8 text-center text-on-surface-variant">
                    No active courts currently available at this venue.
                  </div>
                ) : (
                  facilityCourts.map((court, courtIdx) => {
                    const courtSlots = filteredSlots.filter(s => s.courtId === court.id);
                    return (
                      <div key={court.id} className={`p-4 border-outline-variant/50 hover:bg-surface-container-low/20 transition-colors ${courtIdx < facilityCourts.length - 1 ? 'border-b' : ''}`}>
                        {/* Court Info Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-headline-sm font-bold text-on-surface">{court.name}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">
                              {court.sport}
                            </span>
                            <span className="text-xs text-on-surface-variant font-semibold">
                              Base: ₹{court.pricePerHour}/hr
                            </span>
                          </div>
                          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-primary">lightbulb</span> LED Competition illumination
                          </span>
                        </div>

                        {/* Slot Pills Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                          {courtSlots.length === 0 ? (
                            <div className="col-span-full py-4 text-center text-xs text-on-surface-variant">No slots match the selected time filter.</div>
                          ) : (
                            courtSlots.map(slot => {
                              const isSelected = activeCartSlots.some(s => s.id === slot.id);
                              const isBooked = slot.status === 'BOOKED';
                              const isLocked = slot.status === 'LOCKED' && !isSelected;

                              return (
                                <button
                                  key={slot.id}
                                  disabled={isBooked || isLocked}
                                  onClick={() => handleSlotClick(slot.id, slot.status)}
                                  className={`h-16 rounded-xl border-2 p-2 flex flex-col items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-primary-container text-on-primary border-primary shadow-sm ring-2 ring-primary ring-offset-1'
                                      : isBooked
                                      ? 'bg-surface-container border-outline-variant/60 text-outline cursor-not-allowed'
                                      : isLocked
                                      ? 'bg-amber-50 border-amber-300 text-amber-800 cursor-not-allowed'
                                      : 'bg-surface-container-lowest hover:bg-emerald-50 border-outline-variant hover:border-primary text-on-surface cursor-pointer'
                                  }`}
                                >
                                  <div className="text-xs font-bold flex items-center gap-1">
                                    {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                                    <span>{slot.startTime} – {slot.endTime}</span>
                                  </div>
                                  <div className="text-[11px] font-semibold mt-0.5">
                                    {isBooked ? 'Booked' : isLocked ? 'In Cart' : `₹${slot.calculatedPrice}`}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT STICKY BOOKING SUMMARY RAIL — 4 COLS */}
        <aside className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">Reservation Summary</h2>
              {activeCartSlots.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  {activeCartSlots.length} {activeCartSlots.length === 1 ? 'Slot' : 'Slots'} Selected
                </span>
              )}
            </div>

            {activeCartSlots.length > 0 ? (
              <>
                {/* Session Recap Card */}
                <div className="bg-surface rounded-lg p-3.5 border border-outline-variant/60 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">sports_score</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Target Venue</span>
                      <h4 className="font-bold text-sm text-on-surface truncate">{facility.name}</h4>
                      <p className="text-xs text-primary font-semibold">
                        {facilityCourts[0]?.sport} • {isWeekendSelected ? 'Weekend Tariff' : 'Weekday Tariff'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-outline-variant/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span> Selected Date:
                      </span>
                      <span className="font-bold text-on-surface">{selectedDate} ({isWeekendSelected ? 'Weekend' : 'Weekday'})</span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-outline text-[11px] font-bold block uppercase tracking-wider">Reserved Time Slots:</span>
                      {activeCartSlots.map((s) => (
                        <div key={s.id} className="flex items-center justify-between bg-surface-container-low p-1.5 rounded text-[11px] font-semibold">
                          <span>{s.startTime} – {s.endTime}</span>
                          <span className="text-primary font-bold">₹{s.calculatedPrice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-on-surface pt-1 border-t border-outline-variant/30">
                      <span className="text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">timelapse</span> Total Duration:
                      </span>
                      <span className="font-bold text-tertiary">{activeCartSlots.length * 60} Minutes ({activeCartSlots.length} hrs)</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Financial Breakdown */}
                <div className="space-y-2.5 text-body-sm border-b border-outline-variant/60 pb-4">
                  <div className="flex justify-between items-center text-on-surface">
                    <span>Court Booking Fee ({activeCartSlots.length} hrs)</span>
                    <span className="font-semibold">₹{totalCartPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface">
                    <span className="flex items-center gap-1">
                      <span>QuickCourt Convenience Fee</span>
                      <span className="material-symbols-outlined text-xs text-primary">info</span>
                    </span>
                    <span className="text-secondary font-bold">₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant text-xs">
                    <span>GST (18% Included)</span>
                    <span>Included in tariff</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline block">Total Booking Amount</span>
                    <span className="text-headline-lg font-headline-lg font-bold text-on-surface">
                      ₹{totalCartPrice}
                    </span>
                  </div>
                  <span className="text-xs text-outline font-medium">INR Total</span>
                </div>

                {/* Advance vs Full prompt */}
                <div className="p-2.5 rounded-lg bg-secondary-container/20 border border-secondary/20 text-xs text-on-surface space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Payable 20% Advance:</span>
                    <span className="text-primary font-bold">₹{Math.round(totalCartPrice * 0.2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-[11px]">
                    <span>Remaining at Venue Desk:</span>
                    <span>₹{totalCartPrice - Math.round(totalCartPrice * 0.2)}</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={handleContinue}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-on-primary font-label-lg font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Continue to Summary</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </>
            ) : (
              <div className="py-8 text-center text-outline">
                <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">calendar_add_on</span>
                <p className="text-body-sm">Click an available time slot to reserve your court.</p>
              </div>
            )}

            {/* Athlete Guarantees */}
            <div className="pt-2 space-y-2 text-xs text-outline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                <span>100% Free cancellation up to 2 hours before start</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">lock</span>
                <span>Instant confirmed court allocation</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
