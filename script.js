/* =====================================================
   REUNI SN NUSANTARA 2026 - FINAL STABLE SCRIPT
===================================================== */

const apiUrl = "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";
const eventDate = new Date("2026-04-11T00:00:00+07:00");

document.addEventListener("DOMContentLoaded", function () {

  /* ================= ELEMENT ================= */
  const statistikBox = document.getElementById("statistikBox");
  const countdownBox = document.getElementById("countdownBox");
  const progressKuota = document.getElementById("progressKuota");

  const modalPanduan = document.getElementById("modalPanduan");
  const modalProposal = document.getElementById("modalProposal");
  const modalCallCenter = document.getElementById("modalCallCenter");
  const btnCallCenter = document.getElementById("btnCallCenter");

  const sponsorOverlay = document.getElementById("sponsorOverlay");
  const sponsorPreview = document.getElementById("sponsorPreview");
  const closeSponsor = document.getElementById("closeSponsor");

  const popupDashboard = document.getElementById("popupDashboard");
  const isiDashboard = document.getElementById("isiDashboard");

  const nohpLogin = document.getElementById("nohpLogin");

  /* ================= MODAL ================= */
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

  window.bukaPanduan = () => modalPanduan.classList.add("active");
  window.bukaProposal = () => modalProposal.classList.add("active");

  if (btnCallCenter) {
    btnCallCenter.onclick = () => modalCallCenter.classList.add("active");
  }

  /* ================= LINK ================= */
  window.bukaPeserta = () => window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
  window.bukaUMKM = () => window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");

  /* ================= SPONSOR ================= */
  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.addEventListener("click", function () {
      sponsorPreview.src = this.src;
      sponsorOverlay.classList.add("active");
    });
  });

  if (closeSponsor) {
    closeSponsor.onclick = () => sponsorOverlay.classList.remove("active");
  }

  /* ================= COUNTDOWN ================= */
  function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      countdownBox.innerHTML = "🎉 Acara Sedang Berlangsung!";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownBox.innerHTML = `
      ⏳ ${d} Hari 
      ${h.toString().padStart(2,'0')} Jam 
      ${m.toString().padStart(2,'0')} Menit 
      ${s.toString().padStart(2,'0')} Detik
    `;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ================= STATISTIK ================= */
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

  /* ================= KUOTA TENDA ================= */
  async function loadKuota() {

    if (!progressKuota) return;

    progressKuota.innerHTML = `<div style="color:#aaa;">Loading kuota...</div>`;

    try {
      const res = await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
      const data = await res.json();

      const total = 160;
      const hadir = parseInt(data.totalHadir) || 0;
      const sisa = Math.max(0, total - hadir);
      const percent = Math.min(100, (hadir / total) * 100);

      let warna = "#28a745";
      if (percent > 60) warna = "#ffc107";
      if (percent > 85) warna = "#dc3545";

      progressKuota.innerHTML = `
        <div style="margin-bottom:8px;font-weight:600;">
          Sisa Kuota Tenda: <strong>${sisa}</strong> / ${total}
        </div>

        <div class="progress-bar">
          <div class="progress-fill" style="width:${percent}%; background:${warna};"></div>
        </div>

        <div style="font-size:12px;margin-top:6px;color:#aaa;">
          Berdasarkan peserta yang sudah konfirmasi
        </div>
      `;

    } catch {
      progressKuota.innerHTML = `<div style="color:red;">Gagal load kuota</div>`;
    }
  }

  loadKuota();
  setInterval(loadKuota, 10000);

  /* ================= LOGIN ================= */
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

  /* ================= DASHBOARD ================= */
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

    const qrArea = document.getElementById("qrArea");
    const tendaArea = document.getElementById("tendaArea");

    const h7 = new Date(eventDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const boleh = now >= h7;

    if ((data.qr_aktif || "").toUpperCase() === "YA") {
      qrArea.innerHTML = `
        <div class="qr-frame">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
        </div>
        <p>Tunjukkan QR saat registrasi</p>
      `;
    } else {
      qrArea.innerHTML = `
        <div class="konfirmasi-text">Konfirmasi dibuka H-7</div>
        <button class="konfirmasi-btn"
          onclick="konfirmasiHadir('${data.nohp}')"
          ${boleh ? "" : "disabled"}>
          ${boleh ? "Konfirmasi Kehadiran" : "Belum Aktif"}
        </button>
      `;
    }

    try {
      const res = await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
      const dataStat = await res.json();

      const total = 160;
      const hadir = parseInt(dataStat.totalHadir) || 0;
      const sisa = Math.max(0, total - hadir);

      tendaArea.innerHTML = `
        <div class="tenda-box">
          Sisa Kuota Tenda: <strong>${sisa}</strong> / ${total}
        </div>
      `;
    } catch {
      tendaArea.innerHTML = `<div class="tenda-box">Gagal load kuota</div>`;
    }

  };

  /* ================= KONFIRMASI ================= */
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
