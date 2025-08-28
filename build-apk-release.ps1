# Clean old bundle & assets
Remove-Item -Recurse -Force "android/app/src/main/assets/index.android.bundle" -ErrorAction Ignore
Remove-Item -Recurse -Force "android/app/src/main/res/drawable-*" -ErrorAction Ignore
Remove-Item -Recurse -Force "android/app/src/main/res/raw" -ErrorAction Ignore

# Make assets folder if missing
if (!(Test-Path "android/app/src/main/assets")) {
    New-Item -ItemType Directory -Path "android/app/src/main/assets" | Out-Null
}

# Clear Metro + Gradle caches
npx react-native-clean-project --remove-iOS-build --remove-android-build --remove-npm-cache --remove-yarn-cache --remove-watchman-cache

# Bundle JS for Android
npx react-native bundle `
  --platform android `
  --dev false `
  --entry-file index.js `
  --bundle-output android/app/src/main/assets/index.android.bundle `
  --assets-dest android/app/src/main/res

# Build APK (Release)
cd android
./gradlew clean
./gradlew assembleRelease
cd ..

Write-Host "✅ Release APK generated at: android/app/build/outputs/apk/release/app-release.apk"
