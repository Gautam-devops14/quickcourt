"use client";
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddCourtPage({ params }: { params: { id: string } }) {
  const { addCourt, facilities } = useStore();
  const router = useRouter();

  const facility = facilities.find(f => f.id === params.id);

  const [name, setName] = useState('');
  const [sport, setSport] = useState(facility?.sports[0] || 'Badminton');
  const [pricePerHour, setPricePerHour] = useState(facility?.weekdayDayPrice ? String(facility.weekdayDayPrice) : '600');
  const [weekdayDayPrice, setWeekdayDayPrice] = useState(facility?.weekdayDayPrice ? String(facility.weekdayDayPrice) : '600');
  const [weekdayNightPrice, setWeekdayNightPrice] = useState(facility?.weekdayNightPrice ? String(facility.weekdayNightPrice) : '800');
  const [weekendDayPrice, setWeekendDayPrice] = useState(facility?.weekendDayPrice ? String(facility.weekendDayPrice) : '750');
  const [weekendNightPrice, setWeekendNightPrice] = useState(facility?.weekendNightPrice ? String(facility.weekendNightPrice) : '950');
  const [openTime, setOpenTime] = useState(facility?.openTime || '06:00');
  const [closeTime, setCloseTime] = useState(facility?.closeTime || '23:00');
  const [is24Hours, setIs24Hours] = useState(facility?.is24Hours || false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name || !pricePerHour) {
      setError('Please fill in all required fields.');
      return;
    }
    addCourt({
      facilityId: params.id,
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
      status: 'ACTIVE'
    });
    router.push(`/owner/facilities/${params.id}/courts`);
  };

  if (!facility) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Onboard New Court / Turf</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              Creation Mode
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Establish the identity, surface specifications, pricing, and operating rules for a new court at <strong>{facility.name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/owner/facilities/${params.id}/courts`} className="h-11 px-4 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-2 active:scale-[0.98]">
            <span className="material-symbols-outlined text-lg">close</span>
            Discard
          </Link>
          <button onClick={handleSave} className="h-11 px-6 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 active:scale-[0.98]">
            <span className="material-symbols-outlined text-lg">save</span>
            Save Court
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg flex items-start gap-2">
          <span className="material-symbols-outlined">warning</span>
          <span>{error}</span>
        </div>
      )}

      {/* Card 1: Court Identity */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">stadium</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Court Identity & Surface Specs</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-label-lg font-label-lg text-on-surface">Registered Court Designation <span className="text-error">*</span></label>
            <div className="relative">
              <input 
                value={name} onChange={e => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" 
                type="text" placeholder="e.g. Court 1 - Championship Arena" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-label-lg font-label-lg text-on-surface">Primary Sport Discipline <span className="text-error">*</span></label>
            <select 
              value={sport} onChange={e => setSport(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded px-3.5 py-2.5 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {facility.sports.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Card 2: Financials */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Tariff Matrix & Differential Pricing</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-label-md font-label-md text-on-surface">Weekday Daytime (06:00 - 18:00) <span className="text-error">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-on-surface text-body-md">₹</span>
              <input 
                value={weekdayDayPrice} onChange={e => {
                  setWeekdayDayPrice(e.target.value);
                  setPricePerHour(e.target.value);
                }}
                className="w-full h-11 pl-8 pr-12 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" 
                type="number" 
              />
              <span className="absolute right-3 top-3 text-label-sm font-label-sm text-outline">/ hr</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-md font-label-md text-on-surface">Weekday Peak / Floodlight (18:00 - 23:00) <span className="text-error">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-on-surface text-body-md">₹</span>
              <input 
                value={weekdayNightPrice} onChange={e => setWeekdayNightPrice(e.target.value)}
                className="w-full h-11 pl-8 pr-12 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" 
                type="number" 
              />
              <span className="absolute right-3 top-3 text-label-sm font-label-sm text-outline">/ hr</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-md font-label-md text-on-surface">Weekend Daytime (Sat - Sun 06:00 - 18:00) <span className="text-error">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-on-surface text-body-md">₹</span>
              <input 
                value={weekendDayPrice} onChange={e => setWeekendDayPrice(e.target.value)}
                className="w-full h-11 pl-8 pr-12 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" 
                type="number" 
              />
              <span className="absolute right-3 top-3 text-label-sm font-label-sm text-outline">/ hr</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-md font-label-md text-on-surface">Weekend Peak / Prime (Sat - Sun 18:00 - 23:00) <span className="text-error">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-on-surface text-body-md">₹</span>
              <input 
                value={weekendNightPrice} onChange={e => setWeekendNightPrice(e.target.value)}
                className="w-full h-11 pl-8 pr-12 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" 
                type="number" 
              />
              <span className="absolute right-3 top-3 text-label-sm font-label-sm text-outline">/ hr</span>
            </div>
          </div>
        </div>
      </section>

      {/* Card 3: Operating Hours */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Operating Hours & Availability</h2>
          </div>
          <label className="flex items-center gap-2 text-label-sm font-medium cursor-pointer">
            <input 
              type="checkbox" 
              checked={is24Hours} 
              onChange={e => setIs24Hours(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary" 
            />
            24/7 Round the Clock
          </label>
        </div>

        {!is24Hours && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-label-lg font-label-lg text-on-surface">Opening Time</label>
              <input 
                value={openTime} 
                onChange={e => setOpenTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface" 
                type="time" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-label-lg font-label-lg text-on-surface">Closing Time</label>
              <input 
                value={closeTime} 
                onChange={e => setCloseTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface" 
                type="time" 
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
