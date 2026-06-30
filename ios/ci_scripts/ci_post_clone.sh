#!/bin/sh
set -e

echo "Running pod install..."
cd "$(dirname "$0")/.."
pod install