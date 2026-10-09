@echo off
REM ============================================================
REM  WASTELAND 2 - запуск игры (Windows)
REM  Двойной клик по этому файлу запускает локальный сервер
REM  и открывает игру в браузере по умолчанию.
REM ============================================================
cd /d "%~dp0"

set PORT=8000
set URL=http://localhost:%PORT%

echo.
echo   ================================================
echo      W A S T E L A N D   2   ·   L A U N C H E R
echo   ================================================
echo.

REM Ищем Python (python, py или python3)
where python >nul 2>nul
if %errorlevel%==0 (
    start "" "%URL%"
    echo [INFO] Запускаю python -m http.server %PORT% ...
    python -m http.server %PORT%
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    start "" "%URL%"
    echo [INFO] Запускаю py -m http.server %PORT% ...
    py -m http.server %PORT%
    goto :eof
)

REM Нет Python - пробуем Node
where npx >nul 2>nul
if %errorlevel%==0 (
    start "" "%URL%"
    echo [INFO] Запускаю npx http-server %PORT% ...
    npx --yes http-server -p %PORT% -c-1 .
    goto :eof
)

echo [ОШИБКА] Не найден Python или Node.js.
echo Просто открой index.html двойным кликом в браузере.
pause
