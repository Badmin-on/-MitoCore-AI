# start_hospital.ps1
# Unified Entry Point for Organic Hospital AI Hub

Write-Host "🚀 Launching Hospital Guard Platform..." -ForegroundColor Cyan

# 1. Start Backend (Async)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd src; ../venv/Scripts/python hospital_nucleus.py" -WindowStyle Normal
Write-Host "[+] Backend Nucleus Online (Port 8000)" -ForegroundColor Green

# 2. Start Frontend (Async)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ui; npm run dev" -WindowStyle Normal
Write-Host "[+] Premium Bio-Interface Online (Vite Dev Server)" -ForegroundColor Green

Write-Host "`n✨ System Fully Synchronized. Happy Diagnosing, Alex." -ForegroundColor White
