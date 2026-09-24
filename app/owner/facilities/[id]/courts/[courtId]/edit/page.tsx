"use client";
import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function EditCourtPage({ params }: { params: { id: string, courtId: string } }) {
  const { facilities, courts, updateCourt } = useStore();
  const router = useRouter();

  const facility = facilities.find(f => f.id === params.id);
  const court = courts.find(c => c.id === params.courtId);
  
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [weekdayDayPrice, setWeekdayDayPrice] = useState('');
  const [weekdayNightPrice, setWeekdayNightPrice] = useState('');
  const [weekendDayPrice, setWeekendDayPrice] = useState('');
  const [weekendNightPrice, setWeekendNightPrice] = useState('');
  const [openTime, setOpenTime] = useState('06:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [is24Hours, setIs24Hours] = useState(false);
  const [status, setStatus] = useState<'ACTIVE' | 'MAINTENANCE'>('ACTIVE');
  const [webBookEnabled, setWebBookEnabled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (court) {
      setName(court.name);
      setSport(court.sport);
      setPricePerHour(court.pricePerHour.toString());
      setWeekdayDayPrice((court.weekdayDayPrice ?? court.pricePerHour).toString());
      setWeekdayNightPrice((court.weekdayNightPrice ?? court.pricePerHour + 150).toString());
      setWeekendDayPrice((court.weekendDayPrice ?? court.pricePerHour + 100).toString());
      setWeekendNightPrice((court.weekendNightPrice ?? court.pricePerHour + 250).toString());
      setOpenTime(court.openTime ?? '06:00');
      setCloseTime(court.closeTime ?? '23:00');
      setIs24Hours(court.is24Hours ?? false);
      setStatus(court.status ?? 'ACTIVE');
      setWebBookEnabled(court.webBookEnabled !== false);
    }
  }, [court]);

  if (!facility || !court) return notFound();

  const handleSave = () => {
    if (!name || !pricePerHour) {
      setError('Please fill in all required fields.');
      return;
    }
    updateCourt(court.id, {
      name,
      sport,
      pricePerHour: Number(pricePerHour),
      weekdayDayPrice: Number(weekdayDayPrice || pricePerHour),
      weekdayNightPrice: Number(weekdayNightPrice || pricePerHour),
      weekendDayPrice: Number(weekendDayPrice || pricePerHour),
      weekendNightPrice: Number(weekendNightPrice || pricePerHour),
      openTime: is24Hours ? '00:00' : openTime,
      closeTime: is24Hours ? '23:59' : closeTime,
      is24Hours,
      status,
      webBookEnabled,
    });
    router.push(`/owner/facilities/${params.id}/courts`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Edit Court / Turf</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              Edit Mode
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Update identity, surface specifications, pricing tiers, operating hours, and live availability status for <strong>{court.name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/owner/facilities/${params.id}/courts`} className="h-11 px-4 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-2 active:scale-[0.98]">
            <span className="material-symbols-outlined text-lg">close</span>
            Discard
          </Link>
          <button onClick={handleSave} className="h-11 px-6 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 active:scale-[0.98]">
            <span className="material-symbols-outlined text-lg">save</span>
            Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg flex items-start gap-2">
          <span className="material-symbols-outlined">warning</span>
          <span>{error}</span>
        </div>
      )}

      {/* Card 1: Court Identity & Status */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">stadium</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Court Identity & Operating Status</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
            <input
              type="checkbox"
              checked={webBookEnabled}
              onChange={e => setWebBookEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span className="text-label-md font-bold text-on-surface">Instant Online Booking (Web Book)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-label-lg font-label-lg text-on-surface">Registered Court Designation <span className="text-error">*</span></label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" 
              type="text" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-label-lg font-label-lg text-on-surface">Live Court Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'ACTIVE' | 'MAINTENANCE')}
              className="w-full h-11 bg-surface-container-lowest border border-outline-variant rounded px-3.5 text-body-md font-body-md text-on-surface focus:border-primary cursor-pointer"
            >
              <option value="ACTIVE">Active & Bookable</option>
              <option value="MAINTENANCE">Offline / Maintenance</option>
            </select>
          </div>
        </div>
      </section>

      {/* Card 2: Differential Day/Night Tariff Matrix */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
            <div>
              <h2 className="text-headline-sm font-headline-sm text-on-surface">Standard Tariff Breakdown</h2>
              <p className="text-xs text-on-surface-variant">Set differential weekday and weekend morning vs floodlit night pricing</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
            <span className="text-label-sm font-bold text-outline uppercase block">Weekday Day (6 AM - 5 PM)</span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-on-surface">₹</span>
              <input
                type="number"
                value={weekdayDayPrice}
                onChange={e => setWeekdayDayPrice(e.target.value)}
                className="w-full h-10 pl-7 pr-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface font-bold text-body-md"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
            <span className="text-label-sm font-bold text-outline uppercase block">Weekday Night (5 PM - 11 PM)</span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-on-surface">₹</span>
              <input
                type="number"
                value={weekdayNightPrice}
                onChange={e => setWeekdayNightPrice(e.target.value)}
                className="w-full h-10 pl-7 pr-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface font-bold text-body-md"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
            <span className="text-label-sm font-bold text-outline uppercase block">Weekend Day (6 AM - 5 PM)</span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-on-surface">₹</span>
              <input
                type="number"
                value={weekendDayPrice}
                onChange={e => setWeekendDayPrice(e.target.value)}
                className="w-full h-10 pl-7 pr-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface font-bold text-body-md"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
            <span className="text-label-sm font-bold text-outline uppercase block">Weekend Night (5 PM - 11 PM)</span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-on-surface">₹</span>
              <input
                type="number"
                value={weekendNightPrice}
                onChange={e => setWeekendNightPrice(e.target.value)}
                className="w-full h-10 pl-7 pr-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface font-bold text-body-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Card 3: Operating Hours */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Operating Hours</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={is24Hours}
              onChange={e => setIs24Hours(e.target.checked)}
              className="w-4 h-4 rounded text-primary"
            />
            <span className="text-label-md font-bold text-on-surface">24/7 All-Night Operations</span>
          </label>
        </div>

        {!is24Hours ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-bold text-on-surface">Facility Opening Time</label>
              <input
                type="time"
                value={openTime}
                onChange={e => setOpenTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-label-sm font-bold text-on-surface">Facility Closing Time</label>
              <input
                type="time"
                value={closeTime}
                onChange={e => setCloseTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface"
              />
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-secondary font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">bolt</span>
            Continuous 24-Hour bookings enabled. Slots will be generated around the clock.
          </p>
        )}
      </section>
    </div>
  );
}
