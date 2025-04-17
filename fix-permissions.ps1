# 🔧 Réparation des permissions dans blocus-backend et blocus-frontend

function Fix-Permissions($path) {
    Write-Host "🔄 Réparation des permissions pour: $path"

    if (-Not (Test-Path $path)) {
        Write-Host "⚠️ Dossier non trouvé: $path"
        return
    }

    $acl = Get-Acl $path
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($env:UserName, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.SetAccessRule($rule)
    Set-Acl $path $acl

    Get-ChildItem -Path $path -Recurse -Force | ForEach-Object {
        try {
            $itemAcl = Get-Acl $_.FullName
            $itemAcl.SetAccessRule($rule)
            Set-Acl $_.FullName $itemAcl
        } catch {
            Write-Host "⚠️ Impossible de modifier: $($_.FullName)"
        }
    }

    Write-Host "✅ Terminé pour: $path`n"
}

# 📁 Dossiers à traiter
Fix-Permissions ".\blocus-backend"
Fix-Permissions ".\blocus-frontend"

Write-Host "🎉 Tous les droits ont été réparés avec succès !"
