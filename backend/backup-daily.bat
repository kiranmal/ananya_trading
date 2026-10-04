@echo off
REM ============================================================
REM  Ananya Trading Company — daily database backup
REM
REM  Register with Windows Task Scheduler (runs even when the
REM  API server is stopped):
REM
REM    schtasks /create /tn "AnanyaDB-Backup" /sc daily /st 03:00 ^
REM      /tr "\"%~dp0backup-daily.bat\"" /rl highest
REM
REM  Or via GUI: taskschd.msc -> Create Basic Task -> Daily 03:00
REM    Action: Start a program -> this .bat
REM ============================================================

cd /d "%~dp0"
node backupDb.js >> "%USERPROFILE%\ananya-db-backups\scheduler.log" 2>&1
exit /b %ERRORLEVEL%
