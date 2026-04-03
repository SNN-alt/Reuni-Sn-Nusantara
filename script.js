/* =====================================================
   REUNI SN NUSANTARA 2026 - CLEAN VERSION
===================================================== */

const apiUrl = "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";
const eventDate = new Date("2026-04-11T00:00:00+07:00");

let lastNoHp = "";

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initModal();
  initSponsor();
  initLinks();
  initCountdown();
  loadStatistik();
  loadKuota();

  setInterval(loadStatistik, 30000);
  setInterval(loadKuota, 10000);
});

/* =====================================================
   UTIL
===================================================== */
function safe(val) {
  return val || "";
}

function showError(err) {
  console.error(err);
}

function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, m => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

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
      btn.addEventListener("click", () => {
        btn.closest(".modal, .popup-overlay")?.classList.remove("active");
      });
    });

  window.bukaPanduan = () => document.getElementById("modalPanduan").classList.add("active");
  window.bukaProposal = () => document.getElementById("modalProposal").classList.add("active");

  const btnCallCenter = document.getElementById("btnCallCenter");
  if (btnCallCenter) {
    btnCallCenter.onclick = () => document.getElementById("modalCallCenter").classList.add("active");
  }
}

/* =====================================================
   LINK
===================================================== */
function initLinks() {
  window.bukaPeserta = () => window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
  window.bukaUMKM = () => window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
}

/* =====================================================
   SPONSOR
===================================================== */
function initSponsor() {
  const overlay = document.getElementById("sponsorOverlay");
  const preview = document.getElementById("sponsorPreview");

  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.addEventListener("click", () => {
      preview.src = img.src;
      overlay.classList.add("active");
    });
  });

  document.getElementById("closeSponsor")?.addEventListener("click", () => {
    overlay.classList.remove("active");
  });
}

