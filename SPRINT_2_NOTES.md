# Sprint 2 - Dynamic Journey routing

## Goal

Allow the Journey application to load the Firestore document requested by the
`workspace` URL parameter while preserving the existing Mary link.

## Delivered

- `index.html` continues to open Mary's Journey when no URL parameter is set.
- `index.html?workspace=<id>` selects the requested Journey document.
- Each Journey receives an isolated browser cache key.
- Edit access is read from each Journey's `editors` array.
- An invalid Journey URL shows a clear error and cannot create a replacement
  document by accident.

## Out of scope

- Create Journey flow.
- Template collection and cloning.
- Non-30/60/90 UI rendering.
- HR directory integration.

## Manual tests for the next release

1. Open `index.html`; confirm Mary opens unchanged.
2. Open `index.html?workspace=9dc23f8e-8b42-4a75-b7d2-91b3f1df46ad`; confirm the
   same Mary Journey opens.
3. Open a made-up workspace ID; confirm the app reports "Journey not found"
   and does not create a Firestore document.
4. Verify Mary and Yula retain editor access through the `editors` field.
