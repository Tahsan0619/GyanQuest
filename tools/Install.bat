@echo off
setlocal
title GyanQuest setup
echo Installing GyanQuest...
set "SRC=%~dp0"
set "DEST=%LOCALAPPDATA%\Programs\GyanQuest"
mkdir "%DEST%" 2>nul
xcopy "%SRC%*" "%DEST%\" /E /I /Y /Q >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d=[Environment]::GetFolderPath('Desktop')+'\GyanQuest.lnk'; $s=(New-Object -ComObject WScript.Shell).CreateShortcut($d); $s.TargetPath='%DEST%\GyanQuest.exe'; $s.WorkingDirectory='%DEST%'; $s.Save(); $m=[Environment]::GetFolderPath('StartMenu')+'\Programs\GyanQuest.lnk'; $s=(New-Object -ComObject WScript.Shell).CreateShortcut($m); $s.TargetPath='%DEST%\GyanQuest.exe'; $s.WorkingDirectory='%DEST%'; $s.Save()"
if exist "%DEST%\MicrosoftEdgeWebview2Setup.exe" (
  echo Installing WebView2 if needed...
  "%DEST%\MicrosoftEdgeWebview2Setup.exe" /silent /install
)
echo Launching...
start "" "%DEST%\GyanQuest.exe"
echo Installed. Shortcut is on your Desktop.
timeout /t 4 >nul
