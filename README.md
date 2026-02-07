# Gunpla Collector App

A comprehensive mobile app for cataloging and managing your Gunpla (Gundam model kit) collection. Built with React Native and Expo for iOS and Android.

## Features

✨ **Core Features:**
- 📚 Browse complete catalog of Gunpla models
- 🔍 Multi-attribute search (grade, series, scale, year)
- 📦 Track build status (Unbuilt, Building, Completed)
- 📍 Location tracking (Home, Storage, Work, custom locations)
- 📸 Photo management for completed builds
- 📝 Notes for customization details
- ❤️ Wishlist with priority levels
- 📊 Detailed statistics and insights
- 📱 Barcode scanning for quick model entry
- 💰 Collection value tracking

## Prerequisites

Before you begin, you'll need:

1. **Node.js** (v16 or newer)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Expo CLI**
   - Install globally: `npm install -g expo-cli`

3. **Expo Go app** on your phone
   - iOS: Download from App Store
   - Android: Download from Google Play Store

4. **(Optional) For publishing:**
   - Apple Developer Account ($99/year) for iOS
   - Google Play Console ($25 one-time) for Android

## Installation

1. **Extract the app files** to a folder on your computer

2. **Open Terminal/Command Prompt** and navigate to the app folder:
   ```bash
   cd path/to/gunpla-collector
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the App (Development)

1. **Start the development server:**
   ```bash
   npm start
   ```
   
   This will open the Expo Developer Tools in your browser.

2. **Run on your phone:**
   - Open the **Expo Go** app on your phone
   - Scan the QR code shown in the terminal/browser
   - The app will load on your device

3. **Or run on simulators:**
   - For iOS (Mac only): Press `i` in the terminal
   - For Android: Press `a` in the terminal (requires Android Studio)

## Customizing the App

### Adding Your Own Gunpla Models

The sample data is in `/src/data/sampleData.js`. You can:

1. **Add models manually** by editing this file
2. **Import from a spreadsheet:**
   - Export your spreadsheet as JSON
   - Replace the `SAMPLE_GUNPLA_DATA` array

Each model should have this structure:
```javascript
{
  modelNumber: 'RX-78-2',
  name: 'RX-78-2 Gundam',
  series: 'Mobile Suit Gundam',
  grade: 'Master Grade',
  scale: '1/100',
  manufacturer: 'Bandai',
  releaseYear: 1995,
  price: 40.00,
  barcode: '4573102616234',
  description: 'The iconic original Gundam.',
}
```

### Changing Colors/Theme

Main color is defined in multiple places. Search for `#E53935` (the red color) and replace with your preferred color hex code.

### Changing the App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    ...
  }
}
```

## Publishing to App Stores

### Step 1: Create App Icons

You need these images in the `assets` folder:
- `icon.png` - 1024x1024px (main app icon)
- `splash.png` - 1284x2778px (loading screen)
- `adaptive-icon.png` - 1024x1024px (Android adaptive icon)

Use a tool like https://www.appicon.co/ to generate these.

### Step 2: Configure App Identifiers

Edit `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourname.gunplacollector"
    },
    "android": {
      "package": "com.yourname.gunplacollector"
    }
  }
}
```

Replace `yourname` with your name or company name (lowercase, no spaces).

### Step 3: Build the App

#### For iOS (requires Mac):

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure build:**
   ```bash
   eas build:configure
   ```

4. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

5. **Submit to App Store:**
   - You'll need an Apple Developer account
   - Follow the prompts to submit
   - Or use: `eas submit --platform ios`

#### For Android:

1. **Build APK/AAB:**
   ```bash
   eas build --platform android
   ```

2. **Download the build** when complete

3. **Submit to Google Play:**
   - Create a Google Play Console account
   - Create a new app listing
   - Upload the AAB file
   - Fill in required information
   - Submit for review

### Alternative: Expo's Build Service

If you don't have a Mac, you can use Expo's cloud build service:

```bash
# Build for both platforms
eas build --platform all
```

This builds in the cloud and provides download links.

## Common Issues & Solutions

### "Metro bundler error"
- Solution: Clear cache with `expo start -c`

### "Module not found"
- Solution: Delete `node_modules` and run `npm install` again

### Barcode scanner not working
- Make sure you've granted camera permissions
- Test on a real device (doesn't work in simulator)

### App crashes on startup
- Check that all dependencies are installed
- Try: `expo start -c` to clear cache

### Can't connect to development server
- Make sure phone and computer are on same WiFi
- Try typing IP address manually in Expo Go

## Updating the App

After making changes:

1. For development: Just save your files - app hot-reloads
2. For production: Build a new version with `eas build`

## Data Storage

- All data is stored locally on the device using AsyncStorage
- Data persists between app closes
- To backup: users would need to export/import (feature not yet implemented)
- Data is NOT synced across devices

## Support & Resources

- **Expo Documentation:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **Expo Forums:** https://forums.expo.dev/

## Future Enhancements

Possible features to add:
- Cloud sync across devices
- Social features (share builds)
- Price tracking and alerts
- Import from online retailers
- QR code generation for trades
- Export collection to PDF/Excel
- Backup and restore functionality

## License

This app is provided as-is for personal use. Gundam and Gunpla are trademarks of their respective owners.

---

## Quick Start Checklist

- [ ] Node.js installed
- [ ] Ran `npm install`
- [ ] Expo Go app on phone
- [ ] Ran `npm start`
- [ ] Scanned QR code with Expo Go
- [ ] App running successfully

Need help? The Expo community is very helpful on their forums!
