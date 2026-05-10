// kalkulator subnet
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

// reset tools
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



// --- 2. PERCEn CALCULATOR (FIXED DISPLAY) ---
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

// encode
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

// decode
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

// sitation
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

// analisis url
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

// target tabungan
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

// convert mm ke km
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

// hitung pajak
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

// ohm kalkulator
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

// body goal
// function analyzeFitness() {
//   // 1. Ambil Data Input
//   const age = parseInt(document.getElementById('fitAge').value);
//   const weight = parseFloat(document.getElementById('fitWeight').value);
//   const height = parseFloat(document.getElementById('fitHeight').value);
//   const activity = parseFloat(document.getElementById('activity').value);
//   const sex = document.querySelector('input[name="sex"]:checked').value;
//   const resultDiv = document.getElementById('fitResult');

//   // 2. Validasi Input
//   if (!age || !weight || !height || isNaN(activity)) {
//       resultDiv.innerHTML = '<span style="color:#ff4444">Lengkapi data umur, berat, dan tinggi!</span>';
//       resultDiv.style.display = 'block';
//       return;
//   }

//   // 3. Hitung Berat Badan Ideal (Rumus Broca)
//   let ideal = (sex === 'male') ? (height - 100) * 0.9 : (height - 100) * 0.85;

//   // 4. Hitung BMR (Mifflin-St Jeor) & TDEE
//   let bmr = (10 * weight) + (6.25 * height) - (5 * age);
//   bmr = (sex === 'male') ? bmr + 5 : bmr - 161;
//   const tdee = bmr * activity;

//   // 5. Logika Rekomendasi Otomatis & Olahraga
//   let statusText = "";
//   let colorAction = "";
//   let targetCalorie = 0;
//   let detailMessage = "";
//   let infoOlahraga = "";
//   const diff = weight - ideal;

//   if (Math.abs(diff) <= 2) {
//       statusText = "MAINTAIN (PERTAHANKAN)";
//       colorAction = "#22c55e"; 
//       targetCalorie = tdee;
//       detailMessage = "Berat Anda sudah <b>Ideal</b>.";
//       infoOlahraga = "Kombinasi Kardio & Beban seimbang untuk stamina.";
//   } else if (weight > ideal) {
//       statusText = "CUTTING (TURUNKAN BERAT)";
//       colorAction = "#ff4444"; 
//       targetCalorie = tdee - 500; 
//       detailMessage = `Turunkan sekitar <b>${diff.toFixed(1)} kg</b>.`;
//       infoOlahraga = "Fokus <b>Kardio</b> (Lari/Renang) & Beban repetisi tinggi.";
//   } else {
//       statusText = "BULKING (NAIKKAN BERAT)";
//       colorAction = "#3498db"; 
//       targetCalorie = tdee + 500; 
//       detailMessage = `Naikkan sekitar <b>${Math.abs(diff).toFixed(1)} kg</b>.`;
//       infoOlahraga = "Fokus <b>Latihan Beban (Gym)</b> & nutrisi tinggi protein.";
//   }

//   // 6. TAMPILKAN HASIL AKHIR (Sudah termasuk Rekomendasi & Link)
//   resultDiv.style.display = 'block';
//   resultDiv.innerHTML = `
//       <div style=" padding-left: 12px; font-family: monospace;">
//           <b style="color:orange">[ ANALISIS TUBUH ]</b><br>
//           Target Ideal  : <b style="color:#22c55e">${ideal.toFixed(1)} kg</b><br>
//           Status Rekom  : <b style="color:${colorAction}">${statusText}</b><br>
//           Jatah Makan   : <b style="color:orange">${Math.round(targetCalorie)} kkal/hari</b>
          
//           <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
          
//           <b style="color:orange">[ REKOMENDASI ACTION ]</b><br>
//           ${detailMessage}<br>
//           <i class="fa-solid fa-dumbbell" style="color:orange"></i> ${infoOlahraga}
          
