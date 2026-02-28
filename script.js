let nohpAktif = "";
let namaAktif = "";
/* =================================================
   GLOBAL API URL
================================================= */
const apiUrl =
  "https://script.google.com/macros/s/AKfycbzNp16IqpdW5X7gZqC2WLKtpmU6FEHI5wUOQmHXknXWrpipp2kHzqmPjQ223Frvq7ao/exec";


/* =================================================
   DOM READY
================================================= */
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
  const btnCallCenter   = document.getElementById("btnCallCenter");

  if (btnCallCenter && modalCallCenter) {
    btnCallCenter.onclick = () =>
      modalCallCenter.style.display = "block";

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
  const closeSponsor   = document.getElementById("closeSponsor");

  if (sponsorOverlay) sponsorOverlay.style.display = "none";

  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.addEventListener("click", () => {
      sponsorPreview.src = img.src;
      sponsorOverlay.style.display = "flex";
    });
  });

  closeSponsor?.addEventListener("click", e => {
    e.stopPropagation();
    sponsorOverlay.style.display = "none";
    sponsorPreview.src = "";
  });

  sponsorOverlay?.addEventListener("click", e => {
    if (e.target === sponsorOverlay) {
      sponsorOverlay.style.display = "none";
      sponsorPreview.src = "";
    }
  });


  /* =================================================
   LOGIN PESERTA
================================================= */
window.loginPeserta = function () {
  // Ambil nilai & pastikan hanya angka
  const nohpInput = document.getElementById("nohpLogin");
  const nohp = nohpInput.value.replace(/[^0-9]/g, "");

  // Update field (jaga-jaga kalau paste teks)
  nohpInput.value = nohp;

  // Validasi dasar
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

/* =================================================
   DASHBOARD PESERTA
================================================= */
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
    <div id="kamarArea" style="margin-top:15px;text-align:center;"></div>
  `;

  document.getElementById("popupDashboard").style.display = "flex";

  /* =========================
     QR / KONFIRMASI H-7
  ========================== */

  if (String(data.qr_aktif).toUpperCase() === "YA") {

    document.getElementById("qrArea").innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
      <p style="font-size:13px">Tunjukkan QR saat registrasi</p>
    `;

  } else {

    const now = new Date();
    const todayWIB = new Date(
      now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000
    );

    const eventDate = new Date("2026-04-11T00:00:00+07:00");
    const h7 = new Date(eventDate);
    h7.setDate(eventDate.getDate() - 7);

    const aktif = todayWIB >= h7;

    document.getElementById("qrArea").innerHTML = `
      <p style="color:red;font-weight:bold">
        QR aktif mulai H-7 sebelum acara
      </p>

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
  /* =========================
     TOMBOL TENDA
  ========================== */

  const tendaArea = document.getElementById("tendaArea");

  if (String(data.tenda).toUpperCase() === "YA") {

    tendaArea.innerHTML = `
      <p style="font-weight:bold;color:#28a745;">
        🏕 Anda sudah memesan tenda
      </p>
      <button
        onclick="toggleTenda('${data.nohp}', '${data.tenda || ""}')"
        style="
          margin-top:8px;
          padding:10px 16px;
          border:none;
          border-radius:8px;
          background:#dc3545;
          color:white;">
        Batalkan Tenda
      </button>
    `;

  } else {

    tendaArea.innerHTML = `
      <button
        onclick="toggleTenda('${data.nohp}')"
        style="
          margin-top:8px;
          padding:10px 16px;
          border:none;
          border-radius:8px;
          background:#28a745;
          color:white;">
        Pesan Tenda
      </button>
    `;
  }

  /* =========================
     TAMPILKAN KUOTA TENDA
  ========================== */

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

};   // ← function baru ditutup di sini

   /* =========================
   TOMBOL KAMAR
========================== */

const kamarArea = document.getElementById("kamarArea");

if (String(data.status_kamar || "").toUpperCase() === "LUNAS") {

  kamarArea.innerHTML = `
    <p style="font-weight:bold;color:#28a745;">
      🏨 Status Kamar: LUNAS
    </p>
    <p>${data.tipe_kamar || ""}</p>
  `;

} else if (String(data.status_kamar || "").toUpperCase() === "MENUNGGU") {

  kamarArea.innerHTML = `
    <p style="font-weight:bold;color:#ffc107;">
      🏨 Status: MENUNGGU PEMBAYARAN
    </p>
    <p>${data.tipe_kamar || ""}</p>

    <button
      onclick="redirectPembayaran('${data.nohp}','${data.nama}','${data.tipe_kamar}')"
      style="margin-top:8px;padding:10px 16px;border:none;border-radius:8px;background:#28a745;color:white;">
      Lakukan Pembayaran
    </button>

    <button
      onclick="toggleKamarFrontend('${data.nohp}','${data.tipe_kamar}')"
      style="margin-top:8px;margin-left:8px;padding:10px 16px;border:none;border-radius:8px;background:#dc3545;color:white;">
      Batalkan
    </button>
  `;

} else {

  kamarArea.innerHTML = `
    <button
      onclick="pilihKamar('${data.nohp}')"
      style="margin-top:8px;padding:10px 16px;border:none;border-radius:8px;background:#007bff;color:white;">
      Pesan Kamar
    </button>
  `;
}
   
/* =================================================
   TUTUP DASHBOARD PESERTA
================================================= */
window.tutupDashboard = function () {
  const popup = document.getElementById("popupDashboard");
  if (popup) popup.style.display = "none";
};

/* === KLIK AREA GELAP UNTUK TUTUP === */
const popup = document.getElementById("popupDashboard");
if (popup) {
  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
}

  /* =================================================
     KONFIRMASI KEHADIRAN
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
     STATISTIK (AUTO UPDATE)
  ================================================= */
  function loadStatistik() {
    const statistikBox = document.getElementById("statistikBox");
    if (!statistikBox) return;

    fetch(apiUrl + "?mode=statistik&t=" + Date.now(), { cache: "no-store" })
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

  // load pertama + auto refresh
  loadStatistik();
  setInterval(loadStatistik, 10000);

}); // ✅ DOMContentLoaded TERTUTUP DENGAN BENAR


/* =================================================
   LINK FORM (GLOBAL)
================================================= */
function bukaPeserta() {
  window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
}

function bukaUMKM() {
  window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
}

/* =================================================
   TENDA
================================================= */
function toggleTenda(nohp, currentStatus) {

  const modal = document.getElementById("modalTenda");
  const isi = document.getElementById("isiModalTenda");

  modal.style.display = "flex";

  if (currentStatus === "YA") {

    isi.innerHTML = `
      <h3>Batalkan Tenda?</h3>
      <p>Yakin ingin membatalkan pesanan tenda?</p>

      <button onclick="prosesTenda('${nohp}')"
        style="margin:8px;padding:8px 14px;background:#dc3545;color:white;border:none;border-radius:6px;">
        Ya, Batalkan
      </button>

      <button onclick="tutupModalTenda()"
        style="margin:8px;padding:8px 14px;background:#aaa;color:white;border:none;border-radius:6px;">
        Tutup
      </button>
    `;

  } else {

    isi.innerHTML = `
      <h3>Pesan Tenda?</h3>
      <p>Anda yakin ingin memesan tenda?</p>

      <button onclick="prosesTenda('${nohp}')"
        style="margin:8px;padding:8px 14px;background:#28a745;color:white;border:none;border-radius:6px;">
        Setuju
      </button>

      <button onclick="tutupModalTenda()"
        style="margin:8px;padding:8px 14px;background:#aaa;color:white;border:none;border-radius:6px;">
        Tidak
      </button>
    `;
  }
}

function prosesTenda(nohp) {

  fetch(`${apiUrl}?mode=toggleTenda&nohp=${encodeURIComponent(nohp)}`)
    .then(res => res.json())
    .then(data => {

      alert(data.message);

      tutupModalTenda();

      if (data.status === "OK" || data.status === "BATAL") {
        loginPeserta();
      }

    })
    .catch(() => alert("Gagal koneksi server"));
}

function tutupModalTenda() {
  document.getElementById("modalTenda").style.display = "none";
}

document.getElementById("closeTenda")?.addEventListener("click", tutupModalTenda);

document.getElementById("modalTenda")?.addEventListener("click", function(e){
  if (e.target.id === "modalTenda") {
    tutupModalTenda();
  }
});

function pilihKamar(nohp) {
  document.getElementById("modalPilihKamar").style.display = "flex";
}

function tutupModalPilihKamar() {
  document.getElementById("modalPilihKamar").style.display = "none";
}

document.addEventListener("click", function (e) {
  const modal = document.getElementById("modalPilihKamar");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function konfirmasiPesanKamar() {

  const selected = document.querySelector('input[name="tipeKamar"]:checked');

  if (!selected) {
    alert("Silakan pilih tipe kamar");
    return;
  }

  const tipe = selected.value;

  fetch(`${apiUrl}?mode=toggleKamar&nohp=${encodeURIComponent(nohpAktif)}&tipe=${encodeURIComponent(tipe)}`)
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      tutupModalPilihKamar();
      loginPeserta(); // refresh dashboard
    })
    .catch(() => alert("Gagal koneksi server"));
}

function toggleKamarFrontend(nohp, tipe) {

  fetch(`${apiUrl}?mode=toggleKamar&nohp=${encodeURIComponent(nohp)}&tipe=${encodeURIComponent(tipe || "")}`)
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loginPeserta();
    })
    .catch(() => alert("Gagal koneksi server"));
}

function redirectPembayaran(nohp, nama, tipe) {

  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSensC9TSqAGd_EsXw1oib7u1Dp-wyEwtIL_bkE-xLWwwhDtyg/viewform?usp=pp_url" +
    "&entry.265402746=" + encodeURIComponent(nohp) +
    "&entry.1362223935=" + encodeURIComponent(nama) +
    "&entry.71905223=" + encodeURIComponent(tipe);

  window.open(formUrl, "_blank");
}





