/* =================================================
   GLOBAL API URL
================================================= */
const apiUrl =
  "https://script.google.com/macros/s/AKfycbzwV7E0jGzc91GciG4dNYybpIpqFVhl9RpdBdqZyVAn_oS6kykA12_wAtR_lkh5WJWP/exec";


document.addEventListener("DOMContentLoaded", function () {

  /* =================================================
     MODAL PANDUAN & PROPOSAL
  ================================================= */
  window.bukaPanduan = () =>
    document.getElementById("modalPanduan").style.display = "block";

  window.tutupPanduan = () =>
    document.getElementById("modalPanduan").style.display = "none";

  window.bukaProposal = () =>
    document.getElementById("modalProposal").style.display = "block";

  window.tutupProposal = () =>
    document.getElementById("modalProposal").style.display = "none";


  /* =================================================
     CALL CENTER
  ================================================= */
  const modalCallCenter = document.getElementById("modalCallCenter");
  const btnCallCenter = document.getElementById("btnCallCenter");

  if (btnCallCenter && modalCallCenter) {
    btnCallCenter.onclick = () => modalCallCenter.style.display = "block";
    modalCallCenter.querySelector(".close")
      ?.addEventListener("click", () => {
        modalCallCenter.style.display = "none";
      });
  }


  /* =================================================
     MODAL SPONSOR
  ================================================= */
  const sponsorOverlay = document.getElementById("sponsorOverlay");
  const sponsorPreview = document.getElementById("sponsorPreview");
  const closeSponsor = document.getElementById("closeSponsor");

  if (sponsorOverlay) sponsorOverlay.style.display = "none";

  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.addEventListener("click", () => {
      sponsorPreview.src = img.src;
      sponsorOverlay.style.display = "flex";
    });
  });

  closeSponsor?.addEventListener("click", (e) => {
    e.stopPropagation();
    sponsorOverlay.style.display = "none";
    sponsorPreview.src = "";
  });

  sponsorOverlay?.addEventListener("click", (e) => {
    if (e.target === sponsorOverlay) {
      sponsorOverlay.style.display = "none";
      sponsorPreview.src = "";
    }
  });


  /* =================================================
     LOGIN PESERTA
  ================================================= */
  window.loginPeserta = function () {
    const nohp = document.getElementById("nohpLogin").value.trim();
    if (!nohp) return alert("Masukkan nomor HP");

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


  /* =================================================
     DASHBOARD PESERTA
  ================================================= */
  window.tampilkanDashboard = function (data) {

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
    `;

    document.getElementById("popupDashboard").style.display = "flex";

    /* ===== QR & H-7 ===== */
    if (String(data.qr_aktif).toUpperCase() === "YA") {

      document.getElementById("qrArea").innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
        <p style="font-size:13px">Tunjukkan QR saat registrasi</p>
      `;

    } else {

      const today = new Date();
      const eventDate = new Date("2026-04-11T00:00:00");
      const h7 = new Date(eventDate);
      h7.setDate(eventDate.getDate() - 7);
      const aktif = today >= h7;

      document.getElementById("qrArea").innerHTML = `
        <p style="color:red;font-weight:bold">QR aktif mulai H-7 sebelum acara</p>

        <button
          onclick="konfirmasiHadir('${data.nohp}')"
          ${aktif ? "" : "disabled"}
          style="
            margin-top:10px;
            padding:10px 16px;
            border:none;
            border-radius:8px;
            background:${aktif ? "#28a745" : "#aaa"};
            color:white;
            cursor:${aktif ? "pointer" : "not-allowed"};
          ">
          ${aktif ? "Konfirmasi Kehadiran" : "Aktif 4 April 2026"}
        </button>
      `;
    }
  };


  /* =================================================
     KONFIRMASI
  ================================================= */
  window.konfirmasiHadir = function (nohp) {
    document.getElementById("qrArea").innerHTML = "⏳ Memproses...";

    fetch(`${apiUrl}?mode=konfirmasi&nohp=${encodeURIComponent(nohp)}`)
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (data.status === "OK") loginPeserta();
      })
      .catch(() => alert("Gagal koneksi server"));
  };


  /* =================================================
     TUTUP DASHBOARD
  ================================================= */
  window.tutupDashboard = function () {
    document.getElementById("popupDashboard").style.display = "none";
  };


  /* =================================================
     LOAD STATISTIK PESERTA (AUTO)
  ================================================= */
fetch(apiUrl + "?mode=statistik")
  .then(res => res.json())
  .then(data => {

    // 🔑 fallback aman (anti undefined)
    const totalPeserta = data.totalPeserta ?? 0;
    const totalHadir   = data.totalHadir   ?? 0;

    document.getElementById("statistikBox").innerHTML = `
      <div class="statistik-premium">
        <div>
          <b>Total Pendaftar</b>
          <span>${totalPeserta}</span>
        </div>
        <div>
          <b>Sudah Konfirmasi</b>
          <span>${totalHadir}</span>
        </div>
      </div>
    `;
  })
  .catch(() => {
    document.getElementById("statistikBox").innerHTML = `
      <div class="statistik-premium">
        <div>
          <b>Total Pendaftar</b>
          <span>0</span>
        </div>
        <div>
          <b>Sudah Konfirmasi</b>
          <span>0</span>
        </div>
      </div>
    `;
  });


/* =================================================
   LINK FORM
================================================= */
function bukaPeserta() {
  window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
}

function bukaUMKM() {
  window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
}

