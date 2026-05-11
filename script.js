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
// Fungsi Otomatis Huruf Kapital di Awal Kata
// 1. Fungsi Otomatis Huruf Kapital & Balik Nama
// List gelar yang sering muncul untuk dibuang otomatis
// 1. Data Gelar & Helper
// ═══════════════════════════════════════════════════════════════
//  MULTI-FORMAT CITATION GENERATOR — Full JS
//  Mendukung: APA 7 · IEEE · MLA · Chicago · Harvard
// ═══════════════════════════════════════════════════════════════

// ── Daftar gelar akademik yang akan dibersihkan dari nama ────────────────────
// ═══════════════════════════════════════════════════════════════
//  MULTI-FORMAT CITATION GENERATOR — Full JS
//  Mendukung: APA 7 · IEEE · MLA · Chicago · Harvard
// ═══════════════════════════════════════════════════════════════

// ── Daftar gelar akademik yang dibersihkan dari nama ─────────────────────────
const academicTitles = [
    's.kom','m.kom','s.tr','m.t','s.t','prof','dr','ph.d',
    'm.pd','s.pd','m.si','s.si','m.sc','s.p','se','sh',
    'mm','mba','mt','st','spd','mpd','s.h','s.e','m.m',
    'm.h','s.sos','m.sos','s.ag','m.ag','s.psi','m.psi'
];

// ── Bersihkan gelar dari nama ─────────────────────────────────────────────────
function cleanName(name) {
    if (!name) return "";
    let baseName = name.split(',')[0];
    let parts = baseName.trim().split(/\s+/);
    let filtered = parts.filter(part => {
        let clean = part.toLowerCase().replace(/\./g, '');
        return !academicTitles.includes(clean);
    });
    return filtered.join(" ");
}

