"use client";
import { useState, useMemo } from 'react';
import { useStore } from '@/contexts/StoreContext';

export default function TimeSlotManagementPage() {
  const { facilities, courts, slots, bookings, blockSlots, unblockSlots, currentUser } = useStore();
  
  const currentOwnerId = currentUser?.id ?? 'o1';
  const ownerFacilities = facilities.filter(f => f.ownerId === currentOwnerId);
  const facilityIds = ownerFacilities.map(f => f.id);
  const ownerCourts = courts.filter(c => facilityIds.includes(c.facilityId));
  
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilityIds[0] || '');
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(new Set());

  // Times to display based on mock data which has 17:00, 18:00, 19:00, 20:00
  const timeLabels = ['17:00', '18:00', '19:00', '20:00'];

  const facilityCourts = useMemo(() => ownerCourts.filter(c => c.facilityId === selectedFacilityId), [ownerCourts, selectedFacilityId]);
  
  const toggleSlotSelection = (id: string) => {
    setSelectedSlotIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBlock = () => {
    blockSlots(Array.from(selectedSlotIds));
    setSelectedSlotIds(new Set());
  };

  const handleUnblock = () => {
    unblockSlots(Array.from(selectedSlotIds));
    setSelectedSlotIds(new Set());
  };

  const getSlot = (courtId: string, time: string) => {
    return slots.find(s => s.courtId === courtId && s.startTime === time);
  };

  const selectedCount = selectedSlotIds.size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Time Slot Matrix & Availability</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              Live Operations
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-3xl">
            Control real-time court availability, manage bulk blocks for maintenance, and monitor active reservations across all hubs.
          </p>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">domain</span>
            <select 
              value={selectedFacilityId} onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg py-2 px-3 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              {ownerFacilities.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend & Bulk Action Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-label-sm">
          <div className="flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded border border-outline-variant/40">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-bold text-on-surface">AVAILABLE</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1 rounded border border-outline-variant/40">
            <span className="material-symbols-outlined text-xs text-primary font-bold">check_circle</span>
            <span className="font-bold text-on-surface">BOOKED</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high px-2.5 py-1 rounded border border-outline-variant">
            <span className="material-symbols-outlined text-xs text-outline font-bold">lock</span>
            <span className="font-bold text-on-surface">BLOCKED</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded border border-emerald-500 font-semibold">
            <span className="material-symbols-outlined text-xs text-emerald-700 font-bold">check_box</span>
            <span>SELECTED</span>
          </div>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="bg-emerald-50 border border-emerald-500 rounded-lg p-3 flex items-center justify-between shadow-sm sticky top-4 z-30">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <span className="material-symbols-outlined">library_add_check</span>
            <span>{selectedCount} slots selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleBlock} className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded font-semibold text-sm hover:bg-surface-container">
              Block Selected
            </button>
            <button onClick={handleUnblock} className="px-4 py-2 bg-emerald-600 text-white rounded font-semibold text-sm hover:bg-emerald-700">
              Unblock Selected
            </button>
            <button onClick={() => setSelectedSlotIds(new Set())} className="p-2 text-emerald-800 hover:bg-emerald-200/50 rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Schedule Matrix Grid */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse text-left min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40">
                <th className="sticky left-0 z-20 bg-surface-container-low p-3 w-64 border-r border-outline-variant/30 font-label-md text-label-md text-on-surface uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Court & Specifications</span>
                  </div>
                </th>
                {timeLabels.map(time => (
                  <th key={time} className="p-3 text-center border-r border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant min-w-[120px]">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {facilityCourts.map(court => (
                <tr key={court.id} className="hover:bg-surface/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-surface-container-lowest p-3 border-r border-outline-variant/30 w-64 shadow-xs">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">{court.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm">{court.sport}</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">₹{court.pricePerHour}/hr</span>
                    </div>
                  </td>
                  {timeLabels.map(time => {
                    const slot = getSlot(court.id, time);
                    if (!slot) {
                      return <td key={time} className="p-2 border-r border-outline-variant/20 bg-surface-container-lowest/50" />;
                    }

                    const isSelected = selectedSlotIds.has(slot.id);

                    if (slot.status === 'AVAILABLE') {
                      return (
                        <td key={time} className={`p-2 border-r border-outline-variant/20 cursor-pointer ${isSelected ? 'bg-emerald-50/50' : ''}`} onClick={() => toggleSlotSelection(slot.id)}>
                          <div className={`border rounded-lg p-2 flex flex-col justify-between h-20 transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-outline-variant hover:border-primary hover:bg-surface'}`}>
                            <div className="flex items-start justify-between">
                              <span className={`font-label-sm text-label-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-on-surface'}`}>₹{court.pricePerHour}</span>
                              <input type="checkbox" checked={isSelected} readOnly className={`w-3 h-3 rounded ${isSelected ? 'text-emerald-600 border-emerald-500' : 'text-primary border-outline-variant'}`} />
                            </div>
                            <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              Available
                            </span>
                          </div>
                        </td>
                      );
                    } else if (slot.status === 'BOOKED') {
                      const booking = bookings.find(b => b.slotIds.includes(slot.id));
                      return (
                        <td key={time} className="p-2 border-r border-outline-variant/20">
                          <div className="bg-surface-container border border-outline-variant/40 rounded-lg p-2 flex flex-col justify-between h-20">
                            <div className="flex items-start justify-between">
                              <span className="font-label-sm text-label-sm text-on-surface font-bold truncate">Booked</span>
                              <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant truncate">Ref: {booking?.id.slice(0,8)}</span>
                          </div>
                        </td>
                      );
                    } else if (slot.status === 'BLOCKED') {
                      return (
                        <td key={time} className={`p-2 border-r border-outline-variant/20 cursor-pointer ${isSelected ? 'bg-emerald-50/50' : ''}`} onClick={() => toggleSlotSelection(slot.id)}>
                          <div className={`border rounded-lg p-2 flex flex-col justify-between h-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgMFoiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+')] ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-outline-variant bg-surface-container-high'}`}>
                            <div className="flex items-start justify-between">
                              <span className="font-label-sm text-label-sm text-outline font-bold">Blocked</span>
                              <input type="checkbox" checked={isSelected} readOnly className={`w-3 h-3 rounded ${isSelected ? 'text-emerald-600 border-emerald-500' : 'text-primary border-outline-variant'}`} />
                            </div>
                            <span className="text-[10px] text-outline flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">lock</span>
                              Locked
                            </span>
                          </div>
                        </td>
                      );
                    } else if (slot.status === 'LOCKED') {
                      return (
                        <td key={time} className="p-2 border-r border-outline-variant/20">
                          <div className="bg-surface-container border border-outline-variant/40 rounded-lg p-2 flex flex-col justify-between h-20">
                            <div className="flex items-start justify-between">
                              <span className="font-label-sm text-label-sm text-on-surface font-bold truncate">In Checkout</span>
                              <span className="material-symbols-outlined text-xs text-tertiary">lock_clock</span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant truncate">Temp Locked</span>
                          </div>
                        </td>
                      );
                    }

                    return <td key={time} />;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
