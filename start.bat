@echo off
setlocal EnableDelayedExpansion

title Security Studio - Startup

echo ===================================================
echo             SECURITY STUDIO STARTUP
echo ===================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please download and install Node.js from https://nodejs.org/
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: 2. Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in your PATH.
    echo Please install npm.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Print Node versions
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo [OK] Node.js version: %NODE_VER%
echo [OK] npm version: %NPM_VER%
echo.

:: 3. Check and install dependencies
if not exist "node_modules\" (
    echo [INFO] First time setup: node_modules not found.
    echo [INFO] Installing dependencies... This may take a few minutes.
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
) else (
    echo [OK] Dependencies found.
    echo.
)

:: 4. Start the Application
echo [INFO] Starting the application...
echo [INFO] The frontend will be available at http://localhost:3000
echo [INFO] The backend API will be available at http://127.0.0.1:4000
echo.
echo Leave this window open to keep the servers running. Press Ctrl+C to stop.
echo.

:: Run the dev script
call npm run dev

pause
