#!/bin/bash -e

echo "Deleting old publication"
rm -rf hosting
mkdir hosting
git worktree prune
rm -rf .git/worktrees/hosting/

echo "Checking out hosting branch"
git worktree add -B hosting hosting origin/hosting

echo "Updating files"
cp -r public/* hosting
cd hosting
git add --all
git commit -m "publish"
#git push -u origin hosting
