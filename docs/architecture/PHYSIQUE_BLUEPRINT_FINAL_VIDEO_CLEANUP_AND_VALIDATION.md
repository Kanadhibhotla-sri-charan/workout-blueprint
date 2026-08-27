# Physique Blueprint — Final Video Reference Cleanup & Validation
## Surgical Final Correction

**Developer:** Gemini  
**Architect:** ChatGPT  
**Product Owner:** User  
**Status:** Final cleanup — do not create another feature phase

---

# 1. Objective

The simplified video-reference implementation is already correct.

Do **not** redesign or expand it.

The final intended behavior is:

> One exercise variation → one trustworthy YouTube URL → simple clickable text link → YouTube opens externally.

Nothing is embedded or played inside Blueprint.

This instruction only addresses the remaining shortcomings identified during Architect review.

---

# 2. DO NOT CHANGE THE VIDEO UX

The following are already correct and must remain unchanged:

- simple text hyperlink;
- external YouTube navigation;
- no thumbnail;
- no embedded player;
- no iframe;
- no modal video;
- no lazy-loaded video;
- no autoplay;
- no YouTube preview;
- no additional video service.

Do not reintroduce any of these.

---

# 3. REMOVE UNUSED VIDEO UTILITY CODE

The current snapshot contains:

```text
app/src/utils/video.ts
app/src/utils/video.test.ts
```

These appear to contain YouTube video-ID extraction logic that was relevant to the previous embedded-player implementation.

### Required action

First determine whether either file has any current consumers.

If there are **no current consumers**:

- delete `app/src/utils/video.ts`;
- delete `app/src/utils/video.test.ts`;
- remove any now-unused imports/dependencies associated with them.

If there is a genuine current consumer, do NOT delete it blindly.

Instead, report:

```text
File
Consumer
Why it is still required
```

and leave it unchanged unless a separate decision is made.

The final application should contain no dead video infrastructure.

---

# 4. AUDIT THE 123 VIDEO REFERENCES

The current repository reports:

```text
123 exercise records
123 video links
123 verified references
0 duplicate URLs
```

Do not alter these values simply to make the report pass.

Perform a final integrity check.

For every exercise:

1. Confirm the URL is populated.
2. Confirm it is a YouTube URL.
3. Confirm the actual video corresponds to the exercise variation.
4. Confirm the video is reasonably clear for execution.
5. Confirm the source is reasonably credible.
6. Confirm stored title/creator metadata, if present, matches the actual video.
7. Confirm `video_status: verified` is truthful.

---

# 5. IMPORTANT: MEANING OF "MANUALLY VERIFIED"

The Developer is responsible for this verification.

The User is **NOT** required to watch and approve all 123 videos.

Manual verification means:

```text
Gemini finds candidate
        ↓
Gemini opens the actual YouTube video
        ↓
Gemini checks the movement
        ↓
Gemini confirms the exact variation
        ↓
Gemini records the URL
        ↓
Gemini marks it verified
```

A URL being syntactically valid does NOT make it verified.

A populated URL does NOT make it verified.

Generated metadata does NOT make it verified.

Only actual inspection of the linked video qualifies.

---

# 6. DUPLICATE URL CHECK

Run a complete duplicate check across all 123 exercise records.

Expected:

```text
Total exercises: 123
Unique video URLs: 123
Duplicate assignments: 0
```

If a duplicate appears:

- inspect both exercises;
- determine whether the same video genuinely demonstrates both;
- if not, replace the incorrect reference;
- re-run the audit.

Do not manufacture uniqueness merely for the sake of a 123/123 number.

---

# 7. METADATA INTEGRITY

If the exercise records contain:

```yaml
video_title:
video_creator:
```

confirm that these correspond to the actual linked video.

Do not fabricate a title from the exercise name.

Do not fabricate a creator.

If metadata cannot be confidently established, remove the metadata rather than storing invented information.

The URL itself is the essential requirement.

---

# 8. VIDEO STATUS

Use:

```yaml
video_status: verified
```

only after the actual linked video has been inspected.

If a reference cannot be verified:

```yaml
video_status: needs_review
```

and report it.

Do not claim:

```text
123 verified
```

if that is not actually true.

---

# 9. DATA VALIDATION

Run the repository's official data validation command:

```text
npm run validate-data
```

Expected:

```text
PASS
```

Do not bypass or weaken validation rules to make it pass.

---

# 10. FULL PROJECT VALIDATION

