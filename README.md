# AI Transformation Onboarding Portal

A GitHub Pages-ready onboarding dashboard for Mary Fisher, managed by Yula Zack.

## Files

- `index.html` – application structure
- `styles.css` – visual design
- `app.js` – onboarding logic, progress tracking, Firestore sync and Google login
- `firebase-config.js` – paste your Firebase web app configuration here

## Uploading to GitHub

Upload all four files to the root of the existing repository:

- `index.html`
- `styles.css`
- `app.js`
- `firebase-config.js`

GitHub Pages is already configured to deploy from the `main` branch and `/ (root)`.
After committing, wait about one minute and refresh the live site.

## Firebase setup

1. Create a Firebase project.
2. Add a Web app from Project Overview.
3. Copy the `firebaseConfig` object.
4. Open `firebase-config.js` and replace every placeholder value.
5. In Firebase Console, open **Authentication**:
   - Click **Get started**
   - Enable **Google** as a sign-in provider
6. Open **Firestore Database**:
   - Create the database
   - Choose a production location
7. In Authentication -> Settings -> Authorized domains, add:
   - `yulazack-droid.github.io`

## Recommended Firestore security rules

Replace the placeholder emails with the exact Google account emails used by Yula and Mary.

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function allowedUser() {
      return request.auth != null &&
        request.auth.token.email in [
          "YULA_EMAIL@COMPANY.COM",
          "MARY_EMAIL@COMPANY.COM"
        ];
    }

    match /workspaces/{workspaceId} {
      allow read, write: if allowedUser();
    }
  }
}
```

Publish the rules after editing them.

## How saving works

- Before Firebase is configured, the app runs in local mode and saves in the browser.
- After Firebase is configured and the user signs in with an authorized Google account, the shared workspace is saved to Firestore.
- Both users see the same shared data.

## Important

The Firebase web configuration is not treated as a password. Access control comes from Authentication and Firestore rules. Do not leave Firestore in unrestricted test mode.
