export type Role = 'USER' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: 'ACTIVE' | 'BANNED';
  phone?: string;
  avatar?: string;
  preferredSports?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export type FacilityStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Facility {
  id: string;
  ownerId: string;
  name: string;
  location: string;
  status: FacilityStatus;
  sports: string[];
  amenities: string[];
  rejectionReason?: string;
  photos: string[];
  rating: number;
  description?: string;
  operatingHours?: string;
  is24Hours?: boolean;
  openTime?: string;
  closeTime?: string;
  slotDuration?: number;
  maxBookingDuration?: number;
  weekdayDayPrice?: number;
  weekdayNightPrice?: number;
  weekendDayPrice?: number;
  weekendNightPrice?: number;
  documents?: { name: string; url: string; uploadedAt: string; type?: string; status?: string }[];
}

export interface Court {
  id: string;
  facilityId: string;
  name: string;
  sport: string;
  pricePerHour: number; // Base rate / fallback
  weekdayDayPrice?: number;
  weekdayNightPrice?: number;
  weekendDayPrice?: number;
  weekendNightPrice?: number;
  openTime?: string; // e.g. "06:00"
  closeTime?: string; // e.g. "23:00"
  is24Hours?: boolean;
  status: 'ACTIVE' | 'MAINTENANCE';
}

export type SlotStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED' | 'BLOCKED';

export interface TimeSlot {
  id: string;
  courtId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  status: SlotStatus;
  isNight?: boolean;
  isWeekend?: boolean;
  calculatedPrice?: number;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  courtId: string;
  slotIds: string[];
  status: BookingStatus;
  amount: number;
  totalAmount?: number;
  advanceAmount?: number;
  remainingAmount?: number;
  paymentType?: 'FULL' | 'ADVANCE_20';
  paymentMethod?: string;
  date: string;
  rated?: boolean;
  userRating?: number;
}

