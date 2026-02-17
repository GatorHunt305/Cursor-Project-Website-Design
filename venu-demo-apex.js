(function() {
  var totalBar = document.getElementById('apex-total-bar');
  var totalText = document.getElementById('apex-total-text');
  var chooseTimeBtn = document.getElementById('apex-choose-time-btn');
  var addonsToggle = document.getElementById('apex-addons-toggle');
  var addonsList = document.getElementById('apex-addons-list');
  var addonsWrap = addonsToggle && addonsToggle.closest('.apex-addons-wrap');
  var step1Section = document.getElementById('apex-step1-section');
  var step2Section = document.getElementById('apex-step2-section');
  var step3Section = document.getElementById('apex-step3-section');
  var successSection = document.getElementById('apex-success-section');
  var step1El = document.getElementById('apex-step-1');
  var step2El = document.getElementById('apex-step-2');
  var step3El = document.getElementById('apex-step-3');
  var calendarDaysEl = document.getElementById('apex-calendar-days');
  var calendarMonthEl = document.getElementById('apex-calendar-month');
  var calPrevBtn = document.getElementById('apex-cal-prev');
  var calNextBtn = document.getElementById('apex-cal-next');
  var timesWrap = document.getElementById('apex-times-wrap');
  var continueConfirmBtn = document.getElementById('apex-continue-confirm-btn');
  var confirmForm = document.getElementById('apex-confirm-form');
  var confirmBookingBtn = document.getElementById('apex-confirm-booking-btn');
  var addCalendarBtn = document.getElementById('apex-add-calendar-btn');
  var shareLinkBtn = document.getElementById('apex-share-link-btn');
  var successSummaryEl = document.getElementById('apex-success-summary');
  var successLinkDisplay = document.getElementById('apex-success-link-display');

  var state = {
    service: null,
    serviceName: null,
    servicePrice: 0,
    serviceDuration: null,
    vehicle: 'Sedan',
    vehicleAdd: 0,
    addons: [],
    currentStep: 1,
    calendarYear: 2026,
    calendarMonth: 1,
    selectedDay: null,
    selectedDateLabel: null,
    selectedTime: null
  };

  var UNAVAILABLE_DAYS = { 1: [], 2: [2,3,4,5,9,10,16,17], 3: [] };
  var DEMO_TODAY = { year: 2026, month: 2, day: 13 };
  var MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function getVehicleAdd() {
    var btn = document.querySelector('.apex-vehicle-btn.is-selected');
    return btn ? parseInt(btn.getAttribute('data-add') || '0', 10) : 0;
  }

  function getAddonsTotal() {
    var total = 0;
    document.querySelectorAll('.apex-addon-cb:checked').forEach(function(cb) {
      total += parseInt(cb.getAttribute('data-price') || '0', 10);
    });
    return total;
  }

  function getAddonsList() {
    var list = [];
    document.querySelectorAll('.apex-addon-cb:checked').forEach(function(cb) {
      list.push(cb.value);
    });
    return list;
  }

  function updateTotal() {
    var total = state.servicePrice + state.vehicleAdd + getAddonsTotal();
    state.addons = getAddonsList();

    if (!totalText || !chooseTimeBtn) return;

    if (!state.serviceName) {
      totalText.textContent = 'Select a service to continue';
      totalText.classList.remove('has-selection');
      chooseTimeBtn.disabled = true;
      return;
    }

    var parts = [state.serviceName];
    if (state.vehicleAdd > 0) parts.push(state.vehicle);
    parts = parts.concat(state.addons);
    totalText.textContent = 'Selected: ' + parts.join(' + ') + ' = $' + total;
    totalText.classList.add('has-selection');
    chooseTimeBtn.disabled = false;
  }

  function selectService(card) {
    document.querySelectorAll('.apex-service-card').forEach(function(c) { c.classList.remove('is-selected'); });
    if (card) {
      card.classList.add('is-selected');
      state.service = card;
      state.serviceName = card.getAttribute('data-service');
      state.servicePrice = parseInt(card.getAttribute('data-price') || '0', 10);
      state.serviceDuration = card.getAttribute('data-duration') || null;
    } else {
      state.service = null;
      state.serviceName = null;
      state.servicePrice = 0;
      state.serviceDuration = null;
    }
    updateTotal();
  }

  function selectVehicle(btn) {
    document.querySelectorAll('.apex-vehicle-btn').forEach(function(b) { b.classList.remove('is-selected'); });
    btn.classList.add('is-selected');
    state.vehicle = btn.getAttribute('data-vehicle');
    state.vehicleAdd = getVehicleAdd();
    updateTotal();
  }

  if (addonsToggle && addonsList && addonsWrap) {
    addonsToggle.addEventListener('click', function() {
      var open = addonsList.hidden;
      addonsList.hidden = !open;
      addonsToggle.setAttribute('aria-expanded', open);
      addonsWrap.classList.toggle('is-open', open);
    });
  }

  document.querySelectorAll('.apex-service-card').forEach(function(card) {
    card.addEventListener('click', function() {
      if (card.classList.contains('is-selected')) {
        selectService(null);
      } else {
        selectService(card);
      }
    });
  });

  document.querySelectorAll('.apex-vehicle-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { selectVehicle(btn); });
  });

  document.querySelectorAll('.apex-addon-cb').forEach(function(cb) {
    cb.addEventListener('change', updateTotal);
  });

  function getDaysInMonth(y, m) {
    return new Date(y, m, 0).getDate();
  }

  function renderCalendar() {
    if (!calendarDaysEl || !calendarMonthEl) return;
    var y = state.calendarYear;
    var m = state.calendarMonth;
    var firstDay = new Date(y, m - 1, 1).getDay();
    var daysInMonth = getDaysInMonth(y, m);
    var unavailable = UNAVAILABLE_DAYS[m] || [];
    var isTodayMonth = y === DEMO_TODAY.year && m === DEMO_TODAY.month;

    calendarMonthEl.textContent = MONTH_NAMES[m] + ' ' + y;

    var html = '';
    var i;
    for (i = 0; i < firstDay; i++) {
      html += '<span class="apex-calendar-day is-empty" aria-hidden="true"></span>';
    }
    for (i = 1; i <= daysInMonth; i++) {
      var isUnav = unavailable.indexOf(i) !== -1;
      var isToday = isTodayMonth && i === DEMO_TODAY.day;
      var selected = state.selectedDay === i && state.calendarMonth === m && state.calendarYear === y;
      var cls = 'apex-calendar-day';
      if (isUnav) cls += ' is-unavailable';
      if (isToday) cls += ' is-today';
      if (selected) cls += ' is-selected';
      var label = MONTH_NAMES[m] + ' ' + i + ', ' + y;
      html += '<button type="button" class="' + cls + '" data-day="' + i + '" aria-label="' + label + '" ' + (isUnav ? 'disabled' : '') + '>' + i + '</button>';
    }
    calendarDaysEl.innerHTML = html;

    calendarDaysEl.querySelectorAll('.apex-calendar-day:not(.is-empty):not(.is-unavailable)').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var day = parseInt(btn.getAttribute('data-day'), 10);
        state.selectedDay = day;
        state.selectedDateLabel = MONTH_NAMES[m] + ' ' + day + ', ' + y;
        document.querySelectorAll('.apex-calendar-day').forEach(function(b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        if (timesWrap) {
          timesWrap.hidden = false;
          state.selectedTime = null;
          document.querySelectorAll('.apex-time-slot:not(:disabled)').forEach(function(s) { s.classList.remove('is-selected'); });
          continueConfirmBtn.disabled = true;
        }
      });
    });
  }

  function goToStep2() {
    state.currentStep = 2;
    if (step2Section) step2Section.hidden = false;
    if (step1El) {
      step1El.classList.remove('is-current');
      step1El.classList.add('is-complete');
    }
    if (step2El) step2El.classList.add('is-current');
    step2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderCalendar();
  }

  chooseTimeBtn.addEventListener('click', function() {
    if (chooseTimeBtn.disabled) return;
    goToStep2();
  });

  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', function() {
      if (state.calendarMonth === 1) {
        state.calendarMonth = 12;
        state.calendarYear--;
      } else {
        state.calendarMonth--;
      }
      renderCalendar();
    });
  }
  if (calNextBtn) {
    calNextBtn.addEventListener('click', function() {
      if (state.calendarMonth === 12) {
        state.calendarMonth = 1;
        state.calendarYear++;
      } else {
        state.calendarMonth++;
      }
      renderCalendar();
    });
  }

  document.querySelectorAll('.apex-time-slot').forEach(function(slot) {
    if (slot.disabled) return;
    slot.addEventListener('click', function() {
      document.querySelectorAll('.apex-time-slot').forEach(function(s) { s.classList.remove('is-selected'); });
      slot.classList.add('is-selected');
      state.selectedTime = slot.getAttribute('data-time');
      if (continueConfirmBtn) continueConfirmBtn.disabled = false;
    });
  });

  function formatDateWithWeekday() {
    if (!state.selectedDay || !state.calendarMonth || !state.calendarYear) return state.selectedDateLabel || '—';
    var d = new Date(state.calendarYear, state.calendarMonth - 1, state.selectedDay);
    var weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    var month = MONTH_NAMES[state.calendarMonth];
    return weekday + ', ' + month + ' ' + state.selectedDay;
  }

  function getTotal() {
    return state.servicePrice + state.vehicleAdd + getAddonsTotal();
  }

  function goToStep3() {
    state.currentStep = 3;
    if (step2El) {
      step2El.classList.remove('is-current');
      step2El.classList.add('is-complete');
    }
    if (step3El) step3El.classList.add('is-current');
    if (step3Section) {
      step3Section.hidden = false;
      step3Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    updateSummaryCard();
    updateSmsBubble1();
  }

  function updateSummaryCard() {
    var serviceEl = document.getElementById('apex-summary-service');
    var vehicleEl = document.getElementById('apex-summary-vehicle');
    var addonsEl = document.getElementById('apex-summary-addons');
    var dateEl = document.getElementById('apex-summary-date');
    var timeEl = document.getElementById('apex-summary-time');
    var durationEl = document.getElementById('apex-summary-duration');
    var totalEl = document.getElementById('apex-summary-total');
    if (serviceEl) serviceEl.textContent = state.serviceName || '—';
    if (vehicleEl) vehicleEl.textContent = state.vehicleAdd > 0 ? state.vehicle + ' (+$' + state.vehicleAdd + ')' : (state.vehicle || '—');
    if (addonsEl) addonsEl.textContent = state.addons.length ? state.addons.join(', ') : 'None';
    if (dateEl) dateEl.textContent = formatDateWithWeekday();
    if (timeEl) timeEl.textContent = state.selectedTime || '—';
    if (durationEl) durationEl.textContent = state.serviceDuration ? '~' + state.serviceDuration : '—';
    if (totalEl) totalEl.textContent = '$' + getTotal();
  }

  function updateSmsBubble1() {
    var first = confirmForm && confirmForm.querySelector('[name="firstName"]');
    var addr = confirmForm && confirmForm.querySelector('[name="address"]');
    var bubble = document.getElementById('apex-sms-1');
    if (!bubble) return;
    var name = (first && first.value.trim()) ? first.value.trim() : '[Name]';
    var address = (addr && addr.value.trim()) ? addr.value.trim() : '[address]';
    var shortWeekday = '';
    var shortDate = '2/19';
    if (state.selectedDay && state.calendarMonth && state.calendarYear) {
      var d = new Date(state.calendarYear, state.calendarMonth - 1, state.selectedDay);
      shortWeekday = d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ';
      shortDate = state.calendarMonth + '/' + state.selectedDay;
    }
    var time = (state.selectedTime || '2:30 PM').replace(/\s*([AP]M)/i, function(_, m) { return m.toLowerCase(); });
    bubble.textContent = 'Hi ' + name + '! Your APEX Detail is confirmed for ' + shortWeekday + shortDate + ' at ' + time + '. We\'ll come to you at ' + address + '. Questions? Reply to this text. – APEX Mobile Detailing';
  }

  if (confirmForm) {
    confirmForm.addEventListener('input', function() {
      updateSmsBubble1();
      var loc = document.getElementById('apex-summary-location');
      var addr = confirmForm.querySelector('[name="address"]');
      if (loc && addr) loc.textContent = addr.value.trim() || 'Your address (entered above)';
    });
  }

  if (continueConfirmBtn) {
    continueConfirmBtn.addEventListener('click', function() {
      if (continueConfirmBtn.disabled) return;
      if (state.currentStep === 2 && state.selectedDateLabel && state.selectedTime) {
        goToStep3();
      }
    });
  }

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', function() {
      var firstName = confirmForm && confirmForm.querySelector('[name="firstName"]');
      var address = confirmForm && confirmForm.querySelector('[name="address"]');
      if (firstName && !firstName.value.trim()) {
        firstName.focus();
        return;
      }
      if (address && !address.value.trim()) {
        address.focus();
        return;
      }
      state.confirmedName = firstName ? firstName.value.trim() : '';
      state.confirmedAddress = address ? address.value.trim() : '';
      if (step3Section) step3Section.hidden = true;
      if (successSection) {
        successSection.hidden = false;
        successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (successSummaryEl) {
        var parts = [];
        parts.push(state.serviceName + ' · ' + formatDateWithWeekday() + ' at ' + state.selectedTime);
        if (state.serviceDuration) parts.push('Duration: ~' + state.serviceDuration);
        parts.push('Total: $' + getTotal());
        parts.push('Location: ' + (state.confirmedAddress || '—'));
        successSummaryEl.innerHTML = parts.map(function(p) { return '<p>' + p + '</p>'; }).join('');
      }
      if (successLinkDisplay) successLinkDisplay.textContent = 'venu.app/apex-detailing';
    });
  }

  if (addCalendarBtn) {
    addCalendarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var d = new Date(state.calendarYear, state.calendarMonth - 1, state.selectedDay);
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      var title = encodeURIComponent('APEX Mobile Detailing');
      var details = encodeURIComponent(state.serviceName + ' at ' + (state.confirmedAddress || ''));
      var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + title + '&dates=' + y + m + day + '/' + y + m + day + '&details=' + details;
      window.open(url, '_blank');
    });
  }

  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var url = 'https://venu.app/apex-detailing';
      if (navigator.share) {
        navigator.share({ title: 'APEX Mobile Detailing', url: url, text: 'Book your detail with APEX' }).catch(function() { copyAndShow(url); });
      } else {
        copyAndShow(url);
      }
    });
  }
  function copyAndShow(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        if (successLinkDisplay) successLinkDisplay.textContent = 'Link copied! ' + url;
      });
    } else if (successLinkDisplay) successLinkDisplay.textContent = url;
  }

  updateTotal();
  renderCalendar();
})();
