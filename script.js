const ADMIN_NUMBER = '6281256077844';
const WHATSAPP_LINK = 'https://wa.me/6281256077844';

const REGIONS = {
  'Bengkayang': ['Paum', 'Sejaro', 'Kindau', 'Take', 'Jagoi', 'Merendeng', 'Sebujit', 'Iyeng', 'Siding', 'Tangguh', 'Kapot', 'Badat', 'Piju', 'Nibong'],
  'Sambas': ['Seradi'],
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

function buy(paket, harga) {
  buyingPaket = { paket, harga };
  document.getElementById('buyTitle').textContent = 'Beli Voucher ' + paket;
  document.getElementById('buyInfo').textContent = 'Paket ' + paket + ' - ' + harga;
  document.getElementById('buyNote').textContent = '';
  document.getElementById('buyKecamatan').value = '';
  const desa = document.getElementById('buyDesa');
  desa.innerHTML = '<option value="">-- Pilih Kecamatan dulu --</option>';
  document.getElementById('buyModal').classList.add('show');
}

function closeBuy() {
  document.getElementById('buyModal').classList.remove('show');
}

function updateDesa(scope) {
  const kecSelect = document.getElementById(scope === 'buy' ? 'buyKecamatan' : 'regKecamatan');
  const desaSelect = document.getElementById(scope === 'buy' ? 'buyDesa' : 'regDesa');
  const villages = REGIONS[kecSelect.value] || [];

  desaSelect.innerHTML = villages.length
    ? '<option value="">-- Pilih Desa --</option>' +
      villages.map((d) => '<option value="' + d + '">' + d + '</option>').join('')
    : '<option value="">-- Pilih Kecamatan dulu --</option>';
}

function confirmBuy() {
  const kecamatan = document.getElementById('buyKecamatan').value;
  const desa = document.getElementById('buyDesa').value;
  const note = document.getElementById('buyNote');

  if (!kecamatan || !desa) {
    note.textContent = 'Silakan pilih kecamatan dan desa terlebih dahulu.';
    note.className = 'modal-note err';
    return;
  }

  const msg = encodeURIComponent(
    'Halo JNN GROUP, saya ingin membeli voucher WiFi.\n' +
    'Paket: ' + buyingPaket.paket + '\n' +
    'Harga: ' + buyingPaket.harga + '\n' +
    'Kecamatan: ' + kecamatan + '\n' +
    'Desa: ' + desa + '\n\n' +
    'Mohon info cara pembayaran dan aktivasi. Terima kasih.'
  );

  note.textContent = 'Membuka WhatsApp...';
  note.className = 'modal-note ok';

  window.open(WHATSAPP_LINK + '?text=' + msg, '_blank');
  setTimeout(() => closeBuy(), 800);
}

function registerWifi(e) {
  e.preventDefault();
  const nama = document.getElementById('nama').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const alamat = document.getElementById('alamat').value.trim();
  const kecamatan = document.getElementById('regKecamatan').value;
  const desa = document.getElementById('regDesa').value;
  const paket = document.getElementById('paketDaftar').value;
  const msg = document.getElementById('formMsg');

  const cleanPhone = phone.replace(/[^0-9]/g, '');

  if (cleanPhone.length < 9) {
    msg.textContent = 'Nomor HP tidak valid. Periksa kembali.';
    msg.className = 'form-note err';
    return;
  }

  if (!kecamatan || !desa) {
    msg.textContent = 'Silakan pilih kecamatan dan desa terlebih dahulu.';
    msg.className = 'form-note err';
    return;
  }

  const text = encodeURIComponent(
    'Halo JNN GROUP, saya ingin mendaftar WiFi.\n\n' +
    'Nama: ' + nama + '\n' +
    'No HP: ' + phone + '\n' +
    'Alamat: ' + (alamat || '-') + '\n' +
    'Kecamatan: ' + kecamatan + '\n' +
    'Desa: ' + desa + '\n' +
    'Paket: ' + paket + '\n\n' +
    'Mohon info proses aktivasi. Terima kasih.'
  );

  msg.textContent = 'Mengirim data ke WhatsApp...';
  msg.className = 'form-note ok';

  window.open(WHATSAPP_LINK + '?text=' + text, '_blank');

  setTimeout(() => {
    msg.textContent = 'Pendaftaran terkirim! Tim JNN GROUP akan segera menghubungi ' + phone + '.';
    msg.className = 'form-note ok';
    e.target.reset();
  }, 1000);

  return false;
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('buyModal').classList.remove('show');
  }
});
