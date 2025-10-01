#!/bin/bash

cd android && ./gradlew clean && cd .. 
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res 


cd android && ./gradlew assemblerelease
# cd android && ./gradlew bundlerelease

PROJECT_NAME=$(basename $(pwd))
DEST_DIR="$HOME/dashboard" 
mkdir -p "$DEST_DIR"
cp -R ./android/app/build/outputs/apk/release $DEST_DIR 