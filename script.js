const ADMIN_NUMBER = '6281256077844';
const WHATSAPP_LINK = 'https://wa.me/6281256077844';

const REGIONS = {
  'Bengkayang': ['Paum', 'Sejaro', 'Kindau', 'Take', 'Jagoi', 'Merendeng', 'Sebujit', 'Iyeng', 'Siding', 'Tangguh', 'Kapot', 'Badat', 'Piju', 'Nibong'],
  'Sambas': ['Seradi', 'Samping'],
  'Singkawang': ['Samelagi Kecil']
};

let currentUser = null;
let buyingPaket = null;

function formatPhone(el) {
  const val = el.value.replace(/[^0-9+]/g, '');
  el.value = val;
}

function toggleLogin() {
  const modal = document.getElementById('loginModal');
  modal.classList.toggle('show');
  document.getElementById('loginNote').textContent = '';
  if (modal.classList.contains('show')) {
    document.getElementById('loginPhone').focus();
  }
}

function handleLogin() {
  const phone = document.getElementById('loginPhone').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const note = document.getElementById('loginNote');

  if (!phone || !pass) {
    note.textContent = 'Nomor HP dan password wajib diisi.';
    note.className = 'modal-note err';
    return;
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 9) {
    note.textContent = 'Nomor HP tidak valid.';
    note.className = 'modal-note err';
    return;
  }

  if (cleanPhone === '6281256077844' && pass === 'jnn123') {
    loginSuccess('Admin JNN GROUP');
  } else {
    loginSuccess(phone);
  }
}

function loginSuccess(name) {
  currentUser = { name };
  const area = document.querySelector('.profile-area');
  const initial = name.trim().charAt(0).toUpperCase();
  area.innerHTML = `
    <div class="profile-chip" title="${name}">
      <span class="avatar">${initial}</span>
      <span class="chip-name">${name}</span>
      <button onclick="logout()" title="Keluar">✕</button>
    </div>`;
  document.getElementById('loginModal').classList.remove('show');
  showToast('Selamat datang, ' + name + '!');
}

function logout() {
  currentUser = null;
  const area = document.querySelector('.profile-area');
  area.innerHTML = `
    <button id="loginBtn" class="btn-login" onclick="toggleLogin()">
      <span>👤</span> Masuk
    </button>`;
  showToast('Anda telah keluar.');
}

const VOUCHERS_BY_REGION = {
  'Bengkayang': {
    'harian': [
      '3 Jam - Rp 3.000',
      '6 Jam - Rp 6.000',
      '24 Jam - Rp 10.000'
    ],
    'bulanan': [
      '30 Hari - Rp 75.000 (Kec. Bengkayang)'
    ]
  },
  'Sambas': {
    'harian': [
      '2 Jam - Rp 1.000',
      '4 Jam - Rp 2.000',
      '8 Jam - Rp 4.000'
    ],
    'bulanan': [
      '30 Hari - Rp 50.000 (Kec. Sambas)'
    ]
  },
  'Singkawang': {
    'harian': [
      '3 Jam - Rp 3.000',
      '6 Jam - Rp 6.000',
      '24 Jam - Rp 10.000'
    ],
    'bulanan': [
      '30 Hari - Rp 50.000 (Kec. Singkawang)'
    ]
  }
};

const VOUCHERS_BY_DESA = {
  'Badat': {
    'harian': [
      '1 Jam - Rp 2.000',
      '3 Jam - Rp 5.000',
      '5 Jam - Rp 8.000'
    ]
  },
  'Samping': {
    'harian': [
      '2 Jam - Rp 1.000',
      '4 Jam - Rp 2.000',
      '24 Jam - Rp 10.000'
    ],
    'bulanan': [
      '30 Hari - Rp 50.000 (Kec. Sambas)'
    ]
  }
};

function getVoucherOptions(kecamatan, desa, type) {
  const byDesa = (VOUCHERS_BY_DESA[desa] || {})[type];
  if (byDesa) return byDesa;
  return VOUCHERS_BY_REGION[kecamatan][type];
}

function buy(type) {
  buyingPaket = { type };
  const typeLabel = type === 'harian' ? 'Voucher Harian' : 'Voucher Bulanan';
  document.getElementById('buyTitle').textContent = 'Pilih ' + typeLabel;
  document.getElementById('buyInfo').textContent =
    'Silakan pilih kecamatan dan desa terlebih dahulu untuk melihat harga voucher ' + typeLabel + '.';
  document.getElementById('buyNote').textContent = '';

  document.getElementById('hargaGroup').style.display = 'none';
  document.getElementById('buyHarga').innerHTML = '<option value="">-- Pilih Harga --</option>';

  document.getElementById('buyKecamatan').value = '';
  const desa = document.getElementById('buyDesa');
  desa.innerHTML = '<option value="">-- Pilih Kecamatan dulu --</option>';
  document.getElementById('buyModal').classList.add('show');
}