//           <br><br>
//           <a href="https://who.int" 
//              target="_blank" class="ptes-link" style="font-size:12px; padding: 8px 12px;">
//               <i class="fa-solid fa-book-medical"></i> Dokumentasi Resmi WHO
//           </a>
//       </div>
//   `;
// }
function analyzeFitness() {
    const age = parseInt(document.getElementById('fitAge').value);
    const weight = parseFloat(document.getElementById('fitWeight').value);
    const height = parseFloat(document.getElementById('fitHeight').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const sex = document.querySelector('input[name="sex"]:checked').value;
    const resultDiv = document.getElementById('fitResult');

    if (!age || !weight || !height || isNaN(activity)) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Lengkapi data umur, berat, dan tinggi!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    // 1. Hitung Berat Badan Ideal (Rumus Broca - Lebih akurat dari BMI)
    let ideal = (sex === 'male') ? (height - 100) * 0.9 : (height - 100) * 0.85;

    // 2. Hitung BMR (Mifflin-St Jeor) & TDEE (Total Kalori)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = (sex === 'male') ? bmr + 5 : bmr - 161;
    const tdee = bmr * activity;

    // 3. Logika Rekomendasi Berdasarkan Selisih Berat
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
        detailMessage = "Berat badan Anda sudah <b>Proporsional</b>.";
        infoOlahraga = "Latihan beban & Kardio ringan untuk stamina.";
    } else if (weight > ideal) {
        statusText = "CUTTING (BAKAR LEMAK)";
        colorAction = "#ff4444"; 
        targetCalorie = tdee - 500; 
        detailMessage = `Target: Turunkan <b>${diff.toFixed(1)} kg</b> agar ideal.`;
        infoOlahraga = "Fokus <b>Kardio</b> & Latihan beban repetisi tinggi.";
    } else {
        statusText = "BULKING (NAIKKAN MASSA)";
        colorAction = "#3498db"; 
        targetCalorie = tdee + 500; 
        detailMessage = `Target: Naikkan <b>${Math.abs(diff).toFixed(1)} kg</b> agar ideal.`;
        infoOlahraga = "Fokus <b>Latihan Beban (Hypertrophy)</b> & Protein tinggi.";
    }

    // 4. TAMPILKAN HASIL (Gaya Cyber)
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style=" padding-left: 12px; font-family: monospace; font-size: 13px;">
            <b style="color:orange">[ ANALISIS FISIK ]</b><br>
            Target Ideal  : <b style="color:#22c55e">${ideal.toFixed(1)} kg</b><br>
            Status Rekom  : <b style="color:${colorAction}">${statusText}</b><br>
            Batas BMR     : ${Math.round(bmr)} kkal (Energi dasar)<br>
            
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
            
            <b style="color:orange">[ REKOMENDASI ACTION ]</b><br>
            ${detailMessage}<br>
            Jatah Makan   : <b style="color:orange; font-size:16px;">${Math.round(targetCalorie)} kkal/hari</b><br>
            <i class="fa-solid fa-dumbbell" style="color:orange"></i> ${infoOlahraga}
            
            <br><br>
            <a href="https://who.int" 
               target="_blank" class="ptes-link" style="font-size:11px; padding: 6px 10px;">
                <i class="fa-solid fa-book-medical"></i> Panduan WHO
            </a>
        </div>
    `;
}


// sipil
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
        <div style=" padding-left: 10px; font-family: monospace;">
            <b style="color:orange">[ CIVIL ANALYSIS ]</b><br>
            Volume Beton : <b>${volume.toFixed(2)} m³</b><br>
            Estimasi Semen: <b>${semen} Sak (50kg)</b><br>
            <small style="color:#888;">*Estimasi campuran standar 1:2:3.</small>
        </div>`;
}

// sipil
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
        <div style=" padding-left: 10px; font-family: monospace;">
            <b style="color:orange">[ SLOPE INFO ]</b><br>
            Kemiringan (%) : <b>${percent.toFixed(2)}%</b><br>
            Sudut (Degree) : <b>${degree.toFixed(2)}°</b>
        </div>`;
}
// sipil
// Fungsi untuk sembunyi/munculkan input sesuai pilihan
function toggleInputs() {
    const type = document.getElementById('shapeType').value;
    document.getElementById('groupBalok').style.display = (type === 'balok') ? 'flex' : 'none';
    document.getElementById('groupBulat').style.display = (type !== 'balok') ? 'flex' : 'none';
}
// sipil
function calculateCivilVolume() {
    const type = document.getElementById('shapeType').value;
    const res = document.getElementById('civilVolResult');
    let volume = 0;

    if (type === 'balok') {
        const p = parseFloat(document.getElementById('volP').value);
        const l = parseFloat(document.getElementById('volL').value);
        const t = parseFloat(document.getElementById('volT').value);
        if (!p || !l || !t) return alert("Isi P, L, dan T!");
        volume = p * l * t;
    } else {
        const r = parseFloat(document.getElementById('volR').value);
        const t = parseFloat(document.getElementById('volTinggi').value);
        if (!r || !t) return alert("Isi Jari-jari dan Tinggi!");
        
        if (type === 'tabung') {
            volume = Math.PI * Math.pow(r, 2) * t;
        } else if (type === 'kerucut') {
            volume = (1/3) * Math.PI * Math.pow(r, 2) * t;
        }
    }

    res.style.display = 'block';
    res.innerHTML = `
        <div style=" padding-left: 10px; font-family: monospace;">
            <b style="color:orange">[ HASIL VOLUME ]</b><br>
            Bentuk : ${type.toUpperCase()}<br>
            Volume : <b style="color:#22c55e">${volume.toFixed(3)} m³</b><br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
            <small style="color:#888;">*Gunakan volume ini untuk estimasi material beton/pasir.</small>
        </div>`;
}


// Fungsi untuk menampilkan konfirmasi teks gaji saat mengetik
function updateMonthlyHint(input) {
    // 1. Jalankan format Rupiah otomatis yang sudah kita buat sebelumnya
    formatRupiahInput(input); 

    // 2. Ambil angkanya dan tampilkan di hint bawahnya
    const hint = document.getElementById('monthlyHint');
    if (input.value) {
        hint.innerHTML = `Gaji: <span style="color:orange">Rp ${input.value}</span> / bulan`;
    } else {
        hint.innerHTML = `Gaji: Rp 0 / bulan`;
    }
}

// Fungsi hitung pajak (tetap seperti sebelumnya)
function calculateSimpleTax() {
    const rawValue = document.getElementById('monthlySalary').value.replace(/\./g, "");
    const monthlySalary = parseFloat(rawValue) || 0;
    const ptkp = parseFloat(document.getElementById('maritalStatus').value);
    const resultDiv = document.getElementById('annualTaxResult');

    if (monthlySalary <= 0) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Masukkan gaji bulanan kamu!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const annualSalary = monthlySalary * 12;
    let pkp = annualSalary - ptkp;
    if (pkp < 0) pkp = 0;

    // Pajak 5% untuk penghasilan kena pajak
    const annualTax = pkp * 0.05;
    const monthlyTax = annualTax / 12;

    const formatID = (n) => new Intl.NumberFormat('id-ID').format(Math.ceil(n));

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style=" padding-left: 12px; font-family: monospace;">
            <b style="color:orange">[ RINCIAN KONFIRMASI ]</b><br>
            Input Gaji   : Rp ${formatID(monthlySalary)} / bln<br>
            Total 1 Tahun: Rp ${formatID(annualSalary)}<br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
            
            <b style="color:white">Hasil Pajak:</b><br>
            • Per Tahun : <span style="color:${annualTax > 0 ? '#ff4444' : '#22c55e'}">Rp ${formatID(annualTax)}</span><br>
            • Per Bulan : <b>Rp ${formatID(monthlyTax)}</b><br>
            <br>
            <small style="color:#888;">
                ${annualTax <= 0 ? 'Status: <b>NIHIL</b> (Bebas Pajak).' : 'Estimasi potongan PPh 21 Anda.'}
            </small>
        </div>`;
}

// sawit manajemen
function calculateSawitPro() {
    const size = parseFloat(document.getElementById('landSize').value) || 0;
    const yieldHa = parseFloat(document.getElementById('yieldPerHa').value) || 0;
    const sortasi = parseFloat(document.getElementById('sortasi').value) || 0;
    const priceTBS = parseFloat(document.getElementById('pricePerKg').value) || 0;
    
    const dosis = parseFloat(document.getElementById('dosisPerPokok').value) || 0;
    const priceMat = parseFloat(document.getElementById('priceMaterial').value.replace(/\./g, "")) || 0;
    const upahP = parseFloat(document.getElementById('upahPerPokok').value) || 0;
    
    const resultDiv = document.getElementById('sawitResult');

    if (size <= 0 || yieldHa <= 0 || priceTBS <= 0) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Lengkapi data lahan, hasil, dan harga TBS!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const formatID = (n) => new Intl.NumberFormat('id-ID').format(Math.ceil(n));

    // 1. Perhitungan Populasi & Perawatan
    const totalTrees = Math.ceil(size * 140);
    const totalMaterialNeeded = totalTrees * dosis; // Total Kg/Liter pupuk/racun
    const costMaterial = totalMaterialNeeded * priceMat; // Total harga beli pupuk
    const totalUpahPruning = totalTrees * upahP; // Total bayar tukang beroneng
    const totalOperationalCost = costMaterial + totalUpahPruning;

    // 2. Perhitungan Panen (Setelah Sortasi)
    const grossWeight = (size * yieldHa) * 1000;
    const sortAmount = (grossWeight * sortasi) / 100;
    const netWeight = grossWeight - sortAmount;
    const grossMoney = netWeight * priceTBS;

    // 3. Profit Akhir
    const finalProfit = grossMoney - totalOperationalCost;

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style=" padding-left: 12px; font-family: monospace; font-size: 13px;">
            <b style="color:orange">[ ESTIMASI LOGISTIK ]</b><br>
            • Jml Pokok : ${totalTrees} Batang<br>
            • Butuh Pupuk/Racun : <b>${totalMaterialNeeded.toFixed(1)} Kg/L</b><br>
            • Biaya Material : Rp ${formatID(costMaterial)}<br>
            • Biaya Beroneng : Rp ${formatID(totalUpahPruning)}<br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.1); margin:8px 0;">
            
            <b style="color:orange">[ HASIL PABRIK ]</b><br>
            • Berat Bersih : <b>${formatID(netWeight)} Kg</b><br>
            • Uang Kotor   : Rp ${formatID(grossMoney)}<br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.1); margin:8px 0;">
            
            <b style="color:white">PROFIT BERSIH (NET):</b><br>
            <span style="color:#22c55e; font-size:18px; font-weight:bold;">Rp ${formatID(finalProfit)}</span><br>
            <small style="color:#888;">*Sudah dipotong biaya logistik & upah.</small>
        </div>`;
}
// sawit manajemen
// Memberi saran tapi tidak memaksa isi
// Memberi saran jumlah pohon berdasarkan luas lahan
function suggestTreeCount(input) {
    const size = parseFloat(input.value) || 0;
    const suggestion = Math.ceil(size * 140); // Standar 140 pokok/ha
    document.getElementById('treeHint').innerHTML = `Saran standar: <span style="color:orange">${suggestion}</span> Pokok`;
    
    // Beri placeholder di input manual agar user ada gambaran
    document.getElementById('manualTrees').placeholder = suggestion;
}
// sawit manajemen
// Fungsi untuk memformat angka input menjadi Rupiah otomatis
function formatRupiahInput(input) {
    let value = input.value.replace(/[^0-9]/g, "");
    if (value) {
        input.value = new Intl.NumberFormat('id-ID').format(value);
    }
}
// sawit manajemen
// Memberi saran jumlah pohon berdasarkan luas lahan (standar 140/ha)
function suggestTreeCount(input) {
    const size = parseFloat(input.value) || 0;
    const suggestion = Math.ceil(size * 140);
    document.getElementById('treeHint').innerHTML = `Saran standar: <span style="color:orange">${suggestion}</span> Pokok`;
    document.getElementById('manualTrees').placeholder = suggestion;
}
// sawit manajemen
function calculateSawitSimple() {
    // Ambil Data
    const totalTrees = parseInt(document.getElementById('manualTrees').value) || 0;
    const kotorKg = parseFloat(document.getElementById('totalHarvestKg').value) || 0;
    const sortasi = parseFloat(document.getElementById('sortasi').value) || 0;
    const priceTBS = parseFloat(document.getElementById('priceTBS').value) || 0;
    
    const dosis = parseFloat(document.getElementById('dosisPerPokok').value) || 0;
    const priceMat = parseFloat(document.getElementById('priceMaterial').value.replace(/\./g, "")) || 0;
    const upahP = parseFloat(document.getElementById('upahPerPokok').value) || 0;
    
    const resultDiv = document.getElementById('sawitResult');

    if (kotorKg <= 0 || priceTBS <= 0) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Isi Total Panen dan Harga TBS!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    // 1. Hitung Berat Bersih
    const potonganKg = (kotorKg * sortasi) / 100;
    const bersihKg = kotorKg - potonganKg;
    const uangKotor = bersihKg * priceTBS;

    // 2. Hitung Modal (Berdasarkan jumlah pokok manual)
    const modalPupuk = totalTrees * dosis * priceMat;
    const modalUpah = totalTrees * upahP;
    const totalModal = modalPupuk + modalUpah;

    // 3. Profit Akhir
    const profitBersih = uangKotor - totalModal;

    const formatID = (n) => new Intl.NumberFormat('id-ID').format(Math.ceil(n));

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style=" padding-left: 12px; font-family: monospace; font-size: 13px;">
            <b style="color:orange">[ RINGKASAN PANEN ]</b><br>
            • Berat Kotor : ${formatID(kotorKg)} Kg<br>
            • Potongan (${sortasi}%): -${formatID(potonganKg)} Kg<br>
            • <b>Berat Bersih: ${formatID(bersihKg)} Kg</b><br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.1); margin:8px 0;">
            
            <b style="color:orange">[ RINCIAN MODAL ]</b><br>
            • Pupuk (${totalTrees} pkk): Rp ${formatID(modalPupuk)}<br>
            • Upah (${totalTrees} pkk): Rp ${formatID(modalUpah)}<br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.1); margin:8px 0;">
            
            <b style="color:white">HASIL BERSIH (PROFIT):</b><br>
            Uang Masuk : Rp ${formatID(uangKotor)}<br>
            <span style="color:#22c55e; font-size:18px; font-weight:bold;">SISA: Rp ${formatID(profitBersih)}</span>
        </div>`;
}

