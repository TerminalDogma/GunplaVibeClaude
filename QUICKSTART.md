# Quick Start Guide - Gunpla Collector

## For Complete Beginners

### What You're About to Do:
1. Install some free software on your computer
2. Download this app to your phone
3. Start using it!

---

## Step 1: Install Node.js (5 minutes)

**What is Node.js?** It's software that lets you run this app on your computer.

1. Go to https://nodejs.org/
2. Click the big green button that says "Download"
3. Run the installer
4. Click "Next" through all the steps
5. Restart your computer

**Test it worked:**
- Windows: Open "Command Prompt" (search for it)
- Mac: Open "Terminal" (search for it in Spotlight)
- Type: `node --version`
- You should see a version number like `v18.17.0`

---

## Step 2: Install Expo CLI (2 minutes)

**What is Expo?** It's the tool that puts your app on your phone.

In the same Command Prompt/Terminal window:

```bash
npm install -g expo-cli
```

Wait for it to finish (might take a minute).

---

## Step 3: Get Expo Go on Your Phone (1 minute)

- **iPhone:** Open App Store, search "Expo Go", install it
- **Android:** Open Play Store, search "Expo Go", install it

---

## Step 4: Set Up The App (3 minutes)

1. **Extract the app files** somewhere easy to find (like your Desktop)

2. **Open Command Prompt/Terminal again**

3. **Navigate to the app folder:**
   - Windows: `cd C:\Users\YourName\Desktop\gunpla-collector`
   - Mac: `cd ~/Desktop/gunpla-collector`
   
   (Replace the path with where you put the files)

4. **Install the app's dependencies:**
   ```bash
   npm install
   ```
   
   This will take 2-3 minutes. You'll see a progress bar.

---

## Step 5: Start The App! (1 minute)

1. **In the same terminal, type:**
   ```bash
   npm start
   ```

2. **A QR code will appear** (might take 10-20 seconds)

3. **On your phone:**
   - **iPhone:** Open Camera app, point at QR code, tap notification
   - **Android:** Open Expo Go app, tap "Scan QR Code", scan it

4. **Wait 10-20 seconds** - the app will load on your phone!

---

## You're Done! 🎉

The app is now running on your phone. You can:
- Browse Gunpla models
- Add them to your collection
- Track your build progress
- Create a wishlist
- See statistics

---

## Tips:

- **Keep the terminal open** while using the app
- Your phone and computer must be on the **same WiFi**
- Changes you make save on your phone
- Close terminal when done (press Ctrl+C first)

---

## Next Time You Want To Use It:

1. Open Terminal/Command Prompt
2. Navigate to the folder: `cd path/to/gunpla-collector`
3. Run: `npm start`
4. Scan QR code with Expo Go

---

## If Something Goes Wrong:

### "Cannot find module..."
```bash
npm install
```

### "Port 19000 already in use"
Close any other terminal windows, then try again.

### Can't scan QR code
1. Make sure phone and computer are on same WiFi
2. In Expo Go, manually enter the URL shown in terminal

### App won't load
Try:
```bash
expo start -c
```
(The `-c` clears the cache)

---

## Getting Help:

- **Expo Community:** https://forums.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- Post your error message on the Expo forums - people are helpful!

---

## Want to Add Your Own Models?

See the main README.md file, section "Adding Your Own Gunpla Models"
