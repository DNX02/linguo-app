$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$ShortcutPath = Join-Path $DesktopPath "Linguo — Языковое приложение.lnk"
$TargetPath = "C:\Users\admin\.gemini\antigravity\scratch\linguo-app\Start-Linguo.cmd"
$IconPath = "C:\Users\admin\.gemini\antigravity\scratch\linguo-app\public\favicon.ico"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = "C:\Users\admin\.gemini\antigravity\scratch\linguo-app"
$Shortcut.IconLocation = $IconPath
$Shortcut.Description = "Запуск приложения Linguo"
$Shortcut.Save()

Write-Host "Ярлык успешно создан на рабочем столе: $ShortcutPath" -ForegroundColor Green
