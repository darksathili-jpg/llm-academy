# Installation contrôlée du kit officiel V2 dans LLM Academy.
# Exécuter depuis la racine llm-academy-v4 sur feature/academy-pedagogie-microduck-r1.
param([string]$Archive = "$env:USERPROFILE\Downloads\microduck_mission_v2.zip")
$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
if (-not (Test-Path (Join-Path $root "package.json"))) { throw "Placez-vous à la racine de llm-academy-v4." }
$branch = (git branch --show-current).Trim()
if ($branch -ne "feature/academy-pedagogie-microduck-r1") { throw "Branche incorrecte : $branch. Aucun fichier modifié." }
if (-not (Test-Path -LiteralPath $Archive)) { throw "Archive introuvable : $Archive" }
$dest = Join-Path $root "public\pilotes\microduck-attention-v2"
if (Test-Path $dest) { throw "Destination existante : $dest. Arrêt pour empêcher tout écrasement." }
$temporary = Join-Path ([IO.Path]::GetTempPath()) ("microduck-v2-" + [Guid]::NewGuid().ToString("N"))
New-Item -Path $temporary -ItemType Directory | Out-Null
try {
    Expand-Archive -LiteralPath $Archive -DestinationPath $temporary -Force
    $folder = Join-Path $temporary "microduck_mission_v2"
    $files = @("index.html", "README.md")
    foreach ($direction in @("up","down","left","right")) {
        foreach ($frame in @("idle","step_a","step_b")) { $files += "${direction}_${frame}.png" }
    }
    foreach ($name in $files) {
        if (-not (Test-Path -LiteralPath (Join-Path $folder $name))) { throw "Fichier obligatoire manquant : $name" }
    }
    Add-Type -AssemblyName System.Drawing
    foreach ($name in ($files | Where-Object { $_ -like "*.png" })) {
        $image = [System.Drawing.Image]::FromFile((Join-Path $folder $name))
        try { if ($image.Width -ne 256 -or $image.Height -ne 256) { throw "Dimensions inattendues : $name" } }
        finally { $image.Dispose() }
    }
    New-Item -Path $dest -ItemType Directory | Out-Null
    foreach ($name in $files) { Copy-Item -LiteralPath (Join-Path $folder $name) -Destination (Join-Path $dest $name) }
    Write-Host "OK : 12 sprites officiels et page HTML installés dans $dest"
    Write-Host "Exécutez : npm run build ; npx playwright test tests/e2e/microduck-attention-v2.spec.ts --reporter=list"
} finally { Remove-Item -LiteralPath $temporary -Recurse -Force -ErrorAction SilentlyContinue }
