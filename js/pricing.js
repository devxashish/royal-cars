/**
 * Royal Cars — Pricing & WhatsApp Flow Engine
 * Location: Shaikpet, Hyderabad | Phone: +91 88012 56038
 */

const ROYAL_CARS_CONFIG = {
  phone: "+91 88012 56038",
  cleanPhone: "918801256038",
  email: "royalcarsrental@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/QR3uc2cM3nbLBv82A",
  locationText: "Opposite D-Mart, Senore Colony / Aparna Senore Valley Villas, Shaikpet, Hyderabad, Telangana 500096",
  defaultVehicle: "suv-creta"
};

const FLEET_DATABASE = [
  {
    id: "hatch-polo",
    name: "Volkswagen Polo GT / Swift Sport",
    category: "Hatchback",
    badge: "Agile City Drive",
    baseDailyRate: 1999,
    freeKmPerDay: 250,
    seats: "5 Seater",
    transmission: "Manual / DSG",
    fuel: "Turbo Petrol",
    image: "assets/hatchback_city.jpg",
    description: "Responsive European dynamics and tight turning radius tailored for Jubilee Hills and Hitech City."
  },
  {
    id: "sedan-luxury",
    name: "Mercedes-Benz E/S-Class & BMW 5",
    category: "Sedan",
    badge: "Executive High-Stature",
    baseDailyRate: 6500,
    freeKmPerDay: 250,
    seats: "5 Seater",
    transmission: "9G-Tronic AT",
    fuel: "Twin-Turbo Diesel",
    image: "assets/sedan_luxury.jpg",
    description: "Whisper-quiet cabin acoustics, sovereign ride poise, and high corporate presence for Hyderabad executives."
  },
  {
    id: "suv-creta",
    name: "Range Rover Sport & Creta SX",
    category: "SUV",
    badge: "Commanding Flagship",
    baseDailyRate: 4800,
    freeKmPerDay: 300,
    seats: "5 Seater",
    transmission: "Automatic AWD",
    fuel: "TwinPower Turbo",
    image: "assets/hero_suv.jpg",
    description: "Dominant road stance, generous ground clearance, and panoramic prestige for Telangana highways and city avenues."
  },
  {
    id: "suv-innova",
    name: "Toyota Innova Crysta ZX",
    category: "SUV",
    badge: "Unrivaled Long-Distance",
    baseDailyRate: 4500,
    freeKmPerDay: 300,
    seats: "7 Seater Captain",
    transmission: "Automatic",
    fuel: "Diesel D-4D",
    image: "assets/innova_suv.jpg",
    description: "Supreme touring comfort, expansive luggage capacity, and captain seats for family journeys and airport transfers."
  },
  {
    id: "luxury-rolls",
    name: "Rolls-Royce Ghost / VIP Ceremonial",
    category: "Premium",
    badge: "Ultra Luxury / Wedding",
    baseDailyRate: 35000,
    freeKmPerDay: 150,
    seats: "4 Seater Lounge",
    transmission: "Satellite-Aided AT",
    fuel: "6.75L V12",
    image: "assets/car-1.jpg",
    description: "The zenith of automotive majesty for celebrity arrivals, grand weddings, and high-profile Hyderabad ceremonies."
  }
];

class PricingCalculator {
  constructor(options = {}) {
    this.selectedVehicleId = options.initialVehicle || "suv-creta";
    this.rentalDays = options.initialDays || 3;
    this.includeDoorstepDelivery = false;
    this.includeZeroDep = false;
    this.pickupDate = options.pickupDate || this.getTomorrowDateString();
    this.returnDate = options.returnDate || this.getDateAfterDays(3);

    this.onUpdate = options.onUpdate || (() => {});
    this.init();
  }

