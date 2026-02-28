const eventDate = new Date("2026-04-11T00:00:00+07:00");
const apiUrl="https://script.google.com/macros/s/AKfycbyyZnfx-ilQjNhAG0gP-rO_ctPne7HoxuREYerYXfrRTvJRiFYJReZkuT6kZC8dqop3/exec";

/* ===== COUNTDOWN ===== */
function updateCountdown(){
  const now=new Date();
  const diff=eventDate-now;
  if(diff<=0){
    countdownBox.innerHTML="🎉 Acara Dimulai!";
    return;
  }
  const days=Math.floor(diff/(1000*60*60*24));
  countdownBox.innerHTML=`⏳ Menuju Acara: ${days} hari lagi`;
}
setInterval(updateCountdown,1000);
updateCountdown();

/* ===== KUOTA PROGRESS ===== */
async function loadKuota(){
  try{
    const res=await fetch(`${apiUrl}?mode=ambilKuotaTenda&t=${Date.now()}`);
    const data=await res.json();
    const total=200;
    const percent=((total-data.sisa)/total)*100;

    progressKuota.innerHTML=`
      <div>Sisa Kuota Tenda: <strong>${data.sisa}</strong> / 200</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
    `;
  }catch{}
}
loadKuota();
setInterval(loadKuota,30000);