Run the project's official commands where available:

```text
npm run validate-data
npm test
npm run build
npm run lint
```

Also run the official typecheck command if the repository provides one.

Record the actual results.

Do not report a command as passing unless it was actually executed successfully.

---

# 11. REGRESSION CHECK

Confirm that the video changes have not affected:

- Explore;
- Decide;
- Build;
- exercise detail;
- exercise recommendation logic;
- package generation;
- programming;
- intensity techniques;
- volume/frequency logic;
- Why-this-exercise explanations.

The video reference is informational only.

It must not influence exercise selection or programming.

---

# 12. LINK BEHAVIOR CHECK

Confirm the final UI uses a normal external hyperlink.

Expected behavior:

```text
User sees:
🎥 Click here for video

User clicks:
↓
YouTube opens in a new tab/window
```

The application itself must not attempt to:

- fetch the video;
- render the video;
- render a thumbnail;
- create an iframe.

Use the repository's established external-link conventions.

---

# 13. CROSS-MODE CHECK

For representative exercises, verify that the same canonical `video_link` is used in:

```text
Explore
Decide
Build
Exercise Detail
```

No page-specific video URLs should exist.

---

# 14. FINAL QA REPORT

Update the existing video curation report if necessary.

The final report should truthfully state:

```text
Total exercises: 123
References populated: <actual number>
References manually inspected: <actual number>
Verified: <actual number>
Needs review: <actual number>
Missing: <actual number>
Unique video URLs: <actual number>
Duplicate assignments: <actual number>
```

If everything passes, the desired final state is:

```text
Total exercises: 123
References populated: 123
References manually inspected: 123
Verified: 123
Needs review: 0
Missing: 0
Unique video URLs: 123
Duplicate assignments: 0
```

---

# 15. DO NOT CREATE MORE WORK

This is a final cleanup task.

Do NOT:

- create another video phase;
- redesign the video feature;
- add embedded playback;
- add thumbnails;
- add AI;
- add backend services;
- add video analytics;
- add creator ranking;
- change the recommendation engine;
- change programming logic;
- add unnecessary dependencies;
- redesign Explore/Decide/Build again.

The objective is to **finish and ship**.

---

# 16. Developer Completion Report

When finished, report:

### Code cleanup

- Was `video.ts` removed?
- Was `video.test.ts` removed?
- Were any other dead video-related files removed?

### Video data

- Total exercises
- Links populated
- Manually inspected
- Verified
- Needs review
- Missing
- Unique URLs
- Duplicate URLs

### Validation

- `validate-data`
- `test`
- `build`
- `lint`
- `typecheck`, if available

### Regressions

Confirm:

```text
Explore: PASS
Decide: PASS
Build: PASS
Exercise Detail: PASS
Decision engine: PASS
Programming/package engine: PASS
```

### Deviations

List anything that could not be completed.

Do not hide unresolved issues.

---

# 17. Architect Review After This

After Gemini completes this correction, provide the resulting repository snapshot to the Architect.

The Architect will perform the final review.

The Architect will specifically verify:

1. No embedded video remains.
2. No thumbnail loading remains.
3. No dead video infrastructure remains.
4. The simple-link UX is correct.
5. 123 exercise records remain intact.
6. Video references are correctly mapped.
7. Duplicate URLs are resolved.
8. Curation claims are internally consistent.
9. Existing Blueprint logic has not regressed.
10. Validation/build/test results are credible.

---

# 18. Final Definition of Done

This correction is complete when:

- [ ] Video UX is simple external text links only.
- [ ] No embedded player exists.
- [ ] No thumbnail exists.
- [ ] No iframe exists.
- [ ] No unnecessary video utility remains.
- [ ] 123 exercise records remain.
- [ ] 123 valid video references exist.
- [ ] Developer has manually inspected the references.
- [ ] Verification status is truthful.
- [ ] Duplicate URLs have been audited.
- [ ] Metadata is accurate.
- [ ] Explore works.
- [ ] Decide works.
- [ ] Build works.
- [ ] Exercise Detail works.
- [ ] Data validation passes.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] Typecheck passes if available.
- [ ] No Blueprint decision/programming logic was changed.

---

# 19. Final Instruction

Make only the corrections described above.

The architecture and product direction are already settled.

**Do not interpret this as an invitation for further feature development.**

Once the cleanup and validation pass succeeds, provide the final snapshot for Architect review.

## Goal: ship Physique Blueprint.
