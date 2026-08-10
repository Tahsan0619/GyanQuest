@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title GyanQuest - Demo Boot
color 0A

echo.
echo  ============================================
echo   GyanQuest demo boot
echo  ============================================
echo.
echo   Frontend (games):  http://127.0.0.1:5500/
echo   Backend API:       http://127.0.0.1:8000/api
echo   Admin panel:       http://127.0.0.1:8000/admin
echo.
echo   Tip: Start Apache + MySQL in XAMPP Control
echo        first if you use MySQL (optional for sqlite).
echo.

set "XAMPP=C:\xampp"
set "PHP="
set "PYTHON="

REM Prefer XAMPP PHP when present (matches judge laptop setup)
if exist "%XAMPP%\php\php.exe" set "PHP=%XAMPP%\php\php.exe"
if not defined PHP (
  where php >nul 2>&1 && for /f "delims=" %%P in ('where php') do (
    if not defined PHP set "PHP=%%P"
  )
)

where py >nul 2>&1 && set "PYTHON=py -3"
if not defined PYTHON (
  where python >nul 2>&1 && set "PYTHON=python"
)

if not defined PHP (
  echo [ERROR] PHP not found. Install XAMPP or add php to PATH.
  pause
  exit /b 1
)
if not defined PYTHON (
  echo [ERROR] Python not found. Install Python 3 and retry.
  pause
  exit /b 1
)

REM Best-effort: start XAMPP MySQL if the control helpers exist
if exist "%XAMPP%\mysql_start.bat" (
  echo [1/4] Starting XAMPP MySQL...
  start "" /min cmd /c "cd /d "%XAMPP%" && mysql_start.bat"
) else if exist "%XAMPP%\xampp-control.exe" (
  echo [1/4] Opening XAMPP Control Panel - click Start on MySQL (and Apache if needed)...
  start "" "%XAMPP%\xampp-control.exe"
) else (
  echo [1/4] XAMPP helpers not found - skipping MySQL auto-start.
)

timeout /t 2 /nobreak >nul

echo [2/4] Starting Laravel API on port 8000...
start "GyanQuest API :8000" cmd /k "cd /d "%~dp0backend" && "%PHP%" artisan serve --host=127.0.0.1 --port=8000"

timeout /t 2 /nobreak >nul

echo [3/4] Starting frontend on port 5500...
if exist "%~dp0tools\groq_proxy.py" (
  start "GyanQuest Frontend :5500" cmd /k "cd /d "%~dp0" && %PYTHON% tools\groq_proxy.py"
) else (
  start "GyanQuest Frontend :5500" cmd /k "cd /d "%~dp0" && %PYTHON% -m http.server 5500 --bind 127.0.0.1"
)

timeout /t 3 /nobreak >nul

echo [4/4] Opening browser...
start "" "http://127.0.0.1:5500/"

echo.
echo  Ready for judges.
echo  - Leave the two server windows open.
echo  - Close this window anytime; servers keep running.
echo  - To stop: close the "GyanQuest API" and "GyanQuest Frontend" windows.
echo.
pause
endlocal
