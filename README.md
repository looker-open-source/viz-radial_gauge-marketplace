# Radial Gauge Visualization

**This is not an officially supported Google product.**

### What if I find an error or want to suggest improvements?

We welcome your contributions to this open source visualization with a pull request. Please reach out to Google Cloud support to report an error or suggest an improvement. You can also extend this visualization for your own use case.

### Local development

You must have Node v16 and `yarn` installed.

#### Install Dependencies

Call `yarn` to  install all dependencies, includes React.

```
yarn
```

#### Build javascript

Run `yarn build` to bundle the javascript. The resulting minified bundle.js will be in the `dist` directory.

```
yarn build
```

#### Local testing and other commands

Check package.json for additional commands.

### Configuration options

#### Range Max Source

Controls where the gauge's right-arm value (range max) comes from.

- **Manual / Auto** (default) — uses the `Range Max Override` field if set, otherwise auto-computes from the value and target.
- **First Measure (Row 2)** — when the query returns at least two rows of one measure, row 2 becomes the gauge's goal. Falls back to manual/auto if only one row is returned or the visualization is trellising by row.
- **Second Measure** — when the query has a second measure, its value becomes the gauge's goal. Falls back to manual/auto if a second measure is not provided.

This option is independent of `Target Source` — both can be set freely. For example, drive the goal from the second measure and keep the target marker pointing at an override value.

#### Commit title format
Commit titles on `master` branch follow [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) message spec. Your commit title must prefix one of 3 types and an optional `!` with the format `TYPE: commit title goes here`.
* `fix` - a commit of the type fix patches a bug (correlates with PATCH in Semantic Versioning). `fix: Correct number formatting`
* `feat` - a commit of the type feat introduces a new feature (correlates with MINOR in Semantic Versioning). `feat: Add column sorting`
* `chore` - a commit of the type chore does not affect viz functionality (corresponds with no change in Semantic Versioning). `chore: Update build process`
* Append an `!` exclamation point to the type if it is a breaking change. `fix!: ...`

#### Release management

This repo uses GitHub workflows with [release-please](https://github.com/googleapis/release-please) [action](https://github.com/google-github-actions/release-please-action) to create Github releases, determine versioning, and generate changelogs.
