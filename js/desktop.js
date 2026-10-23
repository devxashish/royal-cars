/**
 * Royal Cars — Desktop Orchestration Script (Shadcn SaaS Style)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Fleet Category Filtering
  const filterChips = document.querySelectorAll('.filter-chip');
  const fleetGrid = document.getElementById('fleet-cards-grid');

  function renderFleetCards(category = 'all') {
    if (!fleetGrid) return;
    fleetGrid.innerHTML = '';

    const filtered = category === 'all' 
      ? FLEET_DATABASE 
      : FLEET_DATABASE.filter(car => car.category.toLowerCase() === category.toLowerCase());

    filtered.forEach(car => {
      const card = document.createElement('article');
      card.className = 'shadcn-car-card';
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${car.image}" alt="${car.name} - Royal Cars Hyderabad" loading="lazy" />
          <span class="card-badge-top">${car.badge}</span>
        </div>
        <div class="card-body-content">
          <div>
            <h3 class="car-title-heading">${car.name}</h3>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #f87171; text-transform: uppercase;">
              ${car.category} Fleet • Self Drive
            </span>
          </div>
          <div class="car-specs-pill-bar">
            <span>${car.seats}</span>
            <span>•</span>
            <span>${car.transmission}</span>
            <span>•</span>
            <span>${car.fuel}</span>
          </div>
          <p class="car-desc-text">${car.description}</p>
          <div class="card-action-footer">
            <div>
              <span class="card-price-value">₹${car.baseDailyRate.toLocaleString('en-IN')}</span>
              <span class="card-price-unit">per day (excl. fuel)</span>
            </div>
            <button class="btn-shadcn-secondary select-car-btn" data-id="${car.id}" style="padding: 8px 14px; font-size: 0.82rem;">
              Estimate Tariff →
            </button>
          </div>
        </div>
      `;
      fleetGrid.appendChild(card);
    });

    // Attach click events to "Estimate Tariff"
    document.querySelectorAll('.select-car-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const carId = e.currentTarget.getAttribute('data-id');
        if (window.appCalculator) {
          window.appCalculator.setVehicle(carId);
          const carSelect = document.getElementById('calc-car-select');
          if (carSelect) carSelect.value = carId;
          
          const calcSection = document.getElementById('calculator');
          if (calcSection) {
            calcSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderFleetCards(chip.getAttribute('data-category'));
    });
  });

  renderFleetCards('all');

  // 2. Interactive Calculator Binding
  const carSelect = document.getElementById('calc-car-select');
  const daysSlider = document.getElementById('calc-days-slider');
  const daysDisplay = document.getElementById('calc-days-display');
  const pickupInput = document.getElementById('calc-pickup-date');
  const returnInput = document.getElementById('calc-return-date');
  const doorstepToggle = document.getElementById('extra-doorstep');
  const zeroDepToggle = document.getElementById('extra-zerodep');

  if (carSelect) {
    carSelect.innerHTML = FLEET_DATABASE.map(car => 
      `<option value="${car.id}">${car.name} (${car.category}) — ₹${car.baseDailyRate.toLocaleString('en-IN')}/day</option>`
    ).join('');
    carSelect.value = 'suv-creta';
  }

  window.appCalculator = new PricingCalculator({
    initialVehicle: 'suv-creta',
    initialDays: 3,
    onUpdate: (res) => {
      const totalHero = document.getElementById('receipt-total-val');
      if (totalHero) totalHero.innerText = res.formattedTotal;

      const carName = document.getElementById('receipt-car-name');
      if (carName) carName.innerText = res.car.name;

      const carCategory = document.getElementById('receipt-car-category');
      if (carCategory) carCategory.innerText = `${res.car.category} • ${res.car.seats}`;

      const rateBreakdown = document.getElementById('receipt-rate-breakdown');
      if (rateBreakdown) {
        rateBreakdown.innerText = `₹${res.baseDailyRate.toLocaleString('en-IN')} × ${res.days} Day${res.days > 1 ? 's' : ''}`;
      }

      const discountRow = document.getElementById('receipt-discount-row');
      const discountVal = document.getElementById('receipt-discount-val');
      if (discountRow && discountVal) {
        if (res.discountAmount > 0) {
          discountRow.style.display = 'flex';
          discountVal.innerText = `-₹${res.discountAmount.toLocaleString('en-IN')} (${res.discountLabel})`;
        } else {
          discountRow.style.display = 'none';
        }
      }

      const kmRow = document.getElementById('receipt-km-val');
      if (kmRow) kmRow.innerText = `${res.totalKmIncluded} KM (${res.car.freeKmPerDay} KM/day)`;

      const deliveryRow = document.getElementById('receipt-delivery-row');
      if (deliveryRow) {
        deliveryRow.style.display = res.includeDoorstepDelivery ? 'flex' : 'none';
      }

      const zeroDepRow = document.getElementById('receipt-zerodep-row');
      if (zeroDepRow) {
        zeroDepRow.style.display = res.includeZeroDep ? 'flex' : 'none';
      }

      const waBtn = document.getElementById('receipt-whatsapp-link');
      if (waBtn) waBtn.href = res.whatsAppUrl;
    }
  });

  if (carSelect) {
    carSelect.addEventListener('change', (e) => {
      window.appCalculator.setVehicle(e.target.value);
    });
  }

  if (daysSlider && daysDisplay) {
    daysSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      daysDisplay.innerText = `${val} Day${val > 1 ? 's' : ''}`;
      window.appCalculator.setRentalDays(val);
      if (returnInput) returnInput.value = window.appCalculator.returnDate;
    });
  }

  if (pickupInput) {
    pickupInput.value = window.appCalculator.pickupDate;
    pickupInput.min = new Date().toISOString().split('T')[0];
    pickupInput.addEventListener('change', (e) => {
      window.appCalculator.setPickupDate(e.target.value);
      if (returnInput) returnInput.value = window.appCalculator.returnDate;
    });
  }

  if (returnInput) {
    returnInput.value = window.appCalculator.returnDate;
    returnInput.addEventListener('change', (e) => {
      window.appCalculator.setReturnDate(e.target.value);
      if (daysSlider) {
        daysSlider.value = window.appCalculator.rentalDays;
        daysDisplay.innerText = `${window.appCalculator.rentalDays} Day${window.appCalculator.rentalDays > 1 ? 's' : ''}`;
      }
    });
  }

  if (doorstepToggle) {
    doorstepToggle.addEventListener('click', () => {
      doorstepToggle.classList.toggle('active');
      window.appCalculator.toggleDoorstepDelivery();
    });
  }

  if (zeroDepToggle) {
    zeroDepToggle.addEventListener('click', () => {
      zeroDepToggle.classList.toggle('active');
      window.appCalculator.toggleZeroDep();
    });
  }

  // 3. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-shadcn-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-trigger-btn');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(f => f.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
});
