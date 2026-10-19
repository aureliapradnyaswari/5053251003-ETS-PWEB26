
let transaksi = muatData();

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

function simpanData() {
  localStorage.setItem(
    "transaksiDompetKu",
    JSON.stringify(transaksi)
  );
}

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}