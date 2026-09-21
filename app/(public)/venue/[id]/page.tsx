"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/contexts/StoreContext';

const SAFE_SPORTS_IMAGES = [
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1558365849-6ebd8b0454b2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1622279457486-69d73ce28b09?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800'
];

export default function VenueDetailsPage() {
  const params = useParams();
  const venueId = params.id as string;
  const { facilities, courts } = useStore();
  
  const facility = facilities.find(f => f.id === venueId);
  const facilityCourts = courts.filter(c => c.facilityId === venueId);
  
  if (!facility) {
    return <div className="p-8 text-center text-on-surface-variant font-body-lg">Venue not found.</div>;
  }

  // Determine standard reference rates from court data or fallback
  const sampleCourt = facilityCourts[0] || {
    pricePerHour: 500,
    weekdayDayPrice: 500,
    weekdayNightPrice: 650,
    weekendDayPrice: 600,
    weekendNightPrice: 750,
  };

  const weekdayDay = sampleCourt.weekdayDayPrice ?? sampleCourt.pricePerHour ?? 500;
  const weekdayNight = sampleCourt.weekdayNightPrice ?? Math.round(weekdayDay * 1.3);
  const weekendDay = sampleCourt.weekendDayPrice ?? Math.round(weekdayDay * 1.2);
  const weekendNight = sampleCourt.weekendNightPrice ?? Math.round(weekdayDay * 1.5);

  const operatingHoursDisplay = facility.operatingHours || (facility.is24Hours ? '24 Hours Open' : '6:00 AM – 11:00 PM');

  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Venue Hero Image Section */}
      <div className="w-full h-64 md:h-96 bg-surface-container relative overflow-hidden">
        <img src={SAFE_SPORTS_IMAGES[Number(facility.id.replace(/[^0-9]/g, '') || 1) % SAFE_SPORTS_IMAGES.length]} className="absolute inset-0 w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified Partner
                </span>
                <span className="px-2 py-1 rounded bg-surface-container-lowest/20 backdrop-blur font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#FFD700]">star</span> 4.8 (120 reviews)
                  <span className="material-symbols-outlined text-[14px] text-[#FFD700]">star</span> {(facility.rating || 0).toFixed(1)} rating
                </span>
              </div>
              <h1 className="font-display-lg-mobile md:font-display-lg font-bold tracking-tight mb-2">{facility.name}</h1>
              <p className="font-body-lg flex items-center gap-1.5 opacity-90">
                <span className="material-symbols-outlined text-[18px]">location_on</span> {facility.location}
              </p>
            </div>
            
            <Link 
              href={`/venue/${facility.id}/book`}
              className="bg-primary hover:bg-primary-hover text-on-primary font-label-lg px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 font-bold"
            >
              <span className="material-symbols-outlined">calendar_month</span> View Availability & Book
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* COMPLETE UPFRONT DIFFERENTIAL TARIFF MATRIX (P0 Item 9) */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                  <div>
                    <h2 className="font-headline-md font-bold text-on-surface">Standard Tariff & Pricing Matrix</h2>
                    <p className="text-xs text-on-surface-variant">Live transparent court fees for day & night sessions</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-surface-container text-on-surface-variant border border-outline-variant/40">
                  Fixed Pricing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weekdays */}
                <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">calendar_view_week</span>
                      Weekdays (Mon – Fri)
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">Standard Days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-amber-600">wb_sunny</span> Day (06:00 – 18:00)
                    </span>
                    <span className="font-bold text-on-surface text-sm">₹{weekdayDay}/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-indigo-600">bedtime</span> Night Floodlit (18:00 – 23:00)
                    </span>
                    <span className="font-bold text-primary text-sm">₹{weekdayNight}/hr</span>
                  </div>
                </div>

                {/* Weekends */}
                <div className="p-4 bg-surface-container-low/70 rounded-xl border border-outline-variant/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">event_available</span>
                      Weekends (Sat – Sun)
                    </span>
                    <span className="text-[10px] text-secondary font-bold">Peak Weekend</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-amber-600">wb_sunny</span> Day (06:00 – 18:00)
                    </span>
                    <span className="font-bold text-on-surface text-sm">₹{weekendDay}/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-indigo-600">bedtime</span> Prime Night (18:00 – 23:00)
                    </span>
                    <span className="font-bold text-primary text-sm">₹{weekendNight}/hr</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                Night session tariffs cover stadium floodlighting illumination.
              </div>
            </section>

            {/* About Section */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50">
              <h2 className="font-headline-md font-bold text-on-surface mb-4">About Venue</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {facility.description || `Experience premium sports infrastructure at ${facility.name}. Featuring state-of-the-art courts, professional lighting, and excellent amenities. Perfect for casual games, coaching sessions, and competitive tournaments.`}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-outline-variant/40">
                <div className="flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span className="font-label-md text-on-surface font-semibold">{operatingHoursDisplay}</span>
                  <span className="font-label-sm text-on-surface-variant">Daily Schedule</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary">local_parking</span>
                  <span className="font-label-md text-on-surface font-semibold">Free Parking</span>
                  <span className="font-label-sm text-on-surface-variant">Available</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary">ac_unit</span>
                  <span className="font-label-md text-on-surface font-semibold">AC / Ventilation</span>
                  <span className="font-label-sm text-on-surface-variant">Available</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary">water_drop</span>
                  <span className="font-label-md text-on-surface font-semibold">Drinking Water</span>
                  <span className="font-label-sm text-on-surface-variant">RO Purified</span>
                </div>
              </div>
            </section>

            {/* Available Sports & Courts */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline-md font-bold text-on-surface">Active Courts & Sports Units ({facilityCourts.length})</h2>
                <span className="text-xs text-primary font-bold">Standard Regulation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilityCourts.map(court => (
                  <div key={court.id} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/40 bg-surface">
                    <div className="flex items-center">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0">
                        <span className="material-symbols-outlined text-[22px]">sports_tennis</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg font-bold text-on-surface">{court.name}</h4>
                        <p className="font-label-sm text-on-surface-variant">{court.sport} • ₹{court.pricePerHour}/hr base</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${court.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                      {court.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            {/* Sticky Booking Widget */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 sticky top-24 shadow-sm space-y-4">
              <h3 className="font-headline-sm font-bold text-on-surface">Book This Venue</h3>
              
              <div className="p-3.5 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm space-y-2 border border-outline-variant/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Weekday Rates:</span>
                  <span className="font-bold text-on-surface">₹{weekdayDay} – ₹{weekdayNight}/hr</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Weekend Rates:</span>
                  <span className="font-bold text-on-surface">₹{weekendDay} – ₹{weekendNight}/hr</span>
                </div>
                <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-1 text-[11px] text-secondary font-bold">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Pay 20% advance or 100% full
                </div>
              </div>
              
              <Link 
                href={`/venue/${facility.id}/book`}
                className="w-full bg-primary hover:bg-primary-hover text-on-primary font-label-lg py-3 rounded-xl flex items-center justify-center transition-colors font-bold shadow-md"
              >
                Select Date & Slots
              </Link>
              
              <p className="text-center font-label-sm text-on-surface-variant text-xs">
                Instant confirmation • Free cancellation up to 2 hours prior
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
