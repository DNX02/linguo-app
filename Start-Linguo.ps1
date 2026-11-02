$ErrorActionPreference = "Stop"

$AppDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 4000
$NodePath = "C:\Program Files\nodejs\node.exe"
if (-not (Test-Path $NodePath)) { $NodePath = "node" }
$CloudflaredPath = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$LogFile = Join-Path $AppDir "tunnel.log"
$LinksFile = Join-Path $AppDir "PUBLIC-LINKS.txt"
$ConfigFile = "C:\Users\admin\.cloudflared\config.yml"

Write-Host "=== Linguo Web App Launcher ===" -ForegroundColor Cyan

# 1. Start Node.js server if not running
$existingNode = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if (-not $existingNode) {
    Write-Host "[1/3] Запуск Full-Stack сервера Linguo на порту $Port..." -ForegroundColor Yellow
    Start-Process -FilePath $NodePath -ArgumentList "server/server.js" -WorkingDirectory $AppDir -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[1/3] Сервер Linguo уже запущен на порту $Port." -ForegroundColor Green
}

# 2. Check and start Cloudflare Tunnel
$existingTunnel = Get-Process cloudflared -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $existingTunnel) {
    Write-Host "[2/3] Запуск Cloudflare Tunnel..." -ForegroundColor Yellow
    if (Test-Path $ConfigFile) {
        Start-Process -FilePath $CloudflaredPath `
            -ArgumentList "tunnel --config `"$ConfigFile`" --protocol http2 --logfile `"$LogFile`" run e-clinic-control" `
            -WorkingDirectory $AppDir `
            -WindowStyle Hidden
    } else {
        Start-Process -FilePath $CloudflaredPath `
            -ArgumentList "tunnel --url http://127.0.0.1:$Port --protocol http2 --logfile `"$LogFile`"" `
            -WorkingDirectory $AppDir `
            -WindowStyle Hidden
    }
    Start-Sleep -Seconds 3
} else {
    Write-Host "[2/3] Cloudflare Tunnel уже работает." -ForegroundColor Green
}

# 3. Get IP and Links
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" } | Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "192.168.100.2" }

$links = @"
===================================================
   Linguo — Приложение для английского и немецкого
===================================================

[1] Постоянный домен Cloudflare:
    https://linguo.e-clinic-control.ru/

[2] Локальная сеть Wi-Fi (для iPhone дома):
    http://${ip}:${Port}/

[3] На этом компьютере:
    http://localhost:${Port}/

База данных пользователей и словарей: локально на сервере.
Озвучка слов (TTS): включена.
Интервальное повторение: SM-2.
===================================================
"@

$links | Out-File -FilePath $LinksFile -Encoding UTF8
Write-Host $links -ForegroundColor Cyan

# Open in default browser
Start-Process "http://localhost:$Port"
