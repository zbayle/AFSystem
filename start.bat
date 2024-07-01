node updater.mjs
start cmd /k "cd AFSystem && npm start"
start cmd /k "cd af-scanner && npm start"
timeout /t 20 /nobreak > NUL
exit