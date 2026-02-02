document.addEventListener("DOMContentLoaded", function () {

  /* =================================================
     MODAL PANDUAN & PROPOSAL
  ================================================= */

  window.bukaPanduan = () => {
    document.getElementById("modalPanduan").style.display = "block";
  };

  window.tutupPanduan = () => {
    document.getElementById("modalPanduan").style.display = "none";
  };

  window.bukaProposal = () => {
    document.getElementById("modalProposal").style.display = "block";
  };

  window.tutupProposal = () => {
    document.getElementById("modalProposal").style.display = "none";
  };


  /* =================================================
     CALL CENTER
  ================================================= */

  const modalCallCenter = document.getElementById("modalCallCenter");
  const btnCallCenter   = document.getElementById("btnCallCenter");

  if (btnCallCenter && modalCallCenter) {
    btnCallCenter.onclick = () => {
      modalCallCenter.style.display = "block";
    };

    modalCallCenter.querySelector(".close")?.addEventListener("click", () => {
      modalCallCenter.style.display = "none";
    });
  }


  /* =================================================
     SPONSOR MODAL (HP & PC AMAN)
  ================================================= */

  const sponsorOverlay = document.getElementById("sponsorOverlay");
  const sponsorPreview = document.getElementById("sponsorPreview");
  const closeSponsor   = document.getElementById("closeSponsor");

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

  const apiUrl =
    "https://script.google.com/macros/s/AKfycbwbmKqK_JmmcXJECDcGia0jArqZ8K27fD51EOFPY8QyEPNbQ7LL3sQmxOot-qOHCdbx/exec";

  window.loginPeserta = function () {
    const nohp = document.getElementById("nohpLogin").value.trim();
    if (!nohp) {
      alert("Masukkan nomor HP");
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


    /* ================= QR & H-7 LOGIC ================= */

    if (String(data.qr_aktif).toUpperCase() === "YA") {

      document.getElementById("qrArea").innerHTML = `
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}"
          alt="QR Peserta">
        <p style="font-size:13px;margin-top:6px">
          Tunjukkan QR ini saat registrasi ulang
        </p>
      `;

    } else {

      const today         = new Date();
      const eventDate     = new Date("2026-04-11T00:00:00");
      const h7Date        = new Date(eventDate);
      h7Date.setDate(eventDate.getDate() - 7);

      const isActive = today >= h7Date;

      document.getElementById("qrArea").innerHTML = `
        <p style="color:red;font-weight:bold">
          QR aktif mulai H-7 sebelum acara
        </p>

        <p style="font-size:13px;margin-top:5px">
          Silakan klik tombol di bawah untuk konfirmasi kehadiran
        </p>

        <button
          onclick="konfirmasiHadir('${data.nohp}')"
          ${isActive ? "" : "disabled"}
          style="
            margin-top:8px;
            padding:8px 14px;
            border:none;
            border-radius:6px;
            background:${isActive ? "#28a745" : "#999"};
            color:white;
            font-size:14px;
            cursor:${isActive ? "pointer" : "not-allowed"};
          ">
          ${isActive ? "Konfirmasi Kehadiran" : "Aktif mulai 4 April 2026"}
        </button>
      `;
    }
  };


  /* =================================================
     KONFIRMASI KEHADIRAN
  ================================================= */

  window.konfirmasiHadir = function (nohp) {

    document.getElementById("qrArea").innerHTML =
      "<p>⏳ Memproses konfirmasi...</p>";

    fetch(`${apiUrl}?mode=konfirmasi&nohp=${encodeURIComponent(nohp)}`)
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (data.status === "OK") {
          loginPeserta(); // refresh data
        }
      })
      .catch(() => alert("Gagal koneksi Apps Script"));
  };


  /* =================================================
     TUTUP DASHBOARD
  ================================================= */

  window.tutupDashboard = function () {
    document.getElementById("popupDashboard").style.display = "none";
  };

});


/* =================================================
   DAFTAR PESERTA & UMKM (GLOBAL)
================================================= */

function bukaPeserta() {
  window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
}

function bukaUMKM() {
  window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
}

/* =================================================
   LOAD STATISTIK PESERTA
================================================= */

fetch(apiUrl + "?mode=statistik")
  .then(res => res.json())
  .then(data => {
    document.getElementById("statistikBox").innerHTML = `
      <strong>📊 INFO PESERTA</strong>
      Total Pendaftar : <b>${data.totalPeserta}</b> orang<br>
      Total Keluarga  : <b>${data.totalKeluarga}</b> orang<br>
      Sudah Konfirmasi: <b>${data.totalHadir}</b> orang
    `;
  })
  .catch(() => {
    document.getElementById("statistikBox").innerHTML =
      "❌ Gagal memuat data peserta";
  });
