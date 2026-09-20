# QuickCourt - Current System Flow

## 1. Application Architecture
QuickCourt is a Next.js (React) front-end application using the App Router. The backend and database layers are currently simulated entirely via a global React Context (`StoreContext`). 

### Key Structural Components:
- **`app/`**: Next.js App Router providing routing for all user types. Grouped into `(auth)`, `(public)`, `admin/`, and `owner/` domains.
- **`contexts/StoreContext.tsx`**: The centralized, mock backend acting as the Single Source of Truth for State.
- **`components/`**: Reusable Stitch-designed UI components (like `TopNav`, `TopNavAdmin`).
- **`types/index.ts`**: TypeScript definitions enforcing data contracts for `User`, `Facility`, `Court`, `TimeSlot`, and `Booking`.

## 2. State & Data Flow (`StoreContext`)
Data naturally flows from the `StoreProvider` (at the root `app/layout.tsx`) downwards.

- **Facilities, Courts, Slots, Users, and Bookings** are all held in memory.
- **Mutations** (add, update, delete, status changes) are performed via bound actions in the context:
  - User Actions: `lockSlot`, `unlockSlot`, `confirmBooking`, `cancelBooking`
  - Owner Actions: `addFacility`, `updateFacility`, `addCourt`, `updateCourt`, `deleteCourt`, `blockSlots`, `unblockSlots`, `resubmitFacility`
  - Admin Actions: `adminApproveFacility`, `adminRejectFacility`, `toggleUserStatus`

### Booking Lifecycle
```
AVAILABLE (Slot)
  ↓ [User clicks slot on Court Matrix]
LOCKED (Slot) -> Set as `cartSlot` in Context
  ↓ [User confirms payment via /checkout -> /payment]
BOOKED (Slot) + CONFIRMED (Booking)
  ↓ [User clicks Cancel on /bookings/[id]]
AVAILABLE (Slot) + CANCELLED (Booking)
```

### Facility Approval Lifecycle
```
DRAFT -> PENDING (Facility) [Owner submits new Facility]
  ↓ [Admin views on /admin/approvals]
APPROVED (Facility) [Becomes visible to Users]
  or
REJECTED (Facility) [Admin requires rejection reason]
  ↓ [Owner edits on /owner/facilities/[id]/edit]
PENDING (Facility) [Owner resubmits]
```

## 3. Role-Based Navigation Flows

### User Flow
```
/ (Home) -> /explore (Venues List)
  ↓
/venue/[id] (Venue Details)
  ↓
/venue/[id]/book (Court/Time Matrix)
  ↓
/checkout (Booking Summary & Slot Lock)
  ↓
/payment (Simulated Payment Processing)
  ↓
/success (Confirmation) -> /bookings (My Bookings)
```

### Owner Flow
```
/owner (Dashboard)
  ↓
/owner/facilities (Manage Venues) -> /owner/facilities/new (Submit Draft)
  ↓
/owner/facilities/[id]/approval (Status Check)
  ↓
/owner/facilities/[id]/courts (Manage Courts & Pricing)
  ↓
/owner/schedule (Manage Time Slots: Block/Unblock)
```

### Admin Flow
```
/admin (Operations Dashboard)
  ↓
/admin/approvals (Pending Facility Reviews)
  ↓
/admin/approvals/[id] (Approve / Reject UI)
  ↓
/admin/users (Platform User Management & Ban/Unban)
```

### Authentication Flow (Mocked)
```
/login or /signup
  ↓ (Role Selection / Details)
/otp (Simulated SMS 6-Digit Passphrase)
  ↓ (Success)
/ (Home)
```

## 4. Cross-Role Interactions (Data Sharing)
Because all roles read from the exact same in-memory context:
1. When an **Owner** adds a facility, it enters the global `facilities` array as `PENDING`.
2. The **Admin** reads `facilities.filter(f => f.status === 'PENDING')` and approves it.
3. The **User** explores `facilities.filter(f => f.status === 'APPROVED')` and books a slot.
4. The **Owner** views `bookings` filtered by `facility.ownerId === currentUser.id`.

