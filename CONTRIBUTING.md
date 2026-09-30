# Contributing

Contributions are **welcome** and will be fully **credited**.

Please read and understand the contribution guide before creating an issue or pull request.

## Etiquette

This project is open source, and as such, the maintainers give their free time to build and maintain the source code
held within. They make the code freely available in the hope that it will be of use to other developers. It would be
extremely unfair for them to suffer abuse or anger for their hard work.

Please be considerate towards maintainers when raising issues or presenting pull requests. Let's show the
world that developers are civilized and selfless people.

It's the duty of the maintainer to ensure that all submissions to the project are of sufficient
quality to benefit the project. Many developers have different skillsets, strengths, and weaknesses. Respect the maintainer's decision, and do not be upset or abusive if your submission is not used.

## Viability

When requesting or submitting new features, first consider whether it might be useful to others. Open
source projects are used by many developers, who may have entirely different needs to your own. Think about
whether or not your feature is likely to be used by other users of the project.

## Procedure

Before filing an issue:

- Attempt to replicate the problem, to ensure that it wasn't a coincidental incident.
- Check to make sure your feature suggestion isn't already present within the project.
- Check the pull requests tab to ensure that the bug doesn't have a fix in progress.
- Check the pull requests tab to ensure that the feature isn't already in progress.

Before submitting a pull request:

- Check the codebase to ensure that your feature doesn't already exist.
- Check the pull requests to ensure that another person hasn't already submitted the feature or fix.

## Workflow

1. **Start from an issue.** Every change starts from an issue with one `priority: P1`-`P4` label, one `type: *` label and a milestone (see [Labels](#labels) and [Milestones](#milestones)).
2. **Branch from the milestone branch.** Each milestone has an integration branch, `milestone/<name>`, created from `main`. Create issue branches from it using `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<issue>-<slug>`, `docs/<issue>-<slug>` or `test/<issue>-<slug>`.
3. **Use [Conventional Commits](https://www.conventionalcommits.org/)** for commits and the PR title; release-please derives versions and the changelog from them.
4. **Open a PR against `milestone/<name>`**, not `main`, with `Closes #<issue>` in the description. CI must be green. Tests are required when the change is testable (PHPUnit for `src/`, Vitest for `js/`).
5. **Merge with rebase or a merge commit, never squash**, so each commit stays meaningful.
6. **Close out the milestone:** `Closes #<issue>` only auto-closes issues on merge to `main`, so the final `milestone/<name>` → `main` PR lists every issue in the milestone (`Closes #A, Closes #B, ...`).
7. **Releases:** merging the final `milestone/<name>` → `main` PR triggers release-please, which publishes one release per milestone (npm + Packagist). See [RELEASING.md](RELEASING.md).
8. **Track progress** on the GitHub Project board, with the columns Todo / In progress / In review / Done.

### Labels

| Label | Meaning |
| ----- | ------- |
| `priority: P1` | Affects users now |
| `priority: P2` | Quality and confidence |
| `priority: P3` | Developer experience |
| `priority: P4` | New feature |
| `type: bug` / `type: feature` / `type: test` / `type: a11y` / `type: dx` / `type: docs` / `type: chore` | Kind of work |

### Milestones

Use one milestone per batch of work, with one `milestone/<name>` integration branch; everything in a milestone is merged to `main` and released together.

## Requirements

If the project maintainer has any additional requirements, you will find them listed here.

- **[PSR-2 Coding Standard](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)** - The easiest way to apply the conventions is to install [PHP Code Sniffer](https://pear.php.net/package/PHP_CodeSniffer).

- **Add tests!** - Your patch won't be accepted if it doesn't have tests.

- **Document every feature** - See [Documentation](#documentation) below; a PR that adds or changes public behavior without matching documentation will not be merged.

- **Consider our release cycle** - We try to follow [SemVer v2.0.0](https://semver.org/). Randomly breaking public APIs is not an option.

- **One pull request per feature** - If you want to do more than one thing, send multiple pull requests.

- **Send coherent history** - Make sure each individual commit in your pull request is meaningful. If you had to make multiple intermediate commits while developing, please [squash them](https://www.git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Changing-Multiple-Commit-Messages) before submitting.

## Documentation

**Every public feature must be documented in `README.md`, in prose, explaining what it does and how to use it.** This applies to new PHP methods on `InertiaTable` (filters, column options, etc.), new Vue props/events/slots, and any behavior change to an existing one. Code comments and tests are not a substitute — if it's not in the README, a user has no way to discover it.

Undocumented features are effectively dead code: nobody can use what they don't know exists, and "it's mentioned in the PR" doesn't help someone installing the package six months later. This is why the fork's most-used filters (multi-select, date range) sat undocumented for a while even though the code shipped — a gap this rule exists to close going forward.

Follow the existing pattern used for each filter (e.g. `#### Select Filters`, `#### Number range Filters`): a short section per feature that includes, at minimum:

1. **What it is / when to use it** - one or two sentences of plain-language description.
2. **The method signature or API surface** - required vs. optional arguments.
3. **A minimal usage example** - the smallest code snippet that works.
4. **A fuller example** - showing the optional parameters in use, if any exist.
5. **Any required setup** - e.g. filters that need a custom `AllowedFilter` registered on the `QueryBuilder` query, like `MultiSelectFilter::getQueryBuilderFilter($column)`.

If the feature is client-side (a Vue prop, slot, or event), add it to the relevant table (e.g. the `Table` properties table or the `Table.vue` slots table) *and* show a short template snippet demonstrating it, consistent with how `#### Table.vue slots` and `#### Custom column cells` are documented today.

When in doubt, match the tone and structure of the surrounding section rather than inventing a new format.

## Releasing

Releases to npm and Packagist are automated — see [RELEASING.md](RELEASING.md) for how it works and what one-time setup it requires.

**Happy coding**!
