# QuickCourt — Product Requirements Document

## 1. Product Overview

QuickCourt is a web-first local sports facility booking platform.

The platform allows sports players to discover local sports facilities, view venue information, check court/time-slot availability, make a simulated booking/payment, and manage their bookings.

The system supports three primary roles:

1. User / Player
2. Facility Owner
3. Admin

---

# 2. Problem

Players currently may need to:

- Search for nearby sports facilities
- Contact venues manually
- Ask about pricing
- Ask about availability
- Coordinate dates and times
- Confirm which court is available
- Handle payment manually

This makes the booking process slower and less transparent.

QuickCourt brings venue discovery, availability, booking, and booking management into one platform.

---

# 3. Product Goals

QuickCourt should make it easy for a player to:

- Discover sports venues
- Search and filter venues
- Understand venue pricing
- View available courts
- Select a date and time
- Book a court
- Complete simulated payment
- View booking information
- Cancel eligible future bookings

QuickCourt should allow facility owners to:

- Register facilities
- Add courts
- Set pricing
- Manage operating hours
- Manage time-slot availability
- View bookings
- Track simulated earnings
- Submit facilities for admin approval
- Correct rejected information and resubmit

QuickCourt should allow administrators to:

- View platform statistics
- Review facility registrations
- Approve facilities
- Reject facilities with a reason
- Manage users and facility owners

---

# 4. Roles

## 4.1 User / Player

The User discovers and books sports facilities.

Primary responsibilities:

- Discover venues
- Search/filter venues
- View venue details
- Select court/time
- Book
- Pay through simulated payment
- View bookings
- Cancel eligible bookings
- Manage profile

---

## 4.2 Facility Owner

The Facility Owner manages sports facilities.

Primary responsibilities:

- Create facility
- Edit facility
- Add courts
- Edit courts
- Delete courts
- Set pricing
- Manage operating hours
- Manage availability
- Block slots
- View bookings
- View simulated earnings
- Submit facility for approval
- Resubmit rejected facilities

---

## 4.3 Admin

The Admin manages platform-level operations.

Primary responsibilities:

- View platform statistics
- Review facilities
- Approve facilities
- Reject facilities
- Provide rejection reasons
- Manage users
- Manage facility owners

---

# 5. User Journey

## Authentication

Login
→ Home

Sign Up
→ OTP Verification
→ Home

---

# 6. User Features

## 6.1 Home

The Home screen should provide:

- QuickCourt branding
- Location selector
- Search
- Sports categories
- Date/time search
- Featured venues
- Available venues
- Top-rated venues
- Book Now actions

---

## 6.2 Explore / Venue Listing

Users can browse approved venues.

Each venue should show:

- Venue name
- Sport types
- Starting price/hour
- Location
- Rating
- Availability
- Venue image
- Book Now

---

## 6.3 Search and Filters

Users can search and filter venues by:

- Sport
- Price
- Venue type
- Rating
- Location

---

## 6.4 Venue Details

Venue details should contain:

- Venue name
- Description
- Address
- Sports
- Amenities
- About
- Gallery
- Reviews
- Rating
- Pricing
- Available courts
- Book Now

---

# 7. Booking

## 7.1 Court and Time Selection

User selects:

1. Date
2. Court
3. Time slot

Time-slot states:

- Available
- Booked
- Temporarily Locked
- Blocked

---

## 7.2 Slot Locking

The intended booking lifecycle is:

Available
→ User selects slot
→ Temporarily Locked
→ Payment
→ Confirmed

If payment fails or is cancelled:

Temporarily Locked
→ Available

For the prototype, the temporary lock can be simulated locally.

A future real implementation should handle concurrency server-side.

---

# 8. Booking Summary

Show:

- Venue
- Sport
- Court
- Date
- Time
- Duration
- Price/hour
- Total amount
- Cancellation information

---

# 9. Payment

Payment is simulated.

Supported visual payment methods:

- UPI
- Card

The prototype should not connect to a real payment gateway.

Flow:

Payment
→ Processing
→ Success

or

Payment
→ Cancelled / Failed
→ Slot released

---

# 10. Booking Success

After successful payment:

