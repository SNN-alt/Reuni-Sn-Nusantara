/* =====================================================
   REUNI SN NUSANTARA 2026 - FULL PROFESSIONAL SCRIPT
===================================================== */

const apiUrl = "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";
const eventDate = new Date("2026-04-11T00:00:00+07:00");

document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     GLOBAL MODAL SYSTEM
  ===================================================== */
  document.querySelectorAll(".modal, .popup-overlay, #sponsorOverlay")
    .forEach(modal => {
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.remove("active");
      });
    });

  document.querySelectorAll(".close, .close-x")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".modal, .popup-overlay").classList.remove("active");
      });
    });

  /* =====================================================
     OPEN MODAL FUNCTIONS
  ===================================================== */
  window.bukaPanduan = () => modalPanduan.classList.add("active");
  window.bukaProposal = () => modalProposal.classList.add("active");
  btnCallCenter.onclick = () => modalCallCenter.classList.add("active");

  /* =====================================================
     FORM LINKS (FIX)
  ===================================================== */
  window.bukaPeserta = function () {
    window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
  };

  window.bukaUMKM = function () {
    window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
  };

  /* =====================================================
     SPONSOR ZOOM
  ===================================================== */
  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.addEventListener("click", function () {
      sponsorPreview.src = this.src;
      sponsorOverlay.classList.add("active");
    });
  });

  if (closeSponsor) {
    closeSponsor.onclick = () => sponsorOverlay.classList.remove("active");
  }

  /* =====================================================
     COUNTDOWN TIMER
  ===================================================== */
  /* ===== COUNTDOWN FULL FORMAT ===== */
function updateCountdown() {

  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    countdownBox.innerHTML = "🎉 Acara Sedang Berlangsung!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownBox.innerHTML = `
    ⏳ ${days} Hari 
    ${hours.toString().padStart(2,'0')} Jam 
    ${minutes.toString().padStart(2,'0')} Menit 
    ${seconds.toString().padStart(2,'0')} Detik
  `;
}

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* =====================================================
     STATISTIK LIVE
  ===================================================== */
  async function loadStatistik() {
    try {
      const res = await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
      const data = await res.json();

      statistikBox.innerHTML = `
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

  loadStatistik();
  setInterval(loadStatistik, 30000);

/* =====================================================
   KUOTA TENDA FINAL (PASTI MUNCUL)
===================================================== */
async function loadKuota() {

  const box = document.getElementById("progressKuota");

  if (!box) {
    console.warn("❌ progressKuota tidak ditemukan di HTML");
    return;
  }

  // loading dulu
  box.innerHTML = `<div style="color:#aaa;">Loading kuota...</div>`;

  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const data = await res.json();

    console.log("✅ DATA KUOTA:", data);

    const total = 160;
    const sisa = parseInt(data.sisa) || 0;
    const used = total - sisa;

    const percent = Math.min(100, (used / total) * 100);

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

      <div style="font-size:12px;margin-top:6px;color:#aaa;">
        Lakukan konfirmasi untuk mendapatkan kuota tenda
      </div>
    `;

  } catch (err) {

    console.error("❌ ERROR KUOTA:", err);

    box.innerHTML = `
      <div style="color:red;">Gagal load kuota</div>
    `;
  }
}
  /* =====================================================
     LOGIN SYSTEM
  ===================================================== */
  window.loginPeserta = async function () {

    let nohp = nohpLogin.value.replace(/\D/g, "");
    nohpLogin.value = nohp;

    if (nohp.length < 10) {
      alert("Nomor HP tidak valid");
      return;
    }

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
     DASHBOARD SYSTEM
  ===================================================== */
  window.tampilkanDashboard = async function (data) {

    const statusBadge =
      (data.statushadir || "").toUpperCase() === "HADIR"
        ? `<span class="badge badge-green">HADIR</span>`
        : `<span class="badge badge-gray">BELUM KONFIRMASI</span>`;

    isiDashboard.innerHTML = `
      <h3>Halo, ${data.nama}</h3>

      <table class="info-table">
        <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
        <tr><td>Jenis Kelamin</td><td class="val">${data.jk}</td></tr>
        <tr><td>Keluarga</td><td class="val">${data.keluarga}</td></tr>
        <tr><td>Jumlah</td><td class="val">${data.jumlah}</td></tr>
        <tr><td>Parkir</td><td class="val">${data.parkir}</td></tr>
        <tr><td>Status</td><td class="val">${statusBadge}</td></tr>
      </table>

      <div class="dashboard-section" id="qrArea"></div>
      <div class="dashboard-section" id="tendaArea"></div>
    `;

    popupDashboard.classList.add("active");

   /* ===== H-7 LOGIC ===== */
const h7 = new Date(eventDate.getTime() - (7 * 24 * 60 * 60 * 1000));
const nowWIB = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
const bolehKonfirmasi = nowWIB >= h7;

if ((data.qr_aktif || "").toUpperCase() === "YA") {

  qrArea.innerHTML = `
    <div class="qr-frame">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
    </div>
    <p style="margin-top:10px;font-weight:600;">
      Tunjukkan QR saat registrasi
    </p>
  `;

} else {

  qrArea.innerHTML = `
    <div class="konfirmasi-text">
      Konfirmasi dibuka 4 April 2026
    </div>

    <button 
      class="konfirmasi-btn"
      onclick="konfirmasiHadir('${data.nohp}')"
      ${bolehKonfirmasi ? "" : "disabled"}
      style="background:${bolehKonfirmasi ? "#198754" : "#aaa"};color:white;">
      ${bolehKonfirmasi ? "Konfirmasi Kehadiran" : "Belum Aktif"}
    </button>

    <div class="konfirmasi-info">
      Lakukan konfirmasi untuk mendapatkan kuota tenda
    </div>
  `;
}

    /* ===== STATUS TENDA ===== */
    try {
      const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
      const kuota = await res.json();

      tendaArea.innerHTML = `
        <div class="tenda-box">
          Sisa Kuota Tenda: <strong>${kuota.sisa}</strong> / 200
        </div>
      `;
    } catch {}
  };

  /* =====================================================
     KONFIRMASI HADIR
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

});


