/* ================================================= */
/*               MODAL PANDUAN & PROPOSAL            */
/* ================================================= */

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


/* ================================================= */
/*               MODAL FORM PESERTA / UMKM / CALL    */
/* ================================================= */

const modalPeserta = document.getElementById("modalPeserta");
const modalUMKM = document.getElementById("modalUMKM");
const modalCallCenter = document.getElementById("modalCallCenter");

document.getElementById("btnPeserta").onclick = () => {
  modalPeserta.style.display = "block";
};
document.getElementById("btnUMKM").onclick = () => {
  modalUMKM.style.display = "block";
};
document.getElementById("btnCallCenter").onclick = () => {
  modalCallCenter.style.display = "block";
};

modalPeserta.querySelector(".close").onclick = () => modalPeserta.style.display = "none";
modalUMKM.querySelector(".close").onclick = () => modalUMKM.style.display = "none";
modalCallCenter.querySelector(".close").onclick = () => modalCallCenter.style.display = "none";


/* ================================================= */
/*               MODAL SPONSOR ZOOM                  */
/* ================================================= */

const modalSponsor = document.getElementById("modalSponsor");
const modalImg = document.getElementById("imgModal");
const closeSponsor = modalSponsor.querySelector(".close");

document.querySelectorAll(".sponsor-img").forEach(img => {
  img.onclick = () => {
    modalSponsor.style.display = "block";
    modalImg.src = img.src;
  };
});

closeSponsor.onclick = () => {
  modalSponsor.style.display = "none";
};


/* ================================================= */
/*            TUTUP MODAL SAAT KLIK LUAR             */
/* ================================================= */

window.onclick = function(event) {
  if (event.target === modalPeserta) modalPeserta.style.display = "none";
  if (event.target === modalUMKM) modalUMKM.style.display = "none";
  if (event.target === modalCallCenter) modalCallCenter.style.display = "none";
  if (event.target === modalSponsor) modalSponsor.style.display = "none";
  if (event.target === document.getElementById("modalPanduan")) tutupPanduan();
  if (event.target === document.getElementById("modalProposal")) tutupProposal();
  if (event.target === document.getElementById("popupDashboard")) tutupDashboard();
};


/* ================================================= */
/*                    LOGIN PESERTA                  */
/* ================================================= */

const apiUrl = "https://script.google.com/macros/s/AKfycbwVP0Ioy8UTg06bbJr-5o0FtJn7zOsnXgKExyY7OBcgrxDP8LELGh_0G86HLOxDP_8/exec";

function loginPeserta(){
  const nohp = document.getElementById("nohpLogin").value.trim();
  if(nohp === ""){
    alert("Masukkan nomor HP!");
    return;
  }

  fetch(apiUrl + "?mode=login&nohp=" + encodeURIComponent(nohp))
    .then(res => res.json())
    .then(data => {
      if(data.status === "NOT_FOUND"){
        alert("Nomor HP belum terdaftar");
      } else {
        tampilkanDashboard(data);
      }
    })
    .catch(() => alert("Gagal koneksi server"));
}

/* ================================================= */
/*                DASHBOARD PESERTA                  */
/* ================================================= */

function tampilkanDashboard(data){

  document.getElementById("isiDashboard").innerHTML = `
    <h3>👋 Halo, ${data.nama}</h3>

    <table style="width:100%;font-size:14px;margin-top:10px;border-collapse:collapse;">
      <tr><td><b>No HP</b></td><td>: ${data.nohp || "-"}</td></tr>
      <tr><td><b>Jenis Kelamin</b></td><td>: ${data.jk || "-"}</td></tr>
      <tr><td><b>Datang bersama keluarga</b></td><td>: ${data.keluarga || "-"}</td></tr>
      <tr><td><b>Jumlah anggota</b></td><td>: ${data.jumlah || "-"}</td></tr>
      <tr><td><b>Kebutuhan parkir</b></td><td>: ${data.parkir || "-"}</td></tr>
      <tr><td><b>Status Kehadiran</b></td><td>: ${data.statushadir || "BELUM KONFIRMASI"}</td></tr>
    </table>

    <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
  `;

  document.getElementById("popupDashboard").style.display = "flex";

  // ===== LOGIKA QR =====
  if (String(data.qr_aktif).toUpperCase() === "YA") {

    document.getElementById("qrArea").innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
      <p style="font-size:13px;margin-top:8px;">
        Tunjukkan QR ini saat registrasi ulang
      </p>
    `;

  } else {

    const hariIni = new Date();
    const tanggalAcara = new Date("2026-04-11"); 
    const h7 = new Date(tanggalAcara);
    h7.setDate(tanggalAcara.getDate() - 7);

    const aktif = (hariIni >= h7);

    document.getElementById("qrArea").innerHTML = `
      <p style="color:red;font-weight:bold;">
        QR aktif mulai H-7 sebelum acara
      </p>

      <p style="font-size:13px;margin-top:5px;">
        Silakan klik tombol di bawah untuk konfirmasi kehadiran.
      </p>

      <button 
        onclick="konfirmasiHadir('${data.nohp}')"
        ${aktif ? "" : "disabled"}
        style="
          margin-top:8px;
          padding:8px 16px;
          border:none;
          border-radius:6px;
          background:${aktif ? "#28a745" : "#999"};
          color:white;
          cursor:${aktif ? "pointer" : "not-allowed"};
        ">
        ${aktif ? "Konfirmasi Kehadiran" : "Tombol aktif mulai H-7"}
      </button>
    `;
  }

} // <-- INI penutup fungsi yang tadi kurang


/* ===== Fungsi sementara konfirmasi ===== */
function konfirmasiHadir(nohp){
  alert("Fitur konfirmasi akan aktif mulai H-7 sebelum acara");
}

/* ================================================= */
/*                TUTUP DASHBOARD                    */
/* ================================================= */

function tutupDashboard(){
  document.getElementById("popupDashboard").style.display = "none";
}


/* ================================================= */
/*                BUKA WHATSAPP                      */
/* ================================================= */

function openWhatsApp(nomor){
  window.open("https://wa.me/" + nomor, "_blank");
}








