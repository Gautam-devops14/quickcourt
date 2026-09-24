"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Facility, Court, TimeSlot, Booking, User, FacilityStatus } from '@/types';
import { mockFacilities } from '@/data/mock';

const STORAGE_KEY = 'quickcourt_demo_final_v1';

const extendedFacilities: Facility[] = [];

const initialCourts: Court[] = extendedFacilities.flatMap(f => {
  let courts: Court[] = [];
  let courtIndex = 1;
  f.sports.forEach(sport => {
    let courtCount = sport === 'Badminton' ? 3 : sport === 'Tennis' ? 2 : sport === 'Football Turf' ? 1 : 2;
    for(let i=0; i<courtCount; i++) {
      let name = sport === 'Football Turf' ? `Turf ${i+1}` : sport === 'Table Tennis' ? `Table ${i+1}` : `Court ${i+1}`;
      const base = sport === 'Football Turf' ? 1200 : sport === 'Tennis' ? 800 : sport === 'Cricket Nets' ? 700 : 500;
      courts.push({
        id: `c${courtIndex}-${f.id}`,
        facilityId: f.id,
        name: name,
        sport: sport,
        pricePerHour: base,
        weekdayDayPrice: base,
        weekdayNightPrice: Math.round(base * 1.3),
        weekendDayPrice: Math.round(base * 1.2),
        weekendNightPrice: Math.round(base * 1.5),
        openTime: '06:00',
        closeTime: '23:00',
        is24Hours: false,
        status: 'ACTIVE'
      });
      courtIndex++;
    }
  });
  return courts;
});

const today = new Date().toISOString().split('T')[0];
// Generate slots covering Morning, Afternoon, and Evening
const initialSlots: TimeSlot[] = initialCourts.flatMap(c => [
  { id: `s-m1-${c.id}`, courtId: c.id, date: today, startTime: '07:00', endTime: '08:00', status: 'AVAILABLE' as const, isNight: false, isWeekend: false, calculatedPrice: c.weekdayDayPrice ?? c.pricePerHour },
  { id: `s-m2-${c.id}`, courtId: c.id, date: today, startTime: '09:00', endTime: '10:00', status: 'AVAILABLE' as const, isNight: false, isWeekend: false, calculatedPrice: c.weekdayDayPrice ?? c.pricePerHour },
  { id: `s-a1-${c.id}`, courtId: c.id, date: today, startTime: '14:00', endTime: '15:00', status: 'AVAILABLE' as const, isNight: false, isWeekend: false, calculatedPrice: c.weekdayDayPrice ?? c.pricePerHour },
  { id: `s-a2-${c.id}`, courtId: c.id, date: today, startTime: '16:00', endTime: '17:00', status: 'AVAILABLE' as const, isNight: false, isWeekend: false, calculatedPrice: c.weekdayDayPrice ?? c.pricePerHour },
  { id: `s1-${c.id}`, courtId: c.id, date: today, startTime: '17:00', endTime: '18:00', status: 'AVAILABLE' as const, isNight: false, isWeekend: false, calculatedPrice: c.weekdayDayPrice ?? c.pricePerHour },
  { id: `s2-${c.id}`, courtId: c.id, date: today, startTime: '18:00', endTime: '19:00', status: 'AVAILABLE' as const, isNight: true, isWeekend: false, calculatedPrice: c.weekdayNightPrice ?? c.pricePerHour },
  { id: `s3-${c.id}`, courtId: c.id, date: today, startTime: '19:00', endTime: '20:00', status: 'BOOKED' as const, isNight: true, isWeekend: false, calculatedPrice: c.weekdayNightPrice ?? c.pricePerHour },
  { id: `s4-${c.id}`, courtId: c.id, date: today, startTime: '20:00', endTime: '21:00', status: 'AVAILABLE' as const, isNight: true, isWeekend: false, calculatedPrice: c.weekdayNightPrice ?? c.pricePerHour },
  { id: `s5-${c.id}`, courtId: c.id, date: today, startTime: '21:00', endTime: '22:00', status: 'AVAILABLE' as const, isNight: true, isWeekend: false, calculatedPrice: c.weekdayNightPrice ?? c.pricePerHour },
]);