// ── Title Case (untuk IEEE, MLA, Chicago, Harvard) ───────────────────────────
function toTitleCase(str) {
    if (!str) return "";
    const minorWords = [
        'dan','di','ke','dari','yang','untuk','pada','dalam','dengan','oleh',
        'the','a','an','and','or','of','in','on','at','to','for','by','with'
    ];
    return str.toLowerCase().split(' ').map((word, i) => {
        if (i !== 0 && minorWords.includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

// ── Sentence Case (untuk APA — hanya huruf pertama & setelah titik dua) ──────
function toSentenceCase(str) {
    if (!str) return "";
    return str.toLowerCase().replace(/(^\w|:\s*\w)/g, c => c.toUpperCase());
}

// ── Tambah titik HANYA jika string belum berakhir titik ──────────────────────
//    Mencegah titik ganda: "Sah, A.. (2016)" → "Sah, A. (2016)"
function dotAfter(str) {
    return str.trimEnd().endsWith('.') ? '' : '.';
}

// ── Format satu nama penulis sesuai gaya ─────────────────────────────────────
//  APA / Harvard  → Last, I.
//  IEEE           → I. Last
//  MLA / Chicago  → Last, Firstname (penulis ke-1) | Firstname Last (selanjutnya)
function formatAuthorNameSingle(rawName, format, isFirst) {
    let cleaned  = cleanName(rawName);
    let parts    = cleaned.trim().split(/\s+/).map(p =>
        p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    );

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];

    let lastName  = parts.pop();
    let initials  = parts.map(p => p.charAt(0) + ".").join(" ");
    let firstFull = parts.join(" ");

    switch (format) {
        case 'apa':
        case 'harvard':
            return `${lastName}, ${initials}`;        // Santoso, B. A.
        case 'ieee':
            return `${initials} ${lastName}`;          // B. A. Santoso
        case 'mla':
        case 'chicago':
            return isFirst
                ? `${lastName}, ${firstFull}`          // Santoso, Budi (penulis ke-1)
                : `${firstFull} ${lastName}`;          // Budi Santoso (selanjutnya)
    }
    return `${initials} ${lastName}`;
}

// ── Gabung semua nama penulis sesuai aturan gaya ─────────────────────────────
function buildAuthorString(authorNames, format) {
    if (!authorNames || authorNames.length === 0) return "";

    const n         = authorNames.length;
    const formatted = authorNames.map((name, i) =>
        formatAuthorNameSingle(name, format, i === 0)
    );

    // APA 7: Daftar Pustaka wajib tulis SEMUA nama s.d. 20 penulis
    if (format === 'apa') {
        if (n === 1) return formatted[0];
        if (n <= 20) {
            let arr  = [...formatted];
            let last = arr.pop();
            return arr.join(', ') + ', & ' + last;
        }
        // 21+ penulis: 19 pertama → . . . → nama terakhir
        return formatted.slice(0, 19).join(', ') + ', . . . ' + formatted[n - 1];
    }

    // Threshold et al. per format non-APA
    const etalThreshold = { ieee: 4, mla: 3, chicago: 4, harvard: 4 };
    const threshold     = etalThreshold[format] ?? 4;

    // MLA: koma sebelum et al. → "Aja, Novan, et al."
    if (n >= threshold) return `${formatted[0]}${format === 'mla' ? ',' : ''} et al.`;
    if (n === 1)        return formatted[0];

    const lastSep = {
        ieee:    ', and ',   // IEEE pakai ", and" bukan "dan"
        mla:     ', and ',
        chicago: ', and ',
        harvard: ' & '
    }[format] ?? ' dan ';

    if (n === 2) return formatted[0] + lastSep + formatted[1];

    // 3 penulis
    let arr  = [...formatted];
    let last = arr.pop();
    return arr.join(', ') + lastSep + last;
}

// ── Tambah field input penulis ────────────────────────────────────────────────
function addAuthorField() {
    const container = document.getElementById('authorContainer');
    const div       = document.createElement('div');
    div.className   = 'flex gap-2 mb-2';
    div.innerHTML   = `
        <input type="text"
               class="tool-input author-name flex-1"
               placeholder="Nama Penulis Selanjutnya">
        <button onclick="this.parentElement.remove()"
                class="tool-btn"
                style="width:40px;margin:0;background:#ff4444;color:white;">×</button>
    `;
    container.appendChild(div);
}

// ── FUNGSI UTAMA ──────────────────────────────────────────────────────────────
function generateCitation() {
    const format   = document.getElementById('citeFormat').value;
    const rawTitle = document.getElementById('citeTitle').value.trim();
    const rawJName = document.getElementById('citeJournalName').value.trim();
    const year     = document.getElementById('citeYear').value.trim();
    const vol      = document.getElementById('citeVol').value.trim();
    const no       = document.getElementById('citeNum').value.trim();
    const page     = document.getElementById('citePage').value.trim();
    const rawUrl   = document.getElementById('citeUrl').value.trim();
    const res      = document.getElementById('citationResult');

    const authorInputs = document.querySelectorAll('.author-name');
    const authorNames  = [...authorInputs].map(el => el.value.trim()).filter(Boolean);

    // Validasi
    if (authorNames.length === 0 || !rawTitle || !year) {
        res.innerHTML     = `<span style="color:#ff4444">⚠️ Nama Penulis, Judul, dan Tahun wajib diisi!</span>`;
        res.style.display = 'block';
        return;
    }

    const authorString = buildAuthorString(authorNames, format);
    const title        = (format === 'apa') ? toSentenceCase(rawTitle) : toTitleCase(rawTitle);
    const jName        = toTitleCase(rawJName);

    let doiLink = "";
    if (rawUrl) {
        doiLink = rawUrl.startsWith('http') ? rawUrl : `https://doi.org/${rawUrl}`;
    }

    let finalCite = "";

    switch (format) {

        // ── APA 7 ──────────────────────────────────────────────────────────────
        case 'apa': {
            finalCite  = `${authorString}${dotAfter(authorString)} (${year}). ${title}. `;
            finalCite += `<i>${jName}</i>, <i>${vol}</i>(${no}), ${page}.`;
            if (doiLink) finalCite += ` ${doiLink}`;

            const n        = authorNames.length;
            const lastWord = cleanName(authorNames[0]).trim().split(/\s+/).pop();
            const inText   = n >= 3
                ? `(${lastWord} et al., ${year})`
                : `(${authorString.replace(/,.*/, '').trim()}, ${year})`;

            finalCite += `
                <div data-nocopy="true" style="margin-top:14px;padding:10px 12px;
                            background:rgba(251,191,36,.08);
                            border-left:3px solid #fbbf24;border-radius:4px;
                            font-size:11px;color:#fbbf24;line-height:1.7;">
                    <b>💡 Tips APA 7:</b><br>
                    • <b>Daftar Pustaka</b> (bagian ini): ${n} penulis ditulis lengkap ✅<br>
                    • <b>Sitasi dalam teks / body note:</b>
                      <span style="color:#fff;font-style:italic;">${inText}</span>
                      ${n >= 3 ? ' ← gunakan <b>et al.</b> untuk 3+ penulis' : ''}
                </div>`;
            break;
        }

        // ── IEEE ───────────────────────────────────────────────────────────────
        case 'ieee':
            finalCite  = `${authorString}, "${title}," `;
            finalCite += `<i>${jName}</i>, vol. ${vol}, no. ${no}, pp. ${page}, ${year}`;
            finalCite += doiLink ? `, [Online]. Tersedia: ${doiLink}.` : '.';
            break;

        // ── MLA ────────────────────────────────────────────────────────────────
        case 'mla':
            finalCite  = `${authorString}${dotAfter(authorString)} "${title}." `;
            finalCite += `<i>${jName}</i>, vol. ${vol}, no. ${no}, ${year}, pp. ${page}.`;
            if (doiLink) finalCite += ` ${doiLink}.`;
            break;

        // ── Chicago ────────────────────────────────────────────────────────────
        case 'chicago':
            finalCite  = `${authorString}${dotAfter(authorString)} "${title}." `;
            finalCite += `<i>${jName}</i> ${vol}, no. ${no} (${year}): ${page}.`;
            if (doiLink) finalCite += ` ${doiLink}.`;
            break;

        // ── Harvard ────────────────────────────────────────────────────────────
        case 'harvard':
            finalCite  = `${authorString} ${year}, '${title}', `;
            finalCite += `<i>${jName}</i>, vol. ${vol}, no. ${no}, pp. ${page}.`;
            if (doiLink) finalCite += ` ${doiLink}.`;
            break;
    }

    res.style.display = 'block';
    res.innerHTML = `
        <div style="
                    background:rgba(34,197,94,.05);
                    padding:15px;border-radius:5px;">
            <b style="color:#22c55e;font-size:11px;">
                ✅ HASIL SIAP SALIN (${format.toUpperCase()}):
            </b>
            <div id="citeText" style="margin-top:10px;color:#ddd;line-height:1.8;">
                ${finalCite}
            </div>
            <button onclick="copyToClipboard('citeText')"
                    class="tool-btn"
                    style="width:auto;padding:8px 20px;background:#22c55e;
                           color:black;margin-top:15px;font-size:12px;">
                <i class="fa-solid fa-copy"></i> SALIN DAFTAR PUSTAKA
            </button>
        </div>
    `;
}

// ── Copy ke clipboard ─────────────────────────────────────────────────────────
function copyToClipboard(id) {
    
    const el   = document.getElementById(id);
    const clone = el.cloneNode(true);
    clone.querySelectorAll('[data-nocopy]').forEach(e => e.remove());
    const text = clone.innerText.trim();
    if (!text) return;

    navigator.clipboard.writeText(text)
        .then(() => alert("✅ Sitasi berhasil disalin!"))
        .catch(() => {
            const ta          = document.createElement('textarea');
            ta.value          = text;
            ta.style.position = 'fixed';
            ta.style.opacity  = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            try {
                document.execCommand('copy');
                alert("✅ Sitasi berhasil disalin!");
            } catch (e) {
                alert("Gagal menyalin. Silakan salin manual.");
            }
            document.body.removeChild(ta);
        });
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

// 
// CORS Proxy — agar fetch ke API eksternal tidak diblokir browser
const CORS_PROXY = 'https://corsproxy.io/?url=';

async function runRecon() {
    const type = document.getElementById('reconType').value;
    const input = document.getElementById('reconInput').value.trim();
    const res = document.getElementById('reconResult');

    if (!input) {
        res.innerHTML = '<span style="color:#ff4444">⚠️ Silakan masukkan data!</span>';
        res.style.display = 'block';
        return;
    }

    res.style.display = 'block';
    res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

    try {
        if (type === 'hash') {
            await runHashLookup(input, res);
        } else if (type === 'revip') {
            await runReverseIP(input, res);
        } else if (type === 'cms') {
            await runCMSDetect(input, res);
        } else if (type === 'subdomain') {
            await runSubdomainFinder(input, res);
        }
    } catch (error) {
        res.innerHTML = `<span style="color:#ff4444">❌ Error: ${error.message || 'Gagal terhubung ke API'}</span>`;
    }
}

// ─── 1. HASH LOOKUP ───────────────────────────────────────────
async function runHashLookup(input, res) {
    const hash = input.trim();
    
    // Validasi format hash
    const isMD5 = /^[a-f0-9]{32}$/i.test(hash);
    const isSHA1 = /^[a-f0-9]{40}$/i.test(hash);
    const isSHA256 = /^[a-f0-9]{64}$/i.test(hash);

    if (!isMD5 && !isSHA1 && !isSHA256) {
        res.innerHTML = `
            <div style="border-left: 3px solid #f59e0b; padding-left: 10px;">
                <b style="color:#f59e0b">⚠️ FORMAT HASH TIDAK DIKENALI</b><br>
                Format yang didukung:<br>
                • MD5 — 32 karakter hex<br>
                • SHA1 — 40 karakter hex<br>
                • SHA256 — 64 karakter hex<br>
                <small style="color:#888;">Contoh MD5: 5d41402abc4b2a76b9719d911017c592</small>
            </div>`;
        return;
    }

    let hashType = 'md5';
    if (isSHA1) hashType = 'sha1';
    if (isSHA256) hashType = 'sha256';

    res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mencari di database hash...';

    try {
        // Coba pake API md5decrypt.net via CORS proxy
        const apiUrl = `${CORS_PROXY}${encodeURIComponent(
            `https://md5decrypt.net/Api/api.php?hash=${hash}&hash_type=${hashType}&code=`
        )}`;
        
        const response = await fetch(apiUrl);
        const data = await response.text();
        
        // MD5Decrypt returns "NOT FOUND" atau string kosong kalau gak ketemu
        const cleaned = data.trim();
        const found = cleaned && cleaned !== 'NOT FOUND' && cleaned.length > 0 && cleaned !== hash;

        if (found) {
            res.innerHTML = `
                <div style="border-left: 3px solid #22c55e; padding-left: 10px;">
                    <b style="color:#22c55e">✅ HASH DECRYPTED</b><br>
                    <table style="width:100%; font-size:13px; margin-top:5px;">
                        <tr><td style="color:#888;">Type:</td><td><b>${hashType.toUpperCase()}</b></td></tr>
                        <tr><td style="color:#888;">Hash:</td><td style="font-family:monospace; font-size:11px; word-break:break-all;">${hash}</td></tr>
                        <tr><td style="color:#888;">Result:</td><td><b style="color:#a855f7;">${cleaned}</b></td></tr>
                    </table>
                </div>`;
        } else {
            // Fallback — redirect ke aggregator
            res.innerHTML = `
                <div style="border-left: 3px solid #f59e0b; padding-left: 10px;">
                    <b style="color:#f59e0b">🔍 HASH TIDAK DITEMUKAN di database utama</b><br>
                    Target: <code style="font-size:11px;">${hash}</code><br>
                    <small style="color:#888;">Coba cek manual di situs berikut:</small><br><br>
                    <a href="https://md5decrypt.net/en/#${hash}" target="_blank" class="ptes-link" style="display:inline-block; margin-right:8px;">
                        <i class="fa-solid fa-magnifying-glass"></i> MD5Decrypt
                    </a>
                    <a href="https://crackstation.net/" target="_blank" class="ptes-link" style="display:inline-block; margin-right:8px;">
                        <i class="fa-solid fa-database"></i> CrackStation
                    </a>
                    <a href="https://hashes.org/search.php?q=${hash}" target="_blank" class="ptes-link" style="display:inline-block;">
                        <i class="fa-solid fa-search"></i> Hashes.org
                    </a>
                </div>`;
        }
    } catch (e) {
        // Fallback jika API gagal
        res.innerHTML = `
            <div style="border-left: 3px solid #f59e0b; padding-left: 10px;">
                <b style="color:#f59e0b">🔍 HASH LOOKUP</b><br>
                Target: <code style="font-size:11px;">${hash}</code><br>
                <small style="color:#888;">Gagal terkoneksi ke database. Coba manual:</small><br><br>
                <a href="https://md5decrypt.net/en/#${hash}" target="_blank" class="ptes-link">
                    <i class="fa-solid fa-magnifying-glass"></i> Cek di MD5Decrypt
                </a>
            </div>`;
    }
}

// ─── 2. REVERSE IP LOOKUP ────────────────────────────────────
async function runReverseIP(input, res) {
    // Bersihkan input — ambil domain/IP saja
    let target = input.replace(/^(https?:\/\/)/, '').replace(/\/.*$/, '').trim();
    
    res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reverse IP lookup...';
    
    const apiUrl = `${CORS_PROXY}${encodeURIComponent(
        `https://api.hackertarget.com/reverseiplookup/?q=${target}`
    )}`;
    
    const response = await fetch(apiUrl);
    const data = await response.text();

    // Parse hasil — API return plaintext, baris pertama bisa "API count exceeded" atau error
    if (data.includes('error') || data.includes('API count') || data.includes('invalid')) {
        // Fallback: tampilkan link
        res.innerHTML = `
            <div style="border-left: 3px solid #f59e0b; padding-left: 10px;">
                <b style="color:#f59e0b">⚠️ API RATE LIMIT / ERROR</b><br>
                <small>HackerTarget free: 20 query/hari. Coba manual:</small><br><br>
                <a href="https://hackertarget.com/reverse-ip-lookup/?q=${target}" target="_blank" class="ptes-link">
                    <i class="fa-solid fa-globe"></i> Buka HackerTarget Reverse IP
                </a>
            </div>`;
        return;
    }

    const lines = data.trim().split('\n').filter(l => l.trim());
    
    if (lines.length === 0) {
        res.innerHTML = '<span style="color:#f59e0b">Tidak ada domain ditemukan untuk IP ini.</span>';
        return;
    }

    res.innerHTML = `
        <div style="border-left: 3px solid #a855f7; padding-left: 10px;">
            <b style="color:#a855f7">🌐 REVERSE IP RESULT</b><br>
            Target: <b>${target}</b> &nbsp;|&nbsp; <small style="color:#888;">${lines.length} domain ditemukan</small>
            <pre style="font-size:11px; color:#bbb; background:#0a0a0a; padding:12px; border-radius:6px; margin-top:8px; max-height:250px; overflow-y:auto; border:1px solid #222;">${lines.join('\n')}</pre>
            <small style="color:#666;">Sumber: HackerTarget API</small>
        </div>`;
}

// ─── 3. CMS DETECTOR ─────────────────────────────────────────
async function runCMSDetect(input, res) {
    let target = input.replace(/^(https?:\/\/)/, '').replace(/\/.*$/, '').trim();
    // Pastikan ada protokol untuk redirect ke whatcms
    const fullUrl = input.startsWith('http') ? input : `https://${target}`;
    
    res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mendeteksi CMS...';

    // WhatCMS requires API key untuk API endpoint-nya,
    // jadi kita pakai link redirect ke WhatCMS + fallback deteksi via HTTP headers
    try {
        // Coba deteksi via response headers (sederhana)
        const apiUrl = `${CORS_PROXY}${encodeURIComponent(fullUrl)}`;
        const response = await fetch(apiUrl, { method: 'HEAD' });
        const server = response.headers.get('server') || '-';
        const poweredBy = response.headers.get('x-powered-by') || '-';
        const cfRails = response.headers.get('x-rack-cache') || '-';
        const cfFramework = response.headers.get('x-frame-options') ? 'Ada' : '-';
        const contentType = response.headers.get('content-type') || '-';
        
        // Tebak CMS dari header
        let cmsGuess = 'Tidak terdeteksi dari header';
        if (poweredBy.includes('PHP')) cmsGuess = 'Kemungkinan WordPress / PHP-based CMS';
        if (server.includes('nginx') && poweredBy.includes('Express')) cmsGuess = 'Node.js (Express)';
        if (server.includes('cloudflare')) cmsGuess = 'Cloudflare Proxy (CMS tidak terlihat)';
        
        res.innerHTML = `
            <div style="border-left: 3px solid #a855f7; padding-left: 10px;">
                <b style="color:#a855f7">🔎 CMS DETECTION</b><br>
                Target: <b>${target}</b><br><br>
                <table style="width:100%; font-size:12px;">
                    <tr><td style="color:#888;">Server:</td><td>${server}</td></tr>
                    <tr><td style="color:#888;">X-Powered-By:</td><td>${poweredBy}</td></tr>
                </table>
                <div style="background:#0a0a0a; padding:8px; border-radius:4px; margin-top:8px; font-size:12px; color:#ccc;">
                    💡 ${cmsGuess}
                </div>
                <a href="https://whatcms.org/?s=${fullUrl}" target="_blank" class="ptes-link" style="margin-top:10px; display:inline-block;">
                    <i class="fa-solid fa-microscope"></i> Analisis Lengkap di WhatCMS
                </a>
            </div>`;
    } catch (e) {
        res.innerHTML = `
            <div style="border-left: 3px solid #f59e0b; padding-left: 10px;">
                <b style="color:#f59e0b">🔎 CMS DETECTION</b><br>
                Target: ${target}<br><br>
                <a href="https://whatcms.org/?s=${fullUrl}" target="_blank" class="ptes-link">
                    <i class="fa-solid fa-microscope"></i> Analisis dengan WhatCMS
                </a>
            </div>`;
    }
}

// ─── 4. SUBDOMAIN FINDER ─────────────────────────────────────
async function runSubdomainFinder(input, res) {
    let target = input.replace(/^(https?:\/\/)/, '').replace(/\/.*$/, '').trim();
    
    res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning subdomains via DNS records...';
    
    const apiUrl = `${CORS_PROXY}${encodeURIComponent(
        `https://api.hackertarget.com/hostsearch/?q=${target}`
    )}`;
    
    const response = await fetch(apiUrl);
    const data = await response.text();

    if (data.includes('error') || data.includes('API count') || data.includes('invalid')) {
        res.innerHTML = `
            <div style="border-left: 3px solid #f59e0b; padding-left: 10px;">
                <b style="color:#f59e0b">⚠️ API RATE LIMIT</b><br>
                <small>HackerTarget free: 20 query/hari. Coba manual:</small><br><br>
                <a href="https://hackertarget.com/find-dns-host-records/?q=${target}" target="_blank" class="ptes-link">
                    <i class="fa-solid fa-globe"></i> Buka HackerTarget HostSearch
                </a>
            </div>`;
        return;
    }

    const lines = data.trim().split('\n').filter(l => l.trim());
    
    if (lines.length === 0) {
        res.innerHTML = '<span style="color:#f59e0b">Tidak ada subdomain ditemukan.</span>';
        return;
    }

    // Format: "domain,IP" — pisahkan
    const tableRows = lines.map(line => {
        const parts = line.split(',');
        if (parts.length === 2) {
            return `<tr><td style="font-family:monospace; font-size:11px; color:#a855f7;">${parts[0]}</td><td style="font-family:monospace; font-size:11px; color:#888;">${parts[1]}</td></tr>`;
        }
        return `<tr><td colspan="2" style="font-size:11px;">${line}</td></tr>`;
    }).join('');

    res.innerHTML = `
        <div style="border-left: 3px solid #a855f7; padding-left: 10px;">
            <b style="color:#a855f7">🔍 SUBDOMAIN ENUMERATION</b><br>
            Target: <b>${target}</b> &nbsp;|&nbsp; <small style="color:#888;">${lines.length} record ditemukan</small>
            <div style="background:#0a0a0a; padding:10px; border-radius:6px; margin-top:8px; max-height:300px; overflow-y:auto; border:1px solid #222;">
                <table style="width:100%; font-size:12px;">
                    <thead>
                        <tr style="border-bottom:1px solid #333;">
                            <th style="text-align:left; color:#888; padding-bottom:5px;">Subdomain</th>
                            <th style="text-align:left; color:#888; padding-bottom:5px;">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            <small style="color:#666; margin-top:5px; display:block;">📡 Data berdasarkan public DNS records (HackerTarget)</small>
        </div>`;
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
            
            <b  style="color:orange">[ TIPS SISTEM/SYSTEM TIPS ]</b><br>
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




