import './style.css'

const seedRooms = [
  { number: '101', type: 'King suite', floor: '1st floor', rate: 210, status: 'Occupied', guest: 'Maya Chen' },
  { number: '102', type: 'Garden queen', floor: '1st floor', rate: 165, status: 'Available', guest: '' },
  { number: '103', type: 'Garden queen', floor: '1st floor', rate: 165, status: 'Reserved', guest: 'Noah Williams' },
  { number: '104', type: 'Twin room', floor: '1st floor', rate: 150, status: 'Occupied', guest: 'Olivia Martin' },
  { number: '201', type: 'King suite', floor: '2nd floor', rate: 210, status: 'Available', guest: '' },
  { number: '202', type: 'Corner deluxe', floor: '2nd floor', rate: 245, status: 'Occupied', guest: 'Ethan Brooks' },
  { number: '203', type: 'Corner deluxe', floor: '2nd floor', rate: 245, status: 'Cleaning', guest: '' },
  { number: '204', type: 'Garden queen', floor: '2nd floor', rate: 165, status: 'Available', guest: '' },
  { number: '205', type: 'Twin room', floor: '2nd floor', rate: 150, status: 'Reserved', guest: 'Ava Patel' },
  { number: '206', type: 'King suite', floor: '2nd floor', rate: 210, status: 'Available', guest: '' },
]

const dateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}
const today = new Date()
const todayValue = dateInputValue(today)
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const dayAfter = new Date(today)
dayAfter.setDate(dayAfter.getDate() + 2)

const seedBookings = [
  { id: 'BK-2048', guest: 'Maya Chen', email: 'maya.chen@email.com', room: '101', checkIn: todayValue, checkOut: dateInputValue(tomorrow), guests: 2, total: 420, status: 'In house' },
  { id: 'BK-2049', guest: 'Noah Williams', email: 'noah.w@email.com', room: '103', checkIn: todayValue, checkOut: dateInputValue(dayAfter), guests: 1, total: 330, status: 'Confirmed' },
  { id: 'BK-2050', guest: 'Olivia Martin', email: 'olivia.m@email.com', room: '104', checkIn: todayValue, checkOut: dateInputValue(tomorrow), guests: 2, total: 300, status: 'In house' },
  { id: 'BK-2051', guest: 'Ethan Brooks', email: 'ethan.b@email.com', room: '202', checkIn: todayValue, checkOut: dateInputValue(dayAfter), guests: 2, total: 490, status: 'In house' },
  { id: 'BK-2052', guest: 'Ava Patel', email: 'ava.p@email.com', room: '205', checkIn: dateInputValue(tomorrow), checkOut: dateInputValue(dayAfter), guests: 2, total: 150, status: 'Confirmed' },
]

