# 🔧 Caching Fix - November 10, 2025

## Problem
Data was loading correctly initially, but disappeared when navigating away and coming back to the page.

## Root Cause
React Query's cache settings were too aggressive:
- `staleTime: 0` - Marked data as stale immediately
- `gcTime: 0` - Deleted cached data immediately when component unmounted
- `refetchOnMount: true` - Always refetched, causing flash of empty content

## Solution
Updated caching configuration in:

### 1. `src/App.tsx` - Global Query Client
```typescript
staleTime: 5 * 60 * 1000,     // Keep data fresh for 5 minutes
gcTime: 10 * 60 * 1000,        // Keep cache for 10 minutes after unmount
refetchOnWindowFocus: false,   // Don't refetch on window focus
refetchOnMount: false,         // Use cached data if available
```

### 2. Individual Hooks
- `src/hooks/useNewsAPI.ts`
- `src/hooks/useProjectsAPI.ts`
- `src/hooks/useGalleryAPI.ts`
- `src/hooks/useHeroAPI.ts`

All updated with the same caching strategy.

## Benefits
✅ Data persists when navigating between pages
✅ Faster page loads (uses cached data)
✅ Less load on backend server
✅ Better user experience (no flickering)
✅ Data still refreshes every 5 minutes

## How to Start Servers

### Option 1: Using the Start Script (Recommended)
```powershell
.\start-all.ps1
```
This will:
- Start backend on port 5000
- Start frontend on port 8080
- Open browser automatically
- Create separate windows for each server

### Option 2: Manual Start
**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
npm run dev -- --port 8080
```

## Useful URLs
- **Main Website:** http://localhost:8080
- **Status Page:** http://localhost:8080/status.html (shows all data visually)
- **API Test:** http://localhost:8080/api-test.html
- **Backend API:** http://localhost:5000
- **Staff Dashboard:** http://localhost:8080/dashboard
- **Staff Login:** http://localhost:8080/staff-login

## Testing the Fix
1. Open http://localhost:8080
2. Wait for data to load
3. Navigate to another page (click any link)
4. Come back to home page
5. ✅ Data should still be visible immediately!

## Debug Tools Added
- **Data Debugger:** Small panel in bottom-right corner shows real-time data status
- **Status Page:** Visual page showing all backend data with previews
- **Console Logs:** Detailed logging in browser console (F12)

## Notes
- Data refreshes automatically after 5 minutes
- Cache clears after 10 minutes of inactivity
- If you update content in dashboard, it invalidates cache automatically
