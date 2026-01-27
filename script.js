/* ===================== */
/*  MODAL PANDUAN & PROPOSAL */
/* ===================== */

function bukaPanduan() {
  document.getElementById("modalPanduan").style.display = "block";
}

function tutupPanduan() {
  document.getElementById("modalPanduan").style.display = "none";
}

function bukaProposal() {
  document.getElementById("modalProposal").style.display = "block";
}

function tutupProposal() {
  document.getElementById("modalProposal").style.display = "none";
}

function tutupDashboard(){
  document.getElementById("popupDashboard").style.display = "none";
}


/* ===================== */
/*  MODAL FORM PESERTA, UMKM, CALL CENTER */
/* ===================== */

const modalPeserta = document.getElementById("modalPeserta");
const modalUMKM = document.getElementById("modalUMKM");
const modalCallCenter = document.getElementById("modalCallCenter");

document.getElementById("btnPeserta").onclick = () => modalPeserta.style.display = "block";
document.getElementById("btnUMKM").onclick = () => modalUMKM.style.display = "block";
document.getElementById("btnCallCenter").onclick = () => modalCallCenter.style.display = "block";

modalPeserta.querySelector(".close").onclick = () => modalPeserta.style.display = "none";
modalUMKM.querySelector(".close").onclick = () => modalUMKM.style.display = "none";
modalCallCenter.querySelector(".close").onclick = () => modalCallCenter.style.display = "none";


/* ===================== */
/*  MODAL SPONSOR IMAGE */
/* ===================== */

const modalSponsor = document.getElementById("modalSponsor");
const modalImg = document.getElementById("imgModal");
const closeSponsor = modalSponsor.querySelector(".close");

document.querySelectorAll(".sponsor-img").forEach(img => {
  img.onclick = () => {
    modalSponsor.style.display = "block";
    modalImg.src = img.src;
  };
});

closeSponsor.onclick = () => modalSponsor.style.display = "none";


/* ===================== */
/*  TUTUP SEMUA MODAL JIKA KLIK LUAR */
/* ===================== */

window.onclick = function(event) {
  if (event.target === modalPeserta) modalPeserta.style.display = "none";
  if (event.target === modalUMKM) modalUMKM.style.display = "none";
  if (event.target === modalCallCenter) modalCallCenter.style.display = "none";
  if (event.target === modalPanduan) modalPanduan.style.display = "none";
  if (event.target === modalProposal) modalProposal.style.display = "none";
  if (event.target === modalSponsor) modalSponsor.style.display = "none";
};


/* ===================== */
/*  WHATSAPP FUNCTION */
/* ===================== */

function openWhatsApp(number) {
  window.open("https://wa.me/" + number, "_blank");
}

function tampilkanDashboard(data){
  const html = `
    <h3>👋 Halo, ${data.nama}</h3>

    <table style="width:100%;font-size:14px;margin-top:10px;">
      <tr><td><b>No HP</b></td><td>: ${data.nohp}</td></tr>
      <tr><td><b>Jenis Kelamin</b></td><td>: ${data.jk}</td></tr>
      <tr><td><b>Datang bersama keluarga</b></td><td>: ${data.keluarga}</td></tr>
      <tr><td><b>Jumlah anggota</b></td><td>: ${data.jumlah}</td></tr>
      <tr><td><b>Kebutuhan parkir</b></td><td>: ${data.parkir}</td></tr>
      <tr><td><b>Status Kehadiran</b></td><td>: ${data.statusHadir || "BELUM KONFIRMASI"}</td></tr>
    </table>

    <div id="qrCode" style="text-align:center;margin-top:15px;"></div>
  `;

  document.getElementById("isiDashboard").innerHTML = html;
  document.getElementById("popupDashboard").style.display = "flex";

// ===== LOGIKA QR =====
if (data.qr_aktif === "YA") {

  // Jika sudah konfirmasi → tampilkan QR
  document.getElementById("qrCode").innerHTML =
    '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
    encodeURIComponent(data.qr) + 
    '" style="margin-top:10px;">';

} else {

  // Jika belum konfirmasi → tampilkan info + tombol
  document.getElementById("qrCode").innerHTML = `
    <p style="color:#000;font-weight:bold;">
      Klik tombol Konfirmasi Kehadiran di bawah ini.
    </p>
    <p style="font-size:13px;">
      Tombol aktif mulai <b>H-7 sebelum acara</b>.<br>
      Setelah dikonfirmasi, QR Code langsung muncul dan digunakan saat check-in acara.
    </p>

    <button onclick="konfirmasiHadir('${data.id}')"
      style="
        margin-top:10px;
        padding:10px 18px;
        background:#28a745;
        color:white;
        border:none;
        border-radius:6px;
        cursor:pointer;
        font-size:14px;">
      Konfirmasi Kehadiran
    </button>
  `;
}

