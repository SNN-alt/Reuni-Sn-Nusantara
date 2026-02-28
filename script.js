const apiUrl = "https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";

document.addEventListener("DOMContentLoaded", function () {

  /* ================= MODAL PANDUAN ================= */
  window.bukaPanduan = function () {
    document.getElementById("modalPanduan").style.display = "flex";
  };
  window.tutupPanduan = function () {
    document.getElementById("modalPanduan").style.display = "none";
  };

  /* ================= MODAL PROPOSAL ================= */
  window.bukaProposal = function () {
    document.getElementById("modalProposal").style.display = "flex";
  };
  window.tutupProposal = function () {
    document.getElementById("modalProposal").style.display = "none";
  };

  /* ================= CALL CENTER ================= */
  const modalCallCenter = document.getElementById("modalCallCenter");
  const btnCallCenter = document.getElementById("btnCallCenter");

  if (btnCallCenter && modalCallCenter) {
    btnCallCenter.onclick = () => modalCallCenter.style.display = "flex";

    modalCallCenter.addEventListener("click", function (e) {
      if (e.target === modalCallCenter) {
        modalCallCenter.style.display = "none";
      }
    });

    const closeBtn = modalCallCenter.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = () => modalCallCenter.style.display = "none";
    }
  }

  /* ================= SPONSOR ZOOM ================= */
  const sponsorOverlay = document.getElementById("sponsorOverlay");
  const sponsorPreview = document.getElementById("sponsorPreview");

  document.querySelectorAll(".sponsor-img").forEach(img => {
    img.addEventListener("click", function () {
      sponsorPreview.src = this.src;
      sponsorOverlay.style.display = "flex";
    });
  });

  if (sponsorOverlay) {
    sponsorOverlay.addEventListener("click", function (e) {
      if (e.target === sponsorOverlay) {
        sponsorOverlay.style.display = "none";
        sponsorPreview.src = "";
      }
    });
  }

  /* ================= LOGIN ================= */
  window.loginPeserta = async function () {

    const input = document.getElementById("nohpLogin");
    let nohp = input.value.replace(/\D/g, "");
    input.value = nohp;

    if (nohp.length < 10) {
      alert("Nomor HP tidak valid");
      return;
    }

    const btn = document.querySelector(".login-box button");
    btn.innerText = "Memproses...";
    btn.disabled = true;

    try {
      const res = await fetch(`${apiUrl}?mode=login&nohp=${encodeURIComponent(nohp)}`);
      const data = await res.json();

      if (data.status === "NOT_FOUND") {
        alert("Nomor belum terdaftar");
      } else {
        tampilkanDashboard(data);
      }
    } catch {
      alert("Gagal koneksi server");
    }

    btn.innerText = "Login";
    btn.disabled = false;
  };

  /* ================= DASHBOARD ================= */
  function tampilkanDashboard(data) {

    const popup = document.getElementById("popupDashboard");
    const isi = document.getElementById("isiDashboard");

    isi.innerHTML = `
      <h3>Halo, ${data.nama}</h3>
      <table class="info-table">
        <tr><td>No HP</td><td class="val">${data.nohp}</td></tr>
        <tr><td>Keluarga</td><td class="val">${data.keluarga}</td></tr>
        <tr><td>Status</td><td class="val">${data.statushadir || "BELUM KONFIRMASI"}</td></tr>
      </table>
      <div id="qrArea" style="margin-top:15px;text-align:center;"></div>
    `;

    popup.style.display = "flex";

    const qrArea = document.getElementById("qrArea");

    if ((data.qr_aktif || "").toUpperCase() === "YA") {
      qrArea.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr)}">
        <p>Tunjukkan QR saat registrasi</p>
      `;
    } else {
      qrArea.innerHTML = `
        <button onclick="konfirmasiHadir('${data.nohp}')">
          Konfirmasi Kehadiran
        </button>
      `;
    }
  }

  window.tutupDashboard = function () {
    document.getElementById("popupDashboard").style.display = "none";
  };

  /* ================= KONFIRMASI ================= */
  window.konfirmasiHadir = async function (nohp) {

    try {
      const res = await fetch(`${apiUrl}?mode=konfirmasi&nohp=${encodeURIComponent(nohp)}`);
      const data = await res.json();
      alert(data.message);
      loginPeserta();
    } catch {
      alert("Gagal koneksi");
    }
  };

  /* ================= STATISTIK ================= */
  async function loadStatistik() {
    const statistikBox = document.getElementById("statistikBox");
    if (!statistikBox) return;

    try {
      const res = await fetch(`${apiUrl}?mode=statistik&t=${Date.now()}`);
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
    } catch {}
  }

  loadStatistik();
  setInterval(loadStatistik, 30000);

});

/* ================= LINK FORM ================= */
function bukaPeserta() {
  window.open("https://forms.gle/VudgYiKRNVWU9zsG8", "_blank");
}
function bukaUMKM() {
  window.open("https://forms.gle/sUyoZ34bRnDrp2xW6", "_blank");
}
