# QuickCourt QA Audit & Bug Report

## Overview
A comprehensive audit of the QuickCourt application frontend has been conducted. The UI architecture (App Router), visual styling (Stitch themes), and core in-memory logic (`StoreContext`) are largely structurally sound, but there are isolated interaction and state-binding bugs, especially around search functionality.

## Issue Tracker

| ID | Severity | Area | Issue | Expected | Actual | File/Component |
|----|----------|------|-------|----------|--------|----------------|
| 01 | **HIGH** | User / Search | Home Page Hero search input is unmanaged and disconnected from the Explore page. | Typing a query and clicking "Search Courts" should redirect to `/explore?query=...` and filter venues. | Clicking "Search Courts" ignores the input and just routes to `/explore` via a static `<Link>`. | `app/page.tsx` |
| 02 | **HIGH** | User / Navigation | Mobile search button in `TopNav` is a dead element. | Tapping the mobile search icon should open a search overlay or redirect to Explore. | The `<button>` lacks an `onClick` handler and performs no action. | `components/shared/TopNav.tsx` |
| 03 | **HIGH** | User / Navigation | Desktop search input in `TopNav` is unmanaged. | Typing a query should ideally redirect to `/explore` or show a dropdown. | The `<input>` has no `onChange` handler or associated state logic. | `components/shared/TopNav.tsx` |
| 04 | **MEDIUM** | User / Explore | Filters drawer checkboxes and price slider are static UI only. | Toggling "Badminton" or adjusting the slider should filter the `activeFacilities` list. | Inputs are hardcoded HTML elements not bound to React state. | `app/(public)/explore/page.tsx` |
| 05 | **MEDIUM** | User / Home | "Top Rated Venues" section is statically clamped to a fixed array slice. | Should ideally show actually highly-rated or featured venues dynamically. | Hardcoded to `activeFacilities.slice(0, 3)`. | `app/page.tsx` |
| 06 | **LOW** | Global | Unoptimized generic `<img>` tags used across the application. | Should use Next.js `<Image />` component for performance. | Raises Next.js lint warnings during `npm run build`. | Multiple `page.tsx` |

## Core Flow Verification
- **Booking State Flow**: Working as intended. Slots successfully lock in context, move to confirmed upon payment, and revert to available upon cancellation.
- **Facility Approval Flow**: Working as intended. Admin rejections correctly capture strings that the Owner can view, and resubmissions correctly reset status to `PENDING`.
- **Role/Authentication Separation**: Works seamlessly. `StoreContext` handles the `currentUser` toggle cleanly across environments.

## Recommendation for Fix Order
1. **Fix ID 01, 02, 03 (Search Functionality)**: These are core user-discovery pathways. Wire up `useState` for the search queries and push them to the Next.js router (`router.push('/explore?q=' + query)`), then read from `useSearchParams()` on the Explore page.
2. **Fix ID 04 (Explore Filters)**: Wire up the checkboxes in the Explore drawer to actually filter the context array.
3. **Fix ID 05 (Dynamic Homepage)**: Enhance the homepage to dynamically present context data rather than hardcoded generic loops.

