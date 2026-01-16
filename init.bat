@echo off
setlocal

REM === Create backend root ===
mkdir backend 2>nul
cd backend || exit /b

REM === Initialize npm ===
call npm init -y

REM === .gitignore ===
(
echo node_modules/
echo .env
echo dist/
) > .gitignore

REM === Root files ===
type nul > server.js

REM === Install packages ===
call npm install express cors dotenv argon2 mysql2 cookie-parser jsonwebtoken psgutil

REM === Create src structure ===
mkdir src 2>nul
pushd src

mkdir controllers utils middlewares config routes

type nul > controllers\authController.js
type nul > utils\token.js
type nul > middlewares\auth.js
type nul > config\env.js
type nul > config\db.js
type nul > routes\authRoutes.js

popd

echo.
echo Backend structure created successfully.
pause
