(function() {
  var depositWrap = document.getElementById('lumiere-deposit-wrap');
  var depositAmountEl = document.getElementById('lumiere-deposit-amount');
  var totalText = document.getElementById('lumiere-total-text');
  var selectTimeBtn = document.getElementById('lumiere-select-time-btn');
  var addonsToggle = document.getElementById('lumiere-addons-toggle');
  var addonsList = document.getElementById('lumiere-addons-list');
  var addonsWrap = addonsToggle && addonsToggle.closest('.lumiere-addons-wrap');
  var scheduleSection = document.getElementById('lumiere-schedule-section');
  var summaryBarText = document.getElementById('lumiere-summary-bar-text');
  var calendarDaysEl = document.getElementById('lumiere-calendar-days');
  var calendarMonthEl = document.getElementById('lumiere-calendar-month');
  var timesWrap = document.getElementById('lumiere-times-wrap');
  var durationNote = document.getElementById('lumiere-duration-note');
  var cancelCard = document.getElementById('lumiere-cancel-card');
  var cancelDeadline = document.getElementById('lumiere-cancel-deadline');
  var cancelDeposit = document.getElementById('lumiere-cancel-deposit');
  var continuePaymentBtn = document.getElementById('lumiere-continue-payment-btn');
  var totalBarBtn = document.getElementById('lumiere-select-time-btn');
  var paymentSection = document.getElementById('lumiere-payment-section');
  var paymentForm = document.getElementById('lumiere-payment-form');
  var payBtn = document.getElementById('lumiere-pay-btn');
  var payBtnText = payBtn && payBtn.querySelector('.lumiere-pay-btn-text');
  var successSection = document.getElementById('lumiere-success-section');
  var successConfetti = document.getElementById('lumiere-success-confetti');
  var totalBar = document.getElementById('lumiere-total-bar');

  var MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DEMO_TODAY = { year: 2026, month: 2, day: 17 };

  var state = {
    service: null,
    serviceName: null,
    servicePrice: 0,
    serviceDuration: null,
    addons: [],
    currentStep: 1,
    calendarYear: 2026,
    calendarMonth: 2,
    selectedDay: null,
    selectedDateLabel: null,
    selectedTime: null,
    selectedTimeMinutes: null
  };

  function getDeposit(price) {
    if (price < 100) return 15;
    if (price < 200) return 25;
    return 50;
  }

  function getAddonsTotal() {
    var total = 0;
    document.querySelectorAll('.lumiere-addon-cb:checked').forEach(function(cb) {
      total += parseInt(cb.getAttribute('data-price') || '0', 10);
    });
    return total;
  }

  function getAddonsList() {
    var list = [];
    document.querySelectorAll('.lumiere-addon-cb:checked').forEach(function(cb) {
      list.push(cb.value);
    });
    return list;
  }

  function updateUI() {
    state.addons = getAddonsList();
    var addonsTotal = getAddonsTotal();
    var total = state.servicePrice + addonsTotal;
    var deposit = state.service ? getDeposit(state.servicePrice) : 0;
    var balance = total - deposit;

    if (depositWrap) depositWrap.hidden = !state.service;
    if (depositAmountEl && state.service) depositAmountEl.textContent = '$' + deposit;

    if (!totalText || !selectTimeBtn) return;

    if (!state.serviceName) {
      totalText.textContent = 'Select a service to continue';
      totalText.classList.remove('has-selection');
      selectTimeBtn.disabled = true;
      return;
    }

    var parts = [state.serviceName, 'Deposit: $' + deposit, 'Balance at appointment: $' + balance];
    totalText.textContent = parts.join('  |  ');
    totalText.classList.add('has-selection');
    selectTimeBtn.disabled = false;
  }

  function selectService(row) {
    document.querySelectorAll('.lumiere-service-row').forEach(function(r) { r.classList.remove('is-selected'); });
    if (row) {
      row.classList.add('is-selected');
      state.service = row;
      state.serviceName = row.getAttribute('data-service');
      state.servicePrice = parseInt(row.getAttribute('data-price') || '0', 10);
      state.serviceDuration = row.getAttribute('data-duration') || null;
    } else {
      state.service = null;
      state.serviceName = null;
      state.servicePrice = 0;
      state.serviceDuration = null;
    }
    updateUI();
  }

  function getTotal() {
    return state.servicePrice + getAddonsTotal();
  }

  function updateSummaryBar() {
    if (!summaryBarText || !state.serviceName) return;
    var total = getTotal();
    var deposit = getDeposit(state.servicePrice);
    var duration = state.serviceDuration || '—';
    summaryBarText.textContent = state.serviceName + '  •  ' + duration + '  •  $' + total + ' total  •  $' + deposit + ' deposit due at next step';
  }

  function goToSchedule() {
    state.currentStep = 2;
    if (scheduleSection) {
      scheduleSection.hidden = false;
      scheduleSection.classList.add('lumiere-step-enter');
      scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    updateSummaryBar();
    renderCalendar();
    if (timesWrap) timesWrap.hidden = true;
    if (durationNote) durationNote.hidden = true;
    if (cancelCard) cancelCard.hidden = true;
    if (continuePaymentBtn) continuePaymentBtn.disabled = true;
    state.selectedDay = null;
    state.selectedTime = null;
  }

  function getDaysInMonth(y, m) {
    return new Date(y, m, 0).getDate();
  }

  function renderCalendar() {
    if (!calendarDaysEl || !calendarMonthEl) return;
    var y = state.calendarYear;
    var m = state.calendarMonth;
    var firstDay = new Date(y, m - 1, 1).getDay();
    var daysInMonth = getDaysInMonth(y, m);
    var isTodayMonth = y === DEMO_TODAY.year && m === DEMO_TODAY.month;
    var startOnMonday = (firstDay + 6) % 7;
    calendarMonthEl.textContent = MONTH_NAMES[m] + ' ' + y;
    var html = '';
    var i;
    for (i = 0; i < startOnMonday; i++) {
      html += '<span class="lumiere-calendar-day is-empty" aria-hidden="true"></span>';
    }
    for (i = 1; i <= daysInMonth; i++) {
      var isSunday = new Date(y, m - 1, i).getDay() === 0;
      var isToday = isTodayMonth && i === DEMO_TODAY.day;
      var selected = state.selectedDay === i && state.calendarMonth === m && state.calendarYear === y;
      var cls = 'lumiere-calendar-day';
      if (isSunday) cls += ' is-closed';
      else if (isToday) cls += ' is-today';
      else cls += ' is-available';
      if (selected) cls += ' is-selected';
      var label = MONTH_NAMES[m] + ' ' + i + ', ' + y;
      var content = isSunday ? 'Closed' : i;
      if (isSunday) {
        html += '<button type="button" class="' + cls + '" aria-label="' + label + ' (Closed)" disabled>' + content + '</button>';
      } else if (isToday) {
        html += '<button type="button" class="' + cls + '" aria-label="Today - Call to book same-day" disabled><span class="lumiere-day-num">' + i + '</span></button>';
      } else {
        html += '<button type="button" class="' + cls + '" data-day="' + i + '" aria-label="' + label + '"><span class="lumiere-day-num">' + i + '</span></button>';
      }
    }
    calendarDaysEl.innerHTML = html;
    calendarDaysEl.querySelectorAll('.lumiere-calendar-day[data-day]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var day = parseInt(btn.getAttribute('data-day'), 10);
        state.selectedDay = day;
        state.selectedDateLabel = MONTH_NAMES[m] + ' ' + day + ', ' + y;
        document.querySelectorAll('.lumiere-calendar-day').forEach(function(b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        if (timesWrap) {
          timesWrap.hidden = false;
          state.selectedTime = null;
          document.querySelectorAll('.lumiere-time-row:not(:disabled)').forEach(function(r) { r.classList.remove('is-selected'); });
          if (durationNote) durationNote.hidden = true;
          if (cancelCard) cancelCard.hidden = true;
          if (continuePaymentBtn) continuePaymentBtn.disabled = true;
        }
      });
    });
  }

  function formatTimeEnd(minutes, durationStr) {
    var match = durationStr && durationStr.match(/(\d+\.?\d*)\s*(hr|min|hrs?)/i);
    var addMin = 60;
    if (match) addMin = match[2].toLowerCase().indexOf('hr') !== -1 ? parseFloat(match[1], 10) * 60 : parseInt(match[1], 10);
    var endMin = minutes + addMin;
    var h = Math.floor(endMin / 60);
    var m = endMin % 60;
    var ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  function formatCancellationDeadline(day, month, year, timeStr) {
    var d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    var weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    var mon = d.toLocaleDateString('en-US', { month: 'short' });
    return weekday + ', ' + mon + ' ' + d.getDate() + ' at ' + (timeStr || '2:00 PM');
  }

  function formatShortDate(day, month, year) {
    var d = new Date(year, month - 1, day);
    var w = d.toLocaleDateString('en-US', { weekday: 'short' });
    var m = d.toLocaleDateString('en-US', { month: 'short' });
    return w + ' ' + m + ' ' + d.getDate() + ', ' + year;
  }

  function formatDeadlineShort(day, month, year, timeStr) {
    var d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    var w = d.toLocaleDateString('en-US', { weekday: 'short' });
    var m = d.toLocaleDateString('en-US', { month: 'short' });
    return w + ' ' + m + ' ' + d.getDate() + ' • ' + (timeStr || '2:00 PM');
  }

  function populatePaymentUI() {
    var deposit = getDeposit(state.servicePrice);
    var total = getTotal();
    var balance = total - deposit;
    var timeStr = state.selectedTime || '2:00 PM';
    var endTime = formatTimeEnd(state.selectedTimeMinutes != null ? state.selectedTimeMinutes : 840, state.serviceDuration);
    var day = state.selectedDay;
    var month = state.calendarMonth;
    var year = state.calendarYear;
    var subheadEl = document.getElementById('lumiere-payment-subhead');
    var apptDayName = day ? new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '';
    if (subheadEl) {
      subheadEl.textContent = 'A $' + deposit + ' deposit confirms your ' + (state.serviceName || '') + ' appointment on ' + apptDayName + ' at ' + timeStr + '.';
    }
    var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
    set('lumiere-confirm-service', state.serviceName || '');
    set('lumiere-confirm-date', day ? formatShortDate(day, month, year) : '');
    set('lumiere-confirm-time', timeStr + ' — ~' + endTime);
    set('lumiere-confirm-duration', state.serviceDuration || '');
    set('lumiere-confirm-total', '$' + total + '.00');
    set('lumiere-confirm-deposit', '$' + deposit + '.00');
    set('lumiere-confirm-balance', '$' + balance + '.00');
    set('lumiere-confirm-deadline', day ? formatDeadlineShort(day, month, year, timeStr) : '');
    var printEl = document.getElementById('lumiere-confirm-print');
    if (printEl) printEl.textContent = 'Deposits are processed securely via Stripe. Your $' + deposit + ' will be applied to your $' + total + ' service total.';
    if (payBtnText) payBtnText.textContent = 'Pay $' + deposit + ' Deposit';
  }

  function goToPayment() {
    if (scheduleSection) scheduleSection.hidden = true;
    if (totalBar) totalBar.hidden = true;
    if (paymentSection) {
      paymentSection.hidden = false;
      paymentSection.classList.add('lumiere-step-enter');
      populatePaymentUI();
      var smsConsent = document.getElementById('lumiere-sms-consent');
      if (payBtn && smsConsent) payBtn.disabled = !smsConsent.checked;
      paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function addConfetti() {
    if (!successConfetti) return;
    var colors = ['is-gold', 'is-cream'];
    for (var i = 0; i < 14; i++) {
      var p = document.createElement('span');
      p.className = 'lumiere-confetti-particle ' + colors[i % 2];
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      p.style.setProperty('--delay', (Math.random() * 0.3) + 's');
      successConfetti.appendChild(p);
    }
  }

  function showSuccess() {
    var deposit = getDeposit(state.servicePrice);
    var total = getTotal();
    var balance = total - deposit;
    var timeStr = state.selectedTime || '2:00 PM';
    var day = state.selectedDay;
    var month = state.calendarMonth;
    var year = state.calendarYear;
    var deadlineStr = day ? formatDeadlineShort(day, month, year, timeStr) : '';
    var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
    set('lumiere-success-service', state.serviceName || '');
    set('lumiere-success-date', day ? formatShortDate(day, month, year).replace(', ' + year, '') : '');
    set('lumiere-success-time', timeStr);
    set('lumiere-success-deposit', '$' + deposit);
    set('lumiere-success-balance', '$' + balance);
    set('lumiere-success-deadline', deadlineStr ? deadlineStr.replace(/^[A-Za-z]+\s+/, '').replace(' • ', ' at ') : '');
    if (paymentSection) paymentSection.hidden = true;
    addConfetti();
    if (successSection) {
      successSection.hidden = false;
      successSection.classList.add('lumiere-step-enter');
      successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    var calLink = document.getElementById('lumiere-success-calendar');
    if (calLink && day) {
      var d = new Date(year, month - 1, day);
      var hour = 14;
      var min = 0;
      var match = (state.selectedTime || '').match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        hour = parseInt(match[1], 10);
        min = parseInt(match[2], 10) || 0;
        if ((match[3] || '').toUpperCase() === 'PM' && hour < 12) hour += 12;
        if ((match[3] || '').toUpperCase() === 'AM' && hour === 12) hour = 0;
      }
      d.setHours(hour, min, 0, 0);
      var durMs = (state.serviceDuration && state.serviceDuration.indexOf('hr') !== -1) ? parseFloat(state.serviceDuration) * 60 * 60 * 1000 : 60 * 60 * 1000;
      var end = new Date(d.getTime() + durMs);
      var title = encodeURIComponent((state.serviceName || 'Appointment') + ' at Lumière Hair Studio');
      var startStr = d.toISOString().replace(/[-:]/g, '').slice(0, 15);
      var endStr = end.toISOString().replace(/[-:]/g, '').slice(0, 15);
      calLink.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + title + '&dates=' + startStr + 'Z/' + endStr + 'Z';
    }
  }

  document.querySelectorAll('.lumiere-time-row:not(:disabled)').forEach(function(row) {
    row.addEventListener('click', function() {
      document.querySelectorAll('.lumiere-time-row').forEach(function(r) { r.classList.remove('is-selected'); });
      row.classList.add('is-selected');
      state.selectedTime = row.getAttribute('data-time');
      state.selectedTimeMinutes = row.getAttribute('data-min') ? parseInt(row.getAttribute('data-min'), 10) : null;
      if (durationNote && state.serviceDuration) {
        var endTime = formatTimeEnd(state.selectedTimeMinutes || 540, state.serviceDuration);
        var durLabel = (state.serviceDuration && state.serviceDuration.indexOf('hr') !== -1) ? state.serviceDuration.replace('hrs', 'hours').replace('hr', 'hour') : (state.serviceDuration || '');
        durationNote.textContent = 'Your ' + state.serviceName + ' appointment will run approximately ' + durLabel + ', ending around ' + endTime + '. Please plan accordingly.';
        durationNote.hidden = false;
      }
      if (cancelCard) {
        cancelCard.hidden = false;
        if (cancelDeadline) cancelDeadline.textContent = formatCancellationDeadline(state.selectedDay, state.calendarMonth, state.calendarYear, state.selectedTime);
        if (cancelDeposit) cancelDeposit.textContent = '$' + getDeposit(state.servicePrice);
      }
      if (continuePaymentBtn) continuePaymentBtn.disabled = false;
    });
  });

  if (document.getElementById('lumiere-cal-prev')) {
    document.getElementById('lumiere-cal-prev').addEventListener('click', function() {
      if (state.calendarMonth === 1) { state.calendarMonth = 12; state.calendarYear--; } else { state.calendarMonth--; }
      renderCalendar();
    });
  }
  if (document.getElementById('lumiere-cal-next')) {
    document.getElementById('lumiere-cal-next').addEventListener('click', function() {
      if (state.calendarMonth === 12) { state.calendarMonth = 1; state.calendarYear++; } else { state.calendarMonth++; }
      renderCalendar();
    });
  }

  if (continuePaymentBtn) {
    continuePaymentBtn.addEventListener('click', function() {
      if (continuePaymentBtn.disabled) return;
      goToPayment();
    });
  }

  if (paymentForm && payBtn) {
    var smsConsent = document.getElementById('lumiere-sms-consent');
    if (smsConsent) {
      smsConsent.addEventListener('change', function() {
        payBtn.disabled = !smsConsent.checked;
      });
    }
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      payBtn.disabled = true;
      payBtn.classList.add('is-loading');
      setTimeout(function() {
        payBtn.classList.remove('is-loading');
        var consent = document.getElementById('lumiere-sms-consent');
        payBtn.disabled = !(consent && consent.checked);
        showSuccess();
      }, 1500);
    });
  }

  var whatHappensToggle = document.getElementById('lumiere-what-happens-toggle');
  var whatHappensContent = document.getElementById('lumiere-what-happens-content');
  var whatHappensWrap = whatHappensToggle && whatHappensToggle.closest('.lumiere-what-happens-wrap');
  if (whatHappensToggle && whatHappensContent) {
    whatHappensToggle.addEventListener('click', function() {
      var open = whatHappensContent.hidden;
      whatHappensContent.hidden = !open;
      whatHappensToggle.setAttribute('aria-expanded', open);
      if (whatHappensWrap) whatHappensWrap.classList.toggle('is-open', open);
    });
  }

  var portalSection = document.getElementById('lumiere-customer-portal');
  var portalLink = document.getElementById('lumiere-success-portal');
  if (portalLink && portalSection) {
    portalLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (cancelModal) cancelModal.hidden = true;
      portalSection.hidden = false;
      portalSection.classList.add('lumiere-step-enter');
      populatePortalUpcoming();
      updateCancelModalDeadline();
      startCountdown();
      portalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function populatePortalUpcoming() {
    var deposit = getDeposit(state.servicePrice);
    var total = getTotal();
    var balance = total - deposit;
    var timeStr = state.selectedTime || '2:00 PM';
    var day = state.selectedDay;
    var month = state.calendarMonth;
    var year = state.calendarYear;
    if (!day) return;
    var d = new Date(year, month - 1, day);
    var dateLong = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
    set('lumiere-portal-upcoming-service', state.serviceName || '');
    set('lumiere-portal-upcoming-datetime', dateLong + '  •  ' + timeStr);
    set('lumiere-portal-upcoming-deposit', 'Deposit Paid: $' + deposit + ' ✓');
    set('lumiere-portal-upcoming-balance', 'Balance Due at Appointment: $' + balance);
    set('lumiere-portal-upcoming-deadline', day ? formatDeadlineShort(day, month, year, timeStr).replace(' • ', ' at ') : '');
    var balanceAmount = document.getElementById('lumiere-portal-balance-amount');
    if (balanceAmount) balanceAmount.textContent = '$' + balance + '.00';
    var balanceDue = document.getElementById('lumiere-portal-balance-due');
    if (balanceDue) balanceDue.textContent = 'Due: ' + dateLong;
  }

  function updateCancelModalDeadline() {
    var day = state.selectedDay;
    var month = state.calendarMonth;
    var year = state.calendarYear;
    var timeStr = state.selectedTime || '2:00 PM';
    var el = document.getElementById('lumiere-cancel-modal-deadline');
    if (el && day) el.textContent = formatDeadlineShort(day, month, year, timeStr).replace(' • ', ' at ');
  }

  function getDeadlineTimestamp() {
    var day = state.selectedDay;
    var month = state.calendarMonth;
    var year = state.calendarYear;
    var timeStr = state.selectedTime || '2:00 PM';
    if (!day) return null;
    var match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    var hour = 14;
    var min = 0;
    if (match) {
      hour = parseInt(match[1], 10);
      min = parseInt(match[2], 10) || 0;
      if ((match[3] || '').toUpperCase() === 'PM' && hour < 12) hour += 12;
      if ((match[3] || '').toUpperCase() === 'AM' && hour === 12) hour = 0;
    }
    return new Date(year, month - 1, day - 1, hour, min, 0);
  }

  function formatCountdown(deadline) {
    var now = new Date();
    if (now >= deadline) return 'Deadline passed';
    var ms = deadline - now;
    var hours = Math.floor(ms / (1000 * 60 * 60));
    var days = Math.floor(hours / 24);
    if (days > 0) return days + ' day' + (days !== 1 ? 's' : '') + ' and ' + (hours % 24) + ' hours remaining';
    return hours + ' hour' + (hours !== 1 ? 's' : '') + ' remaining';
  }

  var countdownTimerId = null;
  function startCountdown() {
    if (countdownTimerId) clearInterval(countdownTimerId);
    var el = document.getElementById('lumiere-portal-countdown');
    if (!el) return;
    function tick() {
      var deadline = getDeadlineTimestamp();
      if (deadline) el.textContent = formatCountdown(deadline);
    }
    tick();
    countdownTimerId = setInterval(tick, 60000);
  }

  /* Portal tabs */
  var tabUpcoming = document.getElementById('lumiere-tab-btn-upcoming');
  var tabHistory = document.getElementById('lumiere-tab-btn-history');
  var tabPayments = document.getElementById('lumiere-tab-btn-payments');
  var tabRebook = document.getElementById('lumiere-tab-btn-rebook');
  var panelUpcoming = document.getElementById('lumiere-tab-upcoming');
  var panelHistory = document.getElementById('lumiere-tab-history');
  var panelPayments = document.getElementById('lumiere-tab-payments');
  var panelRebook = document.getElementById('lumiere-tab-rebook');
  var tabs = [
    { btn: tabUpcoming, panel: panelUpcoming },
    { btn: tabHistory, panel: panelHistory },
    { btn: tabPayments, panel: panelPayments },
    { btn: tabRebook, panel: panelRebook }
  ];
  tabs.forEach(function(t) {
    if (!t.btn || !t.panel) return;
    t.btn.addEventListener('click', function() {
      tabs.forEach(function(x) {
        if (x.btn) { x.btn.classList.remove('is-active'); x.btn.setAttribute('aria-selected', 'false'); }
        if (x.panel) { x.panel.hidden = true; }
      });
      t.btn.classList.add('is-active');
      t.btn.setAttribute('aria-selected', 'true');
      t.panel.hidden = false;
    });
  });

  /* Cancel modal */
  var cancelApptBtn = document.getElementById('lumiere-cancel-appt-btn');
  var cancelModal = document.getElementById('lumiere-cancel-modal');
  var cancelModalKeep = document.getElementById('lumiere-cancel-modal-keep');
  var cancelModalConfirm = document.getElementById('lumiere-cancel-modal-confirm');
  if (cancelApptBtn && cancelModal) {
    cancelApptBtn.addEventListener('click', function() {
      cancelModal.hidden = false;
    });
  }
  function closeCancelModal() {
    if (cancelModal) cancelModal.hidden = true;
  }
  if (cancelModalKeep) cancelModalKeep.addEventListener('click', closeCancelModal);
  if (cancelModalConfirm) cancelModalConfirm.addEventListener('click', closeCancelModal);
  if (cancelModal) {
    cancelModal.addEventListener('click', function(e) {
      if (e.target === cancelModal) closeCancelModal();
    });
  }

  /* SMS timeline */
  var smsToggle = document.getElementById('lumiere-sms-toggle');
  var smsContent = document.getElementById('lumiere-sms-content');
  var smsWrap = smsToggle && smsToggle.closest('.lumiere-sms-timeline-wrap');
  if (smsToggle && smsContent) {
    smsToggle.addEventListener('click', function() {
      var open = smsContent.hidden;
      smsContent.hidden = !open;
      smsToggle.setAttribute('aria-expanded', open);
      if (smsWrap) smsWrap.classList.toggle('is-open', open);
    });
  }

  document.querySelectorAll('.lumiere-service-row').forEach(function(row) {
    row.addEventListener('click', function() {
      if (row.classList.contains('is-selected')) {
        selectService(null);
      } else {
        selectService(row);
      }
    });
  });

  if (addonsToggle && addonsList && addonsWrap) {
    addonsToggle.addEventListener('click', function() {
      var open = addonsList.hidden;
      addonsList.hidden = !open;
      addonsToggle.setAttribute('aria-expanded', open);
      addonsWrap.classList.toggle('is-open', open);
    });
  }

  document.querySelectorAll('.lumiere-addon-cb').forEach(function(cb) {
    cb.addEventListener('change', updateUI);
  });

  selectTimeBtn.addEventListener('click', function() {
    if (selectTimeBtn.disabled) return;
    goToSchedule();
  });

  updateUI();
})();