function loadData(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

const state = {
  rooms: loadData('harlow-rooms', seedRooms),
  bookings: loadData('harlow-bookings', seedBookings),
  view: 'dashboard',
  roomFilter: 'All rooms',
  search: '',
}

const app = document.querySelector('#app')

function persist() {
  localStorage.setItem('harlow-rooms', JSON.stringify(state.rooms))
  localStorage.setItem('harlow-bookings', JSON.stringify(state.bookings))
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

function formatDate(value, options = { month: 'short', day: 'numeric' }) {
  if (!value) return '—'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', options)
}

function getRoom(number) {
  return state.rooms.find((room) => room.number === number)
}

function getStats() {
  const occupied = state.rooms.filter((room) => room.status === 'Occupied').length
  const arrivals = state.bookings.filter((booking) => booking.status === 'Confirmed' && booking.checkIn === todayValue).length
  const departures = state.bookings.filter((booking) => booking.status === 'In house' && booking.checkOut === todayValue).length
  return { occupied, arrivals, departures, occupancy: Math.round((occupied / state.rooms.length) * 100) }
}

function navItem(view, label, icon, count = '') {
  return `<button class="nav-link ${state.view === view ? 'is-active' : ''}" data-view="${view}" type="button">
    <span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>${count ? `<span class="nav-count">${count}</span>` : ''}
  </button>`
}

function renderShell() {
  app.innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#dashboard" data-view="dashboard" aria-label="Harlow House dashboard">
        <span class="brand-mark">H</span><span class="brand-copy"><strong>harlow</strong><small>HOUSE · BOUTIQUE HOTEL</small></span>
      </a>
      <div class="property-switcher"><span class="property-dot"></span><span><strong>Harlow House</strong><small>Portland, Oregon</small></span><span class="switch-chevron">⌄</span></div>
      <p class="nav-caption">WORKSPACE</p>
      <nav class="primary-nav" aria-label="Main navigation">
        ${navItem('dashboard', 'Overview', '⌂')}
        ${navItem('rooms', 'Rooms', '▦', state.rooms.length)}
        ${navItem('reservations', 'Reservations', '▤', state.bookings.filter((booking) => booking.status !== 'Checked out').length)}
        ${navItem('guests', 'Guests', '♙')}
      </nav>
      <div class="sidebar-bottom">
        <div class="help-card"><span class="help-spark">✳</span><strong>Need a hand?</strong><small>Our support team is<br />always around.</small><a href="mailto:hello@harlowhouse.example">Contact support <span>↗</span></a></div>
        <button class="user-profile" type="button"><span class="avatar">JM</span><span><strong>Jordan Miller</strong><small>Front desk manager</small></span><span class="profile-menu">···</span></button>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar"><div class="breadcrumb"><span>Harlow House</span><span>/</span><strong>${state.view === 'dashboard' ? 'Overview' : state.view[0].toUpperCase() + state.view.slice(1)}</strong></div><div class="topbar-actions"><span class="today-label">${formatDate(todayValue, { weekday: 'long', month: 'long', day: 'numeric' })}</span><button class="icon-button notification-button" type="button" aria-label="Notifications"><span>♧</span><i></i></button><button class="mobile-menu" type="button" aria-label="Toggle navigation">☰</button></div></header>
      <section id="view-content" class="view-content"></section>
    </main>
    <dialog class="booking-dialog" id="booking-dialog">
      <form class="booking-form" id="booking-form">
        <div class="dialog-heading"><div><span class="eyebrow">NEW BOOKING</span><h2>Create a reservation</h2><p>Add guest details and choose an available room.</p></div><button class="icon-button close-dialog" type="button" aria-label="Close dialog">×</button></div>
        <div class="form-grid">
          <label class="field field-wide">Guest full name<input name="guest" required autocomplete="name" placeholder="e.g. Alex Morgan" /></label>
          <label class="field field-wide">Email address<input name="email" type="email" required autocomplete="email" placeholder="alex@email.com" /></label>
          <label class="field">Room<select name="room" required>${state.rooms.filter((room) => room.status === 'Available').map((room) => `<option value="${room.number}">Room ${room.number} · ${escapeHTML(room.type)} · $${room.rate}/night</option>`).join('')}</select></label>
          <label class="field">Guests<select name="guests"><option>1</option><option selected>2</option><option>3</option><option>4</option></select></label>
          <label class="field">Check-in<input name="checkIn" type="date" min="${todayValue}" value="${todayValue}" required /></label>
          <label class="field">Nights<input name="nights" type="number" min="1" max="30" value="1" required /></label>
        </div>
        <div class="form-error" role="alert"></div>
        <div class="dialog-footer"><span class="form-note">Payment is collected at check-in.</span><button class="button button-primary" type="submit"><span>＋</span> Save reservation</button></div>
      </form>
    </dialog>
    <div class="toast" role="status" aria-live="polite"></div>
  `
  renderView()
}

function renderDashboard() {
  const stats = getStats()
  const arrivals = state.bookings.filter((booking) => booking.status === 'Confirmed' && booking.checkIn === todayValue)
  const roomSample = state.rooms.slice(0, 8)
  return `
    <div class="page-heading"><div><p class="eyebrow">${formatDate(todayValue, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p><h1>Good morning, Jordan <span>☀</span></h1><p class="page-subtitle">Here’s what’s happening at Harlow House today.</p></div><button class="button button-primary" data-action="new-booking" type="button"><span>＋</span> New reservation</button></div>
    <section class="stats-grid" aria-label="Today's hotel summary">
      <article class="stat-card"><div class="stat-top"><span>OCCUPANCY</span><span class="stat-icon stat-icon-green">◫</span></div><div class="stat-value">${stats.occupancy}<small>%</small></div><div class="stat-foot"><span class="mini-bar"><i style="width:${stats.occupancy}%"></i></span><span>${stats.occupied} of ${state.rooms.length} rooms</span></div></article>
      <article class="stat-card"><div class="stat-top"><span>ARRIVALS</span><span class="stat-icon stat-icon-coral">↘</span></div><div class="stat-value">${stats.arrivals.toString().padStart(2, '0')}</div><div class="stat-foot"><span class="stat-foot-label">Expected today</span><span class="tiny-status">${stats.arrivals ? 'Ready' : 'All clear'}</span></div></article>
      <article class="stat-card"><div class="stat-top"><span>DEPARTURES</span><span class="stat-icon stat-icon-blue">↗</span></div><div class="stat-value">${stats.departures.toString().padStart(2, '0')}</div><div class="stat-foot"><span class="stat-foot-label">Check-outs today</span><span class="tiny-status">By 11:00 am</span></div></article>
      <article class="stat-card revenue-card"><div class="stat-top"><span>ROOM REVENUE</span><span class="stat-icon stat-icon-gold">$</span></div><div class="stat-value">$${state.bookings.filter((booking) => booking.status !== 'Checked out').reduce((sum, booking) => sum + Number(booking.total), 0).toLocaleString()}</div><div class="stat-foot"><span class="stat-foot-label">From active stays</span><span class="tiny-status">This week</span></div></article>
    </section>
    <section class="welcome-strip"><img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85" alt="The Harlow House hotel courtyard and pool" /><div class="welcome-overlay"></div><div class="welcome-copy"><span class="eyebrow">A PLACE TO SLOW DOWN</span><h2>Make room for<br />a little more.</h2><p>Thoughtful stays, right in the heart of Portland.</p></div><div class="weather-pill"><span>☀</span><strong>68°</strong><small>Portland</small></div></section>
    <div class="dashboard-columns">
      <section class="panel arrivals-panel"><div class="panel-heading"><div><span class="eyebrow">FRONT DESK</span><h2>Today’s arrivals <span class="heading-count">${arrivals.length}</span></h2></div><button class="text-button" data-view="reservations" type="button">All reservations <span>→</span></button></div>
        ${arrivals.length ? `<div class="arrival-list">${arrivals.map((booking) => `<article class="arrival-row"><span class="arrival-avatar">${escapeHTML(booking.guest.split(' ').map((part) => part[0]).slice(0, 2).join(''))}</span><div class="arrival-person"><strong>${escapeHTML(booking.guest)}</strong><small>${escapeHTML(booking.email)}</small></div><div class="arrival-room"><small>ROOM</small><strong>${escapeHTML(booking.room)}</strong></div><div class="arrival-time"><small>ARRIVAL</small><strong>After 3:00 pm</strong></div><button class="button button-soft" data-action="check-in" data-id="${booking.id}" type="button">Check in</button></article>`).join('')}</div>` : `<div class="empty-state"><span>✳</span><strong>No arrivals for today</strong><small>New reservations will show here.</small></div>`}
      </section>
      <section class="panel rooms-panel"><div class="panel-heading"><div><span class="eyebrow">ROOM STATUS</span><h2>Rooms at a glance</h2></div><button class="text-button" data-view="rooms" type="button">View all <span>→</span></button></div><div class="room-legend"><span><i class="legend-dot dot-occupied"></i>Occupied</span><span><i class="legend-dot dot-available"></i>Available</span><span><i class="legend-dot dot-reserved"></i>Reserved</span></div><div class="room-mini-grid">${roomSample.map((room) => `<button class="room-mini room-${room.status.toLowerCase()}" data-view="rooms" type="button" title="Room ${room.number}: ${room.status}"><span>${room.number}</span><i></i></button>`).join('')}</div><div class="room-summary"><span><strong>${state.rooms.filter((room) => room.status === 'Available').length}</strong> ready to welcome</span><span class="room-summary-arrow">→</span></div></section>
    </div>
    <footer class="page-footer"><span>Harlow House · Hotel management</span><span>Last synced just now <i></i></span></footer>
  `
}

function renderRooms() {
  const filters = ['All rooms', 'Available', 'Occupied', 'Reserved', 'Cleaning']
  const rooms = state.rooms.filter((room) => state.roomFilter === 'All rooms' || room.status === state.roomFilter)
  return `
    <div class="page-heading"><div><p class="eyebrow">PROPERTY · ${state.rooms.length} KEYS</p><h1>Rooms</h1><p class="page-subtitle">Room status and readiness across the property.</p></div><button class="button button-primary" data-action="new-booking" type="button"><span>＋</span> New reservation</button></div>
    <section class="panel rooms-view-panel"><div class="rooms-toolbar"><div class="segmented-control">${filters.map((filter) => `<button class="segment ${state.roomFilter === filter ? 'is-selected' : ''}" data-room-filter="${filter}" type="button">${filter}<span>${filter === 'All rooms' ? state.rooms.length : state.rooms.filter((room) => room.status === filter).length}</span></button>`).join('')}</div><span class="toolbar-note">Updated moments ago</span></div>
      <div class="room-card-grid">${rooms.map((room) => `<article class="room-card"><div class="room-card-top"><span class="room-number">${room.number}</span><span class="status-pill status-${room.status.toLowerCase().replace(' ', '-')}\"><i></i>${room.status}</span></div><div class="room-card-type"><strong>${escapeHTML(room.type)}</strong><small>${room.floor}</small></div><div class="room-card-bottom"><span>$${room.rate}<small> / night</small></span>${room.guest ? `<span class="room-guest">${escapeHTML(room.guest)}</span>` : `<span class="room-guest room-vacant">Ready for a guest</span>`}</div></article>`).join('')}</div>
    </section><footer class="page-footer"><span>Room types and rates are managed by the front desk.</span><span>${state.rooms.filter((room) => room.status === 'Available').length} rooms ready <i></i></span></footer>
  `
}

function bookingRows(bookings) {
  if (!bookings.length) return `<tr><td class="table-empty" colspan="6">No reservations found.</td></tr>`
  return bookings.map((booking) => {
    const room = getRoom(booking.room)
    let action = '<span class="muted-dash">—</span>'
    if (booking.status === 'Confirmed') action = `<button class="table-action" data-action="check-in" data-id="${booking.id}" type="button">Check in <span>→</span></button>`
    if (booking.status === 'In house') action = `<button class="table-action" data-action="check-out" data-id="${booking.id}" type="button">Check out <span>→</span></button>`
    return `<tr><td><span class="booking-id">${booking.id}</span></td><td><span class="table-guest-avatar">${escapeHTML(booking.guest.split(' ').map((part) => part[0]).slice(0, 2).join(''))}</span><span class="table-guest-name">${escapeHTML(booking.guest)}<small>${escapeHTML(booking.email)}</small></span></td><td><span class="table-room">${escapeHTML(booking.room)} <small>${room ? escapeHTML(room.type) : ''}</small></span></td><td>${formatDate(booking.checkIn)} <span class="date-separator">→</span> ${formatDate(booking.checkOut)}</td><td><span class="status-pill status-${booking.status.toLowerCase().replace(' ', '-')}\"><i></i>${booking.status}</span></td><td class="action-cell">${action}</td></tr>`
  }).join('')
}

function renderReservations() {
  const query = state.search.trim().toLowerCase()
  const bookings = state.bookings.filter((booking) => [booking.guest, booking.email, booking.id, booking.room].some((value) => String(value).toLowerCase().includes(query)))
  return `
    <div class="page-heading"><div><p class="eyebrow">FRONT DESK · ${state.bookings.length} TOTAL</p><h1>Reservations</h1><p class="page-subtitle">Manage upcoming stays and guests currently in-house.</p></div><button class="button button-primary" data-action="new-booking" type="button"><span>＋</span> New reservation</button></div>
    <section class="panel reservations-panel"><div class="reservations-toolbar"><div><h2>All bookings</h2><span class="result-count">${bookings.length} reservations</span></div><label class="search-field"><span aria-hidden="true">⌕</span><input id="booking-search" type="search" value="${escapeHTML(state.search)}" placeholder="Search guest or room" aria-label="Search reservations" /><kbd>⌘ K</kbd></label></div><div class="table-scroll"><table><thead><tr><th>BOOKING</th><th>GUEST</th><th>ROOM</th><th>STAY</th><th>STATUS</th><th></th></tr></thead><tbody>${bookingRows(bookings)}</tbody></table></div></section>
    <footer class="page-footer"><span>Reservations are saved on this device.</span><span>${state.bookings.filter((booking) => booking.status === 'In house').length} guests in-house <i></i></span></footer>
  `
}

function renderGuests() {
  const guests = [...new Map(state.bookings.map((booking) => [booking.email.toLowerCase(), booking])).values()]
    .sort((a, b) => a.guest.localeCompare(b.guest))
  return `
    <div class="page-heading"><div><p class="eyebrow">GUEST DIRECTORY</p><h1>Guests</h1><p class="page-subtitle">Guest details and their most recent stay.</p></div><button class="button button-primary" data-action="new-booking" type="button"><span>＋</span> New reservation</button></div>
    <section class="panel reservations-panel"><div class="reservations-toolbar"><div><h2>Guest directory</h2><span class="result-count">${guests.length} guests</span></div></div><div class="table-scroll"><table><thead><tr><th>GUEST</th><th>EMAIL</th><th>LAST ROOM</th><th>LAST STAY</th><th>STATUS</th><th></th></tr></thead><tbody>${guests.map((guest) => `<tr><td><span class="table-guest-avatar">${escapeHTML(guest.guest.split(' ').map((part) => part[0]).slice(0, 2).join(''))}</span><span class="table-guest-name">${escapeHTML(guest.guest)}</span></td><td>${escapeHTML(guest.email)}</td><td>${escapeHTML(guest.room)}</td><td>${formatDate(guest.checkIn)} <span class="date-separator">→</span> ${formatDate(guest.checkOut)}</td><td><span class="status-pill status-${guest.status.toLowerCase().replace(' ', '-')}\"><i></i>${guest.status}</span></td><td><button class="table-action" data-view="reservations" type="button">Booking <span>→</span></button></td></tr>`).join('')}</tbody></table></div></section>
    <footer class="page-footer"><span>Guest details stay private to your property.</span><span>${guests.length} guest profiles</span></footer>
  `
}

function renderView() {
  const content = document.querySelector('#view-content')
  const views = { dashboard: renderDashboard, rooms: renderRooms, reservations: renderReservations, guests: renderGuests }
  content.innerHTML = (views[state.view] || renderDashboard)()
  if (state.view === 'rooms') {
    content.querySelectorAll('.room-card').forEach((card) => {
      const roomNumber = card.querySelector('.room-number').textContent
      if (getRoom(roomNumber)?.status !== 'Cleaning') return
      const button = document.createElement('button')
      button.className = 'room-ready-button'
      button.dataset.action = 'mark-ready'
      button.dataset.room = roomNumber
      button.type = 'button'
      button.textContent = 'Mark ready →'
      card.querySelector('.room-vacant')?.replaceWith(button)
    })
  }
  document.querySelector('.breadcrumb strong').textContent = state.view === 'dashboard' ? 'Overview' : state.view[0].toUpperCase() + state.view.slice(1)
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('is-active', link.dataset.view === state.view))
}

function showToast(message) {
  const toast = document.querySelector('.toast')
  toast.textContent = message
  toast.classList.add('is-visible')
  window.clearTimeout(showToast.timeout)
  showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2800)
}

function showBookingDialog() {
  if (!state.rooms.some((room) => room.status === 'Available')) {
    showToast('No available rooms right now.')
    return
  }
  const dialog = document.querySelector('#booking-dialog')
  dialog.querySelector('.form-error').textContent = ''
  dialog.showModal()
}

function createBooking(form) {
  const data = new FormData(form)
  const room = getRoom(data.get('room'))
  const nights = Number(data.get('nights'))
  const checkIn = String(data.get('checkIn'))
  if (!room || room.status !== 'Available') {
    form.querySelector('.form-error').textContent = 'That room is no longer available. Please choose another.'
    return
  }
  if (!Number.isInteger(nights) || nights < 1 || nights > 30) {
    form.querySelector('.form-error').textContent = 'Choose a stay between 1 and 30 nights.'
    return
  }
  const checkOutDate = new Date(`${checkIn}T00:00:00`)
  checkOutDate.setDate(checkOutDate.getDate() + nights)
  const idNumber = Math.max(2052, ...state.bookings.map((booking) => Number(booking.id.replace('BK-', '')) || 0)) + 1
  const guest = String(data.get('guest')).trim()
  const booking = {
    id: `BK-${idNumber}`,
    guest,
    email: String(data.get('email')).trim(),
    room: room.number,
    checkIn,
    checkOut: dateInputValue(checkOutDate),
    guests: Number(data.get('guests')),
    total: room.rate * nights,
    status: 'Confirmed',
  }
  room.status = 'Reserved'
  room.guest = guest
  state.bookings.unshift(booking)
  persist()
  document.querySelector('#booking-dialog').close()
  form.reset()
  state.view = 'reservations'
  state.search = ''
  renderShell()
  showToast(`Reservation ${booking.id} created.`)
}

function updateBookingStatus(id, action) {
  const booking = state.bookings.find((item) => item.id === id)
  if (!booking) return
  const room = getRoom(booking.room)
  if (action === 'check-in' && booking.status === 'Confirmed') {
    booking.status = 'In house'
    if (room) room.status = 'Occupied'
    showToast(`${booking.guest} checked in to room ${booking.room}.`)
  } else if (action === 'check-out' && booking.status === 'In house') {
    booking.status = 'Checked out'
    if (room) {
      room.status = 'Cleaning'
      room.guest = ''
    }
    showToast(`Room ${booking.room} checked out and marked for cleaning.`)
  }
  persist()
  renderShell()
}

app.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]')
  const actionButton = event.target.closest('[data-action]')
  const filterButton = event.target.closest('[data-room-filter]')
  if (viewButton) {
    event.preventDefault()
    state.view = viewButton.dataset.view
    state.search = ''
    renderView()
    document.querySelector('.sidebar').classList.remove('sidebar-open')
  }
  if (filterButton) {
    state.roomFilter = filterButton.dataset.roomFilter
    renderView()
  }
  if (actionButton?.dataset.action === 'new-booking') showBookingDialog()
  if (actionButton?.dataset.action === 'mark-ready') {
    const room = getRoom(actionButton.dataset.room)
    if (room?.status === 'Cleaning') {
      room.status = 'Available'
      persist()
      renderShell()
      showToast(`Room ${room.number} is ready for a guest.`)
    }
  }
  if (actionButton?.dataset.action === 'check-in' || actionButton?.dataset.action === 'check-out') {
    updateBookingStatus(actionButton.dataset.id, actionButton.dataset.action)
  }
  if (event.target.closest('.close-dialog')) document.querySelector('#booking-dialog').close()
  if (event.target.closest('.mobile-menu')) document.querySelector('.sidebar').classList.toggle('sidebar-open')
})

app.addEventListener('submit', (event) => {
  if (event.target.id === 'booking-form') {
    event.preventDefault()
    createBooking(event.target)
  }
})

app.addEventListener('input', (event) => {
  if (event.target.id === 'booking-search') {
    const selection = event.target.selectionStart
    state.search = event.target.value
    renderView()
    const search = document.querySelector('#booking-search')
    search.focus()
    search.setSelectionRange(selection, selection)
  }
})

app.addEventListener('click', (event) => {
  if (event.target.id === 'booking-dialog') document.querySelector('#booking-dialog').close()
})

renderShell()