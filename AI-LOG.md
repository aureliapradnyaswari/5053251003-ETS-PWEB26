Penyimpanan Transaksi Menggunakan localStorage

Prompt:  
Bagaimana agar data transaksi yang sudah dimasukkan tidak hilang ketika website di-refresh?

- Menggunakan `localStorage` sebagai tempat penyimpanan data pada browser.
- Menggunakan `JSON.stringify()` untuk mengubah array transaksi menjadi string JSON.
- Menggunakan `JSON.parse()` untuk membaca kembali data yang tersimpan.
- Menambahkan penanganan error untuk menghindari masalah jika data JSON rusak.

Yang diperbaiki:

Dari:
javascript
let transaksi = [];

Menjadi:
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

Validasi Form Transaksi
Prompt:
Bagaimana agar form transaksi tidak bisa disimpan jika tanggal, jenis, kategori, atau nominal belum diisi?

Jawaban:
- Menambahkan validasi sebelum membuat objek transaksi.
- Memastikan nominal merupakan angka dan lebih besar dari nol.
- Menampilkan pesan error pada elemen `pesanError`.
- Menghentikan proses penyimpanan menggunakan `return` jika validasi gagal.

Yang diperbaiki:
Dari transaksi yang langsung disimpan:
javascript
transaksi.push(dataBaru);

Beberapa fitur khas dan lainnya (saya kekurangan waktu untuk menambahkan ke AI-LOG)

Perbaikan Kolom Catatan pada Riwayat Transaksi
**Prompt:** Bagaimana cara agar catatan muncul? Sepertinya di CSS saya bermasalah.

**Jawaban:**
- Masalah bukan hanya pada CSS, tetapi juga pada JavaScript yang digunakan untuk menampilkan transaksi.
- Sebelumnya, kategori dan catatan ditampilkan dalam satu kolom menggunakan `item.catatan || item.kategori`.
- Karena kolom Catatan sudah ditambahkan pada HTML, JavaScript perlu membuat elemen `td` baru khusus untuk catatan.
- Urutan kolom JavaScript harus sesuai dengan HTML, yaitu Keterangan, Tipe, Nominal, Catatan, dan Aksi.
- CSS perlu disesuaikan agar teks catatan yang panjang tidak merusak tampilan tabel.

Yang diperbaiki:
Dari:

```javascript
const kolomKeterangan = document.createElement("td");
kolomKeterangan.textContent = item.catatan || item.kategori;
```

Menjadi:

```javascript
const kolomKeterangan = document.createElement("td");
kolomKeterangan.textContent = item.kategori;

const kolomCatatan = document.createElement("td");
kolomCatatan.textContent = item.catatan || "-";
```

Urutan kolom sebelumnya:

```javascript
baris.append(
    kolomKeterangan,
    kolomTipe,
    kolomNominal,
    kolomAksi
);
```

Diubah menjadi:

```javascript
baris.append(
    kolomKeterangan,
    kolomTipe,
    kolomNominal,
    kolomCatatan,
    kolomAksi
);
```

CSS juga ditambahkan:

```css
td:nth-child(4) {
    max-width: 200px;
    overflow-wrap: anywhere;
    word-break: break-word;
}
```