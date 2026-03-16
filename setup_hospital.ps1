# setup_hospital.ps1
# One-Click Installer for Organic Hospital AI Platform
# Optimized for 8GB RAM Environment

Write-Host "🏥 Initializing Organic Hospital AI Platform Setup..." -ForegroundColor Cyan

# 1. Hardware & Environment Check
$mem = Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory
$totalRAM = [math]::Round($mem.TotalVisibleMemorySize / 1MB)
Write-Host "[+] Detected Total RAM: $totalRAM GB"

if ($totalRAM -lt 8) {
    Write-Warning "[-] Warning: Less than 8GB RAM detected. Mitochondrial Failure (OOM) is likely."
}

# 2. Model Provisioning (Ollama)
Write-Host "[+] Provisioning Quad-Cell Models via Ollama..." -ForegroundColor Yellow
$models = @("llama3.2:1b", "phi3.5:latest", "exaone3.5:2.4b", "qwen2.5:1.5b")

foreach ($model in $models) {
    Write-Host "    > Pulling $model..."
    ollama pull $model
}

# 3. Python Environment Setup
Write-Host "[+] Setting up Python Virtual Environment..." -ForegroundColor Yellow
if (-not (Test-Path "venv")) {
    python -m venv venv
}

# Install requirements
./venv/Scripts/pip install fastapi uvicorn requests python-dotenv

# 4. vLLM-Compatible Backend Logic (Placeholder for Phase 5)
Write-Host "[+] Preparing vLLM-Inspired Orchestration Layer..." -ForegroundColor Yellow
# (In a real scenario, we'd check for vLLM or Docker here)

# 5. UI Initialization (Vite + React)
Write-Host "[+] Initializing Premium Medical UI..." -ForegroundColor Yellow
if (-not (Test-Path "ui/node_modules")) {
    Set-Location ui
    npm install
    Set-Location ..
}

Write-Host "✅ Setup Complete. Launching Organic Hospital Hub..." -ForegroundColor Green
Write-Host "Run './start_hospital.ps1' to begin operation."