function closeBuy() {
  document.getElementById('buyModal').classList.remove('show');
}

function updateDesa() {
  const kecSelect = document.getElementById('buyKecamatan');
  const desaSelect = document.getElementById('buyDesa');
  const villages = REGIONS[kecSelect.value] || [];

  desaSelect.innerHTML = villages.length
    ? '<option value="">-- Pilih Desa --</option>' +
      villages.map((d) => '<option value="' + d + '">' + d + '</option>').join('')
    : '<option value="">-- Pilih Kecamatan dulu --</option>';

  hideHargaIfIncomplete();
}

function onBuyDesaChange() {
  hideHargaIfIncomplete();
}

function hideHargaIfIncomplete() {
  const kecamatan = document.getElementById('buyKecamatan').value;
  const desa = document.getElementById('buyDesa').value;
  const hargaGroup = document.getElementById('hargaGroup');
  const hargaSelect = document.getElementById('buyHarga');

  if (!kecamatan || !desa || !buyingPaket) {
    hargaGroup.style.display = 'none';
    return;
  }

  const options = getVoucherOptions(kecamatan, desa, buyingPaket.type);
  hargaSelect.innerHTML = '<option value="">-- Pilih Harga --</option>' +
    options.map((v) => '<option value="' + v + '">' + v + '</option>').join('');
  hargaGroup.style.display = 'block';
}

function confirmBuy() {
  const harga = document.getElementById('buyHarga').value;
  const kecamatan = document.getElementById('buyKecamatan').value;
  const desa = document.getElementById('buyDesa').value;
  const note = document.getElementById('buyNote');

  if (!harga) {
    note.textContent = 'Silakan pilih harga voucher terlebih dahulu.';
    note.className = 'modal-note err';
    return;
  }

  if (!kecamatan || !desa) {
    note.textContent = 'Silakan pilih kecamatan dan desa terlebih dahulu.';
    note.className = 'modal-note err';
    return;
  }

  document.getElementById('confSisa').textContent =
    (buyingPaket.type === 'harian' ? 'Voucher Harian' : 'Voucher Bulanan') + ' - ' + harga;
  document.getElementById('confKecamatan').textContent = kecamatan;
  document.getElementById('confDesa').textContent = desa;
  document.getElementById('confirmModal').classList.add('show');
}

function closeConfirm() {
  document.getElementById('confirmModal').classList.remove('show');
}

function openWhatsApp() {
  const harga = document.getElementById('buyHarga').value;
  const kecamatan = document.getElementById('buyKecamatan').value;
  const desa = document.getElementById('buyDesa').value;

  const msg = encodeURIComponent(
    'Halo JNN GROUP, saya ingin membeli voucher WiFi.\n' +
    'Jenis: ' + (buyingPaket.type === 'harian' ? 'Voucher Harian' : 'Voucher Bulanan') + '\n' +
    'Paket: ' + harga + '\n' +
    'Kecamatan: ' + kecamatan + '\n' +
    'Desa: ' + desa + '\n\n' +
    'Mohon info cara pembayaran dan aktivasi. Terima kasih.'
  );

  window.open(WHATSAPP_LINK + '?text=' + msg, '_blank');
  closeConfirm();
  closeBuy();
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ===== LIVE CHAT ===== */
const CHAT_TOPIC = 'jnn_group/livechat';
const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const CHAT_STORAGE_KEY = 'jnn_chat_history';
const CHAT_TTL = 24 * 60 * 60 * 1000;
const CHAT_MAX_STORED = 200;
let mqttClient = null;
let chatOpen = false;
let unreadCount = 0;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getChatUser(silent) {
  let user = localStorage.getItem('jnn_chat_user');
  if (!user) {
    if (!silent) {
      user = prompt('Masukkan nama kamu untuk live chat:');
    }
    if (!user || !user.trim()) {
      user = 'Tamu ' + Math.floor(Math.random() * 1000);
    }
    localStorage.setItem('jnn_chat_user', user.trim());
  }
  return user.trim();
}

function loadChatHistory() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const fresh = (Array.isArray(list) ? list : [])
      .filter((m) => m && m.ts && now - m.ts < CHAT_TTL);
    saveChatHistory(fresh);
    return fresh;
  } catch (e) {
    return [];
  }
}

function saveChatHistory(list) {
  try {
    const now = Date.now();
    const fresh = list
      .filter((m) => m && m.ts && now - m.ts < CHAT_TTL)
      .slice(-CHAT_MAX_STORED);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(fresh));
  } catch (e) {}
}

