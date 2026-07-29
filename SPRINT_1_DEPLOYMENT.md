# Sprint 1 deployment checklist

## Purpose

This release makes the Hub a Scopely-wide pilot surface. Every verified
Scopely user can view the Hub, its Journey list, and Journey data. It does not
add Journey creation, templates in Firestore, or dynamic Journey routing.

## Required Firestore migration before publishing rules

In Firebase Console, open Firestore Database > `workspaces` >
`9dc23f8e-8b42-4a75-b7d2-91b3f1df46ad` and add these fields without changing
the existing `workspaceData` field:

```text
editors (array)
  yula.zack@scopely.com
  mary.tikva@scopely.com

```

`editors` defines the only accounts that can change Journey content. The
pilot Firestore rules allow every verified Scopely user to view all Journey
data; they do not grant editing rights.

## Deployment order

1. Take a Firestore backup or export of Mary's document.
2. Add the `editors` field above and confirm the current fields are still
   present.
3. Publish the static website files and wait for GitHub Pages to finish.
4. Publish the updated `firestore.rules`.
5. Test with Yula, Mary, and a third verified Scopely account.

The order matters: the website release removes the old behavior that attempted
to rewrite Journey ownership on every save. Publishing the rules first would
temporarily block editors using the previous website version.

## Manual acceptance checks

- Any verified Scopely account can sign in to `hub.html`, see all available
  Journey cards, the three template cards, and the informational Create Journey
  control.
- Mary and Yula can edit Mary's Journey and retain changes after refresh.
- A third verified Scopely account can open Mary's direct Journey link but
  cannot change any control.
- The Hub button still shows the informational Create Journey dialog.

## Rollback

If an issue appears, restore the prior `firestore.rules` first and then return
the website files to the last GitHub commit. The added Firestore metadata is
safe to leave in place; it does not alter `workspaceData`.

## Before leaving pilot mode

Replace the pilot-wide `get, list` rule with Journey-specific viewer access
before adding real employee Journeys or sensitive onboarding content.
