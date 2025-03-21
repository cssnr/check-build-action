[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/check-build-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/check-build-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/check-build-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/check-build-action/tags)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/check-build-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/check-build-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/check-build-action/dist%2Findex.js?label=dist%20size)](https://github.com/cssnr/check-build-action/blob/master/src/index.js)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/check-build-action/release.yaml?logo=github&label=release)](https://github.com/cssnr/check-build-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/check-build-action/test.yaml?logo=github&label=test)](https://github.com/cssnr/check-build-action/actions/workflows/test.yaml)
[![Workflow lint](https://img.shields.io/github/actions/workflow/status/cssnr/check-build-action/lint.yaml?logo=github&label=lint)](https://github.com/cssnr/check-build-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_check-build-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_check-build-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/check-build-action?logo=github&label=updated)](https://github.com/cssnr/check-build-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/check-build-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/check-build-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/check-build-action?logo=htmx)](https://github.com/cssnr/check-build-action)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/check-build-action?style=flat&logo=github)](https://github.com/cssnr/check-build-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/check-build-action?style=flat&logo=github)](https://github.com/cssnr/check-build-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Check Build Action

- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Features](#Features)
  - [Planned](#Planned)
- [Support](#Support)
- [Contributing](#Contributing)

This action is designed to check if a build has been run. It works on any event.

On a pull_request it will add a comment with a message mentioning the user.

All options are configurable.

## Inputs

| Input   | Req. | Default&nbsp;Value      | Input&nbsp;Description      |
| :------ | :--: | :---------------------- | :-------------------------- |
| build   |  -   | `npm run build`         | Build Command to Run \*     |
| check   |  -   | `git diff --quiet dist` | Check Command to Run \*     |
| path    |  -   | -                       | Path to Verify Exist \*     |
| comment |  -   | `true`                  | Add Comment to PR \*        |
| message |  -   | _see below_             | Message for Comment \*      |
| mention |  -   | `true`                  | Mention Actor with @ \*     |
| summary |  -   | `true`                  | Add Workflow Job Summary \* |
| token   |  -   | `github.token`          | For use with a PAT          |

**build:** Build or prepare command to run before checking if build was run.

**check:** Check command to run to verify build was run. This should exit with error on failure.

**path:** A path to verify exists, otherwise will fail.

**comment:** Add a comment to the pull request.

**message:** Message to put in comment. Default:

```shell
Run: `run npm build`
```

**mention:** Will mention the actor in the comment with `@user`.

**summary:** Will add result details to the job summary on the workflow run.

<details><summary>👀 View Example Job Summary</summary>

---

Coming Soon...

---

</details>

```yaml
- name: 'Check Build Action'
  uses: cssnr/check-build-action@master
```

### Permissions

This action requires the following permissions to add pull request comments:

```yaml
permissions:
  pull-requests: write
```

Permissions documentation for [Workflows](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token) and [Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).

## Outputs

| Output | Output&nbsp;Description |
| :----- | :---------------------- |
| id     | Comment ID if Added     |
| error  | Error Message if Any    |

This outputs the changes `json` object and the `markdown` table.

```yaml
- name: 'Check Build Action'
  id: outdated
  uses: cssnr/check-build-action@master

- name: 'Echo Output'
  env:
    ERROR: ${{ steps.outdated.outputs.error }}
  run: |
    echo "id: ${{ steps.outdated.outputs.id }}"
    echo "error: ${ERROR}"
```

Note: due to the way `${{}}` expressions are evaluated, multi-line output gets executed in a run block.

More Output Examples Coming Soon...

## Examples

💡 _Click on an example heading to expand or collapse the example._

<details open><summary>Custom Build and Check Command</summary>

```yaml
- name: 'Check Build Action'
  uses: cssnr/check-build-action@master
  with:
    build: 'npm run build'
    check: 'git diff --quiet dist'
```

</details>
<details><summary>With All Inputs</summary>

```yaml
- name: 'Check Build Action'
  uses: cssnr/check-build-action@master
  with:
    build: 'npm run build'
    check: 'git diff --quiet dist'
    path: ''
    comment: 'true'
    message: 'Run: `npm run build`'
    mention: 'true'
    summary: 'true'
```

</details>

More Examples Coming Soon...

## Tags

The following rolling [tags](https://github.com/cssnr/check-build-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                     | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/check-build-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/check-build-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/check-build-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/check-build-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/check-build-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/check-build-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/check-build-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

## Features

- Custom build command
- Custom check command
- Optional path to verify
- Option to comment on PRs
- Option to customize message and mention

### Planned

- Wait for some [feature requests](https://github.com/cssnr/check-build-action/discussions/categories/feature-requests)...

Want to automatically updated tags on release? Check out: [cssnr/update-version-tags-action](https://github.com/cssnr/update-version-tags-action)  
Want to check outdated packages on a PR? Check out: [cssnr/npm-outdated-action](https://github.com/cssnr/npm-outdated-action)  
Want to show package changes on release notes? Check out: [cssnr/package-changelog-action](https://github.com/cssnr/package-changelog-action)

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/check-build-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/check-build-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/check-build-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Release%20Notes)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

For more information, see the CSSNR [CONTRIBUTING.md](https://github.com/cssnr/.github/blob/master/.github/CONTRIBUTING.md#contributing).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
