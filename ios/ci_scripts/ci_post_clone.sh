#!/bin/sh
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "Node path:"
which node || true
node -v || true
npm -v || true

cd ../..

npm install

cd ios
pod install