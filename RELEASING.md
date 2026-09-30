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
4. In the same run, `release-please.yml` chains two follow-up jobs, gated on release-please's `release_created` output:
   - `publish-npm` calls `.github/workflows/npm-publish.yml` (reusable), which checks out the new tag, builds the package and runs `npm publish` using npm's **trusted publishing (OIDC)** — no npm token stored in the repo.
   - `publish-packagist` calls `.github/workflows/packagist-publish.yml` (reusable), which calls the Packagist update API (`POST https://packagist.org/api/update-package`, authenticated with an `Authorization: Bearer USERNAME:API_TOKEN` header) so Packagist re-reads the repository and picks up the new tag. It uses the `PACKAGIST_USERNAME` and `PACKAGIST_TOKEN` repository secrets and fails with a clear error if either is missing.

   **Why the publish jobs live inside `release-please.yml`:** release-please creates the GitHub Release with the default `GITHUB_TOKEN`, and GitHub does not trigger other workflows from events created by `GITHUB_TOKEN`. Workflows listening on `release: published` would therefore never run, so publishing is chained directly from the release-please workflow instead.

In short: merge Conventional Commits → merge the Release PR (creates tag + GitHub Release) → the chained jobs publish to npm and Packagist within minutes, with a changelog to match.

## One-time setup (do this once per registry)

### npm trusted publishing

1. On [npmjs.com](https://www.npmjs.com), open the `@ponchrobles/inertia-table` package → **Settings → Trusted Publishers**.
2. Add a GitHub Actions trusted publisher pointing at:
   - Repository: `PonchRobles/inertiajs-tables-laravel-query-builder`
   - Workflow file: `release-please.yml` (the **calling** workflow, not `npm-publish.yml`). The npm docs state: "validation checks the calling workflow's name instead of the workflow that actually contains the publish command" when `workflow_call` is used, and that `id-token: write` must be given to both parent and child workflows (both are set up in this repo). The filename must match exactly, including `.yml`.
   - Environment: (leave blank unless you add one)
3. No `NPM_TOKEN` secret is required — the workflow authenticates via OIDC (`id-token: write` permission) and npm automatically attaches a provenance attestation.

### Packagist

1. **One-time manual submission:** the package is not on Packagist yet. Log in on [packagist.org](https://packagist.org), click **Submit**, and enter `https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder`. The package will be named `ponchrobles/inertia-table` (from `composer.json`).
2. Copy your API token from your Packagist profile page (**Show API Token**).
3. In the GitHub repo, go to **Settings → Secrets and variables → Actions** and add two repository secrets:
   - `PACKAGIST_USERNAME` — your Packagist username.
   - `PACKAGIST_TOKEN` — the API token from step 2.
4. From then on, each release created by release-please runs the `publish-packagist` job, which notifies Packagist to refresh the package. (Alternatively, you can enable the GitHub hook from the Packagist package page; the workflow is a safe fallback.)

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

A GitHub Release created by hand with `gh` (using your own credentials) does not run the chained jobs, since they only run inside `release-please.yml`. Publish manually instead:

- In GitHub, go to **Actions**, pick **Publish to npm** and/or **Publish to Packagist**, click **Run workflow** and enter the tag (e.g. `v5.1.0`). Both workflows support `workflow_dispatch` for this, and the same route works to re-run a failed publish.
- Note for npm: a manual `workflow_dispatch` run of `npm-publish.yml` is validated against `npm-publish.yml` itself, not `release-please.yml`, so it will fail trusted-publisher validation unless that filename is also registered as a trusted publisher (up to 10 are allowed).
