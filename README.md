# Mary First 90 Days — Firebase Authentication Step 1

Version 4.0 adds Google sign-in without changing workspace storage.

## Upload to GitHub Pages
Replace or add these files in the repository root:
- index.html
- styles.css
- app.js
- firebase-config.js
- firebase-auth.js

Do not delete browser Local Storage. Workspace data still saves locally in this step.

## Test
1. Wait for GitHub Pages to deploy.
2. Open the site and hard-refresh with Ctrl+F5.
3. Click **Sign in with Google**.
4. Confirm that your name and email appear in the header.
5. Sign out and sign in again.

Firestore saving is intentionally not enabled in this version.
