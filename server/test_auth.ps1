$req = @{ email = 'devtester@example.com'; password = 'Password123!' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body $req -ContentType 'application/json'
Write-Output "Token: $($login.token)"
$hdr = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/me' -Headers $hdr -Method GET | ConvertTo-Json -Depth 3
