# QuickCourt — Design System & UI Guidelines

## 1. Design Philosophy

QuickCourt should feel like a real modern sports-booking product.

The visual identity should communicate:

- Fast
- Reliable
- Clear
- Active
- Modern
- Practical
- Trustworthy

The interface should prioritize usability over decoration.

---

# 2. Design Direction

Primary characteristics:

- Modern
- Minimal
- Clean
- Professional
- Sports-focused
- Premium but restrained

Use:

- Strong typography
- Generous whitespace
- Clear visual hierarchy
- Subtle borders
- Subtle shadows
- Consistent spacing
- Clear CTAs
- High-quality sports imagery

---

# 3. Avoid

Do NOT use:

- Excessive gradients
- Glassmorphism
- Glowing UI
- Random blobs
- Huge decorative illustrations
- Overly futuristic styling
- Excessive animations
- Excessive pills/badges
- Excessive nested cards
- Generic AI SaaS styling
- Decorative elements without purpose

---

# 4. Brand Context

Product:

QuickCourt

Market:

India

Primary example location:

Ahmedabad, Gujarat

Currency:

₹ INR

Sports:

- Badminton
- Cricket
- Football
- Tennis
- Table Tennis

---

# 5. Layout

Desktop-first.

Use:

- Clear max-width containers
- Consistent horizontal padding
- Strong grid system
- Predictable spacing
- Clear content sections

Avoid overcrowding.

Each screen should have a clear primary action.

---

# 6. Typography

Typography should be:

- Modern
- Highly readable
- Strong for headings
- Neutral for body text

Use a consistent type scale.

Headings should create clear hierarchy.

Do not use decorative fonts.

---

# 7. Colors

Use a restrained color system.

Primary brand color:
A strong sports-oriented accent color.

Supporting colors:
- Neutral background
- White/card surfaces
- Dark text
- Muted secondary text
- Subtle borders

Semantic colors:

Success:
Approved / Confirmed / Available

Warning:
Pending / Temporarily Locked

Error:
Rejected / Failed / Cancelled

Neutral:
Completed / Disabled / Informational

Do not use color as the only indicator of state.

---

# 8. Buttons

Primary CTA:

Strong visual emphasis.

Examples:

- Book Now
- Continue
- Pay Now
- Submit
- Approve

Secondary actions:

- Cancel
- Back
- Edit
- View

Danger actions:

- Delete
- Reject
- Cancel Booking

Buttons should use consistent:

- Height
- Radius
- Typography
- Padding
- Hover state
- Disabled state

---

# 9. Cards

Cards should be clean and purposeful.

Venue cards should prioritize:

1. Image
2. Venue name
3. Location
4. Sport
5. Rating
6. Price
7. Availability
8. CTA

Avoid excessive information inside cards.

---

# 10. Forms

Forms should have:

- Clear labels
- Consistent inputs
- Helpful placeholder text
- Validation states
- Error states
- Clear primary action

Do not make forms unnecessarily long.

Group related fields logically.

---

# 11. Navigation

## User

- Home
- Explore
- My Bookings
- Profile

## Owner

- Dashboard
- Facilities
- Courts
- Time Slots
- Bookings
- Approval Status
- Profile

## Admin

- Dashboard
- Facility Approvals
- Users / Owners
- Bookings
- Profile

Navigation should remain predictable.

---

# 12. Modals / Drawers

Use modals or drawers for temporary interactions such as:

- Filters
- Search
- Cancel confirmation
- Reject reason
- Block slot
- Delete confirmation

Do not create full pages for tiny interactions.

---

# 13. Booking States

Time slots must visually distinguish:

AVAILABLE
BOOKED
TEMPORARILY LOCKED
BLOCKED

Booking statuses:

CONFIRMED
CANCELLED
COMPLETED

Facility statuses:

DRAFT
PENDING
APPROVED
REJECTED

---

# 14. Responsive Design

Desktop is the first target.

However:

- Components should be reusable
- Layout should not depend on fixed dimensions
- Tables should have responsive alternatives
- Cards should adapt to smaller widths
- Navigation should be adaptable later

Mobile optimization is a later phase.

---

# 15. Imagery

Use sports imagery selectively.

Images should support the product.

Avoid:

- Generic stock-photo overload
- Decorative images that compete with content
- Excessively large hero imagery

Venue images should feel realistic and local.

---

# 16. Empty States

Every major data-driven screen should have a useful empty state.

Examples:

No bookings:
"You don't have any bookings yet."

No facilities:
"Add your first facility to get started."

No pending approvals:
"You're all caught up."

---

# 17. Loading States

Use subtle loading states where appropriate.

Avoid excessive animation.

---

# 18. Error States

Errors should be:

- Clear
- Specific
- Actionable

Example:

"Unable to load available slots. Please try again."

---

# 19. Accessibility

Maintain:

- Good contrast
- Readable text
- Clear focus states
- Meaningful labels
- Keyboard-friendly interactions
- State information that isn't conveyed only through color

---

# 20. Design Consistency Rule

User, Owner and Admin interfaces may have different information architectures.

However, they must clearly belong to the same QuickCourt product.

Reuse:

- Typography
- Colors
- Buttons
- Inputs
- Cards
- Spacing
- Icons
- Status patterns
- Modal patterns
- Navigation language

---

# 21. Stitch Design Workflow

The visual design should be created in phases.

Phase 1:
User

Phase 2:
Facility Owner

Phase 3:
Admin

Phase 4:
Cross-role consistency

Phase 5:
Prototype interactions

Do not redesign the entire application when making a small change.

Make targeted refinements.

Preferred refinement:

Target:
Specific screen

Target:
Specific component

Change:
One or two visual properties

Example:

"On the Venue Details screen, increase the visual prominence of the Book Now CTA without changing the rest of the layout."

---

# 22. Prototype Principle

Static design comes first.

Then generate a prototype.

Test:

- Navigation
- Hover states
- Button states
- Form sizes
- Text lengths
- Cards
- Modals
- Empty states
- Error states
- Booking states

After testing, make targeted refinements.

Do not redesign everything based on one issue.

