@echo off
set SERVICE_NAME=KalendarOdsustvaServer
set NODE_PATH="C:\Program Files\nodejs\node.exe"
set APP_PATH="C:\Servisi\kalendar_odsustva\server.js"
set NSSM_PATH=C:\Servisi\nssm\win64\nssm.exe"
set SERVICE_USER=InterniIT
set SERVICE_PASS=Promeni123

echo Installing service "%SERVICE_NAME%"...

%NSSM_PATH% install %SERVICE_NAME% %NODE_PATH% %APP_PATH%

rem Set service to run under specific user (no quotes for user/pass)
%NSSM_PATH% set %SERVICE_NAME% ObjectName .\%SERVICE_USER% %SERVICE_PASS%

rem Set to auto-start with system
%NSSM_PATH% set %SERVICE_NAME% Start SERVICE_AUTO_START

echo Done! Start the service with:
echo net start %SERVICE_NAME%
pause