export const defaultUsers: User[] = [
  { id: 'u1', name: 'Player One', role: 'USER', email: 'player@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  { id: 'u2', name: 'Ravi Kumar', role: 'USER', email: 'ravi@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  { id: 'o1', name: 'Vikram Patel', role: 'OWNER', email: 'owner@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  { id: 'o2', name: 'Neha Sharma', role: 'OWNER', email: 'neha@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  { id: 'a1', name: 'Super Admin', role: 'ADMIN', email: 'admin@quickcourt.in', status: 'ACTIVE', password: 'password123' }
];

interface StoreState {
  currentUser: User | null;
  users: User[];
  facilities: Facility[];
  courts: Court[];
  slots: TimeSlot[];
  bookings: Booking[];
  cartSlot: TimeSlot | null; // Keep for backwards compatibility
  cartSlots: TimeSlot[];     // Multi-hour / multi-slot cart
  selectedCity: string;      // Default Ahmedabad
}

interface ConfirmBookingOptions {
  paymentType?: 'FULL' | 'ADVANCE_20';
  paymentMethod?: string;
  totalAmount?: number;
}

interface StoreContextType extends StoreState {
  setCurrentUser: (user: User | null) => void;
  setSelectedCity: (city: string) => void;
  lockSlot: (slotId: string, slotObj?: TimeSlot) => void;
  toggleLockSlot: (slotId: string, slotObj?: TimeSlot) => void; // Multi-hour selection
  unlockSlot: (slotId?: string) => void;
  clearCart: () => void;
  confirmBooking: (amount: number, options?: ConfirmBookingOptions) => string;
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newSlotId: string) => void;
  rateBooking: (bookingId: string, rating: number) => void;
  updateUser: (user: Partial<User>) => void;
  signUp: (user: Partial<User>) => void;
  login: (email: string, password: string, requiredRole?: string) => { success: boolean; error?: string; user?: User };
  signOut: () => void;
  
  // Owner Actions
  addFacility: (f: Partial<Facility>) => Facility;
  updateFacility: (id: string, f: Partial<Facility>) => void;
  addCourt: (c: Partial<Court>) => Court;
  updateCourt: (id: string, c: Partial<Court>) => void;
  deleteCourt: (id: string) => void;
  blockSlots: (slotIds: string[]) => void;
  unblockSlots: (slotIds: string[]) => void;
  resubmitFacility: (id: string) => void;

  // Admin Actions
  adminApproveFacility: (id: string) => void;
  adminRejectFacility: (id: string, reason: string) => void;
  toggleUserStatus: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({
    currentUser: defaultUsers[0], // Start as Player One by default
    users: defaultUsers,
    facilities: extendedFacilities,
    courts: initialCourts,
    slots: initialSlots,
    bookings: [],
    cartSlot: null,
    cartSlots: [],
    selectedCity: 'Ahmedabad'
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          facilities: parsed.facilities || prev.facilities,
          courts: parsed.courts || prev.courts,
          slots: parsed.slots || prev.slots,
          bookings: parsed.bookings || prev.bookings,
          users: parsed.users || prev.users,
          currentUser: parsed.currentUser !== undefined ? parsed.currentUser : prev.currentUser,
          selectedCity: parsed.selectedCity || prev.selectedCity,
        }));
      }
    } catch {
      // ignore JSON parse or storage access errors
    } finally {
      setIsHydrated(true);
    }

    // Cross-tab / cross-window synchronization listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(prev => ({
            ...prev,
            facilities: parsed.facilities || prev.facilities,
            courts: parsed.courts || prev.courts,
            slots: parsed.slots || prev.slots,
            bookings: parsed.bookings || prev.bookings,
            users: parsed.users || prev.users,
            currentUser: parsed.currentUser !== undefined ? parsed.currentUser : prev.currentUser,
          }));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        facilities: state.facilities,
        courts: state.courts,
        slots: state.slots,
        bookings: state.bookings,
        users: state.users,
        currentUser: state.currentUser,
        selectedCity: state.selectedCity
      }));
    } catch {
      // ignore quota exceeded or privacy mode errors
    }
  }, [isHydrated, state.facilities, state.courts, state.slots, state.bookings, state.users, state.currentUser, state.selectedCity]);

  const setCurrentUser = (user: User | null) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const setSelectedCity = (city: string) => {
    setState(prev => ({ ...prev, selectedCity: city }));
  };

  const signOut = () => {
    setState(prev => ({ ...prev, currentUser: null, cartSlot: null, cartSlots: [] }));
  };

  const updateUser = (userData: Partial<User>) => {
    setState(prev => {
      if (!prev.currentUser) return prev;
      const updated = { ...prev.currentUser, ...userData };
      return {
        ...prev,
        currentUser: updated,
        users: prev.users.map(u => u.id === updated.id ? updated : u)
      };
    });
  };

  const signUp = (userData: Partial<User>) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name || 'New Player',
      role: 'USER', // Force PLAYER role
      email: userData.email || '',
      phone: userData.phone || '',
      status: 'ACTIVE',
      password: userData.password || 'password123'
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
  };

  const login = (email: string, password: string, requiredRole?: string) => {
    // In realistic mock, we find user by email or phone
    const user = state.users.find(u => u.email === email || u.phone === email);
    if (!user) {
      return { success: false, error: 'Account not found.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Invalid password.' };
    }
    if (requiredRole && user.role !== requiredRole) {
      return { success: false, error: `Invalid credentials for ${requiredRole.toLowerCase()} login.` };
    }
    setCurrentUser(user);
    return { success: true, user };
  };

  // Toggle or add slot for multi-hour reservation
  const toggleLockSlot = (slotId: string, slotObj?: TimeSlot) => {
    setState(prev => {
      const isAlreadyInCart = prev.cartSlots.some(s => s.id === slotId);
      let newSlots = [...prev.slots];

      if (isAlreadyInCart) {
        // Unlock this slot
        newSlots = newSlots.map(s => s.id === slotId ? { ...s, status: 'AVAILABLE' as const } : s);
        const newCart = prev.cartSlots.filter(s => s.id !== slotId);
        return {
          ...prev,
          slots: newSlots,
          cartSlots: newCart,
          cartSlot: newCart[0] || null
        };
      } else {
        let targetSlot = newSlots.find(s => s.id === slotId);
        if (!targetSlot && slotObj) {
          targetSlot = { ...slotObj };
          newSlots.push(targetSlot);
        }
        if (!targetSlot || targetSlot.status !== 'AVAILABLE') return prev;
        newSlots = newSlots.map(s => s.id === slotId ? { ...s, status: 'LOCKED' as const } : s);
        const lockedSlot: TimeSlot = { ...targetSlot, status: 'LOCKED' as const };
        const newCart = [...prev.cartSlots, lockedSlot];
        return {
          ...prev,
          slots: newSlots,
          cartSlots: newCart,
          cartSlot: newCart[0]
        };
      }
    });
  };

  const lockSlot = (slotId: string, slotObj?: TimeSlot) => {
    // Single slot or first slot selection
    toggleLockSlot(slotId, slotObj);
  };

  const unlockSlot = (slotId?: string) => {
    setState(prev => {
      let newSlots = [...prev.slots];
      if (slotId) {
        newSlots = newSlots.map(s => s.id === slotId ? { ...s, status: 'AVAILABLE' as const } : s);
        const newCart = prev.cartSlots.filter(s => s.id !== slotId);
        return { ...prev, slots: newSlots, cartSlots: newCart, cartSlot: newCart[0] || null };
      }
      // Unlock all
      const cartIds = prev.cartSlots.map(s => s.id);
      if (prev.cartSlot && !cartIds.includes(prev.cartSlot.id)) {
        cartIds.push(prev.cartSlot.id);
      }
      newSlots = newSlots.map(s => cartIds.includes(s.id) ? { ...s, status: 'AVAILABLE' as const } : s);
      return { ...prev, slots: newSlots, cartSlot: null, cartSlots: [] };
    });
  };

  const clearCart = () => {
    unlockSlot();
  };

  const confirmBooking = (amount: number, options?: ConfirmBookingOptions) => {
    let newBookingId = '';
    setState(prev => {
      const activeSlots = prev.cartSlots.length > 0 ? prev.cartSlots : (prev.cartSlot ? [prev.cartSlot] : []);
      if (activeSlots.length === 0) return prev;
      
      const firstSlot = activeSlots[0];
      const court = prev.courts.find(c => c.id === firstSlot.courtId)!;
      newBookingId = `b-${Date.now()}`;
      
      const totalAmount = options?.totalAmount ?? amount;
      const paymentType = options?.paymentType ?? 'FULL';
      const advanceAmount = paymentType === 'ADVANCE_20' ? Math.round(totalAmount * 0.2) : totalAmount;
      const remainingAmount = paymentType === 'ADVANCE_20' ? (totalAmount - advanceAmount) : 0;

      const newBooking: Booking = {
        id: newBookingId,
        userId: prev.currentUser?.id ?? 'u1',
        facilityId: court.facilityId,
        courtId: court.id,
        slotIds: activeSlots.map(s => s.id),
        status: 'CONFIRMED',
        amount: advanceAmount,
        totalAmount,
        advanceAmount,
        remainingAmount,
        paymentType,
        paymentMethod: options?.paymentMethod ?? 'UPI',
        date: new Date().toISOString()
      };
      
      const bookedIds = activeSlots.map(s => s.id);
      const newSlots = prev.slots.map(s => bookedIds.includes(s.id) ? { ...s, status: 'BOOKED' as const } : s);
      return { ...prev, slots: newSlots, bookings: [newBooking, ...prev.bookings], cartSlot: null, cartSlots: [] };
    });
    return newBookingId;
  };

  const cancelBooking = (bookingId: string) => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking || booking.status !== 'CONFIRMED') return prev;
      const newBookings = prev.bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b);
      const newSlots = prev.slots.map(s => booking.slotIds.includes(s.id) ? { ...s, status: 'AVAILABLE' as const } : s);
      return { ...prev, bookings: newBookings, slots: newSlots };
    });
  };

  const rescheduleBooking = (bookingId: string, newSlotId: string) => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking) return prev;
      // free old slots, book new slot
      const newSlots = prev.slots.map(s => {
        if (booking.slotIds.includes(s.id)) return { ...s, status: 'AVAILABLE' as const };
        if (s.id === newSlotId) return { ...s, status: 'BOOKED' as const };
        return s;
      });
      const newBookings = prev.bookings.map(b => b.id === bookingId ? { ...b, slotIds: [newSlotId] } : b);
      return { ...prev, slots: newSlots, bookings: newBookings };
    });
  };

  const rateBooking = (bookingId: string, rating: number) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, rated: true, userRating: rating } : b)
    }));
  };

  // --- Owner Actions ---
  const addFacility = (f: Partial<Facility>) => {
    const newFacility: Facility = {
      ...f,
      id: `f-${Date.now()}`,
      ownerId: state.currentUser?.id ?? 'o1',
      name: f.name || 'Untitled Venue',
      location: f.location || 'Ahmedabad, Gujarat',
      sports: f.sports || ['Badminton'],
      amenities: f.amenities || ['Parking', 'Drinking Water'],
      status: f.status || 'PENDING',
      rating: 5.0,
      photos: f.photos || [],
      operatingHours: f.operatingHours || (f.is24Hours ? '24 Hours Open' : `${f.openTime || '06:00'} - ${f.closeTime || '23:00'}`),
      openTime: f.openTime || '06:00',
      closeTime: f.closeTime || '23:00',
      is24Hours: f.is24Hours ?? false,
      slotDuration: f.slotDuration || 60,
      maxBookingDuration: f.maxBookingDuration || 2,
      documents: f.documents || []
    };
    setState(prev => ({
      ...prev,
      facilities: [newFacility, ...prev.facilities]
    }));
    return newFacility;
  };

  const updateFacility = (id: string, f: Partial<Facility>) => {
    setState(prev => ({
      ...prev,
      facilities: prev.facilities.map(fac => fac.id === id ? { ...fac, ...f } : fac)
    }));
  };

  const resubmitFacility = (id: string) => {
    setState(prev => ({
      ...prev,
      facilities: prev.facilities.map(fac => fac.id === id ? { ...fac, status: 'PENDING' as FacilityStatus, rejectionReason: undefined } : fac)
    }));
  };

  const addCourt = (c: Partial<Court>) => {
    const newCourt: Court = {
      ...c,
      id: `c-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      facilityId: c.facilityId || '',
      name: c.name || 'Court 1',
      sport: c.sport || 'Badminton',
      pricePerHour: c.pricePerHour || 500,
      weekdayDayPrice: c.weekdayDayPrice ?? c.pricePerHour ?? 500,
      weekdayNightPrice: c.weekdayNightPrice ?? Math.round((c.pricePerHour ?? 500) * 1.3),
      weekendDayPrice: c.weekendDayPrice ?? Math.round((c.pricePerHour ?? 500) * 1.2),
      weekendNightPrice: c.weekendNightPrice ?? Math.round((c.pricePerHour ?? 500) * 1.5),
      status: c.status ?? 'ACTIVE',
      openTime: c.openTime || '06:00',
      closeTime: c.closeTime || '23:00',
      is24Hours: c.is24Hours ?? false
    };

    // Auto-generate standard slots for today for this court
    const todayStr = new Date().toISOString().split('T')[0];
    const newSlots: TimeSlot[] = [
      { id: `s-m1-${newCourt.id}`, courtId: newCourt.id, date: todayStr, startTime: '07:00', endTime: '08:00', status: 'AVAILABLE', isNight: false, calculatedPrice: newCourt.weekdayDayPrice },
      { id: `s-m2-${newCourt.id}`, courtId: newCourt.id, date: todayStr, startTime: '09:00', endTime: '10:00', status: 'AVAILABLE', isNight: false, calculatedPrice: newCourt.weekdayDayPrice },
      { id: `s-a1-${newCourt.id}`, courtId: newCourt.id, date: todayStr, startTime: '16:00', endTime: '17:00', status: 'AVAILABLE', isNight: false, calculatedPrice: newCourt.weekdayDayPrice },
      { id: `s-e1-${newCourt.id}`, courtId: newCourt.id, date: todayStr, startTime: '18:00', endTime: '19:00', status: 'AVAILABLE', isNight: true, calculatedPrice: newCourt.weekdayNightPrice },
      { id: `s-e2-${newCourt.id}`, courtId: newCourt.id, date: todayStr, startTime: '19:00', endTime: '20:00', status: 'AVAILABLE', isNight: true, calculatedPrice: newCourt.weekdayNightPrice },
      { id: `s-e3-${newCourt.id}`, courtId: newCourt.id, date: todayStr, startTime: '20:00', endTime: '21:00', status: 'AVAILABLE', isNight: true, calculatedPrice: newCourt.weekdayNightPrice },
    ];

    setState(prev => ({
      ...prev,
      courts: [...prev.courts, newCourt],
      slots: [...prev.slots, ...newSlots]
    }));
    return newCourt;
  };

  const updateCourt = (id: string, c: Partial<Court>) => {
    setState(prev => ({
      ...prev,
      courts: prev.courts.map(crt => crt.id === id ? { ...crt, ...c } : crt)
    }));
  };

  const deleteCourt = (id: string) => {
    setState(prev => ({
      ...prev,
      courts: prev.courts.filter(c => c.id !== id)
    }));
  };

  const blockSlots = (slotIds: string[]) => {
    setState(prev => ({
      ...prev,
      slots: prev.slots.map(s => slotIds.includes(s.id) ? { ...s, status: 'BLOCKED' as const } : s)
    }));
  };

  const unblockSlots = (slotIds: string[]) => {
    setState(prev => ({
      ...prev,
      slots: prev.slots.map(s => slotIds.includes(s.id) ? { ...s, status: 'AVAILABLE' as const } : s)
    }));
  };

  // --- Admin Actions ---
  const adminApproveFacility = (id: string) => {
    setState(prev => ({
      ...prev,
      facilities: prev.facilities.map(fac => fac.id === id ? { ...fac, status: 'APPROVED' as FacilityStatus, rejectionReason: undefined } : fac)
    }));
  };

  const adminRejectFacility = (id: string, reason: string) => {
    setState(prev => ({
      ...prev,
      facilities: prev.facilities.map(fac => fac.id === id ? { ...fac, status: 'REJECTED' as FacilityStatus, rejectionReason: reason } : fac)
    }));
  };

  const toggleUserStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(user => user.id === id ? { ...user, status: user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' } : user)
    }));
  };

  return (
    <StoreContext.Provider value={{
      ...state, setCurrentUser, setSelectedCity, signOut, updateUser, signUp, login, lockSlot, toggleLockSlot, unlockSlot, clearCart, confirmBooking, cancelBooking, rescheduleBooking, rateBooking,
      addFacility, updateFacility, addCourt, updateCourt, deleteCourt, blockSlots, unblockSlots, resubmitFacility,
      adminApproveFacility, adminRejectFacility, toggleUserStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
