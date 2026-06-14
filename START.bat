@echo off
chcp 65001 >nul
title ElectroFit — запуск проєкту

echo.
echo ============================================================
echo   Запуск проєкту ElectroFit...
echo ============================================================
echo.

docker info >nul 2>&1
if errorlevel 1 (
    echo [ПОМИЛКА] Docker Desktop не запущений або не встановлений.
    echo.
    echo Будь ласка:
    echo   1. Встановіть Docker Desktop для Windows
    echo   2. Запустіть Docker Desktop і дочекайтесь повного завантаження
    echo   3. Запустіть цей файл знову
    echo.
    pause
    exit /b 1
)

echo Docker знайдено. Збірка та запуск контейнерів...
echo.
echo   Сайт:    http://localhost:3000
echo   API:     http://localhost:8080
echo   Swagger: http://localhost:8080/swagger-ui.html
echo.
echo Перший запуск може зайняти кілька хвилин (завантаження образів і збірка).
echo Для зупинки натисніть Ctrl+C у цьому вікні.
echo.

docker compose up --build
if errorlevel 1 (
    echo.
    echo [ПОМИЛКА] Не вдалося запустити контейнери. Перевірте повідомлення вище.
    pause
    exit /b 1
)

pause
