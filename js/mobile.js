/**
 * Royal Cars — Mobile Dedicated Interaction Script
 * Swipe handling, compact calculator binding, bottom action dock
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Render Mobile Fleet Horizontal Scroller / Cards
  const mobileFleetGrid = document.getElementById('mobile-fleet-list');
  const mobilePills = document.querySelectorAll('.mobile-filter-pill');

  function renderMobileFleet(category = 'all') {
    if (!mobileFleetGrid) return;
    mobileFleetGrid.innerHTML = '';

    const filtered = category === 'all' 
      ? FLEET_DATABASE 
      : FLEET_DATABASE.filter(car => car.category.toLowerCase() === category.toLowerCase());

    filtered.forEach(car => {
      const card = document.createElement('div');
      card.className = 'mobile-car-card';
      card.innerHTML = `
        <div class="mobile-card-img">
          <img src="${car.image}" alt="${car.name} - Royal Cars" loading="lazy" />
          <span class="mobile-card-badge">${car.badge}</span>
        </div>
        <div class="mobile-card-content">
          <div class="mobile-card-title-row">
            <h4>${car.name}</h4>
            <span class="mobile-tariff-tag">₹${car.baseDailyRate.toLocaleString('en-IN')}<small>/day</small></span>
          </div>
          <div class="mobile-specs-chip-row">
            <span>${car.seats}</span>
            <span>•</span>
            <span>${car.transmission}</span>
            <span>•</span>
            <span>${car.fuel}</span>
          </div>
          <p class="mobile-car-desc">${car.description}</p>
          <button class="cta-button-primary mobile-select-btn" data-id="${car.id}" style="width: 100%; justify-content: center; padding: 10px 0; margin-top: 8px;">
            Select for Quote →
          </button>
        </div>
      `;
      mobileFleetGrid.appendChild(card);
    });

    // Attach click for mobile selection
    document.querySelectorAll('.mobile-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (window.mobileCalculator) {
          window.mobileCalculator.setVehicle(id);
          const carSel = document.getElementById('m-calc-car-select');
          if (carSel) carSel.value = id;

          const calcEl = document.getElementById('mobile-calculator');
          if (calcEl) {
            calcEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  mobilePills.forEach(pill => {
    pill.addEventListener('click', () => {
      mobilePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderMobileFleet(pill.getAttribute('data-category'));
    });
  });

  renderMobileFleet('all');

  // 3. Compact Mobile Pricing Calculator
  const mCarSelect = document.getElementById('m-calc-car-select');
  const mDaysRange = document.getElementById('m-calc-days-slider');
  const mDaysLabel = document.getElementById('m-calc-days-num');
  const mPickup = document.getElementById('m-calc-pickup');
  const mReturn = document.getElementById('m-calc-return');
  const mDoorstepToggle = document.getElementById('m-doorstep-toggle');
  const mZeroDepToggle = document.getElementById('m-zerodep-toggle');

  if (mCarSelect) {
    mCarSelect.innerHTML = FLEET_DATABASE.map(car => 
      `<option value="${car.id}">${car.name} (₹${car.baseDailyRate.toLocaleString('en-IN')}/day)</option>`
    ).join('');
    mCarSelect.value = 'suv-creta';
  }

  window.mobileCalculator = new PricingCalculator({
    initialVehicle: 'suv-creta',
    initialDays: 3,
    onUpdate: (res) => {
      const mTotal = document.getElementById('m-calc-total-hero');
      if (mTotal) mTotal.innerText = res.formattedTotal;

      const mCarSummary = document.getElementById('m-calc-car-summary');
      if (mCarSummary) mCarSummary.innerText = `${res.car.name} (${res.days} Days)`;

      const mRate = document.getElementById('m-calc-rate-row');
      if (mRate) mRate.innerText = `₹${res.baseDailyRate.toLocaleString('en-IN')} × ${res.days} Days`;

      const mDiscountRow = document.getElementById('m-calc-discount-row');
      const mDiscountVal = document.getElementById('m-calc-discount-val');
      if (mDiscountRow && mDiscountVal) {
        if (res.discountAmount > 0) {
          mDiscountRow.style.display = 'flex';
          mDiscountVal.innerText = `-₹${res.discountAmount.toLocaleString('en-IN')}`;
        } else {
          mDiscountRow.style.display = 'none';
        }
      }

      const mDeliveryRow = document.getElementById('m-calc-delivery-row');
      if (mDeliveryRow) {
        mDeliveryRow.style.display = res.includeDoorstepDelivery ? 'flex' : 'none';
      }

      const mZeroDepRow = document.getElementById('m-calc-zerodep-row');
      if (mZeroDepRow) {
        mZeroDepRow.style.display = res.includeZeroDep ? 'flex' : 'none';
      }

      const mWhatsApp = document.getElementById('m-whatsapp-book-btn');
      if (mWhatsApp) mWhatsApp.href = res.whatsAppUrl;
    }
  });

  if (mCarSelect) {
    mCarSelect.addEventListener('change', (e) => {
      window.mobileCalculator.setVehicle(e.target.value);
    });
  }

  if (mDaysRange && mDaysLabel) {
    mDaysRange.addEventListener('input', (e) => {
      const val = e.target.value;
      mDaysLabel.innerText = `${val} Day${val > 1 ? 's' : ''}`;
      window.mobileCalculator.setRentalDays(val);
      if (mReturn) mReturn.value = window.mobileCalculator.returnDate;
    });
  }

  if (mPickup) {
    mPickup.value = window.mobileCalculator.pickupDate;
    mPickup.min = new Date().toISOString().split('T')[0];
    mPickup.addEventListener('change', (e) => {
      window.mobileCalculator.setPickupDate(e.target.value);
      if (mReturn) mReturn.value = window.mobileCalculator.returnDate;
    });
  }

  if (mReturn) {
    mReturn.value = window.mobileCalculator.returnDate;
    mReturn.addEventListener('change', (e) => {
      window.mobileCalculator.setReturnDate(e.target.value);
      if (mDaysRange) {
        mDaysRange.value = window.mobileCalculator.rentalDays;
        mDaysLabel.innerText = `${window.mobileCalculator.rentalDays} Day${window.mobileCalculator.rentalDays > 1 ? 's' : ''}`;
      }
    });
  }

  if (mDoorstepToggle) {
    mDoorstepToggle.addEventListener('click', () => {
      mDoorstepToggle.classList.toggle('active');
      window.mobileCalculator.toggleDoorstepDelivery();
    });
  }

  if (mZeroDepToggle) {
    mZeroDepToggle.addEventListener('click', () => {
      mZeroDepToggle.classList.toggle('active');
      window.mobileCalculator.toggleZeroDep();
    });
  }

  // 4. Mobile FAQ Collapsible
  const mFaqs = document.querySelectorAll('.m-faq-item');
  mFaqs.forEach(faq => {
    const trigger = faq.querySelector('.m-faq-q');
    trigger.addEventListener('click', () => {
      const isAct = faq.classList.contains('active');
      mFaqs.forEach(f => f.classList.remove('active'));
      if (!isAct) faq.classList.add('active');
    });
  });
});
