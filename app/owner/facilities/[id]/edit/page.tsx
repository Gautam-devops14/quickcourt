"use client";
import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function EditFacilityPage({ params }: { params: { id: string } }) {
  const { facilities, updateFacility, currentUser } = useStore();
  const router = useRouter();

  const facility = facilities.find(f => f.id === params.id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (facility) {
      setName(facility.name);
      setLocation(facility.location);
      setSports([...facility.sports]);
      setDescription(facility.description || "");
    }
  }, [facility]);

  if (!facility) return notFound();

  const handleToggleSport = (sport: string) => {
    setSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const handleSave = () => {
    if (!name || !location || sports.length === 0) {
      setError('Please fill in all required fields and select at least one sport.');
      return;
    }
    updateFacility(facility.id, {
      name,
      location,
      sports,
    });
    router.push(`/owner/facilities`);
  };

  const sportOptions = [
    { id: 'Badminton', icon: 'sports_tennis' },
    { id: 'Box Cricket', icon: 'sports_cricket' },
    { id: 'Football 5v5', icon: 'sports_soccer' },
    { id: 'Pickleball', icon: 'sports_tennis' },
    { id: 'Tennis', icon: 'sports_tennis' },
    { id: 'Table Tennis', icon: 'sports_esports' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Edit Facility</h1>
            <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant">
              Edit Mode
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Update identity, geographic location, and sport verticals for your venue.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/owner/facilities" className="h-11 px-4 rounded-xl border border-outline-variant text-on-surface font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center gap-2 active:scale-[0.98]">
            <span className="material-symbols-outlined text-lg">close</span>
            Cancel
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

      {/* Basic Info */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
          <span className="w-7 h-7 rounded-md bg-surface-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">domain</span>
          </span>
          <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">1. Primary Facility Identity</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-label-lg font-label-lg text-on-surface flex items-center gap-1 mb-1">
              Registered Facility Name <span className="text-error">*</span>
            </label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
              type="text" 
            />
          </div>
          <div>
            <label className="text-label-lg font-label-lg text-on-surface flex items-center gap-1 mb-1">
              Facility Description & Specifications <span className="text-error">*</span>
            </label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" 
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
          <span className="w-7 h-7 rounded-md bg-surface-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">pin_drop</span>
          </span>
          <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">2. Location & Geographic Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-label-lg font-label-lg text-on-surface flex items-center gap-1 mb-1">
              Complete Address <span className="text-error">*</span>
            </label>
            <input 
              value={location} onChange={e => setLocation(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
              type="text" 
            />
          </div>
        </div>
      </div>

      {/* Sports */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
          <span className="w-7 h-7 rounded-md bg-surface-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">sports_tennis</span>
          </span>
          <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">3. Sports Offered</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sportOptions.map(sport => {
            const isSelected = sports.includes(sport.id);
            return (
              <div 
                key={sport.id} 
                onClick={() => handleToggleSport(sport.id)}
                className={`border-2 rounded-lg p-3 relative cursor-pointer shadow-sm transition-all ${isSelected ? 'border-primary-container bg-surface-container-low' : 'border-outline-variant bg-surface-container-lowest hover:border-outline'}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`material-symbols-outlined text-[24px] ${isSelected ? 'text-primary' : 'text-outline-variant'}`}>{sport.icon}</span>
                  {isSelected && <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </div>
                <div className="mt-2">
                  <p className={`text-label-lg font-label-lg font-bold ${isSelected ? 'text-on-surface' : 'text-on-surface-variant'}`}>{sport.id}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
