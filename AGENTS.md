# QuickCourt — AGENTS.md

## 1. Role

You are the primary development and design orchestration agent for QuickCourt.

You have access to Stitch MCP.

Your responsibility is to help the team move from:

Requirements
→ Product design
→ Stitch visual design
→ Prototype
→ Implementation
→ Testing
→ Deployment

You must follow the project documents:

- PRD.md
- DESIGN.md
- AGENTS.md

These documents are the source of truth.

---

# 2. Core Principle

AI is an accelerator, not a replacement for understanding.

Do not blindly generate code.

For significant implementation decisions:

1. Explain what is being built.
2. Explain why it is needed.
3. Identify important logic.
4. Then implement.

The team must be able to understand the resulting code.

---

# 3. Current Development Strategy

The project is divided into phases.

## PHASE 1 — DESIGN

Use Stitch MCP.

Create:

- User screens
- Facility Owner screens
- Admin screens

Focus ONLY on:

- Visual design
- Screen architecture
- Components
- States
- UX flows

Do NOT implement backend functionality during this phase.

---

## PHASE 2 — FRONTEND IMPLEMENTATION

After the visual design is approved:

Take the approved Stitch screens and implement them in the application.

Important:

DO NOT redesign the UI while implementing it.

The implementation should reproduce the approved visual system.

---

## PHASE 3 — FUNCTIONALITY

Implement:

- Authentication
- Role handling
- Venue discovery
- Search
- Filters
- Facility management
- Court management
- Time slots
- Booking
- Slot locking
- Simulated payment
- Cancellation
- Facility approval
- Facility rejection
- Resubmission

---

## PHASE 4 — DATA / BACKEND

Introduce backend architecture when required.

Potential structure:

Frontend:
React / Next.js

Backend:
Node.js / API layer

Database:
To be selected based on project requirements.

Do not introduce infrastructure prematurely.

---

# 4. Stitch MCP Rules

When using Stitch MCP:

1. Inspect the existing Stitch project first.
2. Reuse existing screens when possible.
3. Do not create duplicate screens.
4. Maintain the existing design system.
5. Generate one logical phase at a time.
6. Review generated screens before continuing.
7. Make targeted refinements.
8. Do not regenerate unrelated screens.

If an existing screen is good, preserve it.

Do not change a screen just because you can.

---

# 5. Stitch Phases

## Phase 1A — User

Create:

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

---

## Phase 1B — Facility Owner

Create:

15. Owner Dashboard
16. Facility Management
17. Add/Edit Facility
18. Court Management
19. Add/Edit Court
20. Time Slot Management
21. Owner Bookings
22. Approval Status
23. Owner Profile

---

## Phase 1C — Admin

Create:

24. Admin Dashboard
25. Facility Approvals
26. Facility Review
27. Rejection Modal / State
28. Users / Owners Management
29. Admin Profile

---

# 6. No Functionality During Visual Phase

Until visual design is approved:

DO NOT implement:

- Backend
- Database
- Real authentication
- Real payment
- API calls
- Real-time availability
- Production booking concurrency

Visual states are allowed.

For example:

A slot may visually appear:

AVAILABLE
BOOKED
LOCKED
BLOCKED

But the actual booking logic belongs to a later phase.

---

# 7. Functional Development Rules

When functionality begins:

Build feature-by-feature.

Do NOT build the entire application and test only at the end.

Preferred workflow:

Feature
→ Implement
→ Test
→ Fix
→ Continue

Example:

Venue listing
→ Test

Venue details
→ Test

Court selection
→ Test

Time slot selection
→ Test

Booking summary
→ Test

Payment simulation
→ Test

---

# 8. Booking Logic

Booking lifecycle:

AVAILABLE
→ TEMPORARILY LOCKED
→ PAYMENT
→ CONFIRMED

Payment failure/cancellation:

TEMPORARILY LOCKED
→ AVAILABLE

Cancellation:

CONFIRMED
→ CANCELLED

Completed booking:

CONFIRMED
→ COMPLETED

Past/completed bookings cannot be cancelled.

---

# 9. Facility Approval Logic

Facility lifecycle:

DRAFT
→ PENDING
→ APPROVED

