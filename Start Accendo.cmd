@echo off
title Accendo Local App
cd /d "%~dp0"

echo.
echo  Starting Accendo...
echo.

call npm.cmd run build
if errorlevel 1 (
  echo.
  echo  Accendo could not be built. Please leave this window open and review the error above.
  pause
  exit /b 1
)

start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:4173"

echo.
echo  Accendo is available at http://127.0.0.1:4173
echo  Keep this window open while using the app.
echo  Press Ctrl+C when you want to stop it.
echo.

call npm.cmd run preview -- --host 127.0.0.1
