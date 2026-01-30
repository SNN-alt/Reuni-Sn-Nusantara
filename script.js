document.addEventListener("DOMContentLoaded", function(){

/* ================= MODAL PANDUAN & PROPOSAL ================= */

window.bukaPanduan = () =>
  document.getElementById("modalPanduan").style.display = "block";

window.tutupPanduan = () =>
  document.getElementById("modalPanduan").style.display = "none";

window.bukaProposal = () =>
  document.getElementById("modalProposal").style.display = "block";

window.tutupProposal = () =>
  document.getElementById("modalProposal").style.display = "none";


/* ================= CALL CENTER ================= */

const modalCallCenter = document.getElementById("modalCallCenter");

document.getElementById("btnCallCenter").onclick = () =>
  modalCallCenter.style.display = "block";

modalCallCenter.querySelector(".close").onclick = () =>
  modalCallCenter.style.display = "none";

/* ================= MODAL SPONSOR ================= */
const modalSponsor = document.getElementById("modalSponsor");
const modalImg = document.getElementById("imgModal");

// Klik gambar sponsor → buka modal
document.querySelectorAll(".sponsor-img").forEach(img => {
  img.addEventListener("click", function(){
    modalSponsor.style.display = "flex";
    modalImg.src = this.src;
  });
});

// Tutup dengan tombol X
function tutupSponsor(){
  modalSponsor.style.display = "none";
  modalImg.src = "";
}

// Tutup jika klik area gelap
modalSponsor.addEventListener("click", function(e){
  if(e.target === modalSponsor){
    tutupSponsor();
  }
});


/* ================= LOGIN PESERTA ================= */

const apiUrl = "https://script.google.com/macros/s/AKfycbwbmKqK_JmmcXJECDcGia0jArqZ8K27fD51EOFPY8QyEPNbQ7LL3sQmxOot-qOHCdbx/exec";

window.loginPeserta = function(){
  const nohp = document.getElementById("nohpLogin").value.trim();
  if(!nohp) return alert("Masukkan nomor HP");

  fetch(apiUrl+"?mode=login&nohp="+encodeURIComponent(nohp))
    .then(res=>res.json())
    .then(data=>{
      if(data.status==="NOT_FOUND"){
        alert("Nomor HP belum terdaftar");
      } else {
        tampilkanDashboard(data);
      }
    })
    .catch(()=>alert("Gagal koneksi server"));
};


/* ================= DASHBOARD ================= */

window.tampilkanDashboard = function(data){

  document.getElementById("isiDashboard").innerHTML = `
    <h3>👋 Halo, ${data.nama}</h3>
    <table style="width:100%;font-size:14px;margin-top:10px">
      <tr><td>No HP</td><td>: ${data.nohp}</td></tr>
      <tr><td>Jenis Kelamin</td><td>: ${data.jk}</td></tr>
      <tr><td>Keluarga</td><td>: ${data.keluarga}</td></tr>
      <tr><td>Jumlah</td><td>: ${data.jumlah}</td></tr>
      <tr><td>Parkir</td><td>: ${data.parkir}</td></tr>
      <tr><td>Status</td><td>: ${data.statushadir || "BELUM KONFIRMASI"}</td></tr>
    </table>
    <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
  `;

  document.getElementById("popupDashboard").style.display = "flex";

  if(String(data.qr_aktif).toUpperCase()==="YA"){
    document.getElementById("qrArea").innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
      <p style="font-size:13px">Tunjukkan QR ini saat registrasi</p>
    `;
  } else {
    document.getElementById("qrArea").innerHTML = `
      <p style="color:red;font-weight:bold">QR aktif mulai H-7 sebelum acara</p>
      <button onclick="konfirmasiHadir('${data.nohp}')"
        style="margin-top:8px;padding:8px 16px;border:none;border-radius:6px;background:#28a745;color:white;">
        Konfirmasi Kehadiran
      </button>
    `;
  }
};


/* ================= KONFIRMASI ================= */

window.konfirmasiHadir = function(nohp){
  document.getElementById("qrArea").innerHTML = "<p>⏳ Memproses...</p>";

  fetch(apiUrl+"?mode=konfirmasi&nohp="+encodeURIComponent(nohp))
    .then(res=>res.json())
    .then(data=>{
      alert(data.message);
      if(data.status==="OK") loginPeserta();
    })
    .catch(()=>alert("Gagal koneksi Apps Script"));
};


/* ================= TUTUP DASHBOARD ================= */

window.tutupDashboard = function(){
  document.getElementById("popupDashboard").style.display = "none";
};

});

/* ================= DAFTAR PESERTA & UMKM (GLOBAL) ================= */

function bukaPeserta(){
  window.open("https://forms.gle/VudgYiKRNVWU9zsG8","_blank");
}

function bukaUMKM(){
  window.open("https://forms.gle/sUyoZ34bRnDrp2xW6","_blank");
}

