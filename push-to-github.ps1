# Run these one at a time in PowerShell, or run this script after editing the repo URL at the bottom.
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your GitHub username and repo name.

Set-Location "c:\Users\liamh\Documents\New folder\OneDrive\Documents\Cursor Projects\small-business-websites"

git init
git add .
git commit -m "Initial commit: H4 Services and small business mock sites"
git branch -M main
# Edit the next line with your GitHub repo URL:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
