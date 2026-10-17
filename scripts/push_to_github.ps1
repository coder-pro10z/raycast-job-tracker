# Guards for publishing reviewed task branches. See docs/git-workflow.md.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
function Invoke-Git {
    param([string[]]$GitArgs)
    $result = & git @GitArgs
    if ($LASTEXITCODE -ne 0) { throw "Git failed: git $($GitArgs -join ' ')" }
    return $result
}
try {
    $branch = Invoke-Git -GitArgs @('symbolic-ref', '--quiet', '--short', 'HEAD')
    if (!$branch -or $branch -in @('main', 'master')) {
        throw 'Switch to a task branch. Direct release-branch pushes are prohibited.'
    }
    $dirty = Invoke-Git -GitArgs @('status', '--porcelain')
    if ($dirty) { throw 'Working tree is not clean. Review and commit intended files before pushing.' }
    Invoke-Git -GitArgs @('fetch', 'origin', '--prune')
    foreach ($remoteRef in @('refs/remotes/origin/main', "refs/remotes/origin/$branch")) {
        & git show-ref --verify --quiet $remoteRef
        $refStatus = $LASTEXITCODE
        if ($refStatus -eq 1 -and $remoteRef -ne 'refs/remotes/origin/main') { continue }
        if ($refStatus -ne 0) { throw "Cannot verify $remoteRef. Check the remote configuration." }
        & git merge-base --is-ancestor $remoteRef HEAD
        if ($LASTEXITCODE -ne 0) {
            throw "Integrate $remoteRef into $branch and repeat affected checks before pushing."
        }
    }
    Write-Host "Publishing reviewed commits on $branch. Applicable checks must already have passed."
    Invoke-Git -GitArgs @('push', '--set-upstream', 'origin', "HEAD:refs/heads/$branch")
    Write-Host 'Push succeeded. Open or update the pull request targeting main.'
    exit 0
} catch {
    Write-Error $_ -ErrorAction Continue
    exit 1
}
