const apiUrl="https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";

document.addEventListener("DOMContentLoaded",function(){

/* ===== MODAL GLOBAL CLOSE ===== */
document.querySelectorAll(".modal").forEach(m=>{
  m.addEventListener("click",e=>{
    if(e.target===m) m.style.display="none";
  });
});

/* ===== PANDUAN & PROPOSAL ===== */
window.bukaPanduan=()=>modalPanduan.style.display="flex";
window.tutupPanduan=()=>modalPanduan.style.display="none";
window.bukaProposal=()=>modalProposal.style.display="flex";
window.tutupProposal=()=>modalProposal.style.display="none";

/* ===== CALL CENTER ===== */
btnCallCenter.onclick=()=>modalCallCenter.style.display="flex";

/* ===== SPONSOR ZOOM ===== */
document.querySelectorAll(".sponsor-img").forEach(img=>{
  img.onclick=function(){
    sponsorPreview.src=this.src;
    sponsorOverlay.classList.add("active");
  };
});
closeSponsor.onclick=()=>sponsorOverlay.classList.remove("active");
sponsorOverlay.onclick=e=>{
  if(e.target===sponsorOverlay)
    sponsorOverlay.classList.remove("active");
};

/* ===== LOGIN ===== */
window.loginPeserta=async function(){
  const input=nohpLogin;
  let nohp=input.value.replace(/\D/g,"");
  input.value=nohp;
  if(nohp.length<10){alert("Nomor HP tidak valid");return;}

  try{
    const res=await fetch(`${apiUrl}?mode=login&nohp=${nohp}`);
    const data=await res.json();
    if(data.status==="NOT_FOUND"){alert("Nomor belum terdaftar");}
    else tampilkanDashboard(data);
  }catch{alert("Gagal koneksi");}
};

/* ===== DASHBOARD ===== */
window.tampilkanDashboard=function(data){

  isiDashboard.innerHTML=`
    <h3>Halo, ${data.nama}</h3>
    <table class="info-table">
      <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
      <tr><td>Jenis Kelamin</td><td class="val">${data.jk}</td></tr>
      <tr><td>Keluarga</td><td class="val">${data.keluarga}</td></tr>
      <tr><td>Jumlah</td><td class="val">${data.jumlah}</td></tr>
      <tr><td>Parkir</td><td class="val">${data.parkir}</td></tr>
      <tr><td>Status</td><td class="val">${data.statushadir||"BELUM KONFIRMASI"}</td></tr>
    </table>
    <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
    <div id="tendaArea" style="margin-top:10px;text-align:center;"></div>
  `;

  popupDashboard.style.display="flex";

  const eventDate=new Date("2026-04-11T00:00:00+07:00");
  const h7=new Date(eventDate.getTime()-7*24*60*60*1000);
  const nowWIB=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Jakarta"}));
  const boleh=nowWIB>=h7;

  if((data.qr_aktif||"").toUpperCase()==="YA"){
    qrArea.innerHTML=`
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.qr}">
      <p>Tunjukkan QR saat registrasi</p>
    `;
  }else{
    qrArea.innerHTML=`
      <p style="color:red;font-weight:bold;">
      Konfirmasi dibuka 4 April 2026
      </p>
      <button onclick="konfirmasiHadir('${data.nohp}')"
      ${boleh?"":"disabled"}
      style="padding:10px 16px;border:none;border-radius:8px;
      background:${boleh?"#28a745":"#aaa"};color:white;">
      ${boleh?"Konfirmasi Kehadiran":"Belum Aktif"}
      </button>
    `;
  }

  if((data.statushadir||"").toUpperCase()==="HADIR"){
    if((data.tenda||"").toUpperCase()==="YA")
      tendaArea.innerHTML="<p style='color:green;font-weight:bold;'>🏕 Anda mendapatkan jatah tenda</p>";
    else
      tendaArea.innerHTML="<p style='color:red;font-weight:bold;'>⚠ Kuota tenda habis, hubungi Call Center</p>";
  }
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
