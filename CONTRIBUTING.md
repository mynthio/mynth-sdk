# Contributing

This project uses GitHub Actions for CI, automated release PRs, GitHub Releases, and npm publishing.

## Development

```bash
bun install
bun run lint
bun run format:check
bun run typecheck
bun run test
bun run build
```

Open a pull request against `main`.

## Commit Message Rules (Required)

Releases are generated from commit messages, so commits must follow Conventional Commits.

Use one of these types:

- `feat:`
- `fix:`
- `docs:`
- `chore:`
- `refactor:`
- `perf:`
- `test:`
- `build:`
- `ci:`
- `style:`
- `revert:`

Examples:

```text
feat: add async polling retry backoff
fix(convex): handle missing webhook signature header
feat!: remove deprecated image output field
```

Notes:

- Optional scope is supported: `feat(api): ...`
- Breaking changes should use `!` (for example `feat!:`) and/or a `BREAKING CHANGE:` footer
- PR CI validates commit subjects and will fail on invalid commit messages

## Release Process (Maintainers)

This repository uses [Release Please](https://github.com/googleapis/release-please) with a commit-based changelog.

How it works:

1. Changes are merged into `main` with Conventional Commit messages.
2. The `Release` workflow runs and updates/creates a Release Please PR with:
   - version bump
   - `CHANGELOG.md` updates
   - release notes draft content
3. When the Release Please PR is merged, the workflow creates a GitHub Release and tag.
4. The workflow then publishes the package to npm from that release tag.

Important:

- npm publishing uses GitHub Actions OIDC (trusted publishing) and the `npm` environment in GitHub Actions
- If commits do not follow Conventional Commits, versioning/changelog quality will be degraded

## Pull Request Checklist

- CI passes
- Commit messages follow Conventional Commits
- User-facing changes include docs/README updates when needed
- Breaking changes are clearly marked
