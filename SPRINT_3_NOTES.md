# Sprint 3 - Template repository foundation

## Goal

Create a protected template source from Mary's working Journey without changing
Mary's Journey or linking existing Journeys to future template edits.

## Delivered

- Firestore access rules for the `templates` collection, limited to Yula.
- An admin-only setup page at `seed-templates.html`.
- One-time creation of `templates/ai-transformation-lead` from Mary's current
  `workspaceData` as Template v1.
- No overwrite behavior: the setup page stops if the template already exists.

## Out of scope

- Create Journey flow.
- Editing templates in the Hub.
- Data Analyst and Monetization Manager templates.
