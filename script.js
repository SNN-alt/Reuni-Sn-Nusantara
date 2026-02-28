let apiUrl = "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";

document.addEventListener("DOMContentLoaded", () => {

  const nohpInput = document.getElementById("nohpLogin");
  const popup = document.getElementById("popupDashboard");
  const isiDashboard = document.getElementById("isiDashboard");
  const statistikBox = document.getElementById("statistikBox");

  /* ================= LOGIN ================= */
  window.loginPeserta = async function () {

    let nohp = nohpInput.value.replace(/\D/g,"");
    nohpInput.value = nohp;

    if(nohp.length < 10){
      alert("Nomor HP tidak valid");
      return;
    }

    const btn = document.querySelector(".login-box button");
    btn.innerText = "Memproses...";
    btn.disabled = true;

    try{
      const res = await fetch(apiUrl+"?mode=login&nohp="+encodeURIComponent(nohp));
      const data = await res.json();

      if(data.status === "NOT_FOUND"){
        alert("Nomor belum terdaftar");
      }else{
        tampilkanDashboard(data);
      }

    }catch(err){
      alert("Gagal koneksi server");
    }

    btn.innerText = "Login";
    btn.disabled = false;
  };

  /* ================= DASHBOARD ================= */
  function tampilkanDashboard(data){

    isiDashboard.innerHTML = `
      <h3>Halo, ${data.nama}</h3>
      <table class="info-table">
        <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
        <tr><td>Keluarga</td><td class="val">${data.keluarga}</td></tr>
        <tr><td>Status</td><td class="val">${data.statushadir || "BELUM KONFIRMASI"}</td></tr>
      </table>
      <div id="qrArea" style="margin-top:15px;"></div>
    `;

    popup.style.display="flex";

    const qrArea = document.getElementById("qrArea");

    const eventDate = new Date("2026-04-11T00:00:00+07:00");
    const nowWIB = new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Jakarta"}));
    const h7 = new Date(eventDate.getTime() - (7*24*60*60*1000));

    if(data.qr_aktif === "YA"){
      qrArea.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
        <p>Tunjukkan QR saat registrasi</p>
      `;
    }else{
      qrArea.innerHTML = `
        <p style="color:red;">Konfirmasi dibuka 4 April 2026</p>
        <button onclick="konfirmasiHadir('${data.nohp}')"
        ${nowWIB >= h7 ? "" : "disabled"}>
        Konfirmasi Kehadiran
        </button>
      `;
    }
  }

  window.tutupDashboard = function(){
    popup.style.display="none";
  };

  /* ================= KONFIRMASI ================= */
  window.konfirmasiHadir = async function(nohp){

    try{
      const res = await fetch(apiUrl+"?mode=konfirmasi&nohp="+encodeURIComponent(nohp));
      const data = await res.json();
      alert(data.message);
      loginPeserta();
    }catch{
      alert("Gagal koneksi");
    }
  };

  /* ================= STATISTIK ================= */
  async function loadStatistik(){
    if(!statistikBox) return;

    try{
      const res = await fetch(apiUrl+"?mode=statistik&t="+Date.now());
      const data = await res.json();

      statistikBox.innerHTML = `
        <div class="statistik-premium">
          <div class="stat-item">
            <small>Total Pendaftar</small>
            <span>${data.totalPeserta || 0}</span>
          </div>
          <div class="stat-item">
            <small>Sudah Konfirmasi</small>
            <span>${data.totalHadir || 0}</span>
          </div>
        </div>
      `;
    }catch{}
  }

  loadStatistik();
  setInterval(loadStatistik,30000);

});
