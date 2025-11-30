# Implementation Plan - Backend Fixes

## Goal Description
Fix bugs in the backend, specifically in the `cleanupOldPapers` service which uses PostgreSQL syntax incompatible with the default SQLite database. Also, address the missing "replace" functionality for paper uploads.

## User Review Required
> [!IMPORTANT]
> The application claims to support PostgreSQL but the codebase primarily uses SQLite syntax (`?` placeholders). I will focus on fixing the SQLite implementation as it is the default. Full PostgreSQL support would require a larger refactor.

## Proposed Changes

### Server

#### [MODIFY] [cleanup.js](file:///h:/abhinavaandhara-epaper/server/services/cleanup.js)
- Change SQL date comparison to use SQLite syntax: `date('now', '-7 days')`.
- Change SQL placeholder from `$1` to `?`.
- Fix `paper.date.toISOString()` error by handling string dates.

#### [MODIFY] [papers.js](file:///h:/abhinavaandhara-epaper/server/routes/papers.js)
- Implement "replace" functionality: If a paper exists for the date, allow overwriting it if a flag is present or via a PUT request?
- OR: Update the error message to be more helpful if "replace" is not implemented.
- Actually, I'll implement a PUT route or modify the POST route to handle `?replace=true`.

## Verification Plan

### Automated Tests
- Create `server/test-cleanup.js` to insert an old paper and run `cleanupOldPapers`.
- Verify that the paper is deleted from the DB and filesystem.

### Manual Verification
- Run the server and check logs.
