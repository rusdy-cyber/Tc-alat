const academicTitles = [
    's.kom', 'm.kom', 's.tr', 'm.t', 's.t', 'prof', 'dr', 'ph.d', 'm.pd', 's.pd', 'm.si', 's.si'
];

function cleanName(name) {
    // 1. Hapus gelar (apapun setelah koma biasanya gelar)
    let baseName = name.split(',')[0]; 
    
    // 2. Bersihkan titik dan kata yang mirip gelar dari list
    let parts = baseName.trim().split(/\s+/);
    let filteredParts = parts.filter(part => {
        let cleanPart = part.toLowerCase().replace(/\./g, '');
        return !academicTitles.includes(cleanPart);
    });
    
    return filteredParts.join(" ");
}

function addAuthorField() {
    const container = document.getElementById('authorContainer');
    const div = document.createElement('div');
    div.className = 'flex gap-2 mb-2';
    div.innerHTML = `
        <input type="text" class="tool-input author-name flex-1" placeholder="Nama Penulis Selanjutnya">
        <button onclick="this.parentElement.remove()" class="tool-btn" style="width:40px; margin:0; background:#ff4444; color:white;">×</button>
    `;
    container.appendChild(div);
}

function generateCitation() {
    const format = document.getElementById('citeFormat').value;
    const authorInputs = document.querySelectorAll('.author-name');
    
    // Ambil semua nama, bersihkan dari gelar, lalu format inisialnya
    let formattedAuthors = [];
    authorInputs.forEach(input => {
        let rawName = input.value.trim();
        if (rawName) {
            let cleaned = cleanName(rawName);
            formattedAuthors.push(formatAuthorNameSingle(cleaned, format));
        }
    });

    // Gabungkan nama (Pake 'dan' atau 'et al.')
    let finalAuthorString = "";
    if (formattedAuthors.length > 3) {
        finalAuthorString = formattedAuthors[0] + " dkk"; // IEEE style untuk penulis banyak
    } else if (formattedAuthors.length === 2) {
        finalAuthorString = formattedAuthors.join(" dan ");
    } else if (formattedAuthors.length === 3) {
        let last = formattedAuthors.pop();
        finalAuthorString = formattedAuthors.join(", ") + ", dan " + last;
    } else {
        finalAuthorString = formattedAuthors[0];
    }

    // ... Lanjutkan ke perakitan string jurnal seperti sebelumnya ...
}

// Helper untuk format 1 nama (Inisial)
function formatAuthorNameSingle(name, format) {
    let parts = name.split(/\s+/).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    if (parts.length > 1) {
        let last = parts.pop();
        let initials = parts.map(p => p.charAt(0) + ".").join(" ");
        return format === 'apa' ? `${last}, ${initials}` : `${initials} ${last}`;
    }
    return parts[0];
}


function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

// 2. Fungsi Utama Generate Sitasi
function generateCitation() {
    const format = document.getElementById('citeFormat').value;
    const rawAuthor = document.getElementById('citeAuthor').value.trim();
    const rawTitle = document.getElementById('citeTitle').value.trim();
    const rawJName = document.getElementById('citeJournalName').value.trim();
    
    const year = document.getElementById('citeYear').value.trim();
    const vol = document.getElementById('citeVol').value.trim();
    const no = document.getElementById('citeNum').value.trim();
    const page = document.getElementById('citePage').value.trim();
    const url = document.getElementById('citeUrl') ? document.getElementById('citeUrl').value.trim() : "";
    const res = document.getElementById('citationResult');

    // Validasi
    if (!rawAuthor || !rawTitle || !year) {
        res.innerHTML = '<span style="color:#ff4444">Nama, Judul, dan Tahun wajib diisi!</span>';
        res.style.display = 'block';
        return;
    }

    // Proses Nama & Judul
    const author = formatAuthorName(rawAuthor, format);
    const title = toTitleCase(rawTitle);
    const jName = toTitleCase(rawJName);

    let finalCite = "";

    // Logika Format sesuai standar Skripsi/Jurnal
    switch(format) {
        case 'ieee':
            let linkIeee = url ? `, [Online]. Tersedia: ${url}` : "";
            finalCite = `${author}, "${title}," <i>${jName}</i>, vol. ${vol}, no. ${no}, hal. ${page}, ${year}${linkIeee}.`;
            break;
        case 'apa':
            let linkApa = url ? ` ${url}` : "";
            finalCite = `${author}. (${year}). ${title}. <i>${jName}</i>, ${vol}(${no}), ${page}.${linkApa}`;
            break;
        case 'mla':
            finalCite = `${author}. "${title}." <i>${jName}</i>, vol. ${vol}, no. ${no}, ${year}, pp. ${page}.`;
            break;
        case 'chicago':
            finalCite = `${author}. "${title}." <i>${jName}</i> ${vol}, no. ${no} (${year}): ${page}.`;
            break;
        case 'harvard':
            finalCite = `${author} ${year}, '${title}', <i>${jName}</i>, vol. ${vol}, no. ${no}, pp. ${page}.`;
            break;
    }

    // Tampilkan Hasil
    res.style.display = 'block';
    res.innerHTML = `
        <div style="border-left: 3px solid #22c55e; padding-left: 12px; background: rgba(34, 197, 94, 0.05); padding: 15px; border-radius: 5px;">
            <b style="color:#22c55e; font-size: 11px;">HASIL SIAP PASTE (${format.toUpperCase()}):</b>
            <div id="citeText" style="margin-top:10px; color:#ddd; line-height: 1.5;">${finalCite}</div>
            
            <button onclick="copyToClipboard('citeText')" class="tool-btn" style="width:auto; padding:8px 20px; background:#22c55e; color:black; margin-top:15px; font-size:12px;">
                <i class="fa-solid fa-copy"></i> SALIN DAFTAR PUSTAKA
            </button>
        </div>
    `;
}

// Fungsi Copy (Pastikan ID input sesuai)
function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Sitasi berhasil disalin ke clipboard!");
    });
}