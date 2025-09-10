const express = require('express');
const path = require('path');
const app = express();
const PORT = 80; // Poort 80 voor directe toegang zonder poortnummer

// Serve static files from the 'app/build/outputs/apk/debug' directory
app.use('/apk', express.static(path.join(__dirname, 'app/build/outputs/apk/debug')));

// Serve the download page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/src/main/assets/download.html'));
});

// Serve the APK file at the custom path
app.get('/app-debug.apk', (req, res) => {
  const apkPath = path.join(__dirname, 'app/build/outputs/apk/debug/app-debug.apk');
  res.download(apkPath, 'app-debug.apk', (err) => {
    if (err) {
      console.error('Error downloading APK:', err);
      res.status(500).send('Error downloading APK');
    }
  });
});

// Extra route voor jouw aangepaste URL
app.get('/download.stefano/app-debug.apk', (req, res) => {
  const apkPath = path.join(__dirname, 'app/build/outputs/apk/debug/app-debug.apk');
  res.download(apkPath, 'app-debug.apk', (err) => {
    if (err) {
      console.error('Error downloading APK:', err);
      res.status(500).send('Error downloading APK');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost`);
  console.log(`Direct APK access at http://localhost/app-debug.apk`);
  console.log(`Custom URL access at http://localhost/download.stefano/app-debug.apk`);
});