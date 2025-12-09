/**
 * TattooCrate Client Configuration
 *
 * Instructions:
 * 1. Edit the values below to match your parlor's branding.
 * 2. Upload your logo to the 'assets' folder and update the 'logoUrl' path.
 * 3. Choose your mode: 'online' for website embedding, 'kiosk' for in-store tablets.
 */

window.TATTOO_CRATE_CONFIG = {
  // --- Branding ---
  parlorName: "TattooCrate Studio", // Your Shop Name
  tagline: "AI Powered Ink Design", // Your Slogan
  logoUrl: "", // e.g., "assets/logo.png". If empty, displays text.

  // --- Visuals ---
  theme: {
    // The main accent color (Buttons, Highlights). Default Gold: #fbbf24
    accentColor: "#fbbf24",
    // The background color. Default Dark Blue: #0f172a
    backgroundColor: "#0f172a",
  },

  // --- Operation Mode ---
  // 'full'   = Standard mode (Settings, Upgrades enabled). For Owner/Artist use.
  // 'kiosk'  = In-store client mode. Hides Upgrades/Settings. Optimized for walk-ins.
  // 'online' = Website mode. Hides system settings.
  mode: "full",

  // --- External Links ---
  // Leave empty to hide.
  links: {
    website: "https://your-parlor.com",
    instagram: "https://instagram.com/your-parlor",
    booking: "https://your-booking-link.com"
  },

  // --- Legal ---
  // If true, shows the generic waiver before design generation
  requireWaiver: false,
};
