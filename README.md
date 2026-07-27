
# Mary Fisher – First 90 Days

Final review version before Firebase is connected.

## Included screens

- Overview
- 30 Days, split into four weekly plans
- 60 Days
- 90 Days
- People
- Barcelona visit
- Initiatives (combined opportunities, quick wins and projects)
- Notes

Each of the 30-, 60- and 90-day screens includes separate success criteria that Mary and Yula can each mark independently.

## Upload to GitHub

Upload these four files directly to the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `firebase-config.js`

Replace the current versions with these files.

## Current saving mode

Until Firebase is configured, all changes are saved locally in the browser.

## Scopely branding

This version uses a Scopely-inspired purple, blue, aqua and pink visual system and a text-based brand treatment.

It does not include proprietary game characters or official image assets. To add approved internal assets later, place the image files in an `assets` folder and update the header markup or background in `styles.css`.

## Firebase readiness

The project is already Firebase-ready. After the final review:

1. Create or open the Firebase project.
2. Add a Web app.
3. Paste the configuration into `firebase-config.js`.
4. Enable Google Authentication.
5. Create Firestore.
6. Add `yulazack-droid.github.io` to Authorized domains.
7. Restrict Firestore access to the exact Google accounts used by Mary and Yula.


## Final review changes

- The ongoing 70% / 20% / 10% operating model now appears immediately below Mary's header.
- Opportunities and Quick Wins are combined into one **Initiatives** screen.
- Each initiative includes:
  - Estimated time
  - Scope
  - Type: Quick Win or Project
  - Impact, priority and status

This is the version intended for the final visual review before Firebase configuration is added.


## Delivered corrections

- Mary's start date is now **August 11, 2026**.
- Phase dates and all Week 1–4 date ranges were recalculated.
- When a new onboarding week begins, incomplete activities from prior weeks automatically appear in the current week under **Automatically carried over**.
- Completing a carried-over item updates the original activity.
- Overall progress now changes only when fixed plan activities, Barcelona preparation, or Mary/Yula success criteria are completed.
- Adding names to People or creating an Initiative no longer increases the progress percentage.


## Category progress

The Overview now shows four separate progress measures:

- Learning
- Relationships
- Discovery
- Delivery

Rows do not create progress by themselves. People count only when their status is Completed or Recurring. Initiatives only contribute after their status advances, with partial credit for In progress and full credit for Delivered.


## Final polish update

- Progress categories now use spacious two-column cards.
- The Overview automatically shows the current week's key activities and incomplete carry-over tasks.
- Corrected dates are protected from older browser cache by a new local-storage version.
- Every week includes Mary and Yula satisfaction ratings plus an end-of-week reflection.