  getTomorrowDateString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  getDateAfterDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + 1 + days);
    return d.toISOString().split('T')[0];
  }

  init() {
    this.recalculate();
  }

  setVehicle(vehicleId) {
    const found = FLEET_DATABASE.find(v => v.id === vehicleId);
    if (found) {
      this.selectedVehicleId = vehicleId;
      this.recalculate();
    }
  }

  setRentalDays(days) {
    this.rentalDays = Math.max(1, Math.min(30, parseInt(days) || 1));
    this.updateReturnDateFromDays();
    this.recalculate();
  }

  setPickupDate(dateStr) {
    this.pickupDate = dateStr;
    this.updateReturnDateFromDays();
    this.recalculate();
  }

  setReturnDate(dateStr) {
    this.returnDate = dateStr;
    const p = new Date(this.pickupDate);
    const r = new Date(this.returnDate);
    const diffTime = r - p;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 1) {
      this.rentalDays = diffDays;
    }
    this.recalculate();
  }

  updateReturnDateFromDays() {
    if (!this.pickupDate) return;
    const p = new Date(this.pickupDate);
    p.setDate(p.getDate() + this.rentalDays);
    this.returnDate = p.toISOString().split('T')[0];
  }

  toggleDoorstepDelivery(val) {
    this.includeDoorstepDelivery = val !== undefined ? val : !this.includeDoorstepDelivery;
    this.recalculate();
  }

  toggleZeroDep(val) {
    this.includeZeroDep = val !== undefined ? val : !this.includeZeroDep;
    this.recalculate();
  }

  getCurrentVehicle() {
    return FLEET_DATABASE.find(v => v.id === this.selectedVehicleId) || FLEET_DATABASE[2];
  }

  recalculate() {
    const car = this.getCurrentVehicle();
    const days = this.rentalDays;
    const baseDaily = car.baseDailyRate;

    let discountPct = 0;
    let discountLabel = "Standard Tariff";
    if (days >= 15) {
      discountPct = 0.20;
      discountLabel = "20% Long-Stay Privilege Discount";
    } else if (days >= 7) {
      discountPct = 0.12;
      discountLabel = "12% Weekly Saver Discount";
    } else if (days >= 3) {
      discountPct = 0.05;
      discountLabel = "5% Multi-Day Booking Discount";
    }

    const subtotalRaw = baseDaily * days;
    const discountAmount = Math.round(subtotalRaw * discountPct);
    const vehicleTariff = subtotalRaw - discountAmount;

    const deliveryCharge = this.includeDoorstepDelivery ? 600 : 0;
    const zeroDepCharge = this.includeZeroDep ? (350 * days) : 0;

    const estimatedTotal = vehicleTariff + deliveryCharge + zeroDepCharge;
    const totalKmIncluded = car.freeKmPerDay * days;

    const result = {
      car,
      days,
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
      baseDailyRate: baseDaily,
      subtotalRaw,
      discountPct,
      discountLabel,
      discountAmount,
      vehicleTariff,
      includeDoorstepDelivery: this.includeDoorstepDelivery,
      deliveryCharge,
      includeZeroDep: this.includeZeroDep,
      zeroDepCharge,
      estimatedTotal,
      totalKmIncluded,
      formattedTotal: `₹${estimatedTotal.toLocaleString('en-IN')}`,
      formattedVehicleTariff: `₹${vehicleTariff.toLocaleString('en-IN')}`,
      whatsAppUrl: this.buildWhatsAppUrl(car, days, estimatedTotal)
    };

    this.onUpdate(result);
    return result;
  }

  buildWhatsAppUrl(car, days, total) {
    const text = 
`Hello Royal Cars Hyderabad,

I would like to enquire about a self-drive rental:
• Vehicle: ${car.name} (${car.category})
• Duration: ${days} Day${days > 1 ? 's' : ''} (${this.pickupDate} to ${this.returnDate})
• Delivery Preference: ${this.includeDoorstepDelivery ? 'Doorstep Delivery in Hyderabad' : 'Shaikpet Hub Pickup'}
• Estimated Total: ₹${total.toLocaleString('en-IN')}

Please let me know car availability and documentation details. Thank you!`;

    return `https://wa.me/${ROYAL_CARS_CONFIG.cleanPhone}?text=${encodeURIComponent(text)}`;
  }
}

if (typeof window !== 'undefined') {
  window.ROYAL_CARS_CONFIG = ROYAL_CARS_CONFIG;
  window.FLEET_DATABASE = FLEET_DATABASE;
  window.PricingCalculator = PricingCalculator;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROYAL_CARS_CONFIG, FLEET_DATABASE, PricingCalculator };
}
