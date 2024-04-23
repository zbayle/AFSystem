node updater.mjs
start cmd /k "cd /d %~dp0 && npm start"
start cmd /k "cd /d %~dp0af-scanner && npm start"
timeout /t 30 /nobreak > NUL
for /f "delims=" %%i in ('where chrome') do set "chromePath=%%i"
start "" "%chromePath%" --start-fullscreen http://localhost:3000
exit