@echo off
echo.
echo ================================================
echo  Physics Simulation Hub - Content Updater
echo ================================================
echo.

:menu
echo Kya karna chahte hain?
echo   1. Nayi simulation add kari hai - app rebuild karo
echo   2. Sirf online content.json update karna hai
echo   3. Version check karo
echo   4. Exit
echo.
set /p choice="Choice (1-4): "

if "%choice%"=="1" goto rebuild
if "%choice%"=="2" goto online
if "%choice%"=="3" goto version
if "%choice%"=="4" exit

:rebuild
echo.
echo Konsa version bump?
echo   1. Patch (1.0.0 to 1.0.1) - small fix
echo   2. Minor (1.0.0 to 1.1.0) - nayi sims
echo   3. Major (1.0.0 to 2.0.0) - bada update
set /p vbump="Choice (1-3): "
if "%vbump%"=="1" npm version patch
if "%vbump%"=="2" npm version minor
if "%vbump%"=="3" npm version major
echo.
echo Building Windows app...
npm run electron:win
echo.
echo Done! release/ folder mein .exe milegi
goto end

:online
echo.
echo physics-sim-content/content.json update karo
echo Phir: git add . && git commit -m "update" && git push
echo Students ko 6 ghante mein automatic update milega!
goto end

:version
npm run --silent -- node -e "console.log(require('./package.json').version)"
goto menu

:end
echo.
pause
