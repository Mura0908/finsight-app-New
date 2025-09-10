@echo off
REM Script to automatically initialize and push the repository to GitHub

echo Initializing repository...
git init

echo Adding all files...
git add .

echo Committing files...
git commit -m "Initial commit: FinSight Budget App with all features"

echo Creating main branch...
git branch -M main

echo Setting up remote repository...
git remote add origin https://github.com/Mura0908/finsight-app-New.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo Repository has been successfully pushed to GitHub!
echo.
echo Next steps:
echo 1. Go to https://github.com/Mura0908/finsight-app-New/actions to see the build process
echo 2. After the build completes, go to https://github.com/Mura0908/finsight-app-New/releases to download the APK
echo.