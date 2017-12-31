#!/bin/bash -e
if [ "$TRAVIS_BRANCH" == "master" -a "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo "Deploying branch $TRAVIS_BRANCH to Firebase"
  npm run firebase -- deploy --token=${FIREBASE_API_TOKEN}
else
  echo "Skipping Firebase deployment of branch $TRAVIS_BRANCH"
fi
