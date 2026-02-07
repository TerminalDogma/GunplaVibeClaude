# Troubleshooting Guide

Common issues and their solutions for the Gunpla Collector app.

---

## Installation Issues

### "npm: command not found"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Restart your computer if needed
4. Verify: `node --version`

---

### "npm install" fails with errors

**Problem:** Network issues or corrupted packages

**Solution:**
```bash
# Delete node_modules and try again
rm -rf node_modules
npm cache clean --force
npm install
```

---

### "Cannot find module 'expo'"

**Problem:** Dependencies not installed correctly

**Solution:**
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Then install project dependencies
npm install
```

---

## Running the App

### "Port 19000 is already in use"

**Problem:** Another instance of Expo is running

**Solution:**
```bash
# Close other terminal windows, then:
expo start -c

# Or kill the process:
# Mac/Linux:
lsof -ti:19000 | xargs kill -9

# Windows:
netstat -ano | findstr :19000
taskkill /PID <PID_NUMBER> /F
```

---

### QR code not showing

**Problem:** Network issues or expo-cli problems

**Solution:**
```bash
# Clear cache and restart
expo start -c

# Or try tunnel mode:
expo start --tunnel
```

---

### "Unable to connect to Metro"

**Problem:** Phone and computer on different networks

**Solution:**
1. Make sure phone and computer are on the SAME WiFi network
2. Disable VPN if you're using one
3. Try manually entering the IP address shown in terminal
4. Use tunnel mode: `expo start --tunnel`

---

### App loads but immediately crashes

**Problem:** JavaScript error in the code

**Solution:**
1. Check the terminal for error messages
2. Common causes:
   - Missing imports
   - Typo in file names
   - Navigation issues

3. Clear cache:
   ```bash
   expo start -c
   ```

4. Check you have all dependencies:
   ```bash
   npm install
   ```

---

## App Functionality Issues

### Barcode scanner not working

**Problem:** Camera permissions or simulator limitations

**Solutions:**
1. **Check permissions:**
   - Go to phone Settings → Apps → Gunpla Collector
   - Enable Camera permission

2. **Use a real device:**
   - Barcode scanner doesn't work in simulators
   - Must test on actual phone

3. **Lighting:**
   - Make sure there's enough light
   - Try the flashlight toggle in the app

---

### Photos not saving

**Problem:** Photo library permissions

**Solution:**
1. Go to phone Settings → Apps → Gunpla Collector
2. Enable Photo Library permission
3. Restart the app

---

### Data disappears after closing app

**Problem:** AsyncStorage not working properly

**Solution:**
```bash
# This is rare, but try:
expo start -c

# Or reinstall the app:
# Delete from phone
# Scan QR code again to reinstall
```

---

### Search not finding models

**Problem:** Model not in database or search issue

**Solutions:**
1. Check spelling
2. Try searching by model number instead of name
3. Clear any active filters
4. The model might not be in the sample database - add it manually

---

### Stats not updating

**Problem:** App needs to refresh data

**Solution:**
1. Navigate to another tab and back
2. Add or remove an item
3. Restart the app
4. The stats screen auto-updates when you focus on it

---

## Building & Deployment Issues

### "eas: command not found"

**Problem:** EAS CLI not installed

**Solution:**
```bash
npm install -g eas-cli
eas login
```

---

### Build fails with "Invalid bundle identifier"

**Problem:** Bundle ID formatting issue

**Solution:**
1. Open `app.json`
2. Check bundle ID format: `com.yourname.appname`
3. Use only lowercase letters, dots, and no spaces
4. Make sure it's unique (not used by another app)

---

### "Apple Developer credentials invalid"

**Problem:** Apple ID or password issue

**Solutions:**
1. Make sure you have an active Apple Developer account ($99/year)
2. If you have 2FA enabled, use an app-specific password:
   - Go to appleid.apple.com
   - Generate app-specific password
   - Use that instead of your regular password

---

### Android build fails

**Problem:** Various gradle or dependency issues

**Solution:**
```bash
# Try building with:
eas build --platform android --clear-cache

# Or update eas.json and set:
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

### "Build failed: Out of memory"

**Problem:** Build process needs more memory

