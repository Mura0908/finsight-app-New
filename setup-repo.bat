@echo off
REM Script to initialize and push the FinSight repository to GitHub

REM Initialize git repository (if not already done)
git init

REM Add all files
git add .

REM Commit the files
git commit -m "Initial commit: FinSight Budget App with all features"

REM Instructions for the user
echo Repository setup complete!
echo Remember to:
echo 1. Set up your GitHub remote repository
echo 2. Add the remote: git remote add origin https://github.com/yourusername/finsight-app.git
echo 3. Push to GitHub: git push -u origin main