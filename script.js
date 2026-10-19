
const form = document.getElementById("formTransaksi");
const inputTanggal = document.getElementById("tanggal");
const selectJenis = document.getElementById("jenis");
const selectKategori = document.getElementById("kategori");
const inputNominal = document.getElementById("nominal");
const inputCatatan = document.getElementById("catatan");
const pesanError = document.getElementById("pesanError");

const tabelRiwayat = document.getElementById("daftarTransaksi");
const tampilanPemasukan = document.getElementById("totalPemasukan");
const tampilanPengeluaran = document.getElementById("totalPengeluaran");
const tampilanSaldo = document.getElementById("saldo");

const formBulanan = document.getElementById("formBulanan");
const inputBulanan = document.getElementById("uangBulanan");
const errorBulanan = document.getElementById("errorBulanan");

function tanggalLokal() {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const hari = String(sekarang.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}

function muatData() {
    try {
        const data = JSON.parse(
            localStorage.getItem("transaksiDompetKu") || "[]"
        );
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

let transaksi = muatData();

function simpanData() {
    localStorage.setItem(
        "transaksiDompetKu",
        JSON.stringify(transaksi)
    );
}

function muatBulanan() {
    try {
        const data = JSON.parse(
            localStorage.getItem("uangBulananDompetKu") || "{}"
        );
        return data && typeof data === "object" &&
            !Array.isArray(data) ? data : {};
    } catch {
        return {};
    }
}

let uangBulanan = muatBulanan();

function simpanBulanan() {
    localStorage.setItem(
        "uangBulananDompetKu",
        JSON.stringify(uangBulanan)
    );
}

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID", {
        maximumFractionDigits: 0
    });
}

function updateSaldo() {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    for (const item of transaksi) {
        if (item.jenis === "pemasukan") {
            totalPemasukan += item.nominal;
        } else if (item.jenis === "pengeluaran") {
            totalPengeluaran += item.nominal;
        }
    }

    tampilanPemasukan.textContent = formatRupiah(totalPemasukan);
    tampilanPengeluaran.textContent = formatRupiah(totalPengeluaran);
    tampilanSaldo.textContent =
        formatRupiah(totalPemasukan - totalPengeluaran);
}

function tampilkanRiwayat() {
    tabelRiwayat.replaceChildren();

    const urut = [...transaksi].reverse().sort(
        (a, b) => b.tanggal.localeCompare(a.tanggal)
    );

    for (const item of urut) {
        const baris = document.createElement("tr");

        const kolomKeterangan = document.createElement("td");
        kolomKeterangan.textContent = item.kategori;

        const kolomTipe = document.createElement("td");
        kolomTipe.textContent =
            item.jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran";
        kolomTipe.className = item.jenis;

        const kolomNominal = document.createElement("td");
        kolomNominal.textContent = formatRupiah(item.nominal);
        kolomNominal.className = item.jenis;

        const kolomCatatan = document.createElement("td");
        kolomCatatan.textContent = item.catatan || "-";

        const kolomAksi = document.createElement("td");
        const tombolHapus = document.createElement("button");

        tombolHapus.type = "button";
        tombolHapus.className = "btn-hapus";
        tombolHapus.textContent = "Hapus";
        tombolHapus.dataset.id = item.id;

        kolomAksi.appendChild(tombolHapus);

        baris.append(
            kolomKeterangan,
            kolomTipe,
            kolomNominal,
            kolomCatatan,
            kolomAksi
        );

        tabelRiwayat.appendChild(baris);
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const tanggal = inputTanggal.value;
    const jenis = selectJenis.value;
    const kategori = selectKategori.value;
    const nominal = Number(inputNominal.value);
    const catatan = inputCatatan.value.trim();

    if (
        tanggal === "" ||
        jenis === "" ||
        kategori === "" ||
        inputNominal.value === "" ||
        !Number.isFinite(nominal) ||
        nominal <= 0
    ) {
        pesanError.textContent =
            "Lengkapi semua field wajib dan nominal harus lebih dari 0.";
        return;
    }

    const dataBaru = {
        id: crypto.randomUUID(),
        tanggal: tanggal,
        jenis: jenis,
        kategori: kategori,
        nominal: nominal,
        catatan: catatan
    };

    transaksi.push(dataBaru);
    simpanData();

    pesanError.textContent = "";
    form.reset();
    inputTanggal.value = tanggalLokal();

    updateSaldo();
    tampilkanRiwayat();
    hitungJatahHarian();
});

