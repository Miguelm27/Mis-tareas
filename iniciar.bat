@echo off
REM ============================================================
REM  Doble clic en este archivo para encender la app Mis Tareas
REM ============================================================
cd /d "%~dp0backend"
if not exist node_modules (
  echo Instalando dependencias por primera vez...
  call npm install
)
call npm start
pause
