const fs = require('fs');

const users = [
  // Required Demo Defaults
  { id: 'u1', name: 'Player One', role: 'USER', email: 'player@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  { id: 'o1', name: 'Vikram Patel', role: 'OWNER', email: 'owner@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  { id: 'a1', name: 'Super Admin', role: 'ADMIN', email: 'admin@quickcourt.in', status: 'ACTIVE', password: 'password123' },
  
  // 8 Indian Demo Users
  { id: 'u2', name: 'Aarav Shah', role: 'USER', email: 'aarav@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543211' },
  { id: 'u3', name: 'Rohan Patel', role: 'USER', email: 'rohan@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543212' },
  { id: 'u4', name: 'Dev Mehta', role: 'USER', email: 'dev@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543213' },
  { id: 'u5', name: 'Yash Desai', role: 'USER', email: 'yash@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543214' },
  { id: 'u6', name: 'Kunal Shah', role: 'USER', email: 'kunal@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543215' },
  { id: 'u7', name: 'Krish Patel', role: 'USER', email: 'krish@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543216' },
  { id: 'u8', name: 'Dhruv Joshi', role: 'USER', email: 'dhruv@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543217' },
  { id: 'u9', name: 'Neel Trivedi', role: 'USER', email: 'neel@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9876543218' },

  // 4 Additional Owners
  { id: 'o2', name: 'Ravi Patel', role: 'OWNER', email: 'ravi@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9123456781' },
  { id: 'o3', name: 'Harsh Shah', role: 'OWNER', email: 'harsh@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9123456782' },
  { id: 'o4', name: 'Mihir Desai', role: 'OWNER', email: 'mihir@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9123456783' },
  { id: 'o5', name: 'Akash Mehta', role: 'OWNER', email: 'akash@quickcourt.in', status: 'ACTIVE', password: 'password123', phone: '+91 9123456784' },
];

const ownerIds = ['o1', 'o2', 'o3', 'o4', 'o5'];

const facilities = [
  // 7 APPROVED
  {
    id: 'f1', ownerId: 'o1', name: 'Smash Arena', location: 'Satellite, Ahmedabad',
    status: 'APPROVED', sports: ['Badminton', 'Table Tennis'], amenities: ['AC', 'Parking', 'Pro Shop'],
    rating: 4.8, description: 'Premium badminton facility with synthetic courts.', operatingHours: '06:00 - 23:00',
    openTime: '06:00', closeTime: '23:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 3,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f2', ownerId: 'o2', name: 'CourtHouse Sports Club', location: 'Prahlad Nagar, Ahmedabad',
    status: 'APPROVED', sports: ['Tennis', 'Pickleball'], amenities: ['Floodlights', 'Parking', 'Cafe'],
    rating: 4.6, description: 'Top tier tennis and pickleball courts.', operatingHours: '06:00 - 22:00',
    openTime: '06:00', closeTime: '22:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f3', ownerId: 'o3', name: 'Urban Turf Ahmedabad', location: 'SG Highway, Ahmedabad',
    status: 'APPROVED', sports: ['Football Turf', 'Cricket Nets'], amenities: ['Floodlights', 'Seating Area', 'Parking'],
    rating: 4.9, description: 'FIFA certified artificial turf.', operatingHours: '06:00 - 23:59',
    openTime: '06:00', closeTime: '23:59', is24Hours: false, slotDuration: 60, maxBookingDuration: 3,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f4', ownerId: 'o4', name: 'Rally Point Sports', location: 'Bopal, Ahmedabad',
    status: 'APPROVED', sports: ['Tennis', 'Badminton'], amenities: ['Locker Room', 'Parking'],
    rating: 4.4, description: 'Affordable and well-maintained courts.', operatingHours: '07:00 - 22:00',
    openTime: '07:00', closeTime: '22:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f5', ownerId: 'o5', name: 'GreenZone Arena', location: 'Thaltej, Ahmedabad',
    status: 'APPROVED', sports: ['Cricket Nets', 'Football Turf'], amenities: ['Floodlights', 'Parking', 'First Aid'],
    rating: 4.7, description: 'Best place for box cricket and 5-a-side football.', operatingHours: '06:00 - 23:00',
    openTime: '06:00', closeTime: '23:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 3,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f6', ownerId: 'o1', name: 'GamePoint Sports Hub', location: 'Vastrapur, Ahmedabad',
    status: 'APPROVED', sports: ['Badminton', 'Pickleball'], amenities: ['AC', 'Drinking Water', 'Parking'],
    rating: 4.2, description: 'Indoor courts with excellent lighting.', operatingHours: '06:00 - 23:00',
    openTime: '06:00', closeTime: '23:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f7', ownerId: 'o2', name: 'Ace Sports Centre', location: 'Bodakdev, Ahmedabad',
    status: 'APPROVED', sports: ['Tennis'], amenities: ['Clay Court', 'Parking', 'Pro Shop'],
    rating: 4.8, description: 'Professional clay tennis courts.', operatingHours: '06:00 - 21:00',
    openTime: '06:00', closeTime: '21:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  
  // 2 PENDING
  {
    id: 'f8', ownerId: 'o3', name: 'The Sports Yard', location: 'Chandkheda, Ahmedabad',
    status: 'PENDING', sports: ['Badminton', 'Cricket Nets'], amenities: ['Parking', 'Water Cooler'],
    rating: 0, description: 'New facility pending approval.', operatingHours: '08:00 - 20:00',
    openTime: '08:00', closeTime: '20:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },
  {
    id: 'f9', ownerId: 'o4', name: 'PlayNation Arena', location: 'Maninagar, Ahmedabad',
    status: 'PENDING', sports: ['Football Turf'], amenities: ['Floodlights', 'Parking'],
    rating: 0, description: 'Newly constructed football turf.', operatingHours: '06:00 - 23:00',
    openTime: '06:00', closeTime: '23:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  },

  // 1 REJECTED
  {
    id: 'f10', ownerId: 'o5', name: 'Rally & Run', location: 'Navrangpura, Ahmedabad',
    status: 'REJECTED', rejectionReason: 'Please upload a clearer ownership document and update the facility contact information.',
    sports: ['Tennis', 'Badminton'], amenities: ['Parking'],
    rating: 0, description: 'Multi-sport complex.', operatingHours: '06:00 - 22:00',
    openTime: '06:00', closeTime: '22:00', is24Hours: false, slotDuration: 60, maxBookingDuration: 2,
    documents: [{ name: 'Registration', url: '#', uploadedAt: new Date().toISOString() }], photos: []
  }
];

let courtCounter = 1;
const courts = [];
const slots = [];

const today = new Date();
const dates = [];
for (let i = -2; i <= 2; i++) {
  const d = new Date();
  d.setDate(today.getDate() + i);
  dates.push(d.toISOString().split('T')[0]);
}

const slotTimes = [
  { start: '07:00', end: '08:00', isNight: false },
  { start: '08:00', end: '09:00', isNight: false },
  { start: '09:00', end: '10:00', isNight: false },
  { start: '10:00', end: '11:00', isNight: false },
  { start: '12:00', end: '13:00', isNight: false },
  { start: '13:00', end: '14:00', isNight: false },
  { start: '16:00', end: '17:00', isNight: false },
  { start: '17:00', end: '18:00', isNight: true },
  { start: '18:00', end: '19:00', isNight: true },
  { start: '19:00', end: '20:00', isNight: true },
  { start: '20:00', end: '21:00', isNight: true },
  { start: '21:00', end: '22:00', isNight: true },
];

facilities.forEach(fac => {
  fac.sports.forEach((sport, sIdx) => {
    const numCourts = sport === 'Badminton' ? 3 : sport === 'Football Turf' ? 2 : sport === 'Tennis' ? 2 : 1;
    for (let c = 1; c <= numCourts; c++) {
      const isMaintenance = courtCounter === 5 || courtCounter === 12; // 2 courts maintenance
      const isWebBookDisabled = courtCounter === 8 || courtCounter === 15; // 2 courts disabled
      
      const basePrice = sport === 'Football Turf' ? 1200 : sport === 'Cricket Nets' ? 800 : sport === 'Tennis' ? 600 : sport === 'Badminton' ? 400 : 250;
      
      const namePrefix = sport === 'Football Turf' ? 'Turf' : sport === 'Cricket Nets' ? 'Net' : 'Court';
      const court = {
        id: `c${courtCounter}`,
        facilityId: fac.id,
        name: `${namePrefix} ${c}`,
        sport: sport,
        pricePerHour: basePrice,
        weekdayDayPrice: basePrice,
        weekdayNightPrice: Math.round(basePrice * 1.3),
        weekendDayPrice: Math.round(basePrice * 1.2),
        weekendNightPrice: Math.round(basePrice * 1.5),
        status: isMaintenance ? 'MAINTENANCE' : 'ACTIVE',
        webBookEnabled: !isWebBookDisabled,
        openTime: fac.openTime,
        closeTime: fac.closeTime,
        is24Hours: fac.is24Hours
      };
      courts.push(court);
      courtCounter++;

      // Generate slots for each date
      dates.forEach((dateStr) => {
        const dObj = new Date(dateStr);
        const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;
        slotTimes.forEach(time => {
          // Some random blocked/locked slots
          let status = 'AVAILABLE';
          if (court.status === 'MAINTENANCE') status = 'BLOCKED';
          else if (Math.random() < 0.05) status = 'BLOCKED'; // 5% blocked
          
          let price = isWeekend 
            ? (time.isNight ? court.weekendNightPrice : court.weekendDayPrice)
            : (time.isNight ? court.weekdayNightPrice : court.weekdayDayPrice);

          slots.push({
            id: `s-${court.id}-${dateStr}-${time.start.replace(':', '')}`,
            courtId: court.id,
            date: dateStr,
            startTime: time.start,
            endTime: time.end,
            status: status,
            isNight: time.isNight,
            isWeekend: isWeekend,
            calculatedPrice: price
          });
        });
      });
    }
  });
});

const bookings = [];
const playerIds = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'];
let bookingCounter = 1;

// Pick available slots randomly and book them
const availableSlots = slots.filter(s => s.status === 'AVAILABLE' && facilities.find(f => f.id === courts.find(c => c.id === s.courtId).facilityId).status === 'APPROVED');
const shuffledSlots = availableSlots.sort(() => 0.5 - Math.random());

// 40 bookings
for (let i = 0; i < 40; i++) {
  const slot = shuffledSlots[i];
  if (!slot) break;
  slot.status = 'BOOKED'; // mark in slots

  const user = playerIds[Math.floor(Math.random() * playerIds.length)];
  const court = courts.find(c => c.id === slot.courtId);
  
  // Decide status based on date
  const slotDate = new Date(slot.date);
  slotDate.setHours(parseInt(slot.startTime.split(':')[0]), 0, 0, 0);
  
  let bStatus = 'CONFIRMED';
  if (slotDate < new Date()) {
    bStatus = Math.random() < 0.1 ? 'CANCELLED' : 'COMPLETED';
    if (bStatus === 'CANCELLED') slot.status = 'AVAILABLE';
  }

  const amount = slot.calculatedPrice;
  const isAdvance = Math.random() < 0.3;

  bookings.push({
    id: `b${bookingCounter++}`,
    userId: user,
    facilityId: court.facilityId,
    courtId: court.id,
    slotIds: [slot.id],
    status: bStatus,
    amount: isAdvance ? Math.round(amount * 0.2) : amount,
    totalAmount: amount,
    advanceAmount: isAdvance ? Math.round(amount * 0.2) : 0,
    remainingAmount: isAdvance ? amount - Math.round(amount * 0.2) : 0,
    paymentType: isAdvance ? 'ADVANCE_20' : 'FULL',
    paymentMethod: Math.random() < 0.5 ? 'UPI' : 'CARD',
    date: new Date(slotDate.getTime() - 86400000).toISOString(), // booked 1 day before
    rated: bStatus === 'COMPLETED' ? Math.random() < 0.5 : false,
    userRating: bStatus === 'COMPLETED' ? [4, 5, 5, 3][Math.floor(Math.random() * 4)] : undefined
  });
}

const fileContent = `
import { User, Facility, Court, TimeSlot, Booking } from '@/types';

export const demoUsers: User[] = ${JSON.stringify(users, null, 2)};
export const demoFacilities: Facility[] = ${JSON.stringify(facilities, null, 2)};
export const demoCourts: Court[] = ${JSON.stringify(courts, null, 2)};
export const demoSlots: TimeSlot[] = ${JSON.stringify(slots, null, 2)};
export const demoBookings: Booking[] = ${JSON.stringify(bookings, null, 2)};
`;

fs.writeFileSync('data/demoData.ts', fileContent);
console.log('Demo data generated successfully!');