**Solution:**
This is usually handled automatically by EAS. If persistent:
1. Try building again (sometimes it's temporary)
2. Contact Expo support
3. Use a smaller image for splash screen

---

## Performance Issues

### App is slow or laggy

**Solutions:**
1. **Reduce image sizes** if you've added photos
2. **Clear old data:**
   - Collection grows large over time
   - Export/backup then create a fresh install

3. **Restart device**
4. **Update Expo Go** to latest version

---

### App takes long to load

**Problem:** Development mode is slower

**Solutions:**
1. This is normal in development
2. Production builds are much faster
3. Reduce splash screen image size
4. Check your WiFi connection

---

## Data Management

### How to backup my collection

**Current Version:** No built-in backup

**Manual Backup:**
1. Data is in AsyncStorage on your device
2. Reinstalling the app WILL delete data
3. Future feature: export to JSON/CSV file

**For now:** Keep track separately or use screenshots

---

### How to transfer to new phone

**Option 1:** Start fresh and re-add models

**Option 2 (Advanced):**
If you're comfortable with code:
1. Export AsyncStorage data using a debug function
2. Save the JSON
3. Import on new device

This feature could be added to the app if needed.

---

### Accidentally deleted a model

**Problem:** No undo function currently

**Solution:**
- Re-add the model manually
- Future feature: trash/undo functionality

---

## Specific Error Messages

### "Invariant Violation: Element type is invalid"

**Problem:** Import/export issue in code

**Solution:**
1. Check all your `import` statements
2. Make sure component names match file names
3. Verify exports are correct: `export default`

---

### "undefined is not an object (evaluating 'navigation.navigate')"

**Problem:** Navigation not set up correctly

**Solution:**
1. Make sure screen is wrapped in navigation container
2. Check that navigation prop is being passed
3. Verify screen is registered in navigator

---

### "Network request failed"

**Problem:** Connection issue or CORS

**Solutions:**
1. Check internet connection
2. Try again (might be temporary)
3. If trying to fetch external data, check the URL
4. Use tunnel mode: `expo start --tunnel`

---

## Getting More Help

### Before Asking for Help

1. **Check error message carefully**
2. **Try clearing cache:** `expo start -c`
3. **Try reinstalling:** Delete app, `rm -rf node_modules`, `npm install`
4. **Google the error** - many are common
5. **Check Expo docs** for your specific issue

### Where to Get Help

1. **Expo Forums:** https://forums.expo.dev/
   - Very active community
   - Search first, then post
   - Include error messages and code

2. **Stack Overflow:** https://stackoverflow.com/
   - Tag with `react-native` and `expo`
   - Show what you've tried

3. **Expo Discord:** https://chat.expo.dev/
   - Real-time help
   - Great for quick questions

4. **GitHub Issues:**
   - For Expo bugs: https://github.com/expo/expo/issues
   - Search before creating new issue

### What to Include When Asking

1. **Exact error message** (screenshot or copy-paste)
2. **What you were doing** when error occurred
3. **What you've already tried**
4. **Your environment:**
   - Node version: `node --version`
   - Expo version: Check package.json
   - Phone OS: iOS or Android
   - Computer OS: Mac, Windows, Linux

### Example Good Question

```
Title: "Build failing with 'Invalid bundle identifier' error"

I'm trying to build my app for iOS using EAS but getting this error:
[paste error]

My setup:
- Node v18.17.0
- Expo SDK 50
- Mac OS Ventura

What I've tried:
1. Changed bundle ID to com.myname.gunplacollector
2. Cleared cache with --clear-cache
3. Deleted and reconfigured eas.json

App.json snippet:
[paste relevant code]

Any ideas what I'm missing?
```

---

## Prevention Tips

### To Avoid Common Issues

1. **Keep dependencies updated**
   ```bash
   npm update
   ```

2. **Test regularly** as you develop
   - Don't wait until deployment to test

3. **Use version control** (Git)
   - Can revert if something breaks
   - Track what changed

4. **Read error messages carefully**
   - They usually tell you what's wrong
   - Don't just click past them

5. **Back up your work**
   - Commit to Git regularly
   - Keep copy of working version

6. **Test on real devices**
   - Simulators don't show all issues
   - Test camera features on real phone

---

## Still Stuck?

If you've tried everything and still stuck:

1. **Start fresh:**
   ```bash
   # Create new project from scratch
   # Copy over your working code piece by piece
   ```

2. **Simplify:**
   - Comment out recent changes
   - Find what's causing the issue
   - Fix that specific thing

3. **Ask for help** (see "Where to Get Help" above)

Remember: Everyone gets stuck sometimes. The Expo community is very helpful!
