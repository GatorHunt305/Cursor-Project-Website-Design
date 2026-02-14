# Push this project to GitHub

Your project already has Git set up with an initial commit on the `main` branch.

## One-time setup on GitHub

1. Go to **https://github.com/new**
2. Repository name: e.g. `small-business-websites`
3. Leave "Add a README" **unchecked**
4. Click **Create repository**

## Then run this (replace with your details)

In PowerShell or Cursor terminal, run **one line at a time**:

```powershell
cd "c:\Users\liamh\Documents\New folder\OneDrive\Documents\Cursor Projects\small-business-websites"
```

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
```
*(Replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME with your actual GitHub username and repo name.)*

```powershell
git push -u origin main
```

If GitHub asks for a password, use a **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens).
