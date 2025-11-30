# Backend Fixes Walkthrough

I have addressed the reported issues with the backend, specifically focusing on the daily cleanup job and the paper upload functionality.

## Changes

### 1. Fixed Daily Cleanup Job (`server/services/cleanup.js`)
The cleanup job was failing because it used PostgreSQL-specific syntax (`INTERVAL`, `$1` placeholders) while the application is configured to use SQLite.
- **Fix:** Updated the SQL query to use SQLite-compatible date functions (`date('now', '-7 days')`) and placeholders (`?`).
- **Fix:** Handled date strings correctly (SQLite stores dates as strings, so `toISOString()` was failing).

### 2. Implemented Paper Replacement (`server/routes/papers.js`)
The error message for duplicate paper uploads suggested using "replace", but this functionality was missing.
- **Feature:** Added support for `?replace=true` query parameter in the `/api/papers/upload` endpoint.
- **Logic:** If a paper exists for the given date and `replace=true` is passed, the existing paper (and its thumbnail) is deleted, and the new paper is uploaded and the record updated.

## Verification

### Cleanup Job
I created a reproduction script `server/test-cleanup.js` that:
1. Inserted a dummy paper with a date older than 7 days.
2. Ran the `cleanupOldPapers` function.
3. Verified that the paper was removed from the database and the file system.

**Result:** The script initially failed with `SQLITE_ERROR` (syntax error). After the fix, it passed successfully, confirming the cleanup logic now works with SQLite.

### Paper Upload
I manually verified the code changes for the upload route. The logic now checks for the `replace` query parameter and performs an update (delete old file + update DB record) instead of returning a 409 Conflict error.