/* =====================================================
   COUNTDOWN
===================================================== */
function initCountdown() {
  const box = document.getElementById("countdownBox");

  function update() {
    const diff = eventDate - new Date();

    if (diff <= 0) {
      box.innerHTML = "🎉 Acara Sedang Berlangsung!";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    box.innerHTML = `
      ⏳ ${d} Hari 
      ${String(h).padStart(2,"0")} Jam 
      ${String(m).padStart(2,"0")} Menit 
      ${String(s).padStart(2,"0")} Detik
    `;
  }

  setInterval(update, 1000);
  update();
}

/* =====================================================
   STATISTIK
===================================================== */
async function loadStatistik() {
  const box = document.getElementById("statistikBox");

  try {
    const res = await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
    const data = await res.json();

    box.innerHTML = `
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
  } catch (err) {
    showError(err);
  }
}

/* =====================================================
   KUOTA TENDA (FIXED)
===================================================== */
async function loadKuota() {
  const box = document.getElementById("progressKuota");
  if (!box) return;

  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const data = await res.json();

    const total = data.kapasitas || 0;
    const sisa = data.sisa || 0;
    const terpakai = data.totalTenda || 0;
    const percent = total ? Math.min(100, (terpakai / total) * 100) : 0;

    let warna = "#28a745";
    if (percent > 60) warna = "#ffc107";
    if (percent > 85) warna = "#dc3545";

    box.innerHTML = `
      <div style="margin-bottom:8px;font-weight:600;">
        Sisa Kuota Tenda: <strong>${sisa}</strong> / ${total}
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%; background:${warna};"></div>
      </div>
    `;
  } catch (err) {
    showError(err);
    box.innerHTML = `<div style="color:red;">Gagal load kuota</div>`;
  }
}

/* =====================================================
   LOGIN
===================================================== */
window.loginPeserta = async function (manualNoHp = null) {
  const input = document.getElementById("nohpLogin");

  let nohp = manualNoHp 
    ? manualNoHp 
    : input.value.replace(/\D/g, "");

  if (nohp.length < 10) {
    alert("Nomor HP tidak valid");
    return;
  }

  lastNoHp = nohp;

  try {
    const res = await fetch(`${apiUrl}?mode=login&nohp=${nohp}`);
    const data = await res.json();

    if (data.status === "NOT_FOUND") {
      alert("Nomor belum terdaftar");
    } else {
      tampilkanDashboard(data);
    }

  } catch (err) {
    showError(err);
    alert("Gagal koneksi server");
  }
};

/* =====================================================
   DASHBOARD
===================================================== */
window.tampilkanDashboard = async function (data) {

  const popup = document.getElementById("popupDashboard");
  const isi = document.getElementById("isiDashboard");

  const statusHadir = safe(data.statushadir).toUpperCase();
  const qrAktif = safe(data.qr_aktif);

  const statusBadge =
    statusHadir === "HADIR"
      ? `<span class="badge badge-green">HADIR</span>`
      : `<span class="badge badge-gray">BELUM KONFIRMASI</span>`;

  isi.innerHTML = `
    <h3>Halo, ${escapeHTML(data.nama)}</h3>

    <table class="info-table">
      <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
      <tr><td>Jumlah</td><td class="val">${data.jumlah}</td></tr>
      <tr><td>Status</td><td class="val">${statusBadge}</td></tr>
    </table>

    <div id="qrArea"></div>
    <div id="tendaGlobal"></div>
  `;

  popup.classList.add("active");

  const qrArea = document.getElementById("qrArea");
  const tendaGlobal = document.getElementById("tendaGlobal");

  /* ===== STATUS ===== */
  if (statusHadir === "HADIR" && qrAktif === "YA") {

    const dapatTenda = safe(data.tenda).toUpperCase() === "YA";

    qrArea.innerHTML = `
      <div class="qr-frame">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
      </div>

      <p>Tunjukkan QR ke panitia</p>

      <div style="color:${dapatTenda ? "#28a745" : "#dc3545"};font-weight:600;">
        ${dapatTenda ? "✅ Dapat tenda" : "⚠ Tenda habis"}
      </div>

      <button class="konfirmasi-btn" onclick="batalHadir('${data.nohp}')">
        Batal Hadir
      </button>
    `;

  } else if (statusHadir === "HADIR") {

    qrArea.innerHTML = `
      <div style="color:#ffc107;">QR belum aktif</div>
    `;

  } else {

    qrArea.innerHTML = `
      <button class="konfirmasi-btn" onclick="konfirmasiHadir('${data.nohp}')">
        Konfirmasi Kehadiran
      </button>
    `;
  }

  /* ===== KUOTA GLOBAL ===== */
  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const stat = await res.json();

    const total = stat.kapasitas || 0;
    const sisa = stat.sisa || 0;
    const terpakai = stat.totalTenda || 0;
    const percent = total ? Math.min(100, (terpakai / total) * 100) : 0;

    tendaGlobal.innerHTML = `
      <div style="background:#111;padding:15px;border-radius:12px;color:white;">
        🏕️ Sisa: ${sisa} / ${total}
        <div style="height:10px;background:#333;margin-top:8px;">
          <div style="width:${percent}%;height:100%;background:#28a745;"></div>
        </div>
      </div>
    `;

  } catch (err) {
    showError(err);
  }
};

/* =====================================================
   AKSI
===================================================== */
window.konfirmasiHadir = async function (nohp) {

  const btn = document.querySelector(".konfirmasi-btn");
  if (btn) btn.disabled = true;

  try {
    const res = await fetch(`${apiUrl}?mode=konfirmasi&nohp=${nohp}`);
    const data = await res.json();

    alert(data.message);
    loginPeserta(lastNoHp);

  } catch (err) {
    showError(err);
    alert("Gagal koneksi");
  } finally {
    if (btn) btn.disabled = false;
  }
};

window.batalHadir = async function (nohp) {
  if (!confirm("Yakin batal hadir?")) return;

  try {
    const res = await fetch(`${apiUrl}?mode=konfirmasi&nohp=${nohp}`);
    const data = await res.json();

    alert(data.message);
    loginPeserta(lastNoHp);

  } catch (err) {
    showError(err);
    alert("Gagal koneksi");
  }
};
