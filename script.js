let nohpAktif = "";
let namaAktif = "";

const apiUrl =
  "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";

document.addEventListener("DOMContentLoaded", function () {

  /* ================= LOGIN ================= */

  window.loginPeserta = function () {

    const nohpInput = document.getElementById("nohpLogin");
    const nohp = nohpInput.value.replace(/[^0-9]/g, "");
    nohpInput.value = nohp;

    if (!nohp) {
      alert("Masukkan nomor HP");
      return;
    }

    if (nohp.length < 10) {
      alert("Nomor HP tidak valid");
      return;
    }

    fetch(`${apiUrl}?mode=login&nohp=${encodeURIComponent(nohp)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "NOT_FOUND") {
          alert("Nomor HP belum terdaftar");
        } else {
          tampilkanDashboard(data);
        }
      })
      .catch(() => alert("Gagal koneksi server"));
  };


  /* ================= DASHBOARD ================= */

  window.tampilkanDashboard = function (data) {

    nohpAktif = data.nohp;
    namaAktif = data.nama;

    document.getElementById("isiDashboard").innerHTML = `
      <h3>👋 Halo, ${data.nama}</h3>

      <table class="info-table">
        <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
        <tr><td>Jenis Kelamin</td><td class="val">${data.jk}</td></tr>
        <tr><td>Keluarga</td><td class="val">${data.keluarga}</td></tr>
        <tr><td>Jumlah</td><td class="val">${data.jumlah}</td></tr>
        <tr><td>Parkir</td><td class="val">${data.parkir}</td></tr>
        <tr><td>Status</td><td class="val">${data.statushadir || "BELUM KONFIRMASI"}</td></tr>
      </table>

      <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
      <div id="tendaArea" style="margin-top:15px;text-align:center;"></div>
    `;

    document.getElementById("popupDashboard").style.display = "flex";

    const qrArea = document.getElementById("qrArea");
    const tendaArea = document.getElementById("tendaArea");

    const statusHadir = (data.statushadir || "").toUpperCase();
    const statusTenda = (data.tenda || "").toUpperCase();

   /* ================= QR (AKTIF H-7 / MODE TEST) ================= */

const eventDate = new Date("2026-04-11T00:00:00+07:00");
const h7 = new Date(eventDate);
h7.setDate(eventDate.getDate() - 7);

const now = new Date();
const nowWIB = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);

// ================= MODE TEST =================
const MODE_TEST = true; // nanti ubah ke false saat produksi

const bolehKonfirmasi = MODE_TEST ? true : (nowWIB >= h7);

if ((data.qr_aktif || "").toUpperCase() === "YA") {

  qrArea.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
    <p style="font-size:13px">Tunjukkan QR saat registrasi</p>
  `;

} else {

  qrArea.innerHTML = `
    <p style="color:red;font-weight:bold;">
      Konfirmasi dibuka mulai 4 April 2026
    </p>

    <button
      onclick="konfirmasiHadir('${data.nohp}')"
      ${bolehKonfirmasi ? "" : "disabled"}
      style="
        margin-top:10px;
        padding:10px 16px;
        border:none;
        border-radius:8px;
        background:${bolehKonfirmasi ? "#28a745" : "#aaa"};
        color:white;
        cursor:${bolehKonfirmasi ? "pointer" : "not-allowed"};
      ">
      ${bolehKonfirmasi ? "Konfirmasi Kehadiran" : "Belum Aktif"}
    </button>
  `;
}
    /* ================= STATUS TENDA ================= */

    if (statusHadir === "HADIR") {

      if (statusTenda === "YA") {

        tendaArea.innerHTML = `
          <p style="color:#28a745;font-weight:bold;">
            🏕 Anda mendapatkan jatah tenda
          </p>
        `;

      } else {

        tendaArea.innerHTML = `
          <p style="color:#dc3545;font-weight:bold;">
            ⚠ Kuota tenda sudah habis. Hubungi Call Center.
          </p>
        `;
      }

    } else {

      tendaArea.innerHTML = `
        <p style="color:#999;">
          Konfirmasi kehadiran untuk mendapatkan jatah tenda
        </p>
      `;
    }

    /* ================= KUOTA TENDA ================= */

    fetch(`${apiUrl}?mode=ambilKuotaTenda&t=` + Date.now())
      .then(res => res.json())
      .then(kuota => {

        const kuotaInfo = document.createElement("p");
        kuotaInfo.style.marginTop = "8px";
        kuotaInfo.style.fontSize = "13px";
        kuotaInfo.style.fontWeight = "bold";

        kuotaInfo.innerHTML = `Sisa Kuota Tenda: ${kuota.sisa} / 200`;

        tendaArea.appendChild(kuotaInfo);
      });

  };


  /* ================= KONFIRMASI ================= */

  window.konfirmasiHadir = function (nohp) {

    fetch(`${apiUrl}?mode=konfirmasi&nohp=${encodeURIComponent(nohp)}`)
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        loginPeserta();
      })
      .catch(() => alert("Gagal koneksi server"));
  };


  /* ================= STATISTIK ================= */

  function loadStatistik() {

    const statistikBox = document.getElementById("statistikBox");
    if (!statistikBox) return;

    fetch(apiUrl + "?mode=statistik&t=" + Date.now())
      .then(res => res.json())
      .then(data => {

        statistikBox.innerHTML = `
          <div class="statistik-premium">
            <div class="stat-item">
              <small>Total Pendaftar</small>
              <span>${data.totalPeserta ?? 0}</span>
            </div>
            <div class="stat-item">
              <small>Sudah Konfirmasi</small>
              <span>${data.totalHadir ?? 0}</span>
            </div>
          </div>
        `;
      });
  }

  loadStatistik();
  setInterval(loadStatistik, 10000);

});


/* ================= TUTUP DASHBOARD ================= */

window.tutupDashboard = function () {
  document.getElementById("popupDashboard").style.display = "none";
};


/* ================= LINK FORM ================= */

function bukaPeserta() {
  window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
}

function bukaUMKM() {
  window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
}


