@echo off
TITLE Airbnb Clone Database Seeder
echo Resetting and seeding database with demo listings and users...
cd /d %~dp0backend
npm run seed
echo.
echo Database seeded successfully!
pause
