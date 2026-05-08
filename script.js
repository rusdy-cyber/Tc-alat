// --- 1. SUBNET CALCULATOR (FIXED BITWISE) ---
// function calculateSubnet() {
//     const inputVal = document.getElementById('ipInput').value.trim();
//     const resultDiv = document.getElementById('subnetResult');
//     if (!inputVal.includes('/')) {
//         resultDiv.innerHTML = '<span style="color:red">Format salah! Contoh: 192.168.1.0/24</span>';
//         resultDiv.style.display = 'block';
//         return;
//     }
//     const [ip, cidrStr] = inputVal.split('/');
//     const cidr = parseInt(cidrStr);
//     const ipParts = ip.split('.').map(Number);

//     if (ipParts.length !== 4 || isNaN(cidr)) {
//         resultDiv.innerHTML = '<span style="color:red">IP/CIDR tidak valid</span>';
//         resultDiv.style.display = 'block';
//         return;
//     }

//     // Perbaikan: Ambil indeks array satu per satu
//     const ipInt = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
//     const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
//     const netInt = (ipInt & mask) >>> 0;
//     const broadInt = (netInt | (~mask)) >>> 0;

//     const intToIp = (int) => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');

//     resultDiv.style.display = 'block';
//     resultDiv.innerHTML = `
//         <div style="border-left:3px solid orange; padding-left:10px; font-family:monospace;">
//             <b style="color:orange">[RESULT]</b><br>
//             Net ID: ${intToIp(netInt)}<br>
//             Broadcast: ${intToIp(broadInt)}<br>
//             Hosts: ${cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2}
//         </div>`;
// }

