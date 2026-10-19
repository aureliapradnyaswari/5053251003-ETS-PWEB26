Persona dan Permasalahan
Persona yang saya dapatkan adalah mahasiswa kos yang mendapatkan uang saku bulanan dari orang tua dan harus mengatur pengeluarannya sendiri.
Permasalahan yang sering dialami mahasiswa kos adalah sulit mengontrol pengeluaran sehari-hari. Pengeluaran kecil seperti membeli makanan, transportasi, belanja, dan hiburan sering kali tidak dicatat, sehingga mahasiswa tidak mengetahui berapa banyak uang yang sudah digunakan dan berapa sisa uang yang tersedia sampai akhir bulan.

Untuk mengatasi permasalahan tersebut, saya membuat website DompetKu, yaitu aplikasi pencatatan keuangan pribadi yang memungkinkan pengguna mencatat pemasukan dan pengeluaran, melihat riwayat transaksi, serta memantau sisa uang bulanan.

Fitur khas dari web ini adalah perhitungan jatah harian, yaitu membagi sisa uang dengan jumlah hari yang tersisa pada bulan berjalan. Website juga memberikan peringatan jika pengeluaran hari ini sudah melebihi batas jatah harian.

Dengan fitur tersebut, mahasiswa kos dapat lebih mudah mengetahui batas pengeluaran setiap hari agar uang bulanannya tidak habis sebelum akhir bulan.

Rancangan Struktur Data
const dataBaru = {
    id: crypto.randomUUID(),
    tanggal: tanggal,
    jenis: jenis,
    kategori: kategori,
    nominal: nominal,
    catatan: catatan
};


Data disimpan menggunakan `localStorage` dengan format JSON.

Bug dan Kendala yang Ditemui

Kendala 1: Riwayat Transaksi Tidak Muncul
Saat mengubah tampilan riwayat transaksi dari daftar menjadi tabel, saya mengalami kendala ketika data transaksi tidak muncul seperti yang diharapkan.

Masalah yang diperiksa adalah kesesuaian antara elemen HTML dan JavaScript. JavaScript menggunakan `getElementById("daftarTransaksi")`, sehingga HTML harus memiliki elemen dengan ID yang sama.

Solusinya adalah memastikan bagian HTML menggunakan:
<tbody id="daftarTransaksi"></tbody>

Kemudian JavaScript menggunakan:
const tabelRiwayat =
    document.getElementById("daftarTransaksi");


Kendala 2: Kolom Catatan Tidak Sesuai dengan Tabel
Kendala berikutnya muncul ketika saya menambahkan kolom Catatan (opsional) pada tabel riwayat transaksi.

Sebelumnya, fungsi JavaScript hanya membuat empat kolom dan menggunakan kode:

kolomKeterangan.textContent =
    item.catatan || item.kategori;

Akibatnya, kategori dan catatan belum ditampilkan sebagai informasi yang terpisah.

Untuk mengatasinya, saya mengubah JavaScript agar membuat lima kolom dan memisahkan isinya.

const kolomKeterangan = document.createElement("td");
kolomKeterangan.textContent = item.kategori;

const kolomCatatan = document.createElement("td");
kolomCatatan.textContent = item.catatan || "-";

Urutan penambahan kolom juga disesuaikan dengan HTML:

baris.append(
    kolomKeterangan,
    kolomTipe,
    kolomNominal,
    kolomCatatan,
    kolomAksi
);