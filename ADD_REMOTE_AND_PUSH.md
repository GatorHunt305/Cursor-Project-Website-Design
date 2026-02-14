# Push this project to GitHub

Your project is set up with the remote **https://github.com/GatorHunt305/Cursor-Project-Website-Design.git**. You only need to authenticate and push.

## GitHub no longer accepts account passwords for Git

Use a **Personal Access Token (PAT)** instead.

### 1. Create a token

1. Go to **https://github.com/settings/tokens**
2. Click **Generate new token** → **Generate new token (classic)**
3. Name it (e.g. "Cursor push"), choose an expiry, and check the **repo** scope
4. Click **Generate token** and **copy the token** (you won’t see it again)

### 2. Create the repo on GitHub (if you haven’t yet)

1. Go to **https://github.com/new**
2. Repository name: **Cursor-Project-Website-Design**
3. Leave "Add a README" **unchecked**
4. Click **Create repository**

### 3. Push from your machine

In PowerShell or Cursor terminal, run these **one at a time** (the second line loads Git into your terminal):

```powershell
cd "c:\Users\liamh\Documents\New folder\OneDrive\Documents\Cursor Projects\small-business-websites"
```

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

```powershell
git push -u origin main
```

When prompted:
- **Username:** `GatorHunt305`
- **Password:** paste your **Personal Access Token** (not your GitHub password)

After that, your code will be at **https://github.com/GatorHunt305/Cursor-Project-Website-Design**.
