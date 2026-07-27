
# Mary Fisher – First 90 Days Workspace

## Package 1: Core application

This package is fully functional in local-browser mode and ready for GitHub Pages.

### Final progress logic
- The Overview progress is weekly and resets automatically each week.
- It includes the current week's activities, incomplete carry-over tasks, and manually added tasks.
- The 30-day progress combines all four first-month weeks and any manual tasks added during those weeks.
- The 60-day and 90-day progress bars are based on their own objective checklists.
- Success criteria do not affect progress percentages.

### Upload
Upload these files directly to the repository root:
- index.html
- styles.css
- app.js

The app saves data locally in the browser until the Firebase add-on is installed.

## Carry-over timing fix

Outstanding tasks from previous weeks are shown only after the selected week has actually started. Browsing a future week in advance will not display carry-over items. Each carried item is labelled with its source week.
