$payload = '{"type":"checkout.session.completed","data":{"object":{"metadata":{"bookingId":"68fc534cfa3e7abc3178499e"}}}}'
Write-Output "Payload: $payload"
Invoke-RestMethod -Uri 'http://localhost:5000/webhook' -Method POST -Body $payload -ContentType 'application/json' | ConvertTo-Json -Depth 3
