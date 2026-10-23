# Antigravity Reproduction Prompt: Royal Cars Premium Automotive Rental

## System Prompt Context & Guidelines
This document captures the prompt and engineering instructions used to generate the production-quality **Royal Cars** self-drive rental platform for Shaikpet, Hyderabad.

### Objective
Create a distinctive, editorial automotive rental platform for Royal Cars that avoids all common AI website clichés (no purple-to-blue gradients, no floating decorative blobs, no card-in-card nesting, no invented testimonials or claims).

### Key Architectural Constraints
1. **Art Direction & Design System**:
   - Genre: Editorial Automotive Luxury
   - Macrostructure: `Split Studio` diptych
   - Color Palette: Deep Obsidian (`oklch(14% 0.008 45)`), Warm Alabaster Ink (`oklch(96% 0.006 80)`), Champagne Gold Accent (`oklch(76% 0.13 78)` strictly <= 3% area).
   - Typography: `Syne` Display + `Playfair Display` + `Plus Jakarta Sans` Body + `Space Grotesk` Tabular Numerals.
   - Headings are upright roman only (no italic headers).
2. **True Business Data**:
   - Business: Royal Cars
   - Location: Opposite D-Mart, Senore Colony / Aparna Senore Valley Villas area, Ambedkar Nagar / Shaikpet, Hyderabad, Telangana 500096
   - Direct Telephone: +91 88012 56038
   - Email: royalcarsrental@gmail.com
   - Google Maps: https://maps.app.goo.gl/QR3uc2cM3nbLBv82A
   - Public Ratings: 4.4 ★ on primary listing (~610 reviews), 4.1 ★ on local directory (1,065 ratings).
3. **Core Interactive Features**:
   - Dynamic interactive tariff calculator with duration slider (1 to 30 days) and automatic multi-day discounts (5% for 3+ days, 12% for 7+ days, 20% for 15+ days).
   - Dual interface: `index.html` (1440px desktop) and `mobile.html` (375px thumb reach with sticky action dock).
   - Instant pre-filled WhatsApp enquiry link generation with vehicle name, dates, and calculated estimate.
   - Smooth GSAP ScrollTrigger transitions with strict `prefers-reduced-motion` fallbacks.
