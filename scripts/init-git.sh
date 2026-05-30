#!/usr/bin/env bash
set -euo pipefail

git init
git add .
git commit -m "Initial clean Astro build from Gemini prototype"

echo "Git repo initialized. Create a GitHub repo, then run:"
echo "git remote add origin <your-github-repo-url>"
echo "git branch -M main"
echo "git push -u origin main"