Show:

- Booking confirmation
- Booking ID
- Venue
- Sport
- Court
- Date
- Time
- Amount

Actions:

- View Booking
- My Bookings
- Back to Home

---

# 11. My Bookings

Users can view:

- Confirmed bookings
- Cancelled bookings
- Completed bookings

Each booking contains:

- Venue
- Sport
- Court
- Date
- Time
- Amount
- Status

---

# 12. Booking Cancellation

Users may cancel eligible future bookings.

Cancellation flow:

Booking Details
→ Cancel Booking
→ Confirmation
→ Cancelled

Completed/past bookings should not show the cancellation action.

---

# 13. User Profile

Users can:

- View name
- View email
- View phone
- Edit profile
- Save changes
- Logout

---

# 14. Facility Owner Features

## Owner Dashboard

Show:

- Total bookings
- Active courts
- Simulated earnings
- Pending approvals
- Booking calendar
- Recent bookings
- Earnings trends
- Peak hours

---

## Facility Management

Owner can:

- Add facility
- Edit facility
- View facility
- Manage courts

Facility fields:

- Facility name
- Location
- Description
- Sports
- Amenities
- Photos

---

## Court Management

Court fields:

- Court name
- Sport
- Price/hour
- Operating hours
- Status

Owner actions:

- Add
- Edit
- Delete

---

## Time Slot Management

Time-slot states:

- Available
- Booked
- Blocked

Owner can block slots for:

- Maintenance
- Private event
- Other operational reasons

---

## Owner Bookings

Show:

- User
- Facility
- Court
- Date
- Time
- Status

---

# 15. Facility Approval

Facility lifecycle:

Draft
→ Pending
→ Approved

OR

Pending
→ Rejected

If rejected:

Rejected
→ Owner sees reason
→ Owner edits
→ Resubmits
→ Pending

Admin approval:

Pending
→ Approved

Approved facilities become visible to Users.

Rejected/Pending facilities should not appear in the public venue listing.

---

# 16. Admin Features

## Admin Dashboard

Show:

- Total users
- Total facility owners
- Total facilities
- Total bookings
- Pending approvals
- Recent activity

---

## Facility Approvals

Show:

- Facility
- Owner
- Location
- Sports
- Submitted date
- Status

Action:

- Review

---

## Facility Review

Show:

- Facility name
- Owner information
- Location
- Description
- Sports
- Amenities
- Photos
- Courts
- Pricing
- Operating hours

Actions:

- Approve
- Reject

---

## Rejection

Admin provides a specific rejection reason.

Example:

"Please provide clearer facility photos and complete operating hours."

Owner can see the reason and resubmit.

---

## User / Owner Management

Admin can:

- Search users
- Search owners
- Filter
- View user information
- View booking history
- Ban/unban users

---

# 17. Core Screens

## User

1. Login
2. Sign Up
3. OTP Verification
4. Home
5. Explore / Venues
6. Search / Filters
7. Venue Details
8. Select Date / Court / Time
9. Booking Summary
10. Payment
11. Booking Success
12. My Bookings
13. Booking Details / Cancel
14. Profile

## Facility Owner

15. Owner Dashboard
16. Facility Management
17. Add/Edit Facility
18. Court Management
19. Add/Edit Court
20. Time Slot Management
21. Owner Bookings
22. Approval Status
23. Owner Profile

## Admin

24. Admin Dashboard
25. Facility Approvals
26. Facility Review
27. Rejection Modal/State
28. Users / Owners Management
29. Admin Profile

---

# 18. Out of Scope

The initial prototype does NOT require:

- Real payment gateway
- Real SMS/OTP provider
- Real-time production booking infrastructure
- Real maps integration
- Production analytics
- Production notifications
- Complex recommendation algorithms
- AI-based facility approval
- Advanced reporting unless required later

---

# 19. Prototype Principle

The prototype should demonstrate the complete product journey.

The goal is not to build every possible feature.

The goal is to demonstrate:

User:
Discover → Book → Pay → Manage

Owner:
Create → Configure → Submit → Manage

Admin:
Review → Approve/Reject

And the resulting state changes between these roles.

