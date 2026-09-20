"use client";
import { useStore } from '@/contexts/StoreContext';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';

export default function CourtManagementPage({ params }: { params: { id: string } }) {
  const { facilities, courts, updateCourt, deleteCourt } = useStore();
  const router = useRouter();

  const facility = facilities.find(f => f.id === params.id);
  if (!facility) return notFound();

  const facilityCourts = courts.filter(c => c.facilityId === facility.id);

  const activeCourts = facilityCourts.filter(c => c.status === 'ACTIVE').length;
  const maintenanceCourts = facilityCourts.filter(c => c.status === 'MAINTENANCE').length;

  const handleToggleWebBook = (courtId: string, currentVal: boolean | undefined) => {
    const newVal = currentVal === false ? true : false;
    updateCourt(courtId, { webBookEnabled: newVal });
  };

  const handleDelete = (courtId: string) => {
    if(confirm('Are you sure you want to decommission this court?')) {
      deleteCourt(courtId);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Court & Pitch Inventory</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              Resource Manager
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-on-surface-variant font-body-md text-body-md font-semibold">
              {facility.name}
            </p>
            <span className="text-outline-variant">•</span>
            <Link href={`/owner/facilities/${facility.id}/approval`} className="text-primary text-body-sm font-body-sm hover:underline flex items-center gap-1">
              {facility.status}
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link href={`/owner/facilities`} className="w-full sm:w-auto h-11 px-4 rounded-lg border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Facility
          </Link>
          <Link href={`/owner/facilities/${facility.id}/courts/new`} className="w-full sm:w-auto h-11 px-5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Court
          </Link>
        </div>
      </div>

      {/* Analytics Strip */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="w-10 h-10 rounded-lg bg-surface-container-low text-on-surface flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined">grid_view</span>
            </span>
            <div>
              <span className="block text-label-sm font-label-sm text-outline">Total Capacity</span>
              <span className="block font-headline-sm text-headline-sm font-bold text-on-surface">{facilityCourts.length} Units</span>
            </div>
          </div>
          <div className="w-px h-10 bg-outline-variant shrink-0 hidden md:block"></div>
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <span className="material-symbols-outlined">bolt</span>
            </span>
            <div>
              <span className="block text-label-sm font-label-sm text-outline">Active / Live</span>
              <span className="block font-headline-sm text-headline-sm font-bold text-on-surface">{activeCourts} Live</span>
            </div>
          </div>
          <div className="w-px h-10 bg-outline-variant shrink-0 hidden md:block"></div>
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center border border-tertiary/30">
              <span className="material-symbols-outlined">build</span>
            </span>
            <div>
              <span className="block text-label-sm font-label-sm text-outline">Maintenance</span>
              <span className="block font-headline-sm text-headline-sm font-bold text-on-surface">{maintenanceCourts} Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button className="px-3 py-1.5 rounded-md text-label-sm font-label-sm bg-primary text-on-primary font-semibold whitespace-nowrap">
          All Courts ({facilityCourts.length})
        </button>
      </div>

      {/* Inventory List */}
      <div className="flex flex-col gap-3">
        {facilityCourts.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center text-outline">
            <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">stadium</span>
            No courts configured yet. Add a new court to accept bookings.
          </div>
        ) : (
          facilityCourts.map((court, i) => (
            <div key={court.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 lg:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:border-outline transition-all duration-150 shadow-sm">
              
              {/* Column A: Identity */}
              <div className="flex items-start gap-4 min-w-[340px]">
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-primary-container/20 flex flex-col items-center justify-center text-primary shrink-0">
                  <span className="font-headline-sm text-headline-sm font-bold leading-none">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="font-label-sm text-[9px] uppercase tracking-wider text-outline font-bold">Court</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{court.name}</h2>
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-label-md text-label-md text-primary font-semibold">
                      <span className="material-symbols-outlined text-sm">sports</span>
                      {court.sport}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-sm text-outline">layers</span>
                    <span>Standard Surface</span>
                  </p>
                </div>
              </div>

              {/* Column B: Pricing */}
              <div className="flex flex-col min-w-[150px]">
                <span className="font-label-sm text-label-sm text-outline">Hourly Rate</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">₹{court.pricePerHour}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">/ hr</span>
                </div>
              </div>

              {/* Column C: Operating Hours */}
              <div className="flex flex-col min-w-[190px]">
                <span className="font-label-sm text-label-sm text-outline">Operating Schedule</span>
                <div className="font-body-sm text-body-sm text-on-surface font-medium mt-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-outline">schedule</span>
                  06:00 AM – 11:00 PM (Mon–Sun)
                </div>
              </div>

              {/* Column D: Live Status & Toggle */}
              <div className="flex items-center gap-4 min-w-[180px]">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline mb-1">Live State</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label-md text-label-md font-semibold ${
                    court.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-tertiary-container text-on-tertiary-container border border-tertiary/30'
                  }`}>
                    {court.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>}
                    {court.status === 'ACTIVE' ? 'Active & Bookable' : 'Under Maintenance'}
                  </span>
                </div>
                {/* Instant Online Booking Toggle */}
                <div className="flex flex-col items-center pl-2">
                  <span className="font-label-sm text-[10px] text-outline mb-1">Web Book</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={court.webBookEnabled !== false} 
                      onChange={() => handleToggleWebBook(court.id, court.webBookEnabled)}
                    />
                    <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              </div>

              {/* Column E: Actions */}
              <div className="flex items-center gap-2 border-t xl:border-t-0 pt-3 xl:pt-0 border-outline-variant justify-end">
                <Link href={`/owner/schedule`} className="h-9 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg flex items-center gap-1.5 border border-outline-variant transition-colors" title="View Real-Time Matrix">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span>Schedule</span>
                </Link>
                <Link href={`/owner/facilities/${facility.id}/courts/${court.id}/edit`} className="h-9 px-3 bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-md text-label-md rounded-lg flex items-center gap-1 border border-outline-variant transition-colors" title="Edit Court Specs">
                  <span className="material-symbols-outlined text-base">edit</span>
                  <span>Edit</span>
                </Link>
                <button onClick={() => handleDelete(court.id)} className="h-9 w-9 bg-surface-container-lowest hover:bg-error-container text-outline hover:text-error rounded-lg flex items-center justify-center border border-outline-variant transition-colors" title="Decommission / Delete Court">
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
