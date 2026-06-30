#!/bin/sh
set -e

echo "Installing Node.js..."
brew install node

echo "Node version:"
node -v
npm -v

cd ..
npm install

cd ios
pod install