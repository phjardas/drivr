#!/bin/bash -e
if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "Deploying branch $TRAVIS_BRANCH to Firebase"
  node_modules/.bin/firebase deploy --token=${FIREBASE_API_TOKEN}
else
  echo "Skipping Firebase deployment of branch $TRAVIS_BRANCH"
fi
