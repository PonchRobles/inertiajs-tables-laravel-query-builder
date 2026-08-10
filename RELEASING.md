# Releasing

This project publishes to two registries from a single source tree:

- **npm** (`@ponchrobles/inertia-table`) — versioned via `package.json`.
- **Packagist** (`ponchrobles/inertia-table`) — versioned from git tags directly; `composer.json` intentionally has no `version` field.

Releases are automated with [release-please](https://github.com/googleapis/release-please) based on [Conventional Commits](https://www.conventionalcommits.org/). You should never need to manually bump `package.json`, edit `CHANGELOG.md`, or create tags by hand.

## Ongoing flow (fully automated)

1. Merge PRs into `main` using Conventional Commit messages (`feat:`, `fix:`, `feat!:`/`BREAKING CHANGE:`, `chore:`, `ci:`, `docs:`, etc.) — the same convention already used in this repo's history.
2. The `release-please` workflow (`.github/workflows/release-please.yml`) runs on every push to `main`. It opens or updates a standing **"Release PR"** that bumps `package.json` (and `package-lock.json`) and rewrites `CHANGELOG.md` from the merged commits, computing the next semver bump automatically (`fix:` → patch, `feat:` → minor, `!`/`BREAKING CHANGE:` → major).
3. When you merge that Release PR, release-please:
   - Creates a git tag (e.g. `v5.1.0`).
   - Publishes a GitHub Release for that tag.
4. The GitHub Release triggers `.github/workflows/npm-publish.yml`, which builds the package and runs `npm publish` using npm's **trusted publishing (OIDC)** — no npm token stored in the repo.
5. Packagist picks up the new tag automatically via its GitHub webhook/App integration (see one-time setup below) — no workflow needed on the PHP side, since Packagist resolves versions straight from tags.

In short: merge Conventional Commits → merge the Release PR → npm and Packagist both update within minutes, with a changelog to match.

## One-time setup (do this once per registry)

### npm trusted publishing

1. On [npmjs.com](https://www.npmjs.com), open the `@ponchrobles/inertia-table` package → **Settings → Trusted Publishers**.
2. Add a GitHub Actions trusted publisher pointing at:
   - Repository: `PonchRobles/inertia-table`
   - Workflow file: `.github/workflows/npm-publish.yml`
   - Environment: (leave blank unless you add one)
3. No `NPM_TOKEN` secret is required — the workflow authenticates via OIDC (`id-token: write` permission) and npm automatically attaches a provenance attestation.

### Packagist auto-update

1. On [packagist.org](https://packagist.org), open the `ponchrobles/inertia-table` package settings and make sure it's connected via the GitHub App/service hook (log in with GitHub, grant access to this repo) rather than relying on the nightly crawl.
2. Once connected, every push (including new tags) notifies Packagist instantly — nothing to configure in this repo.

## Manual/emergency release

If you ever need to bypass automation (e.g. release-please is misbehaving):

```bash
npm version <patch|minor|major> --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore(release): vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags
gh release create vX.Y.Z --generate-notes
```

Pushing the tag is enough for Packagist. Creating the GitHub Release triggers the npm publish workflow.