tabelRiwayat.addEventListener("click", function(event) {
    const tombol = event.target.closest(".btn-hapus");

    if (!tombol) return;

    const id = tombol.dataset.id;

    if (!confirm("Yakin ingin menghapus transaksi ini?")) {
        return;
    }

    transaksi = transaksi.filter(function(item) {
        return String(item.id) !== id;
    });

    simpanData();
    updateSaldo();
    tampilkanRiwayat();
    hitungJatahHarian();
});

formBulanan.addEventListener("submit", function(event) {
    event.preventDefault();

    const nominal = Number(inputBulanan.value);

    if (
        inputBulanan.value === "" ||
        !Number.isFinite(nominal) ||
        nominal <= 0
    ) {
        errorBulanan.textContent =
            "Uang bulanan harus lebih dari 0.";
        return;
    }

    const bulanIni = tanggalLokal().slice(0, 7);

    uangBulanan[bulanIni] = nominal;
    simpanBulanan();

    errorBulanan.textContent = "";
    hitungJatahHarian();
});

function hitungJatahHarian() {
    const sekarang = new Date();
    const hariIni = tanggalLokal();
    const bulanIni = hariIni.slice(0, 7);

    const tahun = sekarang.getFullYear();
    const bulan = sekarang.getMonth();
    const tanggal = sekarang.getDate();

    const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
    const sisaHari = jumlahHari - tanggal + 1;

    const bulanan = Number(uangBulanan[bulanIni]) || 0;

    let pemasukanBulan = 0;
    let pengeluaranBulan = 0;
    let pengeluaranHariIni = 0;

    for (const item of transaksi) {
        if (item.tanggal.slice(0, 7) !== bulanIni) {
            continue;
        }

        if (item.jenis === "pemasukan") {
            pemasukanBulan += item.nominal;
        } else if (item.jenis === "pengeluaran") {
            pengeluaranBulan += item.nominal;

            if (item.tanggal === hariIni) {
                pengeluaranHariIni += item.nominal;
            }
        }
    }

    const sisaUang =
        bulanan + pemasukanBulan - pengeluaranBulan;

    const jatahHarian = Math.max(0, sisaUang / sisaHari);

    const jatahAwalHari = Math.max(
        0, (sisaUang + pengeluaranHariIni) / sisaHari
    );

    document.getElementById("tampilanBulanan").textContent =
        formatRupiah(bulanan);

    document.getElementById("sisaUang").textContent =
        formatRupiah(sisaUang);

    document.getElementById("sisaHari").textContent = sisaHari;

    document.getElementById("jatahHarian").textContent =
        formatRupiah(Math.floor(jatahHarian));

    document.getElementById("pengeluaranHariIni").textContent =
        formatRupiah(pengeluaranHariIni);

    const peringatan = document.getElementById("peringatanBoros");

    if (bulanan === 0) {
        peringatan.textContent =
            "Masukkan uang bulanan terlebih dahulu.";
        peringatan.className = "";
    } else if (sisaUang < 0) {
        peringatan.textContent =
            "Peringatan! Pengeluaran bulan ini melebihi uang yang tersedia.";
        peringatan.className = "peringatan";
    } else if (pengeluaranHariIni > jatahAwalHari) {
        peringatan.textContent =
            "Peringatan! Pengeluaran hari ini melebihi jatah harian.";
        peringatan.className = "peringatan";
    } else {
        peringatan.textContent =
            "Bagus! Pengeluaran hari ini masih dalam batas jatah.";
        peringatan.className = "aman";
    }

    inputBulanan.value = bulanan || "";
}

inputTanggal.value = tanggalLokal();
updateSaldo();
tampilkanRiwayat();
hitungJatahHarian();
