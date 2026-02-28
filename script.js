const apiUrl="https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";

document.addEventListener("DOMContentLoaded",function(){

/* ===== GLOBAL MODAL CLOSE ===== */
document.querySelectorAll(".modal, .popup-overlay").forEach(el=>{
  el.addEventListener("click",e=>{
    if(e.target===el) el.classList.remove("active");
  });
});
document.querySelectorAll(".close, .close-x").forEach(btn=>{
  btn.onclick=()=>btn.closest(".modal, .popup-overlay").classList.remove("active");
});

/* ===== OPEN MODAL ===== */
window.bukaPanduan=()=>modalPanduan.classList.add("active");
window.bukaProposal=()=>modalProposal.classList.add("active");
btnCallCenter.onclick=()=>modalCallCenter.classList.add("active");

/* ===== SPONSOR ===== */
document.querySelectorAll(".sponsor-img").forEach(img=>{
  img.onclick=function(){
    sponsorPreview.src=this.src;
    sponsorOverlay.classList.add("active");
  };
});
closeSponsor.onclick=()=>sponsorOverlay.classList.remove("active");

/* ===== LOGIN ===== */
window.loginPeserta=async function(){
  let nohp=nohpLogin.value.replace(/\D/g,"");
  nohpLogin.value=nohp;
  if(nohp.length<10){alert("Nomor HP tidak valid");return;}

  try{
    const res=await fetch(`${apiUrl}?mode=login&nohp=${nohp}`);
    const data=await res.json();
    if(data.status==="NOT_FOUND"){alert("Nomor belum terdaftar");}
    else tampilkanDashboard(data);
  }catch{alert("Gagal koneksi");}
};

/* ===== DASHBOARD ===== */
window.tampilkanDashboard=async function(data){

  const statusBadge =
    (data.statushadir||"").toUpperCase()==="HADIR"
    ? `<span class="badge badge-green">HADIR</span>`
    : `<span class="badge badge-gray">BELUM KONFIRMASI</span>`;

  isiDashboard.innerHTML=`
    <h3>Halo, ${data.nama}</h3>
    <table class="info-table">
      <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
      <tr><td>Jenis Kelamin</td><td class="val">${data.jk}</td></tr>
      <tr><td>Keluarga</td><td class="val">${data.keluarga}</td></tr>
      <tr><td>Jumlah</td><td class="val">${data.jumlah}</td></tr>
      <tr><td>Parkir</td><td class="val">${data.parkir}</td></tr>
      <tr><td>Status</td><td class="val">${statusBadge}</td></tr>
    </table>
    <div class="dashboard-section" id="qrArea"></div>
    <div class="dashboard-section" id="tendaArea"></div>
  `;

  popupDashboard.classList.add("active");

  const eventDate=new Date("2026-04-11T00:00:00+07:00");
  const h7=new Date(eventDate.getTime()-7*24*60*60*1000);
  const nowWIB=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Jakarta"}));
  const boleh=nowWIB>=h7;

  if((data.qr_aktif||"").toUpperCase()==="YA"){
    qrArea.innerHTML=`
      <div class="qr-frame">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
      </div>
      <p style="margin-top:10px;">Tunjukkan QR saat registrasi</p>
    `;
  }else{
    qrArea.innerHTML=`
      <p style="color:#dc3545;font-weight:600;">Konfirmasi dibuka 4 April 2026</p>
      <button onclick="konfirmasiHadir('${data.nohp}')"
      ${boleh?"":"disabled"}
      style="margin-top:10px;padding:10px 16px;border:none;border-radius:8px;
      background:${boleh?"#198754":"#aaa"};color:white;">
      ${boleh?"Konfirmasi Kehadiran":"Belum Aktif"}
      </button>
    `;
  }

  try{
    const res=await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const kuota=await res.json();

    tendaArea.innerHTML=`
      <div class="tenda-box">
        Sisa Kuota Tenda: <strong>${kuota.sisa}</strong> / 200
      </div>
    `;
  }catch{}
};

/* ===== KONFIRMASI ===== */
window.konfirmasiHadir=async function(nohp){
  try{
    const res=await fetch(`${apiUrl}?mode=konfirmasi&nohp=${nohp}`);
    const data=await res.json();
    alert(data.message);
    loginPeserta();
  }catch{alert("Gagal koneksi");}
};

/* ===== STATISTIK ===== */
async function loadStatistik(){
  try{
    const res=await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
    const data=await res.json();
    statistikBox.innerHTML=`
      <div class="statistik-premium">
        <div class="stat-item">
          <small>Total Pendaftar</small>
          <span>${data.totalPeserta||0}</span>
        </div>
        <div class="stat-item">
          <small>Sudah Konfirmasi</small>
          <span>${data.totalHadir||0}</span>
        </div>
      </div>
    `;
  }catch{}
}
loadStatistik();
setInterval(loadStatistik,30000);

});
