#!/bin/bash -e

echo
echo "=== Deleting old publication"
rm -rf hosting
mkdir hosting
git worktree prune
rm -rf .git/worktrees/hosting/

echo
echo "=== Checking out hosting branch"
git worktree add -B hosting hosting origin/hosting

echo
echo "=== Updating files"
cp -r public/* hosting
cd hosting
git add --all
git commit -m "publish"

echo
echo "=== Publishing"
git push -u origin hosting
yarn --immutable --immutable-cache --inline-builds
yarn firebase deploy --token=${FIREBASE_API_TOKEN}
