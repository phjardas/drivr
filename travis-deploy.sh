#!/bin/bash -e
if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "Deploying branch $TRAVIS_BRANCH to Firebase"
  npm run firebase -- deploy --only=hosting --token=${FIREBASE_API_TOKEN}
else
  echo "Skipping Firebase deployment of branch $TRAVIS_BRANCH"
fi
