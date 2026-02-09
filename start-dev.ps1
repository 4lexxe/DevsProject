# Script de inicialización para desarrollo - DevsProject
# Ejecuta app, dashboard-admin y server en paralelo
# Encoding: UTF-8

param(
    [switch]$SkipChecks,
    [switch]$Help
)

$ErrorActionPreference = "Continue"

# Colores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColorOutput "`n=== DevsProject - Inicializador de Desarrollo ===" "Cyan"
    Write-ColorOutput "`nUso: .\start-dev.ps1 [opciones]`n" "Yellow"
    Write-ColorOutput "Opciones:" "Green"
    Write-ColorOutput "  -SkipChecks    Omite la verificación de dependencias"
    Write-ColorOutput "  -Help          Muestra esta ayuda`n"
    Write-ColorOutput "Ejemplos:" "Green"
    Write-ColorOutput "  .\start-dev.ps1"
    Write-ColorOutput "  .\start-dev.ps1 -SkipChecks`n"
    exit 0
}

if ($Help) {
    Show-Help
}

# Banner
Write-ColorOutput "`n============================================================" "Cyan"
Write-ColorOutput "     DevsProject - Inicializador de Desarrollo" "Cyan"
Write-ColorOutput "============================================================`n" "Cyan"

# Verificar Node.js
if (-not $SkipChecks) {
    Write-ColorOutput "[1/3] Verificando dependencias..." "Yellow"
    
    # Verificar Node.js
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeCmd) {
        Write-ColorOutput "  [ERROR] Node.js no esta instalado o no esta en el PATH" "Red"
        Write-ColorOutput "  Por favor, instala Node.js desde https://nodejs.org/" "Yellow"
        exit 1
    }
    
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  [OK] Node.js instalado: $nodeVersion" "Green"
        } else {
            throw "Error ejecutando node --version"
        }
    } catch {
        Write-ColorOutput "  [ERROR] No se pudo verificar la version de Node.js" "Red"
        exit 1
    }
    
    # Verificar que existan los directorios
    $directories = @("app", "dashboard-admin", "server")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            Write-ColorOutput "  [ERROR] Directorio '$dir' no encontrado" "Red"
            exit 1
        }
        Write-ColorOutput "  [OK] Directorio '$dir' encontrado" "Green"
    }
    
    Write-ColorOutput "`n[2/3] Verificando node_modules..." "Yellow"
    
    foreach ($dir in $directories) {
        $nodeModules = Join-Path $dir "node_modules"
        if (-not (Test-Path $nodeModules)) {
            Write-ColorOutput "  [WARN] node_modules no encontrado en '$dir'" "Yellow"
            Write-ColorOutput "  Ejecutando 'npm install' en '$dir'..." "Yellow"
            Push-Location $dir
            try {
                $null = npm install 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorOutput "  [OK] Dependencias instaladas en '$dir'" "Green"
                } else {
                    throw "Error en npm install"
                }
            } catch {
                Write-ColorOutput "  [ERROR] Error instalando dependencias en '$dir'" "Red"
                Pop-Location
                exit 1
            }
            Pop-Location
        } else {
            Write-ColorOutput "  [OK] node_modules encontrado en '$dir'" "Green"
        }
    }
}

Write-ColorOutput "`n[3/3] Iniciando servicios...`n" "Yellow"

# Función para limpiar procesos al salir
$script:jobs = @()

function Stop-AllProcesses {
    Write-ColorOutput "`n`nDeteniendo todos los servicios..." "Yellow"
    foreach ($job in $script:jobs) {
        if ($job.State -eq "Running") {
            try {
                Stop-Job -Job $job -ErrorAction SilentlyContinue
                Write-ColorOutput "  [OK] Job detenido: $($job.Name)" "Green"
            } catch {
                # Ignorar errores
            }
        }
    }
    # Limpiar jobs
    $script:jobs | Remove-Job -Force -ErrorAction SilentlyContinue
    Write-ColorOutput "`nHasta luego!" "Cyan"
    Write-ColorOutput "" "Cyan"
    exit 0
}

# Registrar handler para Ctrl+C
[Console]::TreatControlCAsInput = $false
$null = Register-ObjectEvent -InputObject ([System.Console]) -EventName "CancelKeyPress" -Action {
    Stop-AllProcesses
}

# Configurar variables de entorno si no existen
if (-not $env:VITE_API_URL) {
    $env:VITE_API_URL = "http://localhost:3000/api"
    Write-ColorOutput "  [INFO] VITE_API_URL no definida, usando: $env:VITE_API_URL" "Gray"
}

# Guardar el directorio actual
$rootDir = Get-Location

# Iniciar Server
Write-ColorOutput "[SERVER] Iniciando backend..." "Cyan"
$serverJob = Start-Job -Name "Server" -ScriptBlock {
    param($rootPath)
    Set-Location $rootPath
    Set-Location server
    $env:FORCE_COLOR = "1"
    npm run dev 2>&1 | ForEach-Object {
        $timestamp = Get-Date -Format "HH:mm:ss"
        "[$timestamp] [SERVER] $_"
    }
} -ArgumentList $rootDir.Path

