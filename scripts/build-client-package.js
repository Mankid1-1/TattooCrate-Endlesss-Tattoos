
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log("📦 Starting Client Package Build...");

// 1. Build the App
console.log("⚙️  Running 'npm run build'...");
try {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (e) {
    console.error("❌ Build failed.", e);
    process.exit(1);
}

// 2. Prepare Output Directory
const outputDir = path.join(rootDir, 'tattoocrate-client-package');
const distDir = path.join(rootDir, 'dist');

if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir);

// 3. Copy Build Artifacts
console.log("📂 Copying build files...");
try {
    fs.cpSync(distDir, path.join(outputDir, 'app'), { recursive: true });
} catch (e) {
    console.error("❌ Failed to copy dist folder.", e);
    process.exit(1);
}

// 4. Create Assets Folder
const assetsDir = path.join(outputDir, 'app', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

// 5. Ensure Config is Editable
// Move client-config.js to the root of the package for easy access,
// and update index.html to point to it if needed?
// Actually, keeping it in the app root is fine, but let's copy it to the package root
// and instruct them to replace the one in app/ or symlink it.
// Better: The deployment structure usually requires the config to be next to index.html.
// So 'app/client-config.js' is the one to edit.
// We will create a README that explains this.

// 6. Generate README_IMPLEMENTATION.md
const readmeContent = `# TattooCrate Client Implementation Guide

## Overview
This package contains the complete TattooCrate application ready for deployment on your website or in-store kiosks.

## Directory Structure
- \`app/\`: This folder contains the web application. Upload the contents of this folder to your web server.
- \`app/client-config.js\`: **The most important file.** Edit this to customize your parlor's branding.
- \`app/assets/\`: Place your logo and other images here.

## 1. Customization (Branding)

Open \`app/client-config.js\` in any text editor (Notepad, TextEdit, VS Code).

### Basic Settings
Change the \`parlorName\` and \`tagline\` to match your business.

\`\`\`javascript
parlorName: "My Tattoo Shop",
tagline: "Custom Ink & Art",
\`\`\`

### Logo
1. Save your logo (PNG or JPG) into the \`app/assets/\` folder.
2. Update the config:
\`\`\`javascript
logoUrl: "assets/my-logo.png",
\`\`\`

### Colors (Theme)
Update the hex codes for your brand colors.
- \`accentColor\`: Used for buttons and highlights (default Gold).
- \`backgroundColor\`: The main app background (Dark colors recommended).

## 2. Modes (Online vs Kiosk)

You can configure the app behavior using the \`mode\` setting in \`client-config.js\`.

- **'online'**: Use this for your website. It hides system settings but allows users to explore.
- **'kiosk'**: Use this for in-store tablets. It hides "Go Pro" buttons and other external distractions.
- **'full'**: Standard mode (includes admin settings).

## 3. Deployment

### For Website (Online)
1. Upload the entire contents of the \`app/\` folder to your web host (e.g., public_html/designer).
2. The app will be available at \`yourwebsite.com/designer\`.

### For In-Store Kiosk (iPad/Tablet)
1. You can host it locally or use the online link.
2. Open the link in a fullscreen browser (like Kiosk Pro or Add to Home Screen on iOS).

## 4. Updates
If you receive a new version of TattooCrate, simply replace the files in \`app/\` EXCEPT for your \`client-config.js\` and \`assets/\` folder.

---
**Powered by TattooCrate**
`;

fs.writeFileSync(path.join(outputDir, 'README_IMPLEMENTATION.md'), readmeContent);

console.log(`
✅ Package created successfully at: ${outputDir}
   - app/ (Deploy this folder)
   - README_IMPLEMENTATION.md (Read this first)
`);
