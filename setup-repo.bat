@echo off
REM Script to initialize and push the FinSight repository to GitHub

REM Initialize git repository (if not already done)
git init

REM Add all files
git add .

REM Commit the files
git commit -m "Initial commit: FinSight Budget App with all features"

REM Create main branch and switch to it
git branch -M main

REM Instructions for the user
echo Repository setup complete!
echo Remember to:
echo 1. Create a new repository on GitHub (do not initialize with README)
echo 2. Add the remote: git remote add origin https://github.com/Mura0908/finsight-app-New.git
echo 3. Push to GitHub: git push -u origin main
echo.
echo After pushing, GitHub Actions will automatically build and release the APK!
echo You can download the latest APK from the Releases page on GitHub.