# Iniciar App
Write-ColorOutput "[APP] Iniciando frontend..." "Cyan"
$appJob = Start-Job -Name "App" -ScriptBlock {
    param($rootPath)
    Set-Location $rootPath
    Set-Location app
    $env:FORCE_COLOR = "1"
    npm run dev 2>&1 | ForEach-Object {
        $timestamp = Get-Date -Format "HH:mm:ss"
        "[$timestamp] [APP] $_"
    }
} -ArgumentList $rootDir.Path

# Iniciar Dashboard Admin
Write-ColorOutput "[ADMIN] Iniciando dashboard admin..." "Cyan"
$dashboardJob = Start-Job -Name "Dashboard" -ScriptBlock {
    param($rootPath)
    Set-Location $rootPath
    Set-Location dashboard-admin
    $env:FORCE_COLOR = "1"
    npm run dev 2>&1 | ForEach-Object {
        $timestamp = Get-Date -Format "HH:mm:ss"
        "[$timestamp] [ADMIN] $_"
    }
} -ArgumentList $rootDir.Path

# Guardar referencias a los jobs
$script:jobs = @($serverJob, $appJob, $dashboardJob)

# Esperar un momento para que los servicios inicien
Start-Sleep -Seconds 2

Write-ColorOutput "`n============================================================" "Green"
Write-ColorOutput "           Servicios iniciados correctamente" "Green"
Write-ColorOutput "============================================================`n" "Green"
Write-ColorOutput "Servicios disponibles en:" "Yellow"
Write-ColorOutput "   - Server:    http://localhost:3000" "Cyan"
Write-ColorOutput "   - App:       http://localhost:5173" "Cyan"
Write-ColorOutput "   - Dashboard: http://localhost:5175" "Cyan"
Write-ColorOutput "`nPresiona Ctrl+C para detener todos los servicios`n" "Gray"

# Mostrar logs en tiempo real
try {
    while ($true) {
        # Recibir output de los jobs
        $serverOutput = Receive-Job -Job $serverJob -ErrorAction SilentlyContinue
        $appOutput = Receive-Job -Job $appJob -ErrorAction SilentlyContinue
        $dashboardOutput = Receive-Job -Job $dashboardJob -ErrorAction SilentlyContinue
        
        # Mostrar output con colores
        if ($serverOutput) {
            foreach ($line in $serverOutput) {
                if ($line -match "error|Error|ERROR|failed|Failed") {
                    Write-ColorOutput $line "Red"
                } elseif ($line -match "warning|Warning|WARNING") {
                    Write-ColorOutput $line "Yellow"
                } elseif ($line -match "ready|Ready|listening|Listening") {
                    Write-ColorOutput $line "Green"
                } else {
                    Write-ColorOutput $line "White"
                }
            }
        }
        
        if ($appOutput) {
            foreach ($line in $appOutput) {
                if ($line -match "error|Error|ERROR|failed|Failed") {
                    Write-ColorOutput $line "Red"
                } elseif ($line -match "warning|Warning|WARNING") {
                    Write-ColorOutput $line "Yellow"
                } elseif ($line -match "ready|Ready|Local:") {
                    Write-ColorOutput $line "Green"
                } else {
                    Write-ColorOutput $line "White"
                }
            }
        }
        
        if ($dashboardOutput) {
            foreach ($line in $dashboardOutput) {
                if ($line -match "error|Error|ERROR|failed|Failed") {
                    Write-ColorOutput $line "Red"
                } elseif ($line -match "warning|Warning|WARNING") {
                    Write-ColorOutput $line "Yellow"
                } elseif ($line -match "ready|Ready|Local:") {
                    Write-ColorOutput $line "Green"
                } else {
                    Write-ColorOutput $line "White"
                }
            }
        }
        
        # Verificar si los jobs terminaron
        if ($serverJob.State -eq "Completed" -or $serverJob.State -eq "Failed") {
            Write-ColorOutput "`n[WARN] El servidor se detuvo inesperadamente" "Yellow"
        }
        if ($appJob.State -eq "Completed" -or $appJob.State -eq "Failed") {
            Write-ColorOutput "`n[WARN] La app se detuvo inesperadamente" "Yellow"
        }
        if ($dashboardJob.State -eq "Completed" -or $dashboardJob.State -eq "Failed") {
            Write-ColorOutput "`n[WARN] El dashboard se detuvo inesperadamente" "Yellow"
        }
        
        Start-Sleep -Milliseconds 500
    }
} catch {
    Write-ColorOutput "`n[ERROR] Error: $_" "Red"
} finally {
    # Limpiar jobs
    Stop-Job -Job $serverJob, $appJob, $dashboardJob -ErrorAction SilentlyContinue
    Remove-Job -Job $serverJob, $appJob, $dashboardJob -ErrorAction SilentlyContinue
    Write-ColorOutput "`nServicios detenidos. Hasta luego!`n" "Cyan"
}
