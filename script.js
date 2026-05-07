// --- KONFIGURASI DATA ---
const menuData = [
    { 
        id: 'es-susu', 
        nama: 'Es Susu Mococo', 
        harga: 15000, 
        kategori: 'minuman', 
        img: 'es-susu.png',
        rasa: [
            { nama: 'Oreo', foto: 'oreo-varian.png' },
            { nama: 'Coklat', foto: 'coklat-varian.png' },
            { nama: 'Matcha', foto: 'matcha-varian.png' },
            { nama: 'Capucinno', foto: 'capucinno-varian.png' },
            { nama: 'Dalgona Coffe', foto: 'dalgona-varian.png' },
            { nama: 'Gula Aren', foto: 'gula-aren-varian.png' },
            { nama: 'Butterscotch', foto: 'butterscotch-varian.png' }
        ] 
    },
    { id: 'es-teh', nama: 'Es Teh Segar', harga: 5000, kategori: 'minuman', img: 'es-teh.png' },
    { id: 'es-jeruk', nama: 'Es Jeruk Peras', harga: 7000, kategori: 'minuman', img: 'es-jeruk.png' },
    { id: 'bowl', nama: 'Rice Bowl Ayam', harga: 25000, kategori: 'makanan', img: 'bowl.png' },
    { id: 'boba', nama: 'Boba Brown Sugar', harga: 18000, kategori: 'minuman', img: 'boba.png' },
    { id: 'kentang', nama: 'Kentang Goreng', harga: 12000, kategori: 'jajanan', img: 'kentang.png' }
];

const toppingOptions = [
    { id: 'cream_cheese', nama: 'Cream Cheese', harga: 2000, img: 'top-cream.png' },
    { id: 'boba_top', nama: 'Boba', harga: 2000, img: 'top-boba.png' },
    { id: 'oreo_top', nama: 'Oreo', harga: 2000, img: 'top-oreo.png' },
    { id: 'jelly', nama: 'Jelly', harga: 2000, img: 'top-jelly.png' },
    { id: 'cincau', nama: 'Cincau', harga: 2000, img: 'top-cincau.png' }
];

// --- STATE UTAMA ---
let keranjang = [];
let itemTerpilih = null;
let rasaTerpilih = '';
let toppingDipilih = [];
let tipeMinuman = 'Susu';
let tambahanBlender = 0;

// --- RENDER MENU (HANYA JALAN SEKALI / GANTI KATEGORI) ---
function renderMenu(filter = 'semua') {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';
    
    const filtered = (filter === 'semua') ? menuData : menuData.filter(m => m.kategori === filter);
    
    filtered.forEach(item => {
        // Ambil qty dari keranjang untuk item ini
        const qty = keranjang.filter(k => k.id === item.id).length;
        
        container.innerHTML += `
            <div class="flex bg-white p-3 rounded-[32px] shadow-sm border border-slate-100 items-center mb-3">
                <img src="${item.img}" class="w-16 h-16 rounded-2xl object-cover">
                <div class="ml-4 flex-1">
                    <h3 class="font-bold text-slate-800 text-sm leading-tight">${item.nama}</h3>
                    <p class="text-[11px] text-custom font-black mt-1">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
                <div class="flex items-center ml-2" id="aksi-${item.id}">
                    ${renderTombolAksi(item.id, qty)}
                </div>
            </div>`;
    });
}

// Fungsi pembantu untuk gambar tombol biar gak render ulang seluruh menu
function renderTombolAksi(id, qty) {
    if (qty > 0) {
        return `
            <div class="flex items-center gap-3 bg-slate-100 rounded-full p-1 border border-slate-200">
                <button onclick="hapusSatuPorsi('${id}')" class="w-8 h-8 rounded-full bg-white text-custom shadow-sm font-bold">-</button>
                <span class="text-xs font-black w-4 text-center text-slate-800">${qty}</span>
                <button onclick="pilihProduk('${id}')" class="w-8 h-8 rounded-full bg-custom text-white shadow-sm font-bold">+</button>
            </div>`;
    } else {
        return `<button onclick="pilihProduk('${id}')" class="bg-custom text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-md uppercase">+ PESAN</button>`;
    }
}

// --- TAMBAH & HAPUS (TANPA KEDIP) ---
function tambahKeKeranjang(nama, harga, img, id) {
    keranjang.push({ id, nama, harga, img });
    updateUI();
    
    // UPDATE HANYA TOMBOLNYA SAJA, GAK USAH RENDER ULANG SEMUA MENU
    const targetAksi = document.getElementById(`aksi-${id}`);
    if (targetAksi) {
        const qty = keranjang.filter(k => k.id === id).length;
        targetAksi.innerHTML = renderTombolAksi(id, qty);
    }
}

