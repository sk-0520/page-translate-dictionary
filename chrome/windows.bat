@echo off
set CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe

set CUSTOM_BATCH_FILE=@windows.bat
if exist "%CUSTOM_BATCH_FILE%" call "%CUSTOM_BATCH_FILE%"

"%CHROME%" %*

