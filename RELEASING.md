# Releasing

This document describes the release process for the ROI Calculator.

## Version Scheme

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes to calculation methodology or API
- **MINOR**: New features, new calculators, new metrics
- **PATCH**: Bug fixes, documentation updates, dependency updates

## Pre-release Checklist

Before creating a release:

1. **All CI checks pass**
   ```bash
   make ci
   ```

2. **Update CHANGELOG.md**
   - Move items from `[Unreleased]` to new version section
   - Add release date
   - Update comparison links at bottom

3. **Update version in package.json**
   ```bash
   npm version <major|minor|patch> --no-git-tag-version
   ```

4. **Create release commit**
   ```bash
   git add -A
   git commit -m "chore: release v0.x.x"
   ```

## Creating a Release

### Option 1: GitHub UI (Recommended)

1. Go to [Releases](https://github.com/good-ai/roi-calculator/releases)
2. Click "Draft a new release"
3. Create tag: `v0.x.x`
4. Title: `v0.x.x`
5. Copy changelog section to description
6. Publish release

### Option 2: Command Line

```bash
# Create and push tag
git tag -a v0.x.x -m "Release v0.x.x"
git push origin v0.x.x

# Then create release on GitHub with changelog
```

## Post-release

1. Verify the release appears on GitHub
2. Verify CI ran successfully on the tag
3. Update any deployment environments
4. Announce release (if applicable)

## Hotfix Process

For urgent fixes to a released version:

1. Create branch from tag: `git checkout -b hotfix/v0.x.x v0.x.x`
2. Apply fix with tests
3. Update CHANGELOG.md
4. Bump patch version
5. Create release as above

## Release History

| Version | Date | Highlights |
|---------|------|------------|
| v0.1.0 | 2026-01-06 | Initial release with Manufacturing & Insurance calculators |