function calculateSubnet() {
    const inputVal = document.getElementById('ipInput').value.trim();
    const resultDiv = document.getElementById('subnetResult');

    // 1. Validasi Awal
    if (!inputVal.includes('/')) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Format salah! Contoh: 192.168.1.0/24</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const [ip, cidrStr] = inputVal.split('/');
    const cidr = parseInt(cidrStr);
    const ipParts = ip.split('.').map(Number);

    // 2. Validasi Angka
    if (isNaN(cidr) || cidr < 0 || cidr > 32 || ipParts.length !== 4 || ipParts.some(p => p > 255 || isNaN(p))) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Data IP atau CIDR tidak valid!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    // 3. Logika Bitwise (Inti Perhitungan)
    // Menggabungkan 4 bagian IP menjadi satu angka 32-bit
    const ipInt = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
    
    // Membuat Subnet Mask
    const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    
    // Menghitung Network, Wildcard, dan Broadcast
    const networkInt = (ipInt & mask) >>> 0;
    const wildcardInt = (~mask) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    
    // Jumlah Host
    const usableHosts = cidr >= 31 ? 0 : (Math.pow(2, 32 - cidr) - 2);

    // Helper Konversi
    const intToIp = (int) => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
    const intToBin = (int) => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255]
                                .map(v => v.toString(2).padStart(8, '0')).join('.');

    // 4. Tampilkan Hasil (Gaya Cyber/Tiger Cyber)
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="text-align: left; font-family: 'Courier New', monospace; font-size: 13px; border-left: 3px  padding-left: 12px;">
            <b style="color: orange;">[ NETWORK INFO ]</b><br>
            Network ID   : ${intToIp(networkInt)}<br>
            Subnet Mask  : ${intToIp(mask)}<br>
            Broadcast    : ${intToIp(broadcastInt)}<br>
            Wildcard     : ${intToIp(wildcardInt)}<br><br>
            
            <b style="color: orange;">[ HOST INFO ]</b><br>
            Range IP     : ${cidr > 30 ? 'N/A' : intToIp(networkInt + 1) + ' - ' + intToIp(broadcastInt - 1)}<br>
            Total Usable : ${usableHosts} Host<br><br>
            
            <b style="color: orange;">[ BINARY VIEW ]</b><br>
            Net: <span style="color: #888;">${intToBin(networkInt)}</span><br>
            MSK: <span style="color: #888;">${intToBin(mask)}</span>
        </div>
    `;
}

function resetTool(inputId, resultId) {
    const input = document.getElementById(inputId);
    const result = document.getElementById(resultId);

    // 1. Kosongkan Input
    if (input) input.value = '';

    // 2. Sembunyikan dan Kosongkan Result
    if (result) {
        result.innerHTML = '';
        result.style.display = 'none';
    }
    
    // 3. Feedback Efek (Opsional)
    console.log(`Tool ${inputId} telah diulang.`);
}



// --- 2. PERCENTAGE CALCULATOR (FIXED DISPLAY) ---
function calculatePercentage() {
    const totalInput = document.getElementById('totalAmount');
    const percentInput = document.getElementById('percentValue');
    const result = document.getElementById('percentResult');

    const total = parseFloat(totalInput.value);
    const percent = parseFloat(percentInput.value);

    // Perbaikan 1: Pastikan result muncul secara visual
    result.style.display = 'block';

    if (isNaN(total) || isNaN(percent)) {
        result.innerHTML = '<span style="color: #ff4444;">Masukkan angka yang valid</span>';
        return;
    }

    const hasil = (total * percent) / 100;
    const sisa = total - hasil;

    // Perbaikan 2: Gunakan Intl untuk format rupiah yang lebih stabil
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID').format(angka);
    };

    // Perbaikan 3: Tambahkan styling sedikit agar teksnya terbaca di tema gelap
    result.innerHTML = `
        <div style="border-left: 3px solid orange; padding-left: 10px; color: #ddd;">
            ${percent}% dari ${formatRupiah(total)} = <b style="color: #22c55e;">${formatRupiah(hasil)}</b><br>
            Sisa setelah dikurangi = <b style="color: orange;">${formatRupiah(sisa)}</b>
        </div>
    `;
}



// --- 3. COPY CLIPBOARD (FIXED EVENT) ---
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.currentTarget;
        const oldText = btn.innerHTML;
        btn.innerHTML = 'Copied!';
        setTimeout(() => { btn.innerHTML = oldText; }, 2000);
    });
}

function encodeBase64() {
    const input = document.getElementById('encodeInput').value;
    const result = document.getElementById('encodeResult');
    
    if (!input) return;

    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        result.innerText = encoded;
        result.style.display = 'block';
    } catch (e) {
        result.innerText = "Error: Gagal Encode";
    }
}

function decodeBase64() {
    const input = document.getElementById('encodeInput').value.trim();
    const result = document.getElementById('encodeResult');
    
    if (!input) return;

    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        result.innerText = decoded;
        result.style.display = 'block';
    } catch (e) {
        result.innerText = "Error: Base64 Tidak Valid";
    }
}

function generateCitation() {
    // 1. Ambil elemen input
    const author = document.getElementById('author').value.trim();
    const title = document.getElementById('title').value.trim();
    const year = document.getElementById('year').value.trim();
    const result = document.getElementById('citationResult');

    // 2. Validasi sederhana
    if (!author || !title || !year) {
        result.style.display = 'block';
        result.innerHTML = '<span style="color: #ff4444;">Mohon isi semua kolom (Penulis, Judul, Tahun)</span>';
        return;
    }

    // 3. Tampilkan hasil dengan gaya Cyber/Orange
    result.style.display = 'block'; // MEMASTIKAN BOX MUNCUL
    result.style.marginTop = '15px';
    result.style.padding = '12px';
    result.style.background = 'rgba(255, 115, 0, 0.05)';
    result.style.borderLeft = '3px solid orange';

    // Format APA: Nama, A. (Tahun). Judul buku/artikel.
    result.innerHTML = `
        <span style="color: orange; font-weight: bold; font-size: 12px;">APA CITATION:</span><br>
        <span style="color: #ddd;">${author}. (${year}). <i>${title}</i>.</span>
    `;
}



function analyzeURL() {
  // 1. Ambil input dan bersihkan spasi
  let input = document.getElementById('urlInput').value.trim();
  const result = document.getElementById('urlResult');
  
  if (!input) {
      result.innerHTML = '<span style="color:orange">Silakan masukkan URL.</span>';
      result.style.display = 'block';
      return;
  }

  // 2. Validasi Titik (Syarat wajib domain)
  if (!input.includes('.')) {
      result.innerHTML = '<span style="color:#ff4444">URL tidak valid (Contoh: google.com)</span>';
      result.style.display = 'block';
      return;
  }

  let warnings = [];
  let risk = 'LOW';
  let hostname = "";
  let protocol = "";

  try {
      // 3. Logika Penanganan Protokol yang Lebih Aman
      let finalURL;
      if (input.startsWith('http://') || input.startsWith('https://')) {
          finalURL = input;
      } else {
          finalURL = 'https://' + input;
      }

      // Buat objek URL
      const urlObj = new URL(finalURL);
      hostname = urlObj.hostname.toLowerCase().replace('www.', '');
      protocol = urlObj.protocol.replace(':', '').toUpperCase();

      // --- MULAI ANALISIS JARINGAN ---

      // A. Cek Typosquatting (Kemiripan Brand)
      const targets = ['google.com', 'bca.co.id', 'klikbca.com', 'bri.co.id', 'mandiri.co.id', 'facebook.com', 'instagram.com'];
      targets.forEach(target => {
          if (typeof getLevenshtein === "function") {
              const distance = getLevenshtein(hostname, target);
              if (distance > 0 && distance <= 2 && !hostname.endsWith(target)) {
                  warnings.push(`Typosquatting: Mirip dengan domain asli <b>${target}</b>`);
                  risk = 'HIGH';
              }
          }
      });

      // B. Cek Angka Mencurigakan (Leet Speak)
      if (/\d/.test(hostname)) {
          const brands = ['google', 'bca', 'bri', 'bni', 'mandiri', 'dana', 'shope'];
          if (brands.some(b => hostname.includes(b.replace(/[oie]/g, '')))) {
              warnings.push('Penggunaan angka sebagai pengganti huruf (Leet Speak)');
              risk = 'HIGH';
          }
      }
      // --- LOGIKA DETEKSI NOMOR YANG DIPERBAIKI ---

if (/\d/.test(hostname)) {
  // Daftar brand yang sering dipalsukan pakai angka
  const targetedBrands = [
      { name: 'google', fake: ['g00gle','g0ogle','9oogle','9oo9le', 'googl3', 'g00gl3'] },
      { name: 'bca', fake: ['bc4', 'bca1'] },
      { name: 'bri', fake: ['br1', 'brim0'] },
      { name: 'dana', fake: ['d4na'] },
      { name: 'shopee', fake: ['shope3', 'sh0pee'] },
      { name: 'tokopedia', fake: ['tokoped1a', 't0kopedia'] }
  ];

  let isLeetSpeak = false;

  targetedBrands.forEach(brand => {
      // Cek apakah hostname mengandung salah satu variasi angka palsu
      brand.fake.forEach(f => {
          if (hostname.includes(f)) {
              isLeetSpeak = true;
              warnings.push(`Leet Speak Detected: Mencoba meniru brand <b>${brand.name.toUpperCase()}</b>`);
          }
      });
  });

  if (isLeetSpeak) {
      risk = 'HIGH';
  } else {
      // Jika pakai nomor tapi tidak meniru brand di atas, biarkan LOW/MEDIUM
      // kecuali jika nomornya terlalu banyak (ciri khas domain sampah/phishing)
      const digitCount = (hostname.match(/\d/g) || []).length;
      if (digitCount > 4) {
          warnings.push('Terlalu banyak angka dalam domain (Indikasi Phishing)');
          risk = 'MEDIUM';
      }
  }
}

      // C. Cek Protokol HTTP
      if (urlObj.protocol === 'http:') {
          warnings.push('Insecure Protocol: Menggunakan HTTP (Tanpa Enkripsi)');
          risk = 'HIGH';
      }

      // 4. TAMPILKAN HASIL
      result.style.display = 'block';
      result.innerHTML = `
          <div class="ptes-box" style="border-color: ${risk === 'HIGH' ? '#ff4444' : risk === 'MEDIUM' ? 'orange' : '#22c55e'}">
              <div style="padding: 10px; font-weight: bold; color: ${risk === 'HIGH' ? '#ff4444' : risk === 'MEDIUM' ? 'orange' : '#22c55e'}">
                  <i class="fa-solid fa-shield-halved"></i> ${risk} RISK DETECTED
              </div>
              <div class="ptes-content">
                  <span style="color:orange">> DOMAIN :</span> ${hostname}<br>
                  <span style="color:orange">> STATUS :</span> ${protocol} Encrypted<br>
                  <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:8px 0;">
                  <b style="color:white">Security Alerts:</b><br>
                  ${warnings.length > 0 ? warnings.join('<br>') : '<i class="fa-solid fa-check" style="color:#22c55e"></i> Tidak ditemukan pola phishing.'}
              </div>
          </div>
      `;

  } catch (error) {
      // Jika masih error, tampilkan detail di console untuk debug
      console.error("URL Error:", error);
      result.innerHTML = '<span style="color:#ff4444">Kesalahan memproses URL. Gunakan format standar (contoh: google.com)</span>';
      result.style.display = 'block';
  }
}

function calculateAdvancedSavings() {
  // 1. Ambil target uang (hapus titik format agar jadi angka murni)
  const targetRaw = document.getElementById('targetAmount').value.replace(/\./g, "");
  const target = parseFloat(targetRaw) || 0;
  const resultDiv = document.getElementById('savingsResult');

  // 2. Ambil semua durasi
  const d = parseInt(document.getElementById('inDays').value) || 0;
  const w = parseInt(document.getElementById('inWeeks').value) || 0;
  const m = parseInt(document.getElementById('inMonths').value) || 0;
  const y = parseInt(document.getElementById('inYears').value) || 0;

  // 3. Hitung Total Hari
  const totalDays = d + (w * 7) + (m * 30) + (y * 365);

  // 4. Validasi jika kosong
  if (target <= 0 || totalDays <= 0) {
      resultDiv.innerHTML = '<span style="color:red">Masukkan target uang dan durasi waktu!</span>';
      resultDiv.style.display = 'block';
      return;
  }

  const perDay = target / totalDays;
  const formatID = (n) => new Intl.NumberFormat('id-ID').format(Math.ceil(n));

  // --- 5. LOGIKA PINTAR (Sesuai permintaanmu: hanya muncul jika waktunya cukup) ---
  let strategiHtml = `• Tiap Hari  : <b>Rp ${formatID(perDay)}</b><br>`;

  if (totalDays >= 3) {
      strategiHtml += `• Per 3 Hari : <b>Rp ${formatID(perDay * 3)}</b><br>`;
  }
  if (totalDays >= 7) {
      strategiHtml += `• Per Minggu : <b>Rp ${formatID(perDay * 7)}</b><br>`;
  }
  if (totalDays >= 30) {
      strategiHtml += `• Per Bulan  : <b>Rp ${formatID(perDay * 30)}</b><br>`;
  }
  if (totalDays >= 365) {
      strategiHtml += `• Per Tahun  : <b>Rp ${formatID(perDay * 365)}</b><br>`;
  }

  // 6. Tampilkan ke HTML
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
      <div style=" padding-left: 10px; font-family: monospace;">
          <b style="color:orange">[ ANALISIS DURASI ]</b><br>
          • Detail : ${y}th, ${m}bln, ${w}mgg, ${d}hr<br>
          • Total  : <b>${totalDays} Hari</b><br>
          <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
          
          <b style="color:orange">[ STRATEGI NABUNG ]</b><br>
          Target : <span style="color:#22c55e">Rp ${formatID(target)}</span><br>
          ${strategiHtml}
          <br>
          <small style="color:#888;">*Strategi otomatis menyesuaikan durasi targetmu.</small>
      </div>
  `;
}

function calculateUnit() {
  const val = parseFloat(document.getElementById('unitValue').value);
  const type = document.getElementById('convertType').value;
  const resultDiv = document.getElementById('unitResult');

  if (isNaN(val)) {
      resultDiv.innerHTML = '<span style="color:red">Masukkan angka!</span>';
      resultDiv.style.display = 'block';
      return;
  }

  let result = 0;
  let unitLabel = "";

  switch (type) {
      case "inchToMm": result = val * 25.4; unitLabel = "mm"; break;
      case "mmToInch": result = val / 25.4; unitLabel = "Inci"; break;
      case "knotToKmh": result = val * 1.852; unitLabel = "Km/jam"; break;
      case "kmhToKnot": result = val / 1.852; unitLabel = "Knot"; break;
      case "hpToWatt": result = val * 745.7; unitLabel = "Watt"; break;
      case "wattToHp": result = val / 745.7; unitLabel = "HP"; break;
  }

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
      <div style=" padding-left: 10px; font-family: monospace;">
          <b style="color:orange">[ CONVERSION RESULT ]</b><br>
          Hasil: <span style="color:#22c55e; font-size:18px;">${result.toFixed(2)} ${unitLabel}</span><br>
          <small style="color:#888;">*Akurasi standar teknis.</small>
      </div>
  `;
}

function calculateSalary() {
  const rawValue = document.getElementById('rawSalary').value.replace(/\./g, "");
  const salary = parseFloat(rawValue) || 0;
  const tax = parseFloat(document.getElementById('taxPercent').value) || 0;
  const resultDiv = document.getElementById('salaryResult');

  if (salary <= 0) {
      resultDiv.innerHTML = '<span style="color:#ff4444">Masukkan jumlah gaji!</span>';
      resultDiv.style.display = 'block';
      return;
  }

  const taxAmount = (salary * tax) / 100;
  const netSalary = salary - taxAmount;
  const formatID = (n) => new Intl.NumberFormat('id-ID').format(Math.ceil(n));

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
      <div style=" padding-left: 10px; font-family: monospace;">
          <b style="color:orange">[ ESTIMASI GAJI BERSIH ]</b><br>
          Bruto   : Rp ${formatID(salary)}<br>
          Potongan: <span style="color:#ff4444">Rp ${formatID(taxAmount)} (${tax}%)</span><br>
          <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
          <b>Take Home Pay:</b><br>
          <span style="color:#22c55e; font-size:18px;">Rp ${formatID(netSalary)}</span>
      </div>`;
}



function solveOhm() {
  let v = parseFloat(document.getElementById('voltage').value);
  let i = parseFloat(document.getElementById('current').value);
  let r = parseFloat(document.getElementById('resistance').value);
  const resultDiv = document.getElementById('ohmResult');

  let resultText = "";
  resultDiv.style.display = 'block';

  if (!isNaN(v) && !isNaN(i)) {
      r = v / i;
      resultText = `Resistance (R) = <b>${r.toFixed(2)} Ω</b>`;
  } else if (!isNaN(v) && !isNaN(r)) {
      i = v / r;
      resultText = `Current (I) = <b>${i.toFixed(2)} A</b>`;
  } else if (!isNaN(i) && !isNaN(r)) {
      v = i * r;
      resultText = `Voltage (V) = <b>${v.toFixed(2)} V</b>`;
  } else {
      resultDiv.innerHTML = '<span style="color:red">Isi minimal 2 kolom!</span>';
      return;
  }

  resultDiv.innerHTML = `
      <div style=" padding-left: 10px; font-family: monospace;">
          <b style="color:orange">[ OHM'S LAW RESULT ]</b><br>
          ${resultText}<br>
          Daya (P) : <b>${( (v || i*r) * (i || v/r) ).toFixed(2)} Watt</b>
      </div>`;
}

// Fungsi untuk memantau scroll
window.onscroll = function() {
  const btn = document.getElementById("scrollTop");
  // Jika scroll lebih dari 300px dari atas, munculkan tombol
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      btn.style.display = "block";
  } else {
      btn.style.display = "none";
  }
};

function analyzeFitness() {
  // 1. Ambil Data Input
  const age = parseInt(document.getElementById('fitAge').value);
  const weight = parseFloat(document.getElementById('fitWeight').value);
  const height = parseFloat(document.getElementById('fitHeight').value);
  const activity = parseFloat(document.getElementById('activity').value);
  const sex = document.querySelector('input[name="sex"]:checked').value;
  const resultDiv = document.getElementById('fitResult');

  // 2. Validasi Input
  if (!age || !weight || !height || isNaN(activity)) {
      resultDiv.innerHTML = '<span style="color:#ff4444">Lengkapi data umur, berat, dan tinggi!</span>';
      resultDiv.style.display = 'block';
      return;
  }

  // 3. Hitung Berat Badan Ideal (Rumus Broca)
  let ideal = (sex === 'male') ? (height - 100) * 0.9 : (height - 100) * 0.85;

  // 4. Hitung BMR (Mifflin-St Jeor) & TDEE
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = (sex === 'male') ? bmr + 5 : bmr - 161;
  const tdee = bmr * activity;

  // 5. Logika Rekomendasi Otomatis & Olahraga
  let statusText = "";
  let colorAction = "";
  let targetCalorie = 0;
  let detailMessage = "";
  let infoOlahraga = "";
  const diff = weight - ideal;

  if (Math.abs(diff) <= 2) {
      statusText = "MAINTAIN (PERTAHANKAN)";
      colorAction = "#22c55e"; 
      targetCalorie = tdee;
      detailMessage = "Berat Anda sudah <b>Ideal</b>.";
      infoOlahraga = "Kombinasi Kardio & Beban seimbang untuk stamina.";
  } else if (weight > ideal) {
      statusText = "CUTTING (TURUNKAN BERAT)";
      colorAction = "#ff4444"; 
      targetCalorie = tdee - 500; 
      detailMessage = `Turunkan sekitar <b>${diff.toFixed(1)} kg</b>.`;
      infoOlahraga = "Fokus <b>Kardio</b> (Lari/Renang) & Beban repetisi tinggi.";
  } else {
      statusText = "BULKING (NAIKKAN BERAT)";
      colorAction = "#3498db"; 
      targetCalorie = tdee + 500; 
      detailMessage = `Naikkan sekitar <b>${Math.abs(diff).toFixed(1)} kg</b>.`;
      infoOlahraga = "Fokus <b>Latihan Beban (Gym)</b> & nutrisi tinggi protein.";
  }

  // 6. TAMPILKAN HASIL AKHIR (Sudah termasuk Rekomendasi & Link)
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
      <div style=" padding-left: 12px; font-family: monospace;">
          <b style="color:orange">[ ANALISIS TUBUH ]</b><br>
          Target Ideal  : <b style="color:#22c55e">${ideal.toFixed(1)} kg</b><br>
          Status Rekom  : <b style="color:${colorAction}">${statusText}</b><br>
          Jatah Makan   : <b style="color:orange">${Math.round(targetCalorie)} kkal/hari</b>
          
          <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
          
          <b style="color:orange">[ REKOMENDASI ACTION ]</b><br>
          ${detailMessage}<br>
          <i class="fa-solid fa-dumbbell" style="color:orange"></i> ${infoOlahraga}
          
          <br><br>
          <a href="https://who.int" 
             target="_blank" class="ptes-link" style="font-size:12px; padding: 8px 12px;">
              <i class="fa-solid fa-book-medical"></i> Dokumentasi Resmi WHO
          </a>
      </div>
  `;
}
function calculateConcrete() {
    const p = parseFloat(document.getElementById('conLength').value);
    const l = parseFloat(document.getElementById('conWidth').value);
    const t = parseFloat(document.getElementById('conThick').value) / 100; // cm ke m
    const resultDiv = document.getElementById('concreteResult');

    if (!p || !l || !t) {
        resultDiv.innerHTML = '<span style="color:red">Isi P, L, dan T!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const volume = p * l * t;
    // Estimasi kasar: 1m3 beton butuh ~8 sak semen (50kg)
    const semen = Math.ceil(volume * 8);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="border-left: 3px solid orange; padding-left: 10px; font-family: monospace;">
            <b style="color:orange">[ CIVIL ANALYSIS ]</b><br>
            Volume Beton : <b>${volume.toFixed(2)} m³</b><br>
            Estimasi Semen: <b>${semen} Sak (50kg)</b><br>
            <small style="color:#888;">*Estimasi campuran standar 1:2:3.</small>
        </div>`;
}


function calculateSlope() {
    const rise = parseFloat(document.getElementById('rise').value);
    const run = parseFloat(document.getElementById('run').value);
    const resultDiv = document.getElementById('slopeResult');

    if (!rise || !run) {
        resultDiv.innerHTML = '<span style="color:red">Isi Rise dan Run!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const percent = (rise / run) * 100;
    const degree = Math.atan(rise / run) * (180 / Math.PI);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="border-left: 3px solid orange; padding-left: 10px; font-family: monospace;">
            <b style="color:orange">[ SLOPE INFO ]</b><br>
            Kemiringan (%) : <b>${percent.toFixed(2)}%</b><br>
            Sudut (Degree) : <b>${degree.toFixed(2)}°</b>
        </div>`;
}






// Fungsi untuk kembali ke atas dengan halus
function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth' // Efek scroll halus (smooth)
  });
}