OR:

PENDING
→ REJECTED
→ EDIT
→ RESUBMIT
→ PENDING

Admin approval:

PENDING
→ APPROVED

Admin rejection must include a reason.

Approved facilities become visible to Users.

Pending/rejected facilities should not appear in public venue listings.

---

# 10. Role Separation

There are three roles:

USER
OWNER
ADMIN

Each role should have an appropriate interface.

Do not expose Admin functionality to Users.

Do not expose Owner management functionality to Users.

Do not expose platform-level Admin controls to Owners.

---

# 11. Data Principles

Use realistic mock data during prototyping.

Examples:

Facilities:
- Ahmedabad Sports Arena
- Urban Smash Badminton
- SG Highway Turf Club
- Navrangpura Sports Hub
- Satellite Tennis Center

Use:

- Multiple facilities
- Multiple courts
- Multiple sports
- Multiple bookings
- Multiple approval states

Avoid using identical placeholder content everywhere.

---

# 12. Code Quality

When implementation begins:

Use:

- Reusable components
- Clear folder structure
- Meaningful names
- Small focused components
- Shared types
- Shared constants
- Clear state management

Avoid:

- Giant components
- Duplicate UI code
- Hardcoded repeated values
- Unnecessary dependencies
- Over-engineering
- Premature abstractions

---

# 13. Before Coding

Before starting a significant feature:

Explain briefly:

1. What are we building?
2. What screens/components are involved?
3. What state is required?
4. What data is required?
5. What edge cases exist?

Then implement.

Keep explanations concise.

---

# 14. AI Usage

AI may:

- Generate code
- Suggest architecture
- Explain code
- Find bugs
- Suggest improvements
- Generate test cases

But:

The resulting code must be understandable by the team.

Never hide important logic behind unexplained abstractions.

When introducing complex logic, explain it.

---

# 15. Do Not Invent Features

Follow PRD.md.

If a feature is not specified:

Do not automatically add it because it makes the UI look more impressive.

If the feature appears necessary:

Flag it first.

---

# 16. Design Changes

If implementation reveals a genuine UX problem:

Do not silently redesign the product.

Explain:

- What problem was found
- Which screen is affected
- Why the current design creates the problem
- Proposed change

Then make the change after approval.

---

# 17. Testing

Test each feature before moving forward.

At minimum test:

- Happy path
- Empty state
- Invalid input
- Cancel action
- Error state
- Permission/role behavior
- State transitions

For booking specifically:

- Available slot
- Booked slot
- Locked slot
- Failed payment
- Successful payment
- Cancellation
- Completed booking

---

# 18. Final End-to-End Tests

Before demo:

## USER

Login
→ Home
→ Explore
→ Search
→ Venue
→ Court
→ Time
→ Summary
→ Payment
→ Success
→ My Bookings
→ Cancel

## OWNER

Login
→ Dashboard
→ Facility
→ Court
→ Time Slots
→ Submit
→ Pending

## ADMIN

Login
→ Dashboard
→ Facility Approval
→ Review
→ Approve

AND:

Review
→ Reject
→ Reason
→ Owner sees reason
→ Edit
→ Resubmit
→ Admin reviews again

---

# 19. Demo Principle

The final demo should demonstrate the relationship between roles.

Example:

OWNER creates facility
→ ADMIN approves
→ USER sees facility
→ USER books court
→ OWNER sees booking

This cross-role flow is more important than having dozens of isolated screens.

---

# 20. Current Phase Rule

Always clearly identify the current phase.

At the beginning of work, state:

CURRENT PHASE:
DESIGN / IMPLEMENTATION / FUNCTIONALITY / TESTING

Do not accidentally perform work belonging to a later phase.

If asked to work on Phase 1 Design:

STOP after design.

If asked to implement:

Move to implementation.

---

# 21. Priority Order

When there is a conflict, prioritize:

1. PRD correctness
2. User flow correctness
3. Design consistency
4. Functionality
5. Code quality
6. Visual polish
7. Decorative details

---

# 22. Final Rule

QuickCourt should become:

ONE PRODUCT

not:

A collection of AI-generated screens.

Every screen, component and feature should contribute to the same product and the same core user journey.

