# Deployment Guide - Publishing Your App

This guide will help you publish your Gunpla Collector app to the Apple App Store and Google Play Store.

## Overview

**Time Required:** 2-4 hours (first time)  
**Cost:** 
- Apple App Store: $99/year
- Google Play Store: $25 (one-time)

**What You'll Need:**
- A Mac computer (for iOS builds) OR use Expo's cloud service
- Apple Developer Account (for iOS)
- Google Play Console Account (for Android)
- App icons and screenshots

---

## Phase 1: Prepare Your App

### 1.1 Create App Icons

You need three icon files in the `assets` folder:

**icon.png** (1024x1024px)
- Main app icon
- No transparency
- No rounded corners (Apple/Google add them)

**splash.png** (1284x2778px)
- Shows while app loads
- Can use your logo centered on a solid background

**adaptive-icon.png** (1024x1024px) - Android only
- Keep important content in center 768x768px area

**Free Tools:**
- Canva: https://www.canva.com/
- Figma: https://www.figma.com/
- App Icon Generator: https://www.appicon.co/

**Design Tips:**
- Use the Gundam/Gunpla theme
- Keep it simple and recognizable
- Test at small sizes (it'll be tiny on phones)

### 1.2 Update App Information

Edit `app.json`:

```json
{
  "expo": {
    "name": "Gunpla Collector",
    "slug": "gunpla-collector",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.gunplacollector",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourname.gunplacollector",
      "versionCode": 1
    }
  }
}
```

**Important:**
- Replace `yourname` with your name/company (lowercase, no spaces)
- The bundle ID must be unique (can't use someone else's)
- Use reverse domain format: com.yourname.appname

### 1.3 Test Thoroughly

Before publishing, test:
- ✅ All features work
- ✅ App doesn't crash
- ✅ Works on different screen sizes
- ✅ Barcode scanner works
- ✅ Data saves and loads correctly
- ✅ No spelling errors

---

## Phase 2: Set Up Accounts

### 2.1 Apple Developer Account (for iOS)

1. **Go to:** https://developer.apple.com/programs/enroll/
2. **Sign in** with your Apple ID
3. **Choose:** Individual or Organization
4. **Pay:** $99/year (required)
5. **Wait:** Approval takes 24-48 hours

**You'll receive:**
- Access to App Store Connect
- Ability to publish iOS apps
- Certificates and provisioning profiles

### 2.2 Google Play Console (for Android)

1. **Go to:** https://play.google.com/console/signup
2. **Sign in** with a Google account
3. **Pay:** $25 one-time registration fee
4. **Fill out:** Developer account information
5. **Wait:** Approval takes a few hours

**You'll receive:**
- Access to Play Console
- Ability to publish Android apps

---

## Phase 3: Build Your App

### Option A: Using EAS (Expo Application Services) - Recommended

This is the easiest way and works even if you don't have a Mac.

#### 3.1 Install EAS CLI

```bash
npm install -g eas-cli
```

#### 3.2 Login to Expo

```bash
eas login
```

Create a free Expo account if you don't have one.

#### 3.3 Configure Your Project

```bash
eas build:configure
```

This creates an `eas.json` file. Just accept the defaults.

#### 3.4 Build for iOS

```bash
eas build --platform ios
```

**What happens:**
- You'll be asked to login to your Apple Developer account
- Expo builds your app in the cloud (takes 10-20 minutes)
- You get a link to download the .ipa file

**First time?** You'll need to:
- Generate certificates (EAS can do this automatically)
- Create an App Store listing in App Store Connect

#### 3.5 Build for Android

```bash
eas build --platform android
```

**What happens:**
- Expo builds an .aab file (Android App Bundle)
- Takes 10-15 minutes
- You get a download link

**First time?** EAS will:
- Generate a keystore (keep this safe!)
- Build the app bundle

#### 3.6 Submit Your Builds

**For iOS:**
```bash
eas submit --platform ios
```

Follow the prompts. You'll need your Apple ID credentials.

**For Android:**
- Download the .aab file from the build
- Upload it manually to Play Console (see Phase 4)

### Option B: Local Builds (Advanced)

Only if you have specific requirements or want more control.

**For iOS (requires Mac):**
```bash
expo build:ios
```

**For Android:**
```bash
expo build:android
```

---

## Phase 4: Create Store Listings

### 4.1 App Store Connect (iOS)

1. **Go to:** https://appstoreconnect.apple.com/
2. **Click:** "My Apps" → "+" → "New App"
3. **Fill in:**
   - App Name: "Gunpla Collector"
   - Primary Language: English
   - Bundle ID: (select the one you created)
   - SKU: gunpla-collector-001

4. **App Information:**
   - Category: Utilities or Lifestyle
   - Content Rights: You own the rights
   - Age Rating: 4+

5. **Prepare for Submission:**
   - Screenshots: Take 3-5 screenshots on iPhone (use simulator)
   - App Preview: Optional video
   - Description: Write what the app does
   - Keywords: gunpla, gundam, collection, model kits
   - Support URL: Your email or website
   - Privacy Policy: Required (see template below)

6. **Upload Build:**
   - Select the build from EAS
   - Add version info
   - Submit for review

7. **Wait:** Review takes 1-3 days

### 4.2 Google Play Console (Android)

1. **Go to:** https://play.google.com/console/
2. **Click:** "Create app"
3. **Fill in:**
   - App name: "Gunpla Collector"
   - Default language: English
   - App or game: App
   - Free or paid: Free

4. **Complete All Sections:**

   **Store Listing:**
   - Short description (80 chars max)
   - Full description (4000 chars max)
   - App icon (512x512px)
   - Feature graphic (1024x500px)
   - Screenshots (2-8 images, different screen sizes)
   - Category: Lifestyle
   - Tags: hobby, collection, models

   **Content Rating:**
   - Complete questionnaire
   - Will likely be rated "Everyone"

   **Target Audience:**
   - Age range: 13+

   **Privacy Policy:**
   - URL to your privacy policy (see template below)

   **App Content:**
   - Complete all declarations

5. **Upload Your App:**
   - Go to "Release" → "Production"
   - Upload the .aab file from EAS
   - Fill in release notes
   - Submit for review

6. **Wait:** Review takes 1-7 days

---

## Phase 5: Privacy Policy

Both stores require a privacy policy. Here's a simple template:

```markdown
# Privacy Policy for Gunpla Collector

Last updated: [DATE]

## Data Collection
Gunpla Collector does not collect, store, or transmit any personal data. All your collection data is stored locally on your device.

## Information We Don't Collect
- Personal information
- Location data
- Usage analytics
- Advertising data

## Camera Access
The app requests camera access only for barcode scanning. No photos are stored or transmitted outside your device.

## Photo Library Access
The app may request access to your photo library to let you add photos of your models. Photos are stored only on your device.

## Data Storage
All data is stored locally on your device using the device's secure storage. Your data is never transmitted to external servers.

## Contact
For questions about this privacy policy, contact: [YOUR EMAIL]
```

**Where to host it:**
- GitHub Pages (free)
- Your website
- Google Docs (set to public, get shareable link)
- Medium or other blogging platform

---

## Phase 6: After Approval

### Celebrate! 🎉

Your app is live! Now what?

1. **Test the live version** - Download from store and test
2. **Ask friends/family** to test and review
3. **Monitor reviews** - Respond to user feedback
4. **Plan updates** - Fix bugs, add features

### Updating Your App

When you make changes:

1. **Update version number** in `app.json`:
   ```json
   "version": "1.1.0",
   "ios": { "buildNumber": "2" },
   "android": { "versionCode": 2 }
   ```

2. **Build again:**
   ```bash
   eas build --platform all
   ```

3. **Submit update** to stores

**Version Numbering:**
- 1.0.0 → 1.0.1: Bug fixes
- 1.0.0 → 1.1.0: New features
- 1.0.0 → 2.0.0: Major changes

---

## Troubleshooting

### "Bundle identifier already in use"
- Someone else used that ID
- Change it in app.json to something unique

### "Invalid bundle"
- Check that all icons are correct size
- Verify bundle ID matches exactly

### "Missing compliance"
- Add this to app.json:
  ```json
  "ios": {
    "config": {
      "usesNonExemptEncryption": false
    }
  }
  ```

### Build fails
- Check error message carefully
- Common issues:
  - Wrong Node.js version (use v16 or v18)
  - Network timeout (try again)
  - Invalid app.json syntax

### "App rejected"
- Read rejection carefully
- Common reasons:
  - Missing privacy policy
  - Crashes during review
  - Incomplete app information
- Fix issues and resubmit

---

## Costs Summary

**First Year:**
- Apple Developer: $99
- Google Play: $25
- Expo (optional): Free tier is fine
- **Total: ~$124**

**Each Year After:**
- Apple Developer: $99
- Google Play: $0
- **Total: ~$99**

---

## Tips for Success

1. **Test extensively** before submitting
2. **Write clear descriptions** - help users find your app
3. **Good screenshots** - show the app in action
4. **Respond to reviews** - build a community
5. **Update regularly** - fix bugs, add features
6. **Be patient** - reviews can take time

---

## Resources

- **Expo Docs:** https://docs.expo.dev/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Play Store Policies:** https://play.google.com/about/developer-content-policy/
- **Expo Forums:** https://forums.expo.dev/

---

## Need Help?

- Post in Expo forums with your error messages
- Check StackOverflow for common issues
- Expo Discord is very active and helpful

Good luck with your app launch! 🚀
