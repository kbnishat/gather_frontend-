#!/bin/sh

set -eu

commit_message="${*:-Update application}"

npm run lint
npm run build

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to push."
  exit 0
fi

git add .
git commit -m "$commit_message"
git push origin "$(git branch --show-current)"

echo "Pushed successfully. GitHub Actions will deploy the site from this commit."