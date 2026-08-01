# Apollonia Events — Venue Questionnaire

## For the site owner (read first)

The public website for Apollonia Events was written **before anyone saw the real
venue**. Every factual claim on the site was originally an assumption. The venue
owner has now answered the full questionnaire, and the site has been rewritten to
match reality: location, hall, capacity, catering, staffing, music/noise cutoff,
the day-of-event timeline, the booking time selection, the deposit and
cancellation policy, the real contact details, and the inaugural event.

Only four items remain open (see **"Ende të hapura"** below). Everything else is
confirmed and applied; the **"What breaks if…"** table at the bottom is now all
✅ RESOLVED except for those four.

**Testimonials — resolved.** The fictional testimonials (incl. _"Mira & Elian,
dasmë në shtator"_) have been **removed** and replaced with a single truthful
epigraph about the venue's first real event, the collective exhibition
_"Kujtesë e Vlerave artistike"_ by local artists. No fabricated quotes remain.

---

## Pyetësor për pronarin e vendit (Apollonia Events)

> **Përgjigjet e marra (të zbatuara në faqe).** Faleminderit për përgjigjet — të
> gjitha janë aplikuar në faqe:
>
> 1. **Vendndodhja: Gjilan, Kosovë.** Çdo referencë "buzë Adriatikut" u hoq.
> 2. **Adresa: Rr. Demush Shabani, 60000 Gjilan.** Kati përdhes, në nivel rruge,
>    me një shkallë te hyrja.
> 3. **Një sallë e vetme, rreth 60 m²** — jo tri hapësira. Merr tri forma gjatë
>    ditës (ceremonia · darka · vallëzimi).
> 4. **Salla:** dysheme pllakash gri, mure gri-bardhë, banak në mermer bardh e zi,
>    **tavani i punuar si vepër arti** (dallues), ngjyra mbizotëruese gri. E
>    ndritshme pranë dritareve, më e errët në fund; ndriçim artificial i mirë.
>    **Nuk ka hapësirë të jashtme.**
> 5. **Kapaciteti:** 30–35 të ulur në tryeza; 50–60 në këmbë / kokteil. Pa numër
>    minimal. Tryeza të gjata drejtkëndëshe dhe të rrumbullakëta.
> 6. **Pa kuzhinë:** klienti sjell **kateringun dhe pijet** vetë (i zgjedh lirisht).
>    Vendi ofron hapësirën + **sistem zërimi / DJ**. Dekorin e sjell klienti.
> 7. **Stafi:** s'ka koordinator; një person ndjek orarin dhe rezervimet, përgjigjet
>    **brenda 24 orëve** (premtim i konfirmuar).
> 8. **Zhurma:** muzikë me volum të plotë deri në **23:00** (zonë e banuar), pastaj
>    me ton të lehtë; qëndrimi deri **00:00–01:00**. Orari i punës ~10:00–00:00.
> 9. **Rezervimi:** vjen nga Instagram/Facebook/WhatsApp/Viber/website/personalisht.
>    **Paradhënie 50%.** Anulimi min. **48–72 orë** përpara (24 orë vetëm në raste
>    të veçanta).
> 10. **Deri në 2 evente në ditë** sipas llojit — premtimi "një event në ditë" u hoq
>     kudo.
> 11. **Orari i eventit:** vizitori e zgjedh orën lirisht (10:00–22:00, me hapa
>     gjysmë-ore), jo 5 orare fikse.
> 12. **Instagram real: apollonia.events** → https://www.instagram.com/apollonia.events
> 13. **Telefonat:** +383 44 376 237 dhe +383 48 190 599 (WhatsApp në 38344376237).
> 14. **Trashëgimia / emri i lashtë:** MBAHET (e pandryshuar).
> 15. **Eventi i parë:** ekspozita kolektive **"Kujtesë e Vlerave artistike"** nga
>     artistë vendorë.

### Ende të hapura

1. **Emri — shkrimi i saktë.** Ende pa konfirmuar zyrtarisht; domeni do të jetë
   **Apolloniaevents.com** sipas pronarit.
2. **Çmimet.** Pronari kërkoi nga ne një analizë tregu — **analiza në përgatitje**;
   asnjë çmim nuk publikohet ende.
3. **Email-i.** Ende **në konsultim**; hequr nga faqja derisa të konfirmohet.
4. **Fotografitë.** Pronari **i dërgon së shpejti**; galeria mban mbajtëse vendi me
   ngjyra derisa të vijnë fotot reale.

---

## For the site owner — "What breaks if…"

Each row maps a high-risk assumption to the exact content that changed once the
owner's answer was known. References are to export names in
`src/lib/content.ts` unless noted. All rows are now **✅ RESOLVED** except the
four still-open items noted at the end.

| If the answer is…                                   | Status / what changed                                                                                                                                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **RESOLVED — No olive terrace / no outdoor space** | Confirmed: no outdoor space at all. Single-hall copy stands across `venueFeatures`, `venueCopy.spaces`, `homeCopy`, `galleryItems`.                                                                                                                            |
| ✅ **RESOLVED — Single room, not three spaces**     | Confirmed: one ~60 m² hall taking three forms (ceremonia · darka · vallëzimi).                                                                                                                                                                                 |
| ✅ **RESOLVED — Materials known**                   | Gray tile floor, gray-white walls, white & black marble bar, **art-piece ceiling**. Woven sparingly into `venueCopy.spaces`, `homeCopy.venueIntro`, `galleryItems`.                                                                                            |
| ✅ **RESOLVED — Not on the Adriatic coast**         | Confirmed: Gjilan, Kosovo. `AdriaticCoastline` SVG stays as ancient-city illustration only.                                                                                                                                                                    |
| ✅ **RESOLVED — Heritage angle KEEP**               | Owner confirmed: keep the ancient-Apolonia / φιλοξενία story unchanged.                                                                                                                                                                                        |
| ✅ **RESOLVED — Capacity 30–35 seated / 50–60 standing** | "Deri në 60 të ftuar" kept; honest split in `venueFeatures[0]` and `reserveCopy.faq` item 1. Form max stays 60; `maximumAttendeeCapacity: 60`.                                                                                                            |
| ✅ **RESOLVED — Up to 2 events per day**            | One-event-per-day promise removed from `homeCopy.hero`, `homeCopy.venueIntro`, `venueCopy.header`+metadata, `eventsCopy.header`, `reserveCopy.faq` item 2, and the OG tagline (`lib/og-image.tsx`). Booking/availability logic left unchanged (conservative).   |
| ✅ **RESOLVED — No on-site kitchen / client catering** | `venueFeatures[2]` recast to catering freedom; `reserveCopy.faq` item 3 honest; `eventsCopy.process` step 03 updated.                                                                                                                                       |
| ✅ **RESOLVED — No dedicated host; sound/DJ provided** | `venueFeatures[3]` → "Zërim & përkujdesje"; `eventsCopy.process` step 03 aligned to real staffing.                                                                                                                                                          |
| ✅ **RESOLVED — Free time selection**               | `reserveCopy.timeSlots` generated programmatically: 10:00–22:00 half-hour steps (25 options, "HH:MM"). `validations/reservation.ts` + `validations/manual-reservation.ts` aligned.                                                                             |
| ✅ **RESOLVED — Day timeline**                      | `homeCopy.day.timeline` → 10:00 Përgatitjet · 17:00 Ardhja e mysafirëve · 20:00 Darka & muzika · 23:00 Toni zbutet.                                                                                                                                            |
| ✅ **RESOLVED — Noise / closing time**             | New FAQ: full-volume music to 23:00 (residential), soft after, stay to ~00:00–01:00.                                                                                                                                                                           |
| ✅ **RESOLVED — 24h response promise**             | Confirmed true; `reserveCopy.form.requestNotice` kept.                                                                                                                                                                                                         |
| ✅ **RESOLVED — By-appointment-only**              | Confirmed; `footerCopy` / `emailCopy.footer` "Vetëm me rezervim" kept.                                                                                                                                                                                         |
| ✅ **RESOLVED — Deposit & cancellation**          | New FAQ: 50% deposit; cancel 48–72h ahead (24h in special cases).                                                                                                                                                                                              |
| ✅ **RESOLVED — Testimonials replaced**            | Fictional quotes removed; single truthful epigraph about the inaugural exhibition. `epigraph-testimonials.tsx` renders a single entry without rotating.                                                                                                          |
| ⏳ **Contact details — partial**                   | Phones (+383 44 376 237 / +383 48 190 599), WhatsApp (38344376237), Instagram (apollonia.events), and street address applied to footer + JSON-LD. **Email still pending** — removed until confirmed (open item 3).                                              |
| ⏳ **Name spelling / domain**                      | Official spelling not yet confirmed; domain will be **Apolloniaevents.com** (open item 1).                                                                                                                                                                     |
| ⏳ **Pricing**                                     | Market analysis in preparation; no price published yet (open item 2).                                                                                                                                                                                          |
| ⏳ **Real photos**                                 | Placeholders remain until the owner sends real photos (open item 4).                                                                                                                                                                                           |
