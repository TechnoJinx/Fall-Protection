# TetherCheck

An offline-first PWA for tracking fall protection equipment (full body harnesses,
lanyards, tie-off adaptors, hooks/carabiners, anchorage plates, self retracting
lifelines) and their inspections. Scan an NFC tag
to look up or add equipment, run a checklist-based inspection, and see what's
overdue at a glance. Same shape as the SCBA tracker: phone-only workflow, Web NFC
on Chrome/Android, works offline once loaded.

## Deploying to GitHub Pages

1. Create a new repo (e.g. `TechnoJinx/TetherCheck`).
2. Add all the files in this folder to the repo root: `index.html`, `app.js`,
   `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
3. In the repo settings, enable **GitHub Pages** from the `main` branch, root folder.
4. Visit the published URL on your Pixel 8a in Chrome, then use "Add to Home
   screen" to install it as a standalone app.

Web NFC requires HTTPS, which GitHub Pages provides by default — no extra config
needed.

## How it works

- **Equipment** — the six types above, each with a custom ID (write it to an
  NFC tag the same way you did for SCBA gear), type, manufacturer/model,
  serial/lot number, manufacture/purchase/in-service dates, comments, and
  inspection interval.
- **Scanning** — tap Scan anywhere in the app. If the tag's ID matches existing
  equipment, you land on its detail page; if not, you're dropped into "Add
  equipment" with the ID pre-filled so you can register it on the spot.
- **Inspections** — each equipment type has its own checklist (see below). Any
  failed item automatically flags the equipment **out of service**; a full pass
  clears it and pushes the next-due date forward by that item's inspection
  interval.
- **Dashboard** — counts of overdue / due-soon / current / out-of-service gear,
  plus a running "needs attention" list.
- **Storage** — everything lives in IndexedDB on the phone, so the app works
  fully offline after first load. There's no server and no sync between
  devices; it's a single-phone tool, same as the current SCBA app.

## Checklist basis

The equipment types and checklist wording are taken directly from 3M's
published **Fall Protection Inspection Checklist/Logs** (DBI-SALA/Protecta
Appendix, Release 2, October 2017): Full Body Harnesses, Lanyards, Tie-Off
Adaptors, Hooks/Carabiners, Anchorage Plates, and Self Retracting Lifelines,
each with that document's own General Factors items. Each checklist item is
answered **Accepted**, **Rejected**, or **N/A** (N/A was added for practicality
— e.g. a webbing lanyard has no wire rope to inspect — the source form doesn't
have it). Any Rejected item flags the equipment out of service, matching the
form's "Red: Remove from Service" convention.

If your gear includes other manufacturers, it's worth checking their inspection
instructions against the wording in `CHECKLISTS` in `app.js` and adjusting
per-model where it differs. The default inspection interval is 12 months
(typical for an annual formal/competent-person inspection) — editable per item
when you add it.

## Customizing

- **Checklist items**: edit the `CHECKLISTS` object near the top of `app.js`.
- **Equipment types**: edit `EQUIPMENT_TYPES` (and add a matching entry to
  `CHECKLISTS` and an icon in `ICONS` if you add a new type).
- **Colors/branding**: CSS custom properties at the top of `index.html`.
