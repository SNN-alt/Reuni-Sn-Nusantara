/* =====================================================
   CONFIG
===================================================== */
const apiUrl = "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";
const eventDate = new Date("2026-04-11T00:00:00+07:00");

let lastNoHp = "";

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  initModal();
  initButtons();
  initSponsor();

  startCountdown();
  loadStatistik();
  loadKuota();

  setInterval(loadStatistik, 30000);
  setInterval(loadKuota, 10000);
});

/* =====================================================
   HELPER
===================================================== */
const el = id => document.getElementById(id);

/* =====================================================
   MODAL
===================================================== */
function initModal() {

  document.querySelectorAll(".modal, .popup-overlay, #sponsorOverlay")
    .forEach(modal => {
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.remove("active");
      });
    });

  document.querySelectorAll(".close, .close-x")
    .forEach(btn => {
      btn.onclick = () => {
        btn.closest(".modal, .popup-overlay")?.classList.remove("active");
      };
    });

  window.bukaPanduan = () => el("modalPanduan").classList.add("active");
  window.bukaProposal = () => el("modalProposal").classList.add("active");

  const btnCall = el("btnCallCenter");
  if (btnCall) btnCall.onclick = () => el("modalCallCenter").classList.add("active");
}

/* =====================================================
   BUTTON
===================================================== */
function initButtons() {
  window.bukaPeserta = () => window.open("https://forms.gle/VudgYiKRNVWU9zsG8");
  window.bukaUMKM = () => window.open("https://forms.gle/sUyoZ34bRnDrp2xW6");
}

/* =====================================================
   SPONSOR
===================================================== */
function initSponsor() {

  const overlay = el("sponsorOverlay");
  const preview = el("sponsorPreview");
  const close = el("closeSponsor");

  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.onclick = () => {
      preview.src = img.src;
      overlay.classList.add("active");
    };
  });

  if (close) close.onclick = () => overlay.classList.remove("active");
}

/* =====================================================
   COUNTDOWN
===================================================== */
function startCountdown() {

  const box = el("countdownBox");

  function update() {
    const diff = eventDate - new Date();

    if (diff <= 0) {
      box.innerHTML = "🎉 Acara Sedang Berlangsung!";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000 % 24);
    const m = Math.floor(diff / 60000 % 60);
    const s = Math.floor(diff / 1000 % 60);

    box.innerHTML = `
      ⏳ ${d} Hari 
      ${String(h).padStart(2,'0')} Jam 
      ${String(m).padStart(2,'0')} Menit 
      ${String(s).padStart(2,'0')} Detik
    `;
  }

  update();
  setInterval(update, 1000);
}

/* =====================================================
   STATISTIK
===================================================== */
async function loadStatistik() {

  try {
    const res = await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
    const data = await res.json();

    el("statistikBox").innerHTML = `
      <div class="statistik-premium">
        <div class="stat-item">
          <small>Total Pendaftar</small>
          <span>${data.totalPeserta || 0}</span>
        </div>
        <div class="stat-item">
          <small>Sudah Konfirmasi</small>
          <span>${data.totalHadir || 0}</span>
        </div>
      </div>
    `;
  } catch {}
}

/* =====================================================
   KUOTA TENDA (SUPER FIX)
===================================================== */
async function loadKuota() {

  const box = el("progressKuota");
  if (!box) return;

  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const data = await res.json();

    const total = Number(data.kapasitas) || 160;
    const terpakai = Number(data.totalTenda) || 0;
    const sisa = (data.sisa !== undefined)
      ? Number(data.sisa)
      : Math.max(0, total - terpakai);

    const percent = total > 0
      ? Math.min(100, (terpakai / total) * 100)
      : 0;

    let warna = "#28a745";
    if (percent > 60) warna = "#ffc107";
    if (percent > 85) warna = "#dc3545";

    box.innerHTML = `
      <div style="margin-bottom:8px;font-weight:600;">
        Sisa Kuota Tenda: <strong>${sisa}</strong> / ${total}
      </div>

      <div class="progress-bar">
        <div class="progress-fill"
             style="width:${percent}%; background:${warna};">
        </div>
      </div>
    `;

  } catch {
    box.innerHTML = `<div style="color:red;">Gagal load kuota</div>`;
  }
}

/* =====================================================
   LOGIN
===================================================== */
window.loginPeserta = async function () {

  const input = el("nohpLogin");
  const nohp = input.value.replace(/\D/g, "");

  if (nohp.length < 10) return alert("Nomor HP tidak valid");

  lastNoHp = nohp;

  try {
    const res = await fetch(`${apiUrl}?mode=login&nohp=${nohp}`);
    const data = await res.json();

    if (data.status === "NOT_FOUND") {
      alert("Nomor belum terdaftar");
    } else {
      tampilkanDashboard(data);
    }

  } catch {
    alert("Gagal koneksi server");
  }
};

/* =====================================================
   DASHBOARD
===================================================== */
async function tampilkanDashboard(data) {

  const popup = el("popupDashboard");
  const isi = el("isiDashboard");

  const hadir = (data.statushadir || "").toUpperCase() === "HADIR";

  isi.innerHTML = `
    <h3>Halo, ${data.nama}</h3>
    <p>${data.nohp}</p>
    <p>Jumlah: ${data.jumlah}</p>
    <p>Status: ${hadir ? "HADIR" : "BELUM"}</p>

    <div id="qrArea"></div>
    <div id="kuotaBox"></div>
  `;

  popup.classList.add("active");

  const qrArea = el("qrArea");

  if (hadir) {

    qrArea.innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
      <br><br>
      <button onclick="batalHadir('${data.nohp}')">Batal Hadir</button>
    `;

  } else {

    qrArea.innerHTML = `
      <button onclick="konfirmasiHadir('${data.nohp}')">
        Konfirmasi Kehadiran
      </button>
    `;
  }

  /* LOAD KUOTA */
  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda`);
    const k = await res.json();

    const total = Number(k.kapasitas) || 160;
    const sisa = (k.sisa !== undefined)
      ? Number(k.sisa)
      : total;

    el("kuotaBox").innerHTML = `
      <p>🏕️ Sisa Kuota: ${sisa} / ${total}</p>
    `;
  } catch {}
}

/* =====================================================
   AKSI
===================================================== */
window.konfirmasiHadir = async function (nohp) {

  try {
    const res = await fetch(`${apiUrl}?mode=konfirmasi&nohp=${nohp}`);
    const data = await res.json();

    alert(data.message);
    loginPeserta();

  } catch {
    alert("Gagal koneksi");
  }
};

window.batalHadir = async function (nohp) {

  if (!confirm("Yakin batal hadir?")) return;

  try {
    const res = await fetch(`${apiUrl}?mode=konfirmasi&nohp=${nohp}`);
    const data = await res.json();

    alert(data.message);
    loginPeserta();

  } catch {
    alert("Gagal koneksi");
  }
};
