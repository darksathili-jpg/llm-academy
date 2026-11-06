#Requires -Version 5.1
<#
.SYNOPSIS
  Publie les missions statiques Microduck sur un second dépôt GitHub Pages,
  sans toucher au dépôt LLM Academy principal.
.NOTES
  Exécuter depuis la branche feature/academy-pedagogie-microduck-r1.
  Prérequis : git, GitHub CLI (gh), authentification "gh auth login".
  Nécessite des droits de création de dépôt et configuration GitHub Pages.
#>
[CmdletBinding()]
param(
  [string]$Owner = 'darksathili-jpg',
  [string]$RepoName = 'llm-academy-pilote'
)
$ErrorActionPreference = 'Stop'
$source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$expectedBranch = 'feature/academy-pedagogie-microduck-r1'
$actualBranch = (& git -C $source branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $actualBranch -ne $expectedBranch) {
  throw "Branche incorrecte : '$actualBranch'. Utiliser git switch $expectedBranch puis git pull --ff-only."
}
$pilots = Join-Path $source 'public\pilotes'
$required = @(
  'index.html',
  'microduck-transversal-r1\index.html',
  'microduck-introduction-embeddings-r1\index.html',
  'microduck-introduction-softmax-r1\index.html',
  'microduck-attention-v2\index.html',
  'microduck-attention-v2\right_idle.png',
  'microduck-introduction-attention-r1\index.html',
  'microduck-qkv-r1\index.html',
  'attention-reelle-instructions\index.html',
  'evaluation-attention-n0-n5\index.html',
  'shared\numworks-calculator.js'
)
foreach($file in $required){
  if(-not(Test-Path -LiteralPath (Join-Path $pilots $file))){
    throw "Fichier manquant : $file. Vérifier git pull --ff-only."
  }
}
foreach($cmd in @('git','gh')) {
  if(-not (Get-Command $cmd -ErrorAction SilentlyContinue)){
    throw "Outil absent : $cmd. Installer Git et GitHub CLI."
  }
}
& gh auth status
if($LASTEXITCODE -ne 0){throw 'Connexion GitHub manquante : exécuter gh auth login.'}
# En Windows PowerShell 5.1, la sortie stderr d'une commande native peut
# produire une erreur terminante avec ErrorActionPreference = Stop.
# Pour les sondes attendues (404 GitHub), exécuter silencieusement en processus.
function Invoke-CommandStatus {
  param([string]$Command, [string[]]$Arguments)
  $exe = (Get-Command $Command -ErrorAction Stop).Source
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = (($Arguments | ForEach-Object { '"' + ($_.Replace('"','\\"')) + '"' }) -join ' ')
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  [void]$process.Start()
  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()
  if($process.ExitCode -ne 0 -and $stderr){
    Write-Verbose ($stderr.Trim())
  }
  return $process.ExitCode
}
$repoFull = "$Owner/$RepoName"
# L'absence du dépôt avant sa création est normale et ne doit PAS arrêter le script.
$repoExists = (Invoke-CommandStatus -Command 'gh' -Arguments @('api',"repos/$repoFull",'--silent')) -eq 0
if(-not $repoExists) {
  Write-Host "Création du dépôt public séparé $repoFull ..."
  if((Invoke-CommandStatus -Command 'gh' -Arguments @('repo','create',$repoFull,'--public','--description','Préproduction pédagogique LLM Academy Microduck - élèves et enseignants')) -ne 0){
    throw 'Création du dépôt impossible. Vérifier les droits sur le compte GitHub.'
  }
  Write-Host "Dépôt créé : https://github.com/$repoFull"
}
$tmp = Join-Path ([IO.Path]::GetTempPath()) ('microduck-pilote-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
try {
  Write-Host 'Clonage du dépôt de préproduction...'
  if((Invoke-CommandStatus -Command 'git' -Arguments @('clone',"https://github.com/$repoFull.git",$tmp)) -ne 0){
    throw 'Impossible de cloner le dépôt de préproduction.'
  }
  $marker = Join-Path $tmp '.microduck-pilot-managed'
  $other = @(Get-ChildItem -LiteralPath $tmp -Force | Where-Object {$_.Name -ne '.git'})
  if($repoExists -and $other.Count -gt 0 -and -not (Test-Path -LiteralPath $marker)){
    throw "Le dépôt $repoFull contient des fichiers non gérés par ce script. Refus de les écraser."
  }
  # Ce dépôt dédié doit être exclusivement l'image du sous-dossier public/pilotes/.
  foreach($entry in $other){Remove-Item -LiteralPath $entry.FullName -Recurse -Force}
  Get-ChildItem -LiteralPath $pilots -Force | Copy-Item -Destination $tmp -Recurse -Force
  Set-Content -LiteralPath (Join-Path $tmp '.nojekyll') -Value '' -Encoding ascii
  Set-Content -LiteralPath $marker -Value 'Dépôt de préproduction géré depuis llm-academy/public/pilotes' -Encoding utf8
  if((Invoke-CommandStatus -Command 'git' -Arguments @('-C',$tmp,'checkout','-B','main')) -ne 0){
    throw 'Impossible de sélectionner la branche main du dépôt pilote.'
  }
  & git -C $tmp add -A
  & git -C $tmp diff --cached --quiet
  if($LASTEXITCODE -eq 1){
    & git -C $tmp commit -m 'deploy: publier les pilotes pédagogiques Microduck'
    if($LASTEXITCODE -ne 0){throw 'Commit impossible : configurer user.name et user.email pour Git.'}
    Write-Host 'Envoi vers la branche main du dépôt pilote...'
    if((Invoke-CommandStatus -Command 'git' -Arguments @('-C',$tmp,'push','-u','origin','main')) -ne 0){
      throw 'Push impossible : vérifier les droits GitHub.'
    }
  } elseif($LASTEXITCODE -ne 0) {
    throw 'Erreur dans le contrôle de la copie Git.'
  } else {
    Write-Host 'Contenu identique : aucune modification à pousser.'
  }
  # Paramétrer GitHub Pages seulement s'il n'est pas déjà configuré.
  $pagesReady = (Invoke-CommandStatus -Command 'gh' -Arguments @('api',"repos/$repoFull/pages",'--silent')) -eq 0
  if(-not $pagesReady){
    Write-Host 'Activation de GitHub Pages depuis main, racine du dépôt...'
    $activated = (Invoke-CommandStatus -Command 'gh' -Arguments @('api','--method','POST',"repos/$repoFull/pages",'-f','source[branch]=main','-f','source[path]=/')) -eq 0
    if(-not $activated){
      Write-Warning "Publication poussée, mais activation Pages manuelle requise : https://github.com/$repoFull/settings/pages (Deploy from a branch, main, /(root))."
    }
  }
  Write-Host ''
  Write-Host "DEPOT : https://github.com/$repoFull"
  Write-Host "URL A VERIFIER APRES DEPLOIEMENT : https://$Owner.github.io/$RepoName/"
  Write-Host "La présence de l'URL n'est pas encore confirmée. Vérifier dans Settings > Pages."
  Write-Host "Le dépôt llm-academy original et son site public ne sont pas modifiés."
}
finally {
  if(Test-Path -LiteralPath $tmp){Remove-Item -LiteralPath $tmp -Recurse -Force}
}
