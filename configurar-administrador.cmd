@echo off
setlocal
cd /d "%~dp0"
title Configurar administrador - Fabulosa Play

echo ==================================================
echo   CONFIGURAR ADMINISTRADOR DE FABULOSA PLAY
echo ==================================================
echo.
echo Se abrira Firebase en el navegador.
echo.
echo 1. Entre en Authentication.
echo 2. Active el proveedor Correo/contrasena.
echo 3. En Usuarios, cree esta cuenta:
echo    fabulosaplay@gmail.com
echo 4. Use la contrasena privada que usted definio.
echo.
start "" "https://console.firebase.google.com/project/fabulosaplaycr/authentication/users"
pause

echo.
echo Ahora se iniciara sesion en Firebase CLI para publicar
echo las reglas que permiten editar solamente a su correo.
echo.
call npx firebase-tools@latest login
if errorlevel 1 goto :error

call npx firebase-tools@latest deploy --only firestore:rules --project fabulosaplaycr
if errorlevel 1 goto :error

echo.
echo ==================================================
echo   ADMINISTRADOR CONFIGURADO CORRECTAMENTE
echo ==================================================
echo.
echo Preparando y abriendo el panel local...

if not exist "node_modules" (
  echo Instalando dependencias del proyecto...
  call npm install
  if errorlevel 1 goto :error
)

start "Fabulosa Play" cmd /k "cd /d ""%~dp0"" && npm run dev"
timeout /t 6 /nobreak >nul
start "" "http://127.0.0.1:5173/admin"

echo.
echo Inicie sesion y pulse Publicar catalogo actual una sola vez.
pause
exit /b 0

:error
echo.
echo No se completo la configuracion. Revise el mensaje anterior.
pause
exit /b 1