function hapusSatuPorsi(id) {
    const idx = keranjang.findLastIndex(k => k.id === id);
    if (idx > -1) keranjang.splice(idx, 1);
    updateUI();
    
    // UPDATE HANYA TOMBOLNYA SAJA
    const targetAksi = document.getElementById(`aksi-${id}`);
    if (targetAksi) {
        const qty = keranjang.filter(k => k.id === id).length;
        targetAksi.innerHTML = renderTombolAksi(id, qty);
    }
}
// --- MODAL & TOPPING ---
function pilihProduk(id) {
    itemTerpilih = menuData.find(m => m.id === id);
    if (!itemTerpilih) return;

    if (itemTerpilih.id !== 'es-susu') {
        tambahKeKeranjang(itemTerpilih.nama, itemTerpilih.harga, itemTerpilih.img, itemTerpilih.id);
        return;
    }

    rasaTerpilih = '';
    toppingDipilih = [];
    tipeMinuman = 'Susu';
    tambahanBlender = 0;
    
    document.getElementById('modal-topping').classList.remove('hidden');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="flex flex-col items-center text-center mb-6">
            <h2 class="text-xl font-black text-slate-800">${itemTerpilih.nama}</h2>
            <p class="text-[12px] text-slate-400 mt-1">Rp ${itemTerpilih.harga.toLocaleString('id-ID')}</p>
        </div>

        <p class="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center tracking-widest text-slate-300">Tekstur Es:</p>
        <div class="flex justify-center mb-8">
            <button onclick="toggleBlender(this)" class="tipe-btn w-full max-w-[220px] py-4 px-6 rounded-3xl bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center gap-3 transition-all border-none shadow-sm">
                <i class="fas fa-wind opacity-50"></i> Di Blender +1.000
            </button>
        </div>

        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Geser & Pilih Rasa:</p>
        <div class="rasa-scroll-wrapper" id="rasaWrapper">
            ${itemTerpilih.rasa.map(r => `
                <div class="rasa-item p-2 rounded-[24px] border-2 border-slate-100 bg-white shadow-sm flex-shrink-0">
                    <img src="${r.foto}" class="w-full h-24 object-cover rounded-[18px] mb-2 pointer-events-none">
                    <span class="text-[10px] font-black text-slate-700 uppercase">${r.nama}</span>
                </div>
            `).join('')}
        </div>

        <p class="text-[10px] font-bold text-slate-400 uppercase mb-3">Topping Tambahan:</p>
        <div class="space-y-3 mb-6">
            ${toppingOptions.map(t => `
                <div onclick="toggleTopping(this, '${t.id}', ${t.harga})" class="topping-item flex justify-between items-center p-3 rounded-2xl border-2 border-slate-100 cursor-pointer transition-all">
                    <div class="flex items-center gap-3">
                        <img src="${t.img}" class="w-10 h-10 rounded-lg object-cover">
                        <span class="text-xs font-bold text-slate-700">${t.nama}</span>
                    </div>
                    <span class="text-xs font-black text-custom">+Rp ${t.harga.toLocaleString('id-ID')}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="bg-slate-50 rounded-2xl p-4 mb-6 flex justify-between items-center border border-dashed border-slate-200">
            <span class="text-[10px] font-bold text-slate-500 uppercase">Total</span>
            <span id="live-total-harga" class="text-lg font-black text-custom">Rp ${itemTerpilih.harga.toLocaleString('id-ID')}</span>
        </div>
        
        <button onclick="konfirmasiKeKeranjang()" class="w-full bg-custom text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all">
            Konfirmasi Pesanan
        </button>`;
    
    // Aktifkan kembali deteksi scroll otomatis untuk varian rasa
    setTimeout(initScrollDetection, 100);
}

function initScrollDetection() {
    const wrapper = document.getElementById('rasaWrapper');
    if (!wrapper) return;

    wrapper.addEventListener('scroll', () => {
        const items = wrapper.querySelectorAll('.rasa-item');
        const wrapperCenter = wrapper.getBoundingClientRect().left + (wrapper.offsetWidth / 2);
        
        items.forEach(item => {
            const itemCenter = item.getBoundingClientRect().left + (item.getBoundingClientRect().width / 2);
            // Jika item berada di tengah (jarak < 60px dari pusat)
            if (Math.abs(wrapperCenter - itemCenter) < 60) {
                item.classList.add('is-active');
                rasaTerpilih = item.querySelector('span').innerText;
            } else {
                item.classList.remove('is-active');
            }
        });
    });
    
    // Trigger scroll sedikit agar item pertama terdeteksi aktif
    wrapper.scrollLeft = 1;
}

function toggleBlender(el) {
    el.classList.add('active-press');
    setTimeout(() => el.classList.remove('active-press'), 100);

    if (tipeMinuman === 'Blender') {
        tipeMinuman = 'Susu';
        tambahanBlender = 0;
        el.classList.remove('active');
    } else {
        tipeMinuman = 'Blender';
        tambahanBlender = 1000;
        el.classList.add('active');
    }
    updateTotalModal();
}

function toggleTopping(el, id, harga) {
    const idx = toppingDipilih.indexOf(id);
    el.classList.add('active-press');
    setTimeout(() => el.classList.remove('active-press'), 100);

    if (idx > -1) {
        toppingDipilih.splice(idx, 1);
        el.classList.remove('selected-topping');
    } else {
        toppingDipilih.push(id);
        el.classList.add('selected-topping');
    }
    updateTotalModal();
}

function updateTotalModal() {
    let total = itemTerpilih.harga + tambahanBlender;
    toppingDipilih.forEach(tid => {
        const t = toppingOptions.find(o => o.id === tid);
        if(t) total += t.harga;
    });
    document.getElementById('live-total-harga').innerText = "Rp " + total.toLocaleString('id-ID');
}

function konfirmasiKeKeranjang() {
    if (!rasaTerpilih) return alert("Geser dan pilih rasa dulu ya!");
    let namaFinal = `${itemTerpilih.nama} ${rasaTerpilih} (${tipeMinuman})`;
    let hargaFinal = itemTerpilih.harga + tambahanBlender;
    toppingDipilih.forEach(tid => {
        const t = toppingOptions.find(o => o.id === tid);
        namaFinal += ` + ${t.nama}`;
        hargaFinal += t.harga;
    });
    keranjang.push({ id: itemTerpilih.id, nama: namaFinal, harga: hargaFinal, img: itemTerpilih.img });
    tutupModal();
    updateUI();
    renderMenu();
}

// --- NAVIGATION & UI ---
function filterMenu(kat) {
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active', 'bg-custom', 'text-white'));
    document.getElementById('tab-' + kat).classList.add('active', 'bg-custom', 'text-white');
    renderMenu(kat);
}

function updateUI() {
    let total = keranjang.reduce((sum, item) => sum + item.harga, 0);
    const footerTotal = document.getElementById('footer-total');
    if (footerTotal) footerTotal.innerText = "Rp " + total.toLocaleString('id-ID');
    
    const floatingCart = document.getElementById('floating-cart');
    // Cek halaman mana yang lagi aktif sekarang
    const isBeranda = document.getElementById('page-beranda').classList.contains('active');
    
    // Tombol CUMA boleh muncul di Beranda DAN kalau ada isinya
    if (keranjang.length > 0 && isBeranda) {
        floatingCart.classList.remove('hidden-cart');
    } else {
        floatingCart.classList.add('hidden-cart');
    }
}

function hapusSatuPorsi(id) {
    const idx = keranjang.findLastIndex(k => k.id === id);
    if (idx > -1) keranjang.splice(idx, 1);
    updateUI();
    renderMenu();
}

function tambahKeKeranjang(nama, harga, img, id) {
    keranjang.push({ id, nama, harga, img });
    updateUI();
    renderMenu();
}

function tutupModal() { document.getElementById('modal-topping').classList.add('hidden'); }
// --- NAVIGASI HALAMAN (FIX JARAK & TOMBOL WA) ---
function bukaHalaman(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    if (pageId === 'pembayaran') {
        document.getElementById('floating-cart').classList.add('hidden-cart');
        renderCheckout();
    } else {
        updateUI();
    }
    window.scrollTo(0, 0);
}

function renderCheckout() {
    const listContainer = document.getElementById('checkout-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = ''; // Kosongkan dulu sebelum isi baru
    let total = 0;

    if (keranjang.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-slate-400 py-10 text-xs">Keranjang kamu masih kosong.</p>`;
        document.getElementById('pay-subtotal').innerText = "Rp 0";
        document.getElementById('pay-total').innerText = "Rp 0";
        return;
    }

    // Kelompokkan item yang sama biar rapi (misal: 2x Es Susu Oreo)
    const ringkasan = keranjang.reduce((acc, item) => {
        acc[item.nama] = acc[item.nama] || { ...item, qty: 0 };
        acc[item.nama].qty++;
        return acc;
    }, {});

    Object.values(ringkasan).forEach(item => {
        const subtotalItem = item.harga * item.qty;
        total += subtotalItem;
        
        listContainer.innerHTML += `
            <div class="flex items-center bg-white p-4 rounded-[30px] shadow-sm border border-slate-100 mb-3">
                <img src="${item.img}" class="w-14 h-14 rounded-2xl object-cover">
                <div class="ml-4 flex-1">
                    <h3 class="font-bold text-[11px] text-slate-800 leading-tight">${item.nama}</h3>
                    <p class="text-xs text-custom font-black mt-1">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
                <div class="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <span class="text-xs font-black text-slate-700">${item.qty}x</span>
                </div>
            </div>`;
    });

    // Update angka total di bagian bawah halaman pembayaran
    document.getElementById('pay-subtotal').innerText = "Rp " + total.toLocaleString('id-ID');
    document.getElementById('pay-total').innerText = "Rp " + total.toLocaleString('id-ID');
}

document.addEventListener('DOMContentLoaded', () => renderMenu('semua'));
