# architect-private/

Files for the architect area (spec texts, CAD/BIM, photo sets, case studies).
Never publicly reachable — they stream out only through
`GET /api/architect/file/[slug]` with a signed-in architect or admin portal
session. An entry whose file is missing shows as "coming soon" in the
dashboard, so entries can go live before their files.

Filenames must match `src/lib/architect-resources.ts` **exactly** —
case-sensitive on Vercel. Expected files:

- `spec-polyester-nl.docx`
- `spec-polyester-fr.docx`
- `spec-polyester-en.docx`
- `spec-pvc-nl.docx`
- `spec-pvc-fr.docx`
- `spec-pvc-en.docx`
- `spec-acoustic-nl.docx`
- `spec-acoustic-fr.docx`
- `spec-acoustic-en.docx`
- `stretch-profile-details.dwg`
- `stretch-ceiling-buildups.dwg`
- `stretch-ceilings.rvt`
- `stretch-ceilings.skp`
- `photos-van-der-valk-wellness.zip`
- `photos-johnson-johnson.zip`
- `photos-event-halls.zip`
- `case-candor-rt60.pdf`
- `case-backlit-office.pdf`
