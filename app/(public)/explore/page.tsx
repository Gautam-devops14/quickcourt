"use client";
import React from "react";
import Link from 'next/link';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useSearchParams } from 'next/navigation';

function ExploreContent() {
  const { facilities, courts } = useStore();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(2000);

  // Initialize query on mount or query change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      const qLower = q.toLowerCase();
      const sportMatches: { [key: string]: string } = {
        'badminton': 'Badminton',
        'football': 'Football',
        'football turf': 'Football',
        'cricket': 'Cricket',
        'cricket nets': 'Cricket',
        'tennis': 'Tennis',
        'pickleball': 'Pickleball',
        'basketball': 'Basketball'
      };
      
      if (sportMatches[qLower]) {
        setSelectedSports([sportMatches[qLower]]);
        setSearchQuery('');
      } else {
        setSearchQuery(q);
      }
    }
  }, [searchParams]);

  const toggleSport = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const handleClearFilters = () => {
    setSelectedSports([]);
    setPriceMax(2000);
    setSearchQuery('');
  };
  
  const visibleFacilities = useMemo(() => {
    return facilities.filter(f => {
      // Must be approved
      if (f.status !== 'APPROVED') return false;
      
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesLoc = f.location.toLowerCase().includes(q);
        const matchesSport = f.sports.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesSport) return false;
      }
      
      // Sport Filter
      if (selectedSports.length > 0) {
        if (!f.sports.some(s => selectedSports.some(sel => s.toLowerCase().includes(sel.toLowerCase())))) return false;
      }
      
      // Price Filter (Find min price court for this facility)
      const facilityCourts = courts.filter(c => c.facilityId === f.id);
      const minPrice = facilityCourts.length > 0 
        ? Math.min(...facilityCourts.map(c => c.pricePerHour))
        : 0;
        
      if (minPrice > priceMax) return false;

      return true;
    });
  }, [facilities, courts, searchQuery, selectedSports, priceMax]);

  const SPORT_TABS = [
    { id: 'All', label: 'All Sports' },
    { id: 'Badminton', label: 'Badminton' },
    { id: 'Cricket', label: 'Cricket Nets' },
    { id: 'Football', label: 'Football Turf' },
    { id: 'Tennis', label: 'Tennis' },
    { id: 'Pickleball', label: 'Pickleball' },
    { id: 'Basketball', label: 'Basketball' },
  ];

  return (
    <>
      {/* Header utility bar aligned to Stitch */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant/40 pt-4 pb-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Explore Venues</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Showing {visibleFacilities.length} venues in Ahmedabad</p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-72 bg-surface rounded-lg border border-outline-variant/50 flex items-center px-3 py-2 focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search venue, sport, locality..." 
                className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant/50 transition-colors relative"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span className="font-label-md hidden sm:block">Filters</span>
              {(selectedSports.length > 0 || priceMax < 2000) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-surface-container-lowest"></span>
              )}
            </button>
          </div>
        </div>

        {/* Persistent Sport Category Strip (P0 Item 4) */}
        <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {SPORT_TABS.map(tab => {
            const isAll = tab.id === 'All';
            const isSelected = isAll ? selectedSports.length === 0 : selectedSports.some(s => s.toLowerCase().includes(tab.id.toLowerCase()));
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (isAll) {
                    setSelectedSports([]);
                  } else {
                    toggleSport(tab.id);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                  isSelected 
                    ? 'bg-primary text-on-primary shadow-xs' 
                    : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/50'
                }`}
              >
                {isSelected && !isAll && <span className="material-symbols-outlined text-xs">check</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-8 pb-24">
        {/* Venue Grid structurally aligned to Stitch Explore list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFacilities.map(facility => (
            <div key={facility.id} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden hover:border-primary transition-colors flex flex-col">
              <div className="h-48 bg-surface-container relative">
                 <img src={`https://loremflickr.com/600/400/sports,court?lock=${facility.id.replace(/[^0-9]/g, '') || 1}`} className="w-full h-full object-cover" alt="" />
                 <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded font-label-sm text-label-sm font-bold flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[14px]">star</span> {(facility.rating || 0).toFixed(1)}
                 </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{facility.name}</h3>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-primary-container text-on-primary-container">OPEN</span>
                </div>
                
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mb-4">
                  <span className="material-symbols-outlined text-[16px]">location_on</span> {facility.location}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {facility.sports.map(sport => (
                    <span key={sport} className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant/30 font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sports_score</span> {sport}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-on-surface-variant block">Starting from</span>
                    <span className="font-headline-sm font-bold text-on-surface">₹400<span className="font-body-sm text-on-surface-variant font-normal">/hr</span></span>
                    <span className="font-headline-sm font-bold text-on-surface">
                      ₹{courts.filter(c => c.facilityId === facility.id).map(c => c.pricePerHour).sort()[0] || 400}
                      <span className="font-body-sm text-on-surface-variant font-normal">/hr</span>
                    </span>
                  </div>
                  <Link href={`/venue/${facility.id}`} className="bg-primary hover:bg-primary-hover text-on-primary px-4 py-2 rounded-lg font-label-md transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {visibleFacilities.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search_off</span>
              <h3 className="font-headline-sm text-on-surface mb-2">No venues found</h3>
              <p className="text-on-surface-variant font-body-sm">Try adjusting your filters or search query.</p>
              <button onClick={handleClearFilters} className="mt-4 text-primary font-label-md hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </main>

      {/* Slide-out Filter Drawer (Stitch Structural Match) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-surface-container-lowest h-full shadow-lg border-l border-outline-variant flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/50">
              <h2 className="font-headline-sm font-bold text-on-surface">Filter Venues</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              <div>
                <h3 className="font-label-lg font-bold text-on-surface mb-3 uppercase tracking-wide text-xs">Sport Categories</h3>
                <div className="space-y-3">
                  {['Badminton', 'Tennis', 'Football Turf', 'Cricket Nets', 'Basketball', 'Pickleball', 'Table Tennis'].map(s => (
                    <label key={s} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                        checked={selectedSports.includes(s)}
                        onChange={() => toggleSport(s)}
                      />
                      <span className="font-body-md text-on-surface">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-label-lg font-bold text-on-surface mb-3 uppercase tracking-wide text-xs">Price Range (Max: ₹{priceMax})</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="100"
                  className="w-full accent-primary" 
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                />
                <div className="flex justify-between font-body-sm text-on-surface-variant mt-2">
                  <span>₹0</span>
                  <span>₹2000+</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-outline-variant/50 bg-surface-container-lowest flex gap-3">
              <button className="flex-1 py-2.5 rounded-lg border border-outline-variant font-label-md text-on-surface hover:bg-surface-container" onClick={handleClearFilters}>Clear</button>
              <button className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-md hover:bg-primary-hover" onClick={() => setIsFilterOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-outline-variant">Loading venues...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
