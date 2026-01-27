// ===== MODAL PANDUAN =====
function bukaPanduan(){
  document.getElementById("modalPanduan").style.display = "block";
}
function tutupPanduan(){
  document.getElementById("modalPanduan").style.display = "none";
}

// ===== MODAL PROPOSAL =====
function bukaProposal(){
  document.getElementById("modalProposal").style.display = "block";
}
function tutupProposal(){
  document.getElementById("modalProposal").style.display = "none";
}

// ===== MODAL FORM =====
const modalPeserta = document.getElementById("modalPeserta");
const modalUMKM = document.getElementById("modalUMKM");
const modalCallCenter = document.getElementById("modalCallCenter");

document.getElementById("btnPeserta").onclick = () => modalPeserta.style.display="block";
document.getElementById("btnUMKM").onclick = () => modalUMKM.style.display="block";
document.getElementById("btnCallCenter").onclick = () => modalCallCenter.style.display="block";

modalPeserta.querySelector(".close").onclick = () => modalPeserta.style.display="none";
modalUMKM.querySelector(".close").onclick = () => modalUMKM.style.display="none";
modalCallCenter.querySelector(".close").onclick = () => modalCallCenter.style.display="none";

// ===== TUTUP JIKA KLIK LUAR =====
window.onclick = function(event){
  if(event.target == modalPeserta) modalPeserta.style.display="none";
  if(event.target == modalUMKM) modalUMKM.style.display="none";
  if(event.target == modalCallCenter) modalCallCenter.style.display="none";
  if(event.target == document.getElementById("modalPanduan")) tutupPanduan();
  if(event.target == document.getElementById("modalProposal")) tutupProposal();
}

// ===== LOGIN PESERTA =====
const apiUrl = "PASTE_URL_API_ANDA";

function loginPeserta(){
  const nohp = document.getElementById("nohpLogin").value.trim();
  if(nohp == ""){
    alert("Masukkan nomor HP");
    return;
  }

  fetch(apiUrl+"?mode=login&nohp="+encodeURIComponent(nohp))
    .then(res=>res.json())
    .then(data=>{
      if(data.status=="NOT_FOUND"){
        alert("Nomor HP tidak terdaftar");
      } else {
        tampilkanDashboard(data);
      }
    })
    .catch(()=>alert("Gagal koneksi server"));
}

// ===== DASHBOARD =====
function tampilkanDashboard(data){
  document.getElementById("isiDashboard").innerHTML = `
    <h3>👋 Halo, ${data.nama}</h3>
    <table style="width:100%;font-size:14px;margin-top:10px">
      <tr><td>No HP</td><td>: ${data.nohp}</td></tr>
      <tr><td>Jenis Kelamin</td><td>: ${data.jk}</td></tr>
      <tr><td>Datang bersama keluarga</td><td>: ${data.keluarga}</td></tr>
      <tr><td>Jumlah anggota</td><td>: ${data.jumlah}</td></tr>
      <tr><td>Kebutuhan parkir</td><td>: ${data.parkir}</td></tr>
      <tr><td>Status Kehadiran</td><td>: ${data.statushadir || "BELUM KONFIRMASI"}</td></tr>
    </table>
    <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
  `;

  document.getElementById("popupDashboard").style.display="flex";

  if(data.qr_aktif=="YA"){
    document.getElementById("qrArea").innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
      <p>Tunjukkan QR ini saat registrasi ulang</p>
    `;
  } else {
    document.getElementById("qrArea").innerHTML = `
      <p style="color:red;font-weight:bold;">
        QR aktif mulai H-7 sebelum acara
      </p>
    `;
  }
}

// ===== TUTUP DASHBOARD =====
function tutupDashboard(){
  document.getElementById("popupDashboard").style.display="none";
}

// ===== WHATSAPP =====
function openWhatsApp(nomor){
  window.open("https://wa.me/"+nomor,"_blank");
}
