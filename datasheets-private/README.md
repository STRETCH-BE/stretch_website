# datasheets-private/

The gated datasheet PDFs. Files here are **never publicly reachable** — they
stream out only through `GET /api/datasheet/[slug]` with a valid signed token
(see `src/lib/datasheet-links.ts`; secret: `DATASHEET_SIGNING_SECRET`).

Filenames must match `src/lib/datasheets.ts` **exactly** — case-sensitive on
Vercel. Expected files:

- `pvc-stretch-ceiling.pdf`
- `stretch-pvc-r.pdf`
- `polyester-stretch-ceiling.pdf`
- `polyester-705s.pdf`
- `polyester-non-flammable.pdf`
- `acoustic-stretch-system.pdf`
- `stretch-acoustic-495d.pdf`
- `stretch-acoustic-705a.pdf`
- `stretch-acoustic-colours.pdf`
- `stretch-micro-perf.pdf`
- `stretchsound-acoustic-panels.pdf`
- `stretch-translucent-307-308-309t.pdf`
- `stretch-backlit-lux.pdf`
- `stretch-black-back.pdf`
- `stretch-lighting-sbl.pdf`
- `prefab-l-cove-1010.pdf`
- `prefab-l-cove-1610.pdf`
- `stretch-inspection-hatch.pdf`
- `stretch-invisible-speaker.pdf`
- `stretch-mirror.pdf`
- `stretch-ir-heating.pdf`
- `stretch-outdoor.pdf`
- `profiles-p-c6.pdf`
- `profiles-s-pp-c01.pdf`
- `s-bs-pvc-01-installation.pdf`
- `s-bs-f-02-installation.pdf`
- `s-bs-f-02-track-support.pdf`
- `basic-structure-stretch-ceiling-nl.pdf`
- `maintenance-stretch-ceilings-nl.pdf`
