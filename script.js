/* ===================== */
/*  AMBIL SEMUA MODAL */
/* ===================== */

const modalPanduan     = document.getElementById("modalPanduan");
const modalProposal   = document.getElementById("modalProposal");
const modalPeserta    = document.getElementById("modalPeserta");
const modalUMKM       = document.getElementById("modalUMKM");
const modalCallCenter = document.getElementById("modalCallCenter");
const modalSponsor    = document.getElementById("modalSponsor");
const popupDashboard  = document.getElementById("popupDashboard");

/* ===================== */
/*  FUNGSI BUKA TUTUP MODAL */
/* ===================== */

function bukaPanduan() {
  modalPanduan.style.display = "block";
}
function tutupPanduan() {
  modalPanduan.style.display = "none";
}

function bukaProposal() {
  modalProposal.style.display = "block";
}
function tutupProposal() {
  modalProposal.style.display = "none";
}

document.getElementById("btnPeserta").onclick = () => modalPeserta.style.display = "block";
document.getElementById("btnUMKM").onclick    = () => modalUMKM.style.display = "block";
document.getElementById("btnCallCenter").onclick = () => modalCallCenter.style.display = "block";

modalPeserta.querySelector(".close").onclick = () => modalPeserta.style.display = "none";
modalUMKM.querySelector(".close").onclick = () => modalUMKM.style.display = "none";
modalCallCenter.querySelector(".close").onclick = () => modalCallCenter.style.display = "none";

/* ===================== */
/*  MODAL SPONSOR */
/* ===================== */

const modalImg = document.getElementById("imgModal");
document.querySelectorAll(".sponsor-img").forEach(img => {
  img.onclick = () => {
    modalSponsor.style.display = "block";
    modalImg.src = img.src;
  };
});
modalSponsor.querySelector(".close").onclick = () => modalSponsor.style.display = "none";

/* ===================== */
/*  TUTUP SEMUA MODAL KLIK LUAR */
/* ===================== */

window.onclick = function(event) {
  if (event.target === modalPanduan) modalPanduan.style.display = "none";
  if (event.target === modalProposal) modalProposal.style.display = "none";
  if (event.target === modalPeserta) modalPeserta.style.display = "none";
  if (event.target === modalUMKM) modalUMKM.style.display = "none";
  if (event.target === modalCallCenter) modalCallCenter.style.display = "none";
  if (event.target === modalSponsor) modalSponsor.style.display = "none";
  if (event.target === popupDashboard) popupDashboard.style.display = "none";
};

/* ===================== */
/*  TUTUP DASHBOARD */
/* ===================== */

function tutupDashboard(){
  popupDashboard.style.display = "none";
}

/* ===================== */
/*  OPEN WHATSAPP */
/* ===================== */

function openWhatsApp(number) {
  window.open("https://wa.me/" + number, "_blank");
}

/* ===================== */
/*  DASHBOARD PESERTA */
/* ===================== */

function tampilkanDashboard(data){

  const html = `
    <h3>👋 Halo, ${data.nama}</h3>

    <table style="width:100%;font-size:14px;margin-top:10px">
      <tr><td><b>No HP</b></td><td>: ${data.nohp}</td></tr>
      <tr><td><b>Jenis Kelamin</b></td><td>: ${data.jk}</td></tr>
      <tr><td><b>Datang bersama keluarga</b></td><td>: ${data.keluarga}</td></tr>
      <tr><td><b>Jumlah anggota</b></td><td>: ${data.jumlah}</td></tr>
      <tr><td><b>Kebutuhan parkir</b></td><td>: ${data.parkir}</td></tr>
      <tr><td><b>Status Kehadiran</b></td><td>: ${data.statushadir}</td></tr>
    </table>

    <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
  `;

  document.getElementById("isiDashboard").innerHTML = html;
  popupDashboard.style.display = "flex";

  /* ===== LOGIKA QR H-7 ===== */
  if(data.qr_aktif === "YA"){

    document.getElementById("qrArea").innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
      <p style="font-size:13px;margin-top:8px;">
        Tunjukkan QR ini saat registrasi ulang
      </p>
    `;

  } else {

    document.getElementById("qrArea").innerHTML = `
      <p style="color:red;font-weight:bold;">
        QR aktif mulai H-7 sebelum acara
      </p>
      <p style="font-size:13px;">
        Silakan buka kembali halaman ini mendekati hari acara
      </p>
    `;
  }
}
