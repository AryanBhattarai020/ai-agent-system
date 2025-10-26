# Building Android APK for AI Agent App

This guide will help you convert the AI Agent website into an Android APK that you can install on your phone.

## Prerequisites

### 1. Install Required Software

#### a) Node.js (Already installed ✓)
You already have Node.js installed.

#### b) Android Studio
1. Download Android Studio from: https://developer.android.com/studio
2. Install Android Studio
3. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (optional, for testing)
4. Open Android Studio and complete the setup wizard

#### c) Java Development Kit (JDK)
- Android Studio usually includes JDK
- If not, download JDK 11 or later from: https://adoptium.net/

### 2. Set Up Environment Variables

Add these to your system environment variables (Windows):

1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Add/Update these variables:

```
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Android\Android Studio\jbr
```

5. Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

6. **Restart your terminal/PowerShell after setting environment variables**

### 3. Verify Installation

Open a NEW PowerShell window and run:

```powershell
java -version
adb --version
```

Both commands should work without errors.

---

## Step-by-Step Build Process

### Step 1: Generate App Icons (IMPORTANT!)

Before building, you need to generate app icons:

1. **Option A (Easiest):** Open `generate-icons.html` in your web browser
   - Double-click the file `generate-icons.html`
   - Click "Download All Icons" button
   - Save each icon to the `public/icons/` folder with the correct names

2. **Option B:** Use an online tool like https://favicon.io/favicon-generator/
   - Create icons with "AI" text
   - Download all sizes: 72, 96, 128, 144, 152, 192, 384, 512
   - Name them as `icon-{size}x{size}.png` (e.g., `icon-512x512.png`)
   - Place in `public/icons/` folder

### Step 2: Sync Web Assets to Android

Run this command to copy your web files to the Android project:

```powershell
npx cap sync
```

This copies everything from the `public` folder to the Android project.

### Step 3: Open Android Project

Open the Android project in Android Studio:

```powershell
npx cap open android
```

This will launch Android Studio with your project.

### Step 4: Build APK in Android Studio

#### Option A: Build from Android Studio (Recommended for first-time)

1. Wait for Android Studio to finish syncing/indexing (check bottom status bar)
2. In the menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Wait for the build to complete (this may take 5-10 minutes the first time)
4. When done, click "locate" in the notification to find your APK
5. The APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

#### Option B: Build from Command Line (Faster after first build)

```powershell
cd android
.\gradlew assembleDebug
cd ..
```

The APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

Or use the npm script:
```powershell
npm run cap:build:apk
```

### Step 5: Install APK on Your Phone

#### Method 1: Via USB Cable (Recommended)

1. Enable Developer Options on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect your phone to your computer via USB

3. Allow USB debugging when prompted on your phone

4. Install the APK:
```powershell
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

If you get "already exists" error:
```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

#### Method 2: Transfer APK File

1. Copy `android\app\build\outputs\apk\debug\app-debug.apk` to your phone
   - Via USB cable: Copy to phone's Download folder
   - Via cloud: Upload to Google Drive/Dropbox and download on phone
   - Via email: Email it to yourself

2. On your phone:
   - Open the APK file
   - Allow "Install from Unknown Sources" if prompted
   - Tap "Install"

---

## Connecting to Your Backend

The app needs to connect to your Express backend. You have two options:

### Option 1: Use the Settings in the App

1. Launch the app
2. Tap the ⚙ Settings button
3. Enter your computer's local IP address: `http://192.168.x.x:3000`
4. Save

To find your computer's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network connection (usually starts with 192.168.x.x)

### Option 2: Configure Before Building

Edit `public/index.html` and change the API_BASE default value (around line 237):

```javascript
let API_BASE = 'http://YOUR_COMPUTER_IP:3000';
```

Then rebuild:
```powershell
npx cap sync
npm run cap:build:apk
```

---

## Troubleshooting

### "JAVA_HOME is not set"
- Make sure you set the JAVA_HOME environment variable
- Restart your terminal/PowerShell
- Verify with: `echo $env:JAVA_HOME`

### "SDK location not found"
Create a file `android/local.properties` with:
```
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

### "Gradle build failed"
1. Open Android Studio
2. Let it download/update any SDK components
3. Try building from Android Studio first
4. Then try command line

### "Unable to locate adb"
- Make sure Android SDK platform-tools is installed
- Add to PATH: `%ANDROID_HOME%\platform-tools`
- Restart terminal

### "Build tools not found"
In Android Studio:
1. Go to Tools → SDK Manager
2. Click "SDK Tools" tab
3. Check "Android SDK Build-Tools"
4. Click "Apply"

### App installs but won't connect to backend
- Make sure your phone and computer are on the same WiFi network
- Check Windows Firewall allows connections on port 3000
- Test the backend URL in your phone's browser first: `http://192.168.x.x:3000`
- Start your Express server: `npm start`

---

## Building a Release APK (for distribution)

The debug APK works fine for personal use. For a production release:

### 1. Generate a Keystore

```powershell
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Gradle

Edit `android/app/build.gradle` and add signing config.

### 3. Build Release APK

```powershell
cd android
.\gradlew assembleRelease
```

The release APK will be at: `android\app\build\outputs\apk\release\app-release.apk`

---

## Quick Reference Commands

```powershell
# Sync web assets to Android
npx cap sync

# Open in Android Studio
npx cap open android

# Build APK (debug)
npm run cap:build:apk

# Install on connected phone
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Check connected devices
adb devices

# Start Express backend
npm start
```

---

## Testing Your App

1. Make sure your Express server is running:
   ```powershell
   npm start
   ```

2. Make sure your phone can reach your server:
   - Open browser on phone
   - Visit `http://YOUR_COMPUTER_IP:3000`
   - You should see the web interface

3. Launch the AI Agent app on your phone

4. Configure the API URL in Settings if needed

5. Start chatting!

---

## Next Steps

- The app is now fully responsive for mobile
- Safe area insets are handled for notched phones
- Touch targets are optimized for fingers
- The app works offline for the UI, but needs network to connect to your backend

**Important Notes:**
- The DEBUG APK is for testing only
- The backend server must be running on your computer
- Your phone and computer must be on the same network
- For production use, consider hosting your backend on a cloud server

---

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Make sure all prerequisites are installed
3. Verify environment variables are set correctly
4. Try building from Android Studio first before command line
5. Check Android Studio's Build output for specific errors

Good luck! 🚀
