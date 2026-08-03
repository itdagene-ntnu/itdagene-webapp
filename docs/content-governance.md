# Content governance

The public site treats each module as a separately maintained publication.
The current code-level lifecycle settings live in `config/edition.ts`.
Public GraphQL data with real items is considered published so an outdated flag cannot hide information that is already public.
Static manifests still require an explicit edition and become historical when their year differs from the current metadata.

## Authoring boundaries

The redesigned homepage retires the old CMS page aggregation.
Its copied annual slugs made the most important route depend on manual rollover and could silently mix editions.
The homepage is now assembled from typed event metadata, public program and company data, edition configuration, and deliberately curated reusable sections.

Program CMS authoring is preserved.
The structured event query remains the source of truth for dates, times, rooms, publication state, and the scannable schedule.
The optional `program` CMS page is rendered as supporting editorial context and supplies metadata when it exists.
Deleting that page must never remove or unpublish the structured program.

| Module        | Source                             | Owner                | Publish trigger                                   | Fallback                                               | Expiry behavior                                      |
| ------------- | ---------------------------------- | -------------------- | ------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Event dates   | GraphQL metadata                   | Leadership and web   | Dates are confirmed                               | Show that the date is coming                           | Never show a previous date as current                |
| Program       | GraphQL                            | Program lead and web | At least one approved public event exists         | Explain that the program is unpublished                | Preserve the year in the archive                     |
| Stands        | Yearly map manifest                | Logistics and web    | Company allocation and coordinates are final      | Show the previous map only as a labelled archive       | A mismatched year is always stale                    |
| Jobs          | GraphQL                            | Company team         | At least one active listing exists                | Show useful no-listings guidance                       | Expired listings stay outside the active query       |
| Companies     | GraphQL metadata and stand archive | Company team         | At least one public company list exists           | Show a previous-edition roster only with its year       | Never imply historical participants are current      |
| Gallery       | GraphQL plus edition configuration | Marketing            | A curated and approved set is available           | Hide an empty grid and explain publication status      | Every visible archive must show its edition          |
| Interest form | Separate React app and API         | Company team         | The form is open for the configured year          | Show the responsible contact                           | Closed periods must explain the next step            |
| FAQ           | GraphQL                            | Leadership and web   | Answers have been checked for the current edition | Show direct contact information                        | Fixed dates and deadlines must be reviewed each year |

## Annual rollover checklist

1. Confirm the current metadata year, dates, location, and public launch date.
2. Review each module state and owner in `config/edition.ts`.
3. Replace the stand manifest only after the map, numbers, companies, and coordinates are final.
4. Update the interest application year and verify the full cross-domain journey.
5. Review every FAQ answer containing a date, deadline, price, or operational promise.
6. Label previous-edition photography and artifacts with their actual year.
7. Run Relay generation, type checks, lint, production builds, behavioral tests, and the responsive route matrix.

## Shared visual system

`styles/tokens.css` is the source of truth for colors, spacing, typography, focus treatment, and control geometry.
Run `yarn tokens:check` before release.
Run `yarn tokens:sync` after editing the source tokens so the interest application remains visually aligned.
