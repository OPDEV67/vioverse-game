@echo off
setlocal
cd /d "%~dp0"
title Vioverse - Moonlit Live Server
echo.
echo  =============================================
echo        VIOVERSE - LIVE DEVELOPMENT SERVER
echo  =============================================
echo.
echo  Serving files from:
echo  %CD%
echo.
if not exist "index.html" (
  echo ERROR: index.html is missing from this folder.
  echo Start this server from your GitHubDesktop vioverse-game clone.
  pause
  exit /b 1
)
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 live_server.py
  goto server_end
)
where python >nul 2>nul
if %errorlevel%==0 (
  python live_server.py
  goto server_end
)
echo Python 3 was not found.
echo Download Python from https://www.python.org/downloads/
echo Then start server.bat again.
:server_end
echo.
echo The Vioverse server has stopped.
pause
endlocal
