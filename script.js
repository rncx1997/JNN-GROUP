const ADMIN_NUMBER = '6285190066408';
const WHATSAPP_LINK = 'https://wa.me/6285190066408';

let currentUser = null;

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

  if (cleanPhone === '6285190066408' && pass === 'jnn123') {
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
  const msg = encodeURIComponent(
    'Halo JNN GROUP, saya ingin membeli voucher WiFi.\n' +
    'Paket: ' + paket + '\n' +
    'Harga: ' + harga + '\n\n' +
    'Mohon info cara pembayaran dan aktivasi. Terima kasih.'
  );
  window.open(WHATSAPP_LINK + '?text=' + msg, '_blank');
}

function registerWifi(e) {
  e.preventDefault();
  const nama = document.getElementById('nama').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const alamat = document.getElementById('alamat').value.trim();
  const paket = document.getElementById('paketDaftar').value;
  const msg = document.getElementById('formMsg');

  const cleanPhone = phone.replace(/[^0-9]/g, '');

  if (cleanPhone.length < 9) {
    msg.textContent = 'Nomor HP tidak valid. Periksa kembali.';
    msg.className = 'form-note err';
    return;
  }

  const text = encodeURIComponent(
    'Halo JNN GROUP, saya ingin mendaftar WiFi.\n\n' +
    'Nama: ' + nama + '\n' +
    'No HP: ' + phone + '\n' +
    'Alamat: ' + (alamat || '-') + '\n' +
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('loginModal').classList.remove('show');
  }
});
