#!/bin/bash
# Script to initialize and push the FinSight repository to GitHub

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit: FinSight Budget App with all features"

# Add the remote repository (replace 'yourusername' with your actual GitHub username)
# Uncomment the line below and replace 'yourusername' with your GitHub username
# git remote add origin https://github.com/yourusername/finsight-app.git

# Push to GitHub
# Uncomment the line below after setting up the remote
# git push -u origin main

echo "Repository setup complete!"
echo "Remember to:"
echo "1. Replace 'yourusername' in the remote URL with your actual GitHub username"
echo "2. Uncomment the git remote and git push lines"
echo "3. Run the commands manually or uncomment them in this script"