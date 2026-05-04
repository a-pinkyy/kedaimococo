




// Navigasi antar halaman
function bukaHalaman(pageId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Tampilkan halaman yang dipilih
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    if (pageId === 'pembayaran') {
        // Sembunyikan tombol melayang saat di checkout
        document.getElementById('floating-cart').classList.add('hidden-cart');
        renderCheckout();
    } else {
        // Cek apakah tombol keranjang perlu muncul lagi saat kembali ke beranda
        updateUI();
    }
    
    window.scrollTo(0, 0);
}

function renderCheckout() {
    const listContainer = document.getElementById('checkout-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    let subtotal = 0;

    if (keranjang.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-slate-400 py-10 text-xs">Keranjang kamu masih kosong.</p>`;
        document.getElementById('pay-subtotal').innerText = "Rp 0";
        document.getElementById('pay-total').innerText = "Rp 0";
        return;
    }

    // Kelompokkan item yang sama untuk tampilan ringkas
    const ringkasanKeranjang = keranjang.reduce((acc, item) => {
        const key = item.nama; // Mengelompokkan berdasarkan nama (termasuk toppingnya)
        if (!acc[key]) {
            acc[key] = { ...item, qty: 0 };
        }
        acc[key].qty += 1;
        return acc;
    }, {});

    Object.values(ringkasanKeranjang).forEach((item) => {
        const totalHargaItem = item.harga * item.qty;
        subtotal += totalHargaItem;
        
        listContainer.innerHTML += `
            <div class="flex items-center bg-white p-4 rounded-[30px] shadow-sm border border-slate-100 mb-3">
                <img src="${item.img}" class="w-14 h-14 rounded-2xl object-cover shadow-sm">
                <div class="ml-4 flex-1">
                    <h3 class="font-bold text-[11px] text-slate-800 leading-tight">${item.nama}</h3>
                    <p class="text-xs text-custom font-black mt-1">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
                <!-- Tampilan Jumlah Porsi Tanpa Tombol Hapus -->
                <div class="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <span class="text-xs font-black text-slate-700">${item.qty}x</span>
                </div>
            </div>
        `;
    });

    document.getElementById('pay-subtotal').innerText = "Rp " + subtotal.toLocaleString('id-ID');
    document.getElementById('pay-total').innerText = "Rp " + subtotal.toLocaleString('id-ID');
}

// Fungsi menghapus item dari keranjang
function hapusItem(index) {
    keranjang.splice(index, 1);
    renderCheckout();
    
    // Jika semua item dihapus, otomatis balik ke beranda
    if (keranjang.length === 0) {
        setTimeout(() => {
            bukaHalaman('beranda');
        }, 500);
    }
}



const menuData = [
    { id: 'bowl', nama: 'Rice Bowl Ayam', harga: 20000, kategori: 'makanan', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150', deskripsi: 'Nasi hangat dengan ayam krispi.' },
    { id: 'boba', nama: 'Boba Brown Sugar', harga: 15000, kategori: 'minuman', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=150', deskripsiTopping: 'Disajikan dalam Gelas 14 Oz dengan es batu kristal dan gula aren murni.' },
    { id: 'kentang', nama: 'Kentang Goreng', harga: 12000, kategori: 'jajanan', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150', deskripsi: 'Renyah dengan bumbu gurih.' }
];

const toppingOptions = [
    { id: 'oreo', nama: 'Ekstra Oreo', harga: 3000 },
    { id: 'boba', nama: 'Ekstra Boba', harga: 4000 },
    { id: 'pudding', nama: 'Ekstra Pudding', harga: 5000 }
];

let keranjang = [];
let toppingDipilih = []; // Untuk menampung sementara pilihan topping user
let itemTerpilih = null;

function renderMenu(filter = 'semua') {
    const container = document.getElementById('menu-container');
    if(!container) return;
    container.innerHTML = '';
    
    const filtered = filter === 'semua' ? menuData : menuData.filter(m => m.kategori === filter);
    
    filtered.forEach(item => {
        // Menghitung berapa porsi produk ini yang ada di keranjang berdasarkan ID
        const qtyTampil = keranjang.filter(k => k.id === item.id).length;

        // Logika Tombol: Jika 0 tampilkan "+ PESAN", jika > 0 tampilkan "- QTY +"
        const aksiHTML = qtyTampil > 0 ? `
            <div class="flex items-center gap-3 bg-slate-100 rounded-full p-1 border border-slate-200">
                <button onclick="hapusSatuPorsi('${item.id}')" class="w-8 h-8 rounded-full bg-white text-custom shadow-sm font-bold active:scale-90 transition-transform">-</button>
                <span class="text-xs font-black w-4 text-center text-slate-800">${qtyTampil}</span>
                <button onclick="pilihProduk('${item.id}')" class="w-8 h-8 rounded-full bg-custom text-white shadow-sm font-bold active:scale-90 transition-transform">+</button>
            </div>` 
            : `<button onclick="pilihProduk('${item.id}')" class="bg-custom text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-md active:scale-95 transition-all uppercase tracking-wider">+ PESAN</button>`;

        container.innerHTML += `
            <div class="flex bg-white p-3 rounded-[32px] shadow-sm border border-slate-100 items-center mb-3 transition-all">
                <img src="${item.img}" class="w-16 h-16 rounded-2xl object-cover shadow-sm">
                <div class="ml-4 flex-1">
                    <h3 class="font-bold text-slate-800 text-sm leading-tight">${item.nama}</h3>
                    <p class="text-[11px] text-custom font-black mt-1">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>
                <div class="flex items-center ml-2">${aksiHTML}</div>
            </div>`;
    });
}
// LOGIKA PILIH PRODUK
function pilihProduk(id) {
    itemTerpilih = menuData.find(m => m.id === id);
    if (itemTerpilih.kategori === 'minuman') {
        toppingDipilih = []; // Reset pilihan topping
        bukaModalTopping();
    } else {
        tambahKeKeranjang(itemTerpilih.nama, itemTerpilih.harga, itemTerpilih.img);
    }
}

function bukaModalTopping() {
    const modal = document.getElementById('modal-topping');
    const content = document.getElementById('modal-content');
    toppingDipilih = []; 

    content.innerHTML = `
        <div class="flex flex-col items-center text-center mb-6">
            <img src="${itemTerpilih.img}" class="modal-img-medium shadow-xl mb-4">
            <h2 class="text-xl font-black text-slate-800">${itemTerpilih.nama}</h2>
            <p class="text-[12px] text-slate-400 mt-2 px-6 leading-relaxed">${itemTerpilih.deskripsiTopping || 'Gelas 14 oz dengan es kristal'}</p>
        </div>

        <div class="space-y-3 mb-6">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tambahkan Topping:</p>
            ${toppingOptions.map(t => `
                <div onclick="toggleTopping(this, '${t.id}', ${t.harga})" class="topping-item flex justify-between items-center p-4 rounded-2xl border-2 border-slate-100 cursor-pointer transition-all">
                    <div class="flex items-center">
                        <div class="check-box w-5 h-5 border-2 border-slate-200 rounded-full mr-3 flex items-center justify-center transition-all">
                            <i class="fas fa-check text-[10px] text-white opacity-0"></i>
                        </div>
                        <span class="text-xs font-bold text-slate-700 name-topping">${t.nama}</span>
                    </div>
                    <span class="text-xs font-black text-custom">+Rp ${t.harga.toLocaleString('id-ID')}</span>
                </div>
            `).join('')}
        </div>

        <div class="bg-slate-50 rounded-2xl p-4 mb-6 flex justify-between items-center border border-dashed border-slate-200">
            <span class="text-[10px] font-bold text-slate-500 uppercase">Harga Porsi Ini</span>
            <span id="live-total-harga" class="text-lg font-black text-custom">Rp ${itemTerpilih.harga.toLocaleString('id-ID')}</span>
        </div>

        <button onclick="konfirmasiKeKeranjang()" class="w-full bg-custom text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Konfirmasi & Tambah Porsi
        </button>
    `;
    modal.classList.remove('hidden');
}
function toggleTopping(el, toppingId, hargaTopping) {
    const index = toppingDipilih.indexOf(toppingId);
    const checkBox = el.querySelector('.check-box');
    const checkIcon = el.querySelector('.fa-check');
    const nameText = el.querySelector('.name-topping');

    if (index > -1) {
        // JIKA BATAL PILIH
        toppingDipilih.splice(index, 1);
        el.style.backgroundColor = "transparent";
        el.style.borderColor = "#f1f5f9"; // slate-100
        checkBox.style.backgroundColor = "transparent";
        checkBox.style.borderColor = "#e2e8f0"; // slate-200
        checkIcon.style.opacity = "0";
        nameText.style.color = "#334155"; // slate-700
    } else {
        // JIKA DIPILIH
        toppingDipilih.push(toppingId);
        el.style.backgroundColor = "#541161"; // Warna custom kamu
        el.style.borderColor = "#541161";
        checkBox.style.backgroundColor = "#ffffff";
        checkBox.style.borderColor = "#ffffff";
        checkIcon.style.opacity = "1";
        checkIcon.style.color = "#541161";
        nameText.style.color = "#ffffff";
    }

    // Update Harga Real-time di Modal
    let totalSementera = itemTerpilih.harga;
    toppingDipilih.forEach(tid => {
        const t = toppingOptions.find(opt => opt.id === tid);
        totalSementera += t.harga;
    });
    document.getElementById('live-total-harga').innerText = "Rp " + totalSementera.toLocaleString('id-ID');
}
// KONFIRMASI MASUK KERANJANG
function konfirmasiKeKeranjang() {
    let namaTopping = "";
    let hargaTambahan = 0;

    toppingDipilih.forEach(tid => {
        const t = toppingOptions.find(opt => opt.id === tid);
        namaTopping += ` + ${t.nama}`;
        hargaTambahan += t.harga;
    });

    const namaFinal = itemTerpilih.nama + (namaTopping || " (Original)");
    const hargaFinal = itemTerpilih.harga + hargaTambahan;

    tambahKeKeranjang(namaFinal, hargaFinal, itemTerpilih.img);
    tutupModal();
}

function tambahKeKeranjang(nama, harga, img) {
    // Pastikan itemTerpilih.id ikut tersimpan
    keranjang.push({ 
        id: itemTerpilih.id, 
        nama: nama, 
        harga: harga, 
        img: img 
    });
    
    updateUI(); // Mengupdate total harga di bawah
    renderMenu(document.querySelector('.category-tab.active')?.id.replace('tab-', '') || 'semua'); // Refresh tombol porsi
}

function updateUI() {
    let total = 0;
    keranjang.forEach(item => total += item.harga);
    document.getElementById('footer-total').innerText = "Rp " + total.toLocaleString('id-ID');
    
    if (keranjang.length > 0) document.getElementById('floating-cart').classList.remove('hidden-cart');
}

function tutupModal() {
    document.getElementById('modal-topping').classList.add('hidden');
}

// Inisialisasi awal
document.addEventListener('DOMContentLoaded', () => renderMenu());


function hapusSatuPorsi(itemId) {
    // Mencari index terakhir dari produk dengan ID tersebut
    const index = keranjang.findLastIndex(item => item.id === itemId);
    
    if (index > -1) {
        keranjang.splice(index, 1); // Hapus 1 porsi saja
        updateUI();
        // Refresh tampilan menu agar angka berubah atau kembali ke tombol "+ PESAN"
        renderMenu(document.querySelector('.category-tab.active')?.id.replace('tab-', '') || 'semua');
    }
}


function prosesPesanan() {
    const namaUser = document.getElementById('namaPenerima').value;
    const alamatUser = document.getElementById('alamatLengkap').value;

    if (!namaUser || !alamatUser) {
        alert("Tolong isi nama dan alamat pengiriman dulu ya!");
        return;
    }

    if (keranjang.length === 0) {
        alert("Keranjang kamu kosong!");
        return;
    }

    // Mengelompokkan item yang sama untuk pesan WA yang rapi
    const ringkasan = keranjang.reduce((acc, item) => {
        const key = item.nama;
        if (!acc[key]) {
            acc[key] = { harga: item.harga, qty: 0 };
        }
        acc[key].qty += 1;
        return acc;
    }, {});

    let pesanWA = `*HALO KEDAI MOCOCO*\n`;
    pesanWA += `Saya mau pesan dengan detail berikut:\n\n`;
    pesanWA += `*Data Pengiriman:*\n`;
    pesanWA += `Nama: ${namaUser}\n`;
    pesanWA += `Alamat: ${alamatUser}\n\n`;
    pesanWA += `*Daftar Pesanan:*\n`;

    let totalKeseluruhan = 0;
    Object.keys(ringkasan).forEach((namaProduk, index) => {
        const detail = ringkasan[namaProduk];
        const subTotal = detail.harga * detail.qty;
        totalKeseluruhan += subTotal;
        pesanWA += `${index + 1}. ${namaProduk} (${detail.qty}x) = Rp ${subTotal.toLocaleString('id-ID')}\n`;
    });

    pesanWA += `\n*Total Belanja:* Rp ${totalKeseluruhan.toLocaleString('id-ID')}\n`;
    pesanWA += `\n_Mohon info biaya ongkir ke alamat saya ya, Kak. Terima kasih!_`;

    // Encode pesan untuk URL WhatsApp
    const pesanEncoded = encodeURIComponent(pesanWA);
    const nomorWA = "6281228081342"; // Ganti dengan nomor WA kedaimococo kamu
    
    // Buka WhatsApp di tab baru
    window.open(`https://wa.me/${nomorWA}?text=${pesanEncoded}`, '_blank');
}