function purgeExpiredChat() {
  loadChatHistory();
}

function renderChatHistory() {
  const history = loadChatHistory();
  const wrap = document.getElementById('chatMessages');
  wrap.innerHTML = '';
  history.forEach((m) => renderChatMessage(m, false));
}

function initChat() {
  const status = document.getElementById('chatStatus');
  if (typeof mqtt === 'undefined') {
    status.textContent = 'Chat tidak tersedia';
    return;
  }

  try {
    mqttClient = mqtt.connect(BROKER_URL, {
      clientId: 'jnn_web_' + Math.random().toString(16).substr(2, 8)
    });
  } catch (e) {
    status.textContent = 'Gagal terhubung';
    return;
  }

  mqttClient.on('connect', () => {
    status.textContent = '● Online';
    status.classList.add('online');
    mqttClient.subscribe(CHAT_TOPIC);
    renderChatHistory();
    const user = getChatUser(true);
    publishChat({ user, text: ' masuk ke live chat', time: nowTime(), system: true });
  });

  mqttClient.on('message', (topic, payload) => {
    try {
      const msg = JSON.parse(payload.toString());
      appendChatMessage(msg);
    } catch (e) {}
  });

  mqttClient.on('close', () => {
    status.textContent = '● Offline';
    status.classList.remove('online');
  });

  mqttClient.on('error', () => {
    status.textContent = 'Gagal terhubung';
    status.classList.remove('online');
  });
}

function nowTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function publishChat(msg) {
  if (mqttClient && mqttClient.connected) {
    try {
      mqttClient.publish(CHAT_TOPIC, JSON.stringify(msg));
    } catch (e) {}
  }
}

function renderChatMessage(msg, countUnread) {
  const wrap = document.getElementById('chatMessages');
  const me = msg.user === getChatUser();

  if (msg.system) {
    const sys = document.createElement('div');
    sys.className = 'chat-sys';
    sys.textContent = msg.user + ' ' + msg.text + ' · ' + msg.time;
    wrap.appendChild(sys);
  } else {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (me ? 'me' : 'them');
    if (msg.id) div.dataset.msgId = msg.id;
    div.innerHTML =
      '<span class="chat-user">' + escapeHtml(me ? 'Kamu' : msg.user) + '</span>' +
      '<span>' + escapeHtml(msg.text) + '</span>' +
      '<span class="chat-time">' + escapeHtml(msg.time) + '</span>';
    wrap.appendChild(div);
  }

  wrap.scrollTop = wrap.scrollHeight;

  if (countUnread && !chatOpen) {
    unreadCount++;
    updateChatBadge();
  }
}

function appendChatMessage(msg) {
  if (!msg || msg.system) {
    renderChatMessage(msg, false);
    return;
  }

  if (msg.id && document.querySelector('[data-msg-id="' + msg.id + '"]')) return;

  if (!msg.ts) msg.ts = Date.now();

  const history = loadChatHistory();
  saveChatHistory(history.concat(msg));

  renderChatMessage(msg, true);
}

function updateChatBadge() {
  const badge = document.getElementById('chatBadge');
  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? 'grid' : 'none';
}

function toggleChat() {
  const panel = document.getElementById('chatPanel');
  chatOpen = !chatOpen;
  panel.classList.toggle('show', chatOpen);
  if (chatOpen) {
    unreadCount = 0;
    updateChatBadge();
    getChatUser();
    document.getElementById('chatText').focus();
  }
}

function sendChat() {
  const input = document.getElementById('chatText');
  const text = input.value.trim();
  if (!text) return;

  const msg = {
    id: 'm' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    user: getChatUser(),
    text,
    time: nowTime(),
    ts: Date.now(),
    system: false
  };
  publishChat(msg);
  appendChatMessage(msg);
  input.value = '';
}

initChat();

setInterval(() => {
  purgeExpiredChat();
  renderChatHistory();
}, 60 * 60 * 1000);


let slideIndex = 0;
const slides = document.querySelectorAll('.billboard-slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  slideIndex = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle('active', i === slideIndex));
  dots.forEach((d, i) => d.classList.toggle('active', i === slideIndex));
}

dots.forEach((d, i) => {
  d.addEventListener('click', () => goToSlide(i));
});

setInterval(() => goToSlide(slideIndex + 1), 5000);

document.getElementById('loginModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) toggleLogin();
});

document.getElementById('buyModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeBuy();
});

document.getElementById('confirmModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeConfirm();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('buyModal').classList.remove('show');
    closeConfirm();
  }
});
