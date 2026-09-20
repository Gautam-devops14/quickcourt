"use client";
import React from "react";
import Link from 'next/link';
import { useStore, defaultUsers } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { ShieldAlert, UserCircle } from 'lucide-react';
import { TopNav } from '@/components/shared/TopNav';


export default function Home() {
  const { facilities, courts, slots, setCurrentUser, currentUser } = useStore();
  const router = useRouter();
  const [showDevTools, setShowDevTools] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
  const [topRatedFilter, setTopRatedFilter] = useState('All');

  // Group facilities for dynamic rendering
  const activeFacilities = useMemo(() => facilities.filter(f => f.status === 'APPROVED'), [facilities]);
  const topRatedFacilities = useMemo(() => {
    let filtered = [...activeFacilities];
    if (topRatedFilter === 'Indoor') {
      filtered = filtered.filter(f => f.amenities.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('indoor')));
    } else if (topRatedFilter === 'Lighted') {
      filtered = filtered.filter(f => f.amenities.some(a => a.toLowerCase().includes('floodlight') || a.toLowerCase().includes('light')));
    } else if (topRatedFilter === 'Equipment Rental') {
      filtered = filtered.filter(f => f.amenities.some(a => a.toLowerCase().includes('equipment') || a.toLowerCase().includes('pro shop') || a.toLowerCase().includes('rental')));
    }
    return filtered
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [activeFacilities, topRatedFilter]);

  const handleRoleSelect = (role: 'USER' | 'OWNER' | 'ADMIN', route: string) => {
    const targetUser = defaultUsers.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      router.push(route);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  
  return (
    <>
      <TopNav />
      <main className="flex flex-col w-full pb-20 md:pb-0 pt-16">
        {/* HERO & SEARCH CONSOLE */}
        <section className="bg-surface-container-lowest border-b border-outline-variant/40 pt-8 pb-10">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-container border border-primary/20 text-on-primary-container text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-[14px]">sports_tennis</span> Next-Gen Athletic Booking
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-3">
                Find and book local sports courts in seconds.
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                Real-time court availability, verified competition surfaces, and instant confirmation with zero markup.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-3 md:p-4 border border-outline-variant/80 shadow-sm">

              <form onSubmit={(e) => { e.preventDefault(); router.push(`/explore?q=${encodeURIComponent(searchQuery)}`); }} className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant flex items-center gap-2 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">search</span>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant">Search Venues</label>
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Venue name, club, locality..." className="w-full bg-transparent text-xs font-semibold text-on-surface outline-none truncate placeholder:text-on-surface-variant/70" />
                  </div>
                </div>

                <div className="md:col-span-3 bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant">Zone Filter</label>
                    <select className="w-full bg-transparent text-xs font-semibold text-on-surface outline-none cursor-pointer">
                      <option value="all">Ahmedabad (All)</option>
                      <option value="sg">SG Highway</option>
                      <option value="vastrapur">Vastrapur</option>
                      <option value="bopal">Bopal / South Bopal</option>
                      <option value="prahlad">Prahlad Nagar</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-3 bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant">Date</label>
                    <select className="w-full bg-transparent text-xs font-semibold text-on-surface outline-none cursor-pointer">
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                      <option value="weekend">This Weekend</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="w-full h-full min-h-[46px] rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Search</span>
                  </button>
                </div>
              </form>

              <div className="mt-3 pt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Fast Searches:</span>
                <Link href="/explore?q=Badminton" className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface text-[11px] font-semibold flex items-center gap-1 transition-colors">🏸 AC Badminton</Link>
                <Link href="/explore?q=Football" className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface text-[11px] font-semibold flex items-center gap-1 transition-colors">⚽ Floodlit Turfs</Link>
                <Link href="/explore?q=Cricket" className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface text-[11px] font-semibold flex items-center gap-1 transition-colors">🏏 Cricket Nets</Link>
                <Link href="/explore?q=Tennis" className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface text-[11px] font-semibold flex items-center gap-1 transition-colors">🎾 Clay Tennis</Link>
              </div>
            </div>
          </div>
        </section>

        {/* BROWSE BY DISCIPLINE */}
        <section className="py-8 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-on-surface">Browse by Discipline</h2>
              <p className="text-xs text-on-surface-variant">Verified competition-grade facilities and neighborhood venues</p>
            </div>
            <span className="text-xs text-on-surface-variant font-semibold hidden sm:inline">7 Categories Managed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { id: 'Badminton', icon: 'sports_tennis' },
              { id: 'Football Turf', icon: 'sports_soccer' },
              { id: 'Tennis', icon: 'sports_baseball' },
              { id: 'Pickleball', icon: 'sports_tennis' },
              { id: 'Basketball', icon: 'sports_basketball' },
              { id: 'Cricket Nets', icon: 'sports_cricket' },
              { id: 'Padel', icon: 'sports_tennis' }
            ].map(cat => {
              const activeCourtsCount = courts.filter(c => c.sport.includes(cat.id)).length;
              return (
                <Link key={cat.id} href={`/explore?q=${cat.id}`} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 hover:border-primary hover:shadow-sm cursor-pointer transition-all group flex flex-col items-start">
                  <div className="w-9 h-9 rounded-lg bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-primary flex items-center justify-center transition-colors mb-2">
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  </div>
                  <div className="font-bold text-xs text-on-surface">{cat.id}</div>
                  <div className="text-[10px] text-primary font-semibold mt-0.5">{activeCourtsCount} Courts open</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AVAILABLE TONIGHT */}
        <section className="bg-surface-container-lowest border-y border-outline-variant/40 py-6 w-full">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[10px] font-extrabold uppercase tracking-wider">Fast Track</span>
                <h3 className="font-bold text-sm text-on-surface">Available Tonight • Instant Reserve</h3>
              </div>
              <span className="text-xs text-on-surface-variant">Direct confirmation without host approval delays</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeFacilities.slice(0, 4).map((facility, i) => {
                const facCourts = courts.filter(c => c.facilityId === facility.id);
                const firstCourt = facCourts[0] || { name: 'Court 1', pricePerHour: 500 };
                return (
                  <div key={'fast-'+facility.id} className="bg-surface border border-outline-variant/60 rounded-xl p-3 flex items-center justify-between hover:border-primary transition-all">
                    <div>
                      <div className="text-xs font-bold text-on-surface truncate max-w-[140px]" title={facility.name}>{facility.name}</div>
                      <div className="text-xs font-extrabold text-primary mt-0.5">{i === 0 ? "7:00 PM" : i === 1 ? "8:00 PM" : i === 2 ? "9:00 PM" : "10:00 PM"} - {i === 0 ? "8:00 PM" : i === 1 ? "9:00 PM" : i === 2 ? "10:00 PM" : "11:00 PM"}</div>
                      <div className="text-[11px] text-on-surface-variant">₹{firstCourt.pricePerHour} • {facility.sports[0]}</div>
                    </div>
                    <Link href={`/venue/${facility.id}/book`} className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold transition-all shadow-sm shrink-0">
                      Quick Book
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TOP RATED VENUES */}
        <section className="py-10 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span> Curated Facilities
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-on-surface">Top Rated Venues Near You</h2>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button onClick={() => setTopRatedFilter('All')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${topRatedFilter === 'All' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant/50 text-on-surface hover:bg-surface-container-high'}`}>All</button>
              <button onClick={() => setTopRatedFilter('Indoor')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${topRatedFilter === 'Indoor' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant/50 text-on-surface hover:bg-surface-container-high'}`}>Indoor</button>
              <button onClick={() => setTopRatedFilter('Lighted')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${topRatedFilter === 'Lighted' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant/50 text-on-surface hover:bg-surface-container-high'}`}>Lighted</button>
              <button onClick={() => setTopRatedFilter('Equipment Rental')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${topRatedFilter === 'Equipment Rental' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant/50 text-on-surface hover:bg-surface-container-high'}`}>Equipment Rental</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRatedFacilities.slice(0, 4).map(facility => {
              const facCourts = courts.filter(c => c.facilityId === facility.id);
              const startingPrice = facCourts.length > 0 ? Math.min(...facCourts.map(c => c.pricePerHour)) : 500;
              return (
                <div key={'top-'+facility.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 overflow-hidden group hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-40 w-full bg-surface-container overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute top-2.5 right-2.5 bg-surface-container-lowest/95 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[13px] text-secondary">star</span>
                      <span className="text-[11px] font-bold text-on-surface">{(facility.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-on-surface leading-tight truncate">{facility.name}</h3>
                      <span className="text-xs font-extrabold text-on-surface shrink-0">₹{startingPrice}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant flex items-center gap-1 truncate mb-2">
                      <span className="material-symbols-outlined text-[12px]">location_on</span> {facility.location.split(',')[0]}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {facility.sports.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-surface text-on-surface text-[9px] font-bold uppercase rounded border border-outline-variant/50 tracking-wide">{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <Link href={`/venue/${facility.id}`} className="py-1.5 text-center rounded-lg border border-outline-variant text-on-surface text-[11px] font-bold hover:bg-surface-container transition-colors">Details</Link>
                      <Link href={`/venue/${facility.id}/book`} className="py-1.5 text-center rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-hover transition-colors">Book</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RAPID BOOKING DESK */}
        <section className="py-10 bg-surface-container border-y border-outline-variant/40 w-full">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Rapid Booking Desk</h2>
                <p className="text-xs text-on-surface-variant">Real-time venue slot inventory with direct court reservation links</p>
              </div>
              <span className="text-xs text-on-surface-variant font-medium hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Auto-refreshed 2 mins ago
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeFacilities.slice(2, 6).map(facility => {
                const facCourts = courts.filter(c => c.facilityId === facility.id);
                const startingPrice = facCourts.length > 0 ? Math.min(...facCourts.map(c => c.pricePerHour)) : 500;
                return (
                  <div key={'rapid-'+facility.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=150" className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-on-surface truncate">{facility.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container whitespace-nowrap">Open till 11:30 PM</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 truncate">{facCourts.length} Courts • {facility.amenities?.join(', ') || 'Various Amenities'}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-on-surface-variant">
                          <span className="text-primary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">event_available</span> Courts left tonight
                          </span>
                          <span>• Free cancel 2h before</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant/40 shrink-0">
                      <div className="text-sm font-extrabold text-on-surface">₹{startingPrice} <span className="text-xs font-normal text-on-surface-variant">/hr</span></div>
                      <Link href={`/venue/${facility.id}/book`} className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold shadow-sm">
                        Check Slots
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TRUST / UTILITY SECTION */}
        <section className="py-12 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-on-surface mb-2">Built for Players, Engineered for Facilities</h2>
            <p className="text-xs md:text-sm text-on-surface-variant">The zero-friction protocol for reserving athletic facilities without phone calls, double-bookings, or payment friction.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary mb-4 border border-outline-variant">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1.5">Instant Confirmation</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Direct API integrations with facility systems guarantee your slot the moment payment clears.</p>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary mb-4 border border-outline-variant">
                <span className="material-symbols-outlined text-[20px]">price_check</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1.5">No Hidden Markups</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">You pay the exact floor price set by the venue owner. No arbitrary convenience fees or dynamic surges.</p>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary mb-4 border border-outline-variant">
                <span className="material-symbols-outlined text-[20px]">shield_person</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1.5">Verified Competition Quality</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Facilities are vetted for surface quality, lighting standards, and authentic reviews before listing.</p>
            </div>
          </div>
        </section>

        {/* FOR FACILITY OPERATORS */}
        <section className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg pb-12 w-full">
          <div className="bg-[#0b1c30] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-outline-variant/30">
            <div className="max-w-xl">
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[11px] font-bold uppercase tracking-wider mb-2.5 inline-block">
                For Facility Operators
              </span>
              <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                Eliminate idle court hours with QuickCourt OS
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Connect your courts to Ahmedabad&apos;s fastest-growing athletic community. Auto-schedule lights, manage memberships, and receive direct automated payouts.
              </p>
            </div>
            <Link 
              href="/owner/facilities/new" 
              className="shrink-0 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0b1c30] font-bold shadow-md transition-all text-sm flex items-center gap-2"
            >
              <span>List Your Facility</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* COMPREHENSIVE FOOTER */}
        <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/60 pt-12 pb-16 text-on-surface">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">QuickCourt</span>
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase">India</span>
                </div>
                <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
                  Next-generation athletic facility booking platform. Real-time floor availability, verified surfaces, transparent pricing, and instant turnstile reservations across Ahmedabad and beyond.
                </p>
                <div className="flex items-center gap-3 pt-2 text-on-surface-variant">
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Platform Status: 100% Operational
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface mb-3">Explore Sports</h4>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  <li><Link href="/explore?q=Badminton" className="hover:text-primary transition-colors">Badminton Courts</Link></li>
                  <li><Link href="/explore?q=Football+Turf" className="hover:text-primary transition-colors">Football Turfs</Link></li>
                  <li><Link href="/explore?q=Cricket+Nets" className="hover:text-primary transition-colors">Box Cricket Nets</Link></li>
                  <li><Link href="/explore?q=Tennis" className="hover:text-primary transition-colors">Tennis Courts</Link></li>
                  <li><Link href="/explore?q=Pickleball" className="hover:text-primary transition-colors">Pickleball</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface mb-3">Ahmedabad Hubs</h4>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  <li><Link href="/explore?q=SG+Highway" className="hover:text-primary transition-colors">SG Highway</Link></li>
                  <li><Link href="/explore?q=Bopal" className="hover:text-primary transition-colors">South Bopal</Link></li>
                  <li><Link href="/explore?q=Prahlad+Nagar" className="hover:text-primary transition-colors">Prahlad Nagar</Link></li>
                  <li><Link href="/explore?q=Vastrapur" className="hover:text-primary transition-colors">Vastrapur</Link></li>
                  <li><Link href="/explore?q=Thaltej" className="hover:text-primary transition-colors">Thaltej</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface mb-3">Facility Partners</h4>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  <li><Link href="/owner/facilities/new" className="hover:text-primary transition-colors font-semibold text-primary">Partner Registration</Link></li>
                  <li><Link href="/owner" className="hover:text-primary transition-colors">Partner Dashboard</Link></li>
                  <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Operations</Link></li>
                  <li><Link href="/login" className="hover:text-primary transition-colors">Portal Login</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-on-surface-variant">
              <div>© 2026 QuickCourt Technologies Private Limited. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <span className="hover:text-on-surface cursor-pointer">Terms of Service</span>
                <span className="hover:text-on-surface cursor-pointer">Privacy Policy</span>
                <span className="hover:text-on-surface cursor-pointer">Cancellation Policy</span>
                <span className="hover:text-on-surface cursor-pointer">Support</span>
              </div>
            </div>
          </div>
        </footer>

      </main>

      {/* Dev Tools Footer for QA */}
      <div className="fixed bottom-4 right-4 z-[999]">
        {!showDevTools ? (
          <button 
            onClick={() => setShowDevTools(true)}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover"
            title="QA Role Switcher"
          >
            <span className="material-symbols-outlined">construction</span>
          </button>
        ) : (
          <div className="bg-surface-container-lowest border border-outline shadow-xl p-4 rounded-xl w-72">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-headline-sm font-bold text-on-surface">QA Test Session</h4>
              <button onClick={() => setShowDevTools(false)}><span className="material-symbols-outlined text-[20px] text-on-surface">close</span></button>
            </div>
            <div className="text-xs text-on-surface-variant mb-4">Current: {currentUser ? `${currentUser.role} (${currentUser.name})` : 'Logged Out'}</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleRoleSelect('USER', '/explore')} className="w-full py-1.5 bg-surface text-on-surface border border-outline-variant rounded hover:bg-surface-container">Enter as Player One</button>
              <button onClick={() => handleRoleSelect('OWNER', '/owner')} className="w-full py-1.5 bg-surface text-on-surface border border-outline-variant rounded hover:bg-surface-container">Enter as Vikram (Owner)</button>
              <button onClick={() => handleRoleSelect('ADMIN', '/admin')} className="w-full py-1.5 bg-surface text-on-surface border border-outline-variant rounded hover:bg-surface-container">Enter as Super Admin</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
