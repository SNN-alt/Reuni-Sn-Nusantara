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

// ===== LOGIKA QR & INFO PESERTA =====
if (data.qr_aktif === "YA") {

  // Jika sudah H-7 dan sudah konfirmasi → QR muncul
  document.getElementById("qrCode").innerHTML = `
    <p style="font-weight:bold;margin-bottom:10px;">
      Status Kehadiran : ${data.statushadir}
    </p>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
    <p style="font-size:12px;margin-top:8px;">
      Tunjukkan QR ini saat registrasi ulang
    </p>
  `;

} else {

  // Jika belum masuk masa H-7
  document.getElementById("qrCode").innerHTML = `
    <p><b>No HP</b> : ${data.nohp}</p>
    <p><b>Jenis Kelamin</b> : ${data.jk}</p>
    <p><b>Datang bersama keluarga</b> : ${data.keluarga}</p>
    <p><b>Jumlah anggota</b> : ${data.jumlah}</p>
    <p><b>Kebutuhan parkir</b> : ${data.parkir}</p>
    <p><b>Status Kehadiran</b> : ${data.statushadir}</p>

    <hr style="margin:10px 0;">

    <p style="color:red;font-weight:bold;">
      QR aktif mulai H-7 sebelum acara
    </p>
    <p style="font-size:13px;">
      Silakan buka kembali halaman ini saat mendekati hari acara
    </p>
  `;
}



