@echo off
chcp 65001 > nul
title MeteMorali Admin Panel Başlatıcı
color 0A

echo ====================================================
echo             METEMORALI ADMIN PANEL BAŞLATICI
echo ====================================================
echo.

:: 1. Backend Sunucusunu Başlat
echo [1/2] C# Backend API Başlatılıyor (http://localhost:5055)...
cd AdminBackend\MeteAdminApi
start "MeteMorali Backend API" dotnet run --project MeteAdminApi.csproj --launch-profile http
cd ..\..

echo.
echo [2/2] Admin Arayüzü Tarayıcıda Açılıyor...
timeout /t 3 /nobreak > nul

:: 2. Tarayıcıda Admin Giriş Sayfasını Aç
start "" "AdminFrontend\index.html"

echo.
echo ====================================================
echo  İŞLEM TAMAM!
echo  Giriş Bilgileri:
echo  Kullanıcı Adı: admin
echo  Şifre: admin123
echo ====================================================
echo.
pause
