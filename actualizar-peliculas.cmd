@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: No se encontro npm. Instale Node.js y vuelva a intentarlo.
  pause
  exit /b 1
)

set "TMDB_READ_TOKEN="
set /p "TMDB_READ_TOKEN=Pegue el token de lectura de TMDB y presione ENTER: "
if not defined TMDB_READ_TOKEN (
  echo ERROR: No se ingreso el token.
  pause
  exit /b 1
)

call npm run movies:tmdb
set "IMPORT_RESULT=%ERRORLEVEL%"
set "TMDB_READ_TOKEN="

if not "%IMPORT_RESULT%"=="0" (
  echo.
  echo La importacion no termino correctamente. Revise el mensaje anterior.
  pause
  exit /b %IMPORT_RESULT%
)

echo.
echo Catalogo actualizado correctamente.
pause