// marjin bisnis
function calculateBizProfit() {
    const rev = parseFloat(document.getElementById('bizRevenue').value.replace(/\./g, "")) || 0;
    const cogs = parseFloat(document.getElementById('bizCogs').value.replace(/\./g, "")) || 0;
    const exp = parseFloat(document.getElementById('bizExpense').value.replace(/\./g, "")) || 0;
    const resultDiv = document.getElementById('bizResult');

    if (rev <= 0) {
        resultDiv.innerHTML = '<span style="color:red">Masukkan nilai penjualan!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const totalCost = cogs + exp;
    const netProfit = rev - totalCost;
    const margin = (netProfit / rev) * 100;
    
    const formatID = (n) => new Intl.NumberFormat('id-ID').format(Math.ceil(n));

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style=" padding-left: 10px; font-family: monospace;">
            <b style="color:orange">[ BUSINESS REPORT ]</b><br>
            Omzet Bersih : Rp ${formatID(rev)}<br>
            Total Biaya  : Rp ${formatID(totalCost)}<br>
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
            
            <b style="color:white">LABA BERSIH:</b><br>
            <span style="color:${netProfit > 0 ? '#22c55e' : '#ff4444'}; font-size:18px;">
                Rp ${formatID(netProfit)}
            </span><br>
            Margin Untung : <b>${margin.toFixed(1)}%</b><br>
            <br>
            <small style="color:#888;">
                ${margin < 20 ? '*Margin rendah, cek efisiensi biaya!' : '*Margin sehat, lanjutkan!'}
            </small>
        </div>
    `;
}

// haid jadwal
function analyzeCycle() {
    const lastDateInput = document.getElementById('lastPeriod').value;
    const duration = parseInt(document.getElementById('periodDuration').value) || 7;
    const cycle = parseInt(document.getElementById('cycleLength').value) || 28;
    const resultDiv = document.getElementById('cycleResult');

    if (!lastDateInput) {
        resultDiv.innerHTML = '<span style="color:#ff4444">Pilih tanggal haid terakhir!</span>';
        resultDiv.style.display = 'block';
        return;
    }

    const lastDate = new Date(lastDateInput);
    const today = new Date();
    today.setHours(0,0,0,0);

    // --- LOGIKA TANGGAL ---
    const nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycle);
    const ovulationDay = new Date(nextPeriod);
    ovulationDay.setDate(nextPeriod.getDate() - 14);
    const fertileStart = new Date(ovulationDay); fertileStart.setDate(ovulationDay.getDate() - 5);
    const fertileEnd = new Date(ovulationDay); fertileEnd.setDate(ovulationDay.getDate() + 1);

    // --- LOGIKA GEJALA ---
    const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(el => el.value);
    let saranGejala = "";

    if (selectedSymptoms.length > 0) {
        saranGejala = `<b style="color:orange">[ ANALISIS GEJALA/SYMPTOM ANALYSIS ]</b><br>`;
        selectedSymptoms.forEach(s => {
            if (s === "Kram Perut") saranGejala += `• <b>Kram:</b> Gunakan kompres hangat & air jahe(Use warm compress & ginger water).<br>`;
            if (s === "Jerawat") saranGejala += `• <b>Jerawat:</b> Jaga kebersihan wajah, kurangi susu & gula(Keep your face clean, reduce milk & sugar).<br>`;
            if (s === "Pusing") saranGejala += `• <b>Pusing:</b> Cukup istirahat & kurangi cahaya terang(Get enough rest & reduce bright light).<br>`;
            if (s === "Mood Swings") saranGejala += `• <b>Mood:</b> Meditasi atau jalan santai, kurangi kafein(Meditate or take a walk, reduce caffeine).<br>`;
            if (s === "Payudara Sensitif") saranGejala += `• <b>Sensitif:</b> Gunakan bra yang nyaman/longgar(Wear a comfortable/loose bra).<br>`;
        });
        saranGejala += `<hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">`;
    }

    const options = { day: 'numeric', month: 'long' };
    const formatDate = (date) => date.toLocaleDateString('id-ID', options);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style= padding-left: 12px; font-family: monospace; font-size: 13px;">
            <b style="color:orange">[ ESTIMASI SIKLUS/CYCLE ESTIMATION ]</b><br>
            • Haid Berikutnya/Next Period : <b style="color:#ff4444">${formatDate(nextPeriod)}</b><br>
            • Puncak Subur/Fertile Peak : <b style="color:#22c55e">${formatDate(ovulationDay)}</b><br>
            <small style="color:#888;">Rentang Subur/Fertile Range: ${formatDate(fertileStart)} - ${formatDate(fertileEnd)}</small>
            
            <hr style="border:0; border-top:1px solid rgba(255,115,0,0.2); margin:10px 0;">
            
            ${saranGejala}
            
            <b style="color:orange">[ TIPS SISTEM/SYSTEM TIPS ]</b><br>
            <small style="color:#ddd;">Siklus Anda terdeteksi(Your cycle is detected) ${cycle} hari. Catat perubahan gejala setiap bulan untuk membantu diagnosa medis jika diperlukan(daily. Note changes in symptoms each month to aid in a medical diagnosis if necessary.).</small>
        </div>`;
}

function filterTools(category) {
    const cards = document.querySelectorAll('.tool-card');
    const buttons = document.querySelectorAll('.category-btn');

    // 1. Update status tombol aktif
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(category)) btn.classList.add('active');
    });

    // 2. Logika Sembunyi/Munculkan Card
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Animasi keluar
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";

        setTimeout(() => {
            if (category === 'all' || cardCategory === category) {
                card.style.display = "block";
                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                }, 50);
            } else {
                card.style.display = "none";
            }
        }, 300);
    });
}


function changeLang(lang) {
    // Contoh mengganti judul alat
    document.querySelector('.tool-title').innerText = translations[lang].title;
    // ... teruskan untuk elemen lainnya
}













// Fungsi untuk kembali ke atas dengan halus
function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth' // Efek scroll halus (smooth)
  });
}




