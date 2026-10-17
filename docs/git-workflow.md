# Git workflow

This is the canonical pull, push, and merge policy for NextApply. It supersedes older instructions to push directly to `main`.

## Branches and authorization

- `main` is the release branch. Deliver changes through a pull request; do not push directly to `main` or `master`.
- Use one focused branch per task: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, or `chore/<topic>`.
- Inspect `git status --short --branch` before working. Preserve existing user changes. Never automatically discard files, reset hard, clean, or stash another person's work.
- Creating local branches and preparing changes is part of implementation. Push or merge only when the user's instructions authorize that action; existing authorization persists. A request to edit policy alone does not authorize publishing it.
- Never force-push or delete a remote branch without explicit authorization. Never rewrite shared or release history.

## Pull and synchronization

1. Inspect status and confirm the intended branch and remote (`git remote -v`). Resolve or explicitly preserve uncommitted work before switching or integrating history.
2. Run `git fetch origin --prune`; stop if it fails.
3. To update local `main`, use `git switch main` followed by `git pull --ff-only origin main`. If histories diverge, inspect the commits and preserve them on a task branch; do not reset or force the update.
4. Start new work with `git switch -c feat/<topic>` from updated `main`.
5. On an existing published task branch, use `git pull --ff-only origin <branch>`. If it diverges, inspect both histories and merge `origin/<branch>` explicitly. Do not silently rebase.
6. Integrate current release changes into a task branch with `git merge origin/main`. Merge shared branches rather than rebasing published commits.
7. A rebase is allowed only for unpublished commits on a private task branch, with a clean working tree. It must not require rewriting a remote branch.

## Commit and validation

- Review `git diff`, stage explicit task files with `git add <paths>`, then review `git diff --cached` and run `git diff --cached --check`. Avoid blanket staging.
- Use conventional commits: `feat(scope): ...`, `fix(scope): ...`, `docs(scope): ...`, or `chore(scope): ...`.
- Never commit credentials, tokens, `.env`, or `appsettings.Development.json`. Do not modify `.github/workflows/`; keep workflow templates in `automation/gmail-jd-automator/workflow/`.
- For frontend changes, run `npm run build` in `frontend/` and relevant tests. For backend changes, run `dotnet build` in `backend/NextApply.Api/` and relevant tests. For automation changes, run relevant automation checks. Documentation-only changes require link/diff review; Git tooling changes require relevant script validation.
- Record validation results and any unavailable checks in the PR. A failed required check blocks merging; an unavailable check must be disclosed and resolved or explicitly waived by the maintainer.

## Push

1. Confirm the current task branch, intended destination, clean working tree, reviewed commits, and passing applicable checks.
2. Fetch `origin` again. Ensure the branch contains `origin/main` and, if already published, `origin/<branch>`. Integrate missing commits and repeat affected checks before pushing.
3. Push only the intended branch: `git push --set-upstream origin <branch>` on first publication, then `git push origin <branch>`.
4. If rejected as non-fast-forward, fetch and inspect remote changes, merge them, validate, and retry normally. Never solve a rejection with a force push.
5. Open or update a PR targeting `main`, describing the problem, resulting behavior, validation, and any migration or deployment impact. Do not include unrelated changes.

The root `push_to_github.bat` delegates to the guarded helper. It does not stage, commit, merge, run project checks, or establish publication authorization. Its guards supplement the review above.

## Merge

- Default method: **squash merge** a focused PR into `main`, using a conventional commit PR title. Preserve merge commits when synchronizing published task branches.
- Before merging, require a non-draft PR, current `main` integrated, no conflicts, all applicable checks passing, resolved review conversations, and maintainer review of the final diff. For a solo-maintainer repository, the maintainer may review their own PR; an agent still needs authorization to merge.
- Resolve conflicts on the task branch by understanding both changes. Do not choose all of `ours` or `theirs` blindly. Stop for clarification when competing product intent cannot be determined. Stage resolved files, complete the merge, inspect the combined diff, and rerun affected checks.
- If a merge cannot be resolved safely, use `git merge --abort` to return to the pre-merge state. Do not discard unrelated work.
- After merging, fetch and fast-forward local `main`. Do not merge the old squash-merged branch into new work. Delete task branches only when authorized and their work is confirmed merged.
- Roll back released changes through a reviewed revert PR, not a history reset. Hotfixes follow the same branch, check, and PR process.

## Remote enforcement

These repository instructions and the helper are local policy, not GitHub branch protection. Configure a GitHub ruleset separately to require PRs for `main`, block force pushes/deletion, require actual configured checks, and resolve conversations before merging. Require an independent approval when another maintainer is available. Do not invent required check names or assume protections are enabled. Restrict bypass access; any emergency exception must be explicitly authorized and documented.
