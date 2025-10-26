# Android APK Build Checklist ✅

Print this or keep it open while building your APK!

---

## ☑️ BEFORE YOU START

- [ ] Android Studio installed
- [ ] Environment variables set (ANDROID_HOME, JAVA_HOME)
- [ ] Terminal/PowerShell restarted after env variables
- [ ] Verified with: `java -version` and `adb --version`

---

## ☑️ STEP 1: ICONS

- [ ] Open `generate-icons.html` in browser
- [ ] Click "Download All Icons"
- [ ] Save all 8 icons to `public/icons/` folder:
  - [ ] icon-72x72.png
  - [ ] icon-96x96.png
  - [ ] icon-128x128.png
  - [ ] icon-144x144.png
  - [ ] icon-152x152.png
  - [ ] icon-192x192.png
  - [ ] icon-384x384.png
  - [ ] icon-512x512.png

---

## ☑️ STEP 2: SYNC

- [ ] Run: `npx cap sync`
- [ ] Wait for success message
- [ ] Verify android folder was updated

---

## ☑️ STEP 3: BUILD

### Option A: Android Studio (Recommended first time)
- [ ] Run: `npx cap open android`
- [ ] Wait for Android Studio to open and sync
- [ ] Wait for indexing to complete (bottom right status bar)
- [ ] Click: Build → Build Bundle(s) / APK(s) → Build APK(s)
- [ ] Wait 5-10 minutes for first build
- [ ] Click "locate" in notification when done

### Option B: Command Line (Faster)
- [ ] Run: `npm run cap:build:apk`
- [ ] Wait for build to complete
- [ ] APK at: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## ☑️ STEP 4: INSTALL

### Method 1: USB Cable
- [ ] Enable USB debugging on phone
  - [ ] Go to Settings → About Phone
  - [ ] Tap Build Number 7 times
  - [ ] Go to Settings → Developer Options
  - [ ] Enable USB Debugging
- [ ] Connect phone via USB
- [ ] Allow debugging on phone when prompted
- [ ] Run: `adb install android\app\build\outputs\apk\debug\app-debug.apk`
- [ ] Or: `adb install -r android\app\build\outputs\apk\debug\app-debug.apk` (if already installed)

### Method 2: Manual Transfer
- [ ] Copy APK to phone (USB/Cloud/Email)
- [ ] Open APK file on phone
- [ ] Allow "Install from Unknown Sources"
- [ ] Tap Install

---

## ☑️ STEP 5: CONFIGURE

- [ ] Start backend: `npm start`
- [ ] Find your IP: `ipconfig` (look for IPv4 like 192.168.x.x)
- [ ] Write down your IP: ________________
- [ ] Open AI Agent app on phone
- [ ] Tap Settings ⚙
- [ ] Enter: `http://YOUR_IP:3000`
- [ ] Save settings
- [ ] Test by sending a message!

---

## ☑️ VERIFICATION

- [ ] App installs without errors
- [ ] App opens and shows UI
- [ ] Settings icon works
- [ ] Theme toggle works
- [ ] Backend URL configured
- [ ] Phone and PC on same WiFi
- [ ] Backend server running
- [ ] Message sends successfully
- [ ] Response received from AI

---

## 🚨 IF SOMETHING FAILS

| Problem | Solution |
|---------|----------|
| Icons missing | Use `generate-icons.html` to create them |
| Build fails | Open `BUILD-ANDROID-APK.md` → Troubleshooting |
| Can't install APK | Enable USB debugging or use manual transfer |
| App won't connect | Check same WiFi, correct IP, firewall, server running |
| "JAVA_HOME not set" | Set environment variable, restart terminal |
| "SDK not found" | Create `android/local.properties` file |

---

## 📚 NEED MORE HELP?

- **Quick Guide:** QUICKSTART.md
- **Full Guide:** BUILD-ANDROID-APK.md  
- **What Changed:** CHANGES-SUMMARY.md
- **Project Docs:** README.md

---

## ✅ DONE!

- [ ] APK built successfully
- [ ] Installed on phone
- [ ] Backend configured
- [ ] Tested and working
- [ ] Celebrate! 🎉

---

**Pro Tip:** After the first build, subsequent builds are much faster! You can rebuild with just:
```
npx cap sync
npm run cap:build:apk
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```
