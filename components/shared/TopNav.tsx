"use client"
import React from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react'; // Can mix with Material symbols or just stick to Material where specified

import { useStore } from '@/contexts/StoreContext';

const CITIES = ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat', 'Rajkot', 'Mumbai', 'Bengaluru'];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCity, setSelectedCity, currentUser, signOut } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/40">
      <div className="h-16 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between gap-gutter">
        <div className="flex items-center gap-space-lg">
          <Link href="/" className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-extrabold">QuickCourt</span>
          </Link>

          {/* Location Selector (Desktop & Mobile) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-space-xs px-2 sm:px-space-sm py-1 bg-surface rounded-xl border border-outline-variant/60 cursor-pointer hover:border-outline transition-colors text-left"
              title="Select City"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold max-w-[90px] sm:max-w-none truncate">{selectedCity}, IN</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
            </button>

            {isCityDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsCityDropdownOpen(false)} />
                <div className="absolute left-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 p-2 py-2.5">
                  <div className="text-[10px] uppercase font-bold text-on-surface-variant px-2.5 pb-1.5 border-b border-outline-variant/40">
                    Select Operating City
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {CITIES.map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${selectedCity === city ? 'bg-primary-container text-on-primary font-bold' : 'text-on-surface hover:bg-surface-container'}`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center flex-1 max-w-xs mx-space-md">
          <div className="w-full flex items-center gap-space-xs px-space-sm py-1.5 bg-surface rounded-xl border border-outline-variant/60 text-on-surface-variant hover:border-outline focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <input 
              className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant" 
              placeholder="Search courts, sports, clubs..." 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className="hidden lg:flex items-center gap-space-lg">
          <Link 
            href="/explore" 
            className={cn(
              "font-label-lg text-label-lg transition-colors",
              pathname.startsWith('/explore') ? "text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Find Venues
          </Link>
          <Link 
            href="/bookings" 
            className={cn(
              "font-label-lg text-label-lg transition-colors",
              pathname.startsWith('/bookings') ? "text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            My Bookings
          </Link>
        </nav>

        <div className="flex items-center gap-space-md">
          <button 
            type="button"
            onClick={() => router.push('/explore')} 
            className="xl:hidden p-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Search"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          
          <Link 
            href="/owner" 
            className="hidden sm:inline-flex items-center font-label-lg text-label-lg px-space-md py-1.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface hover:text-on-surface transition-colors"
          >
            Partner Host
          </Link>
          
          {currentUser ? (
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer transition-transform hover:scale-105 text-on-primary font-bold text-xs" title={currentUser.name}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-on-primary px-3.5 py-1.5 rounded-xl font-label-md font-bold hover:bg-primary-hover transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant p-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg font-label-md flex items-center gap-2.5 ${pathname.startsWith('/explore') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-xl">explore</span>
              Find Venues & Courts
            </Link>
            <Link
              href="/bookings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg font-label-md flex items-center gap-2.5 ${pathname.startsWith('/bookings') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-xl">book_online</span>
              My Bookings & Passes
            </Link>
            <Link
              href="/owner"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg font-label-md flex items-center gap-2.5 ${pathname.startsWith('/owner') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-xl">storefront</span>
              Partner Operator Portal
            </Link>
            {currentUser && (
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg font-label-md flex items-center gap-2.5 ${pathname.startsWith('/profile') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-xl">account_circle</span>
                My Profile ({currentUser.name})
              </Link>
            )}
          </nav>
          <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                  router.push('/');
                }}
                className="text-error font-label-md flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-primary text-on-primary py-2 rounded-xl font-label-md font-bold"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
