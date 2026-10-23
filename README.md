# Royal Cars — Premium Self-Drive Car Rental Website
**Location**: Opposite D-Mart, Senore Colony / Aparna Senore Valley Villas area, Ambedkar Nagar / Shaikpet, Hyderabad, Telangana 500096  
**Phone**: +91 88012 56038 | **Email**: royalcarsrental@gmail.com  
**Google Maps**: [https://maps.app.goo.gl/QR3uc2cM3nbLBv82A](https://maps.app.goo.gl/QR3uc2cM3nbLBv82A)

---

## 1. Overview & Architecture

This project is a bespoke, production-quality digital web platform for **Royal Cars**, built according to anti-AI-slop design principles (Hallmark discipline) with high visual taste, confident editorial typography, and an interactive pricing estimation engine.

### Project Directory Structure
```
Royal-Cars/
├── index.html            # Dedicated 1440px+ luxury desktop experience
├── mobile.html           # Dedicated thumb-reach mobile experience (375px–414px)
├── css/
│   └── styles.css        # Shared OKLCH design system, tokens, typography & components
├── js/
│   ├── pricing.js        # Shared pricing engine & WhatsApp pre-filled message generator
│   ├── desktop.js        # Desktop GSAP ScrollTrigger orchestration, fleet filters, DOM binding
│   └── mobile.js         # Mobile drawer, filter scroller, and compact calculator
├── assets/               # High-res car imagery (car-1.jpg through car-5.jpg)
├── server.ps1            # Lightweight PowerShell web server for local testing
├── ANTIGRAVITY_PROMPT.md # Project reproduction prompt and technical specs
└── README.md             # Guide to running, configuring, and updating the site
```

---

## 2. How to Run Locally

### Using PowerShell Server
From the `Royal-Cars` directory, run:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then navigate in your web browser to:
- **Desktop View**: [http://localhost:4000/index.html](http://localhost:4000/index.html)
- **Mobile View**: [http://localhost:4000/mobile.html](http://localhost:4000/mobile.html)

### Using Python HTTP Server (Alternative)
```bash
python -m http.server 4000
```

---

## 3. Device Routing

The website employs client-side viewport detection:
- In `js/desktop.js`, if `window.innerWidth < 768px`, mobile visitors are seamlessly directed to `mobile.html`.
- Both `index.html` and `mobile.html` are independently accessible and feature reciprocal manual links in the header/footer to ensure testing flexibility.

---

## 4. How to Update Business Information

All business configuration and catalog items are centralized in `js/pricing.js`:

### A. Updating Phone, Email, Address, or Google Maps URL
Open `js/pricing.js` and edit the `ROYAL_CARS_CONFIG` object:
```javascript
const ROYAL_CARS_CONFIG = {
  phone: "+91 88012 56038",
  cleanPhone: "918801256038", // International format without '+' for WhatsApp API
  email: "royalcarsrental@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/QR3uc2cM3nbLBv82A",
  locationText: "Opposite D-Mart, Senore Colony / Aparna Senore Valley Villas, Shaikpet, Hyderabad, Telangana 500096",
  defaultVehicle: "suv-creta"
};
```

### B. Updating Fleet Inventory & Pricing
In `js/pricing.js`, edit the `FLEET_DATABASE` array. For each vehicle, you can update:
- `name`: Display name (e.g., `"Toyota Innova Crysta"`)
- `category`: `"Hatchback"`, `"Sedan"`, `"SUV"`, or `"Premium"`
- `baseDailyRate`: Base price per 24 hours (e.g., `4800`)
- `freeKmPerDay`: Included daily kilometers (e.g., `300`)
- `image`: Path to the image in `assets/`
- `description`: Automotive editorial summary

### C. Replacing Car Photography
Place your photography in `assets/` and update the `image` attribute in `FLEET_DATABASE` in `js/pricing.js`, or update `assets/car-5.jpg` / `assets/car-2.jpg` directly.

---

## 5. Connecting a Real Booking Backend Later

Currently, form and calculator actions open a customized, pre-filled WhatsApp enquiry link to the business dispatcher via:
```javascript
https://wa.me/918801256038?text=...
```
To connect a real booking backend (e.g. Supabase, Firebase, or Node.js REST API):
1. In `js/pricing.js`, modify `PricingCalculator.prototype.recalculate()` to emit an event or return JSON payload.
2. Replace the WhatsApp `<a>` tags or add a modal with standard `fetch('/api/bookings', { method: 'POST', body: JSON.stringify(bookingData) })`.

---

## 6. Hallmark & Truth Integrity Policy

- **No invented reviews**: Transparently shows verified public ratings (**4.4★** ~610 reviews on primary listing, **4.1★** 1,065 ratings on directory).
- **No fake inventory claims**: Demo fleet items are clearly labeled: *"Demo fleet preview — confirm real-time availability with Royal Cars."*
- **No AI slop**: Designed with tactile restraint, high typographic contrast, OKLCH perceptual color values, and fluid GSAP transitions.
