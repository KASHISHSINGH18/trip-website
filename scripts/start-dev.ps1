Param()
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$client = Join-Path $scriptRoot '..\client'
$server = Join-Path $scriptRoot '..\server'

Write-Host "Starting client and server in separate PowerShell windows..."

Start-Process -FilePath "powershell" -ArgumentList @('-NoExit','-Command',"cd '$client'; npm run dev") -WindowStyle Normal
Start-Process -FilePath "powershell" -ArgumentList @('-NoExit','-Command',"cd '$server'; npm run dev") -WindowStyle Normal

Write-Host "Launched two PowerShell windows: client (port 3000) and server (port 5000)."
