# GraphQL schema snapshot

`schema.graphql` is generated from backend commit `2f6976e3ec8457885266f9fd4daee8bde7c8d97c` in `itdagene-ntnu/itdagene`.

Relay compilation uses this reviewed snapshot so a frontend pull request is not coupled to whichever backend schema happens to be deployed while CI is running.

To update it, first check out the exact backend revision recorded above and verify it with `git -C ../itdagene rev-parse HEAD`.
Run that backend locally, then regenerate with `yarn schema:dev` and replace the recorded commit in this file in the same change.
