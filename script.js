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
/* =====================================================
   KUOTA TENDA (SUPER FIX - ANTI ERROR 181/160)
===================================================== */
async function loadKuota() {

  const box = el("progressKuota");
  if (!box) return;

  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const data = await res.json();

    /* ================= VALIDASI ANGKA ================= */
    const kapasitas = parseInt(data.kapasitas) || 160;
    let terpakai = parseInt(data.totalTenda) || 0;

    // ❗ Anti error negatif / NaN / lebih dari kapasitas
    if (terpakai < 0) terpakai = 0;
    if (terpakai > kapasitas) terpakai = kapasitas;

    const sisa = Math.max(0, kapasitas - terpakai);

    const percent = Math.min(100, (terpakai / kapasitas) * 100);

    let warna = "#28a745";
    if (percent > 60) warna = "#ffc107";
    if (percent > 85) warna = "#dc3545";

    box.innerHTML = `
      <div style="margin-bottom:8px;font-weight:600;">
        Sisa Kuota Tenda: <strong>${sisa}</strong> / ${kapasitas}
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%; background:${warna};"></div>
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
/* =====================================================
   DASHBOARD PESERTA (FINAL FIX UI + KUOTA)
===================================================== */
async function tampilkanDashboard(data) {

  const popup = el("popupDashboard");
  const isi = el("isiDashboard");

  const hadir = (data.statushadir || "").toUpperCase() === "HADIR";
  const dapatTenda = (data.tenda || "").toUpperCase() === "YA";

  const badge = hadir
    ? `<span class="badge badge-green">HADIR</span>`
    : `<span class="badge badge-gray">BELUM KONFIRMASI</span>`;

  isi.innerHTML = `
    <h3 style="margin-bottom:15px;">Halo, ${data.nama}</h3>

    <table class="info-table">
      <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
      <tr><td>Jumlah</td><td class="val">${data.jumlah}</td></tr>
      <tr><td>Status</td><td class="val">${badge}</td></tr>
    </table>

    <div id="qrArea" style="margin-top:15px;"></div>
    <div id="kuotaBox" style="margin-top:20px;"></div>
  `;

  popup.classList.add("active");

  const qrArea = el("qrArea");

  /* ================= JIKA SUDAH HADIR ================= */
  if (hadir) {

    const infoTenda = dapatTenda
      ? `<div style="color:#28a745;font-weight:600;margin-top:10px;">
           ✅ Anda mendapatkan kuota tenda
         </div>`
      : `<div style="color:#dc3545;font-weight:600;margin-top:10px;">
           ⚠ Kuota tenda sudah habis,Hubungi Call Canter
         </div>`;

    qrArea.innerHTML = `
      <div class="qr-frame">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
      </div>

      <p style="margin-top:10px;font-weight:600;">
        Tunjukkan QR ke panitia
      </p>

      ${infoTenda}

      <button 
        class="konfirmasi-btn"
        style="background:#dc3545;color:white;margin-top:15px;"
        onclick="batalHadir('${data.nohp}')">
        Batal Hadir
      </button>

      <div style="font-size:12px;color:#888;margin-top:8px;">
        Jika batal, kuota tenda akan diberikan ke peserta lain
      </div>
    `;

  } 
  /* ================= BELUM HADIR ================= */
  else {

    qrArea.innerHTML = `
      <button 
        class="konfirmasi-btn"
        style="background:#198754;color:white;width:100%;"
        onclick="konfirmasiHadir('${data.nohp}')">
        Konfirmasi Kehadiran
      </button>

      <div style="font-size:12px;color:#888;margin-top:8px;">
        Konfirmasi untuk mendapatkan kuota tenda
      </div>
    `;
  }

  /* ================= KUOTA GLOBAL FIX ================= */
  try {
    const res = await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const k = await res.json();

    const kapasitas = parseInt(k.kapasitas) || 160;
    let terpakai = parseInt(k.totalTenda) || 0;

    if (terpakai < 0) terpakai = 0;
    if (terpakai > kapasitas) terpakai = kapasitas;

    const sisa = Math.max(0, kapasitas - terpakai);
    const percent = Math.min(100, (terpakai / kapasitas) * 100);

    let warna = "#28a745";
    if (percent > 60) warna = "#ffc107";
    if (percent > 85) warna = "#dc3545";

    el("kuotaBox").innerHTML = `
      <div style="
        background:#111;
        padding:15px;
        border-radius:12px;
        text-align:center;
        color:white;
      ">

        <div style="margin-bottom:8px;font-weight:600;">
          🏕️ Sisa Kuota Tenda: ${sisa} / ${kapasitas}
        </div>

        <div style="
          width:100%;
          height:10px;
          background:#333;
          border-radius:10px;
          overflow:hidden;
        ">
          <div style="
            width:${percent}%;
            height:100%;
            background:${warna};
          "></div>
        </div>

        <div style="font-size:12px;margin-top:6px;color:#aaa;">
          Terisi ${terpakai} orang
        </div>

      </div>
    `;

  } catch {
    el("kuotaBox").innerHTML = `
      <div style="color:red;text-align:center;">
        Gagal load kuota tenda
      </div>
    `;
  }
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
/* =====================================================
   QR SCANNER ADMIN (1 USER UNTUK SEMUA)
===================================================== */

function startScanner() {

  const hasil = document.getElementById("hasilScan");

  const html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {

    if (devices && devices.length) {

      html5QrCode.start(
        devices[0].id,
        {
          fps: 10,
          qrbox: 250
        },
        async (decodedText) => {

          // STOP SCAN SEMENTARA
          await html5QrCode.stop();

          hasil.innerHTML = "⏳ Memproses...";

          try {
            const res = await fetch(`${apiUrl}?mode=scan&kode=${decodedText}`);
            const data = await res.json();

            /* ================= HASIL ================= */

            if (data.status === "SUCCESS") {

              hasil.innerHTML = `
                <div style="color:#28a745;">
                  ✅ ${data.nama}<br>
                  Status: HADIR<br>
                  Tenda: ${data.tenda}
                </div>
              `;

            } else if (data.status === "ALREADY_USED") {

              hasil.innerHTML = `<div style="color:#ffc107;">⚠ Sudah pernah scan</div>`;

            } else if (data.status === "NOT_ACTIVE") {

              hasil.innerHTML = `<div style="color:#dc3545;">❌ QR belum aktif</div>`;

            } else {

              hasil.innerHTML = `<div style="color:#dc3545;">❌ QR tidak ditemukan</div>`;
            }

          } catch {
            hasil.innerHTML = `<div style="color:red;">Gagal koneksi server</div>`;
          }

          /* ================= AUTO SCAN LAGI ================= */
          setTimeout(() => {
            startScanner();
          }, 2500);

        }
      );
    }
  });
}

/* AUTO START */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("reader")) {
    startScanner();
  }
});
