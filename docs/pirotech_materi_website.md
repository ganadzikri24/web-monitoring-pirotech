# 📝 Copywriting Materi Website PiRoTech

**Sumber:** Folder `pirotech1/` + rencana fitur baru  
**Tanggal:** 5 Agustus 2026

> Dokumen ini berisi **teks/copywriting murni** untuk seluruh halaman website PiRoTech. Hanya konten kata-kata — tanpa detail teknis UI. Desain UI akan disesuaikan terpisah.

---

## 1. Identitas Brand

| Item | Konten |
|---|---|
| **Nama Aplikasi** | PiRoTech |
| **Tagline** | Monitoring Alat Pengolah Sampah Plastik Menjadi Bahan Bakar Cair |
| **Deskripsi Singkat** | Pemantauan dan pengendalian proses pirolisis plastik secara real-time berbasis IoT |
| **Institusi** | Sekolah Vokasi IPB |
| **Email Kontak** | info@pirotech.id |
| **Footer** | © {tahun} PiRoTech • Sekolah Vokasi IPB |

---

## 2. Halaman Login

**Judul:** Login

**Label Form:**
- Email
- Password

**Tombol:**
- Masuk
- *(loading):* Masuk…

**Keterangan:**
> Akun dikelola oleh Admin.

**Pesan Error:**
> Gagal login

---

## 3. Sidebar (Label Menu)

| Menu | Label |
|---|---|
| A | Overview |
| B | Dashboard Monitoring |
| C | Log Activity |

**Tombol Logout:** Keluar / Logout

---

## 4. A — Halaman Overview

### 4.1. Input Sampah Hari Ini

**Judul Seksi:**
> Input Sampah Hari Ini

**Deskripsi:**
> Masukkan berat sampah plastik yang akan diolah hari ini untuk melihat perkiraan hasil.

**Label Form:**

| Label | Placeholder | Satuan |
|---|---|---|
| Berat Sampah | Masukkan berat sampah | kg |
| Jenis Plastik | Pilih jenis plastik | — |

**Pilihan Jenis Plastik:**
- PET (Botol Minum) — Kode 1
- HDPE (Botol Susu, Galon) — Kode 2
- LDPE (Kantong Plastik) — Kode 4
- PP (Tutup Botol, Kemasan Makanan) — Kode 5
- PS (Styrofoam) — Kode 6
- Campuran

---

### 4.2. Perkiraan Hasil

**Judul Seksi:**
> Perkiraan Hasil Pengolahan

**Kartu-kartu Hasil:**

| Label | Contoh Nilai | Satuan |
|---|---|---|
| Estimasi BBM | 3.5 | liter |
| Estimasi Residu | 0.5 | kg |
| Yield Rate | 55 | % |

---

### 4.3. Statistik & Analisis (Scroll Bawah)

**Judul Seksi:**
> Ringkasan Pengolahan

---

#### Kartu: Rata-Rata Hasil Pengolahan

**Label:** Rata-Rata Hasil

**Deskripsi:**
> Rata-rata yield (liter BBM per kg plastik) dari seluruh pengolahan sebelumnya.

**Contoh Nilai:** 0.52 liter/kg

---

#### Kartu: Perkiraan Nilai Ekonomis

**Label:** Nilai Ekonomis

**Deskripsi:**
> Potensi pendapatan dari BBM yang dihasilkan berdasarkan harga pasar.

**Contoh Nilai:** Rp 23.800

**Keterangan kecil:**
> Berdasarkan harga BBM setara solar ≈ Rp 6.800/liter

---

#### Kartu: Perbandingan dengan Konvensional

**Label:** Dampak Lingkungan

**Deskripsi:**
> Emisi CO₂ yang berhasil dihemat dibandingkan pembakaran / pembuangan ke TPA konvensional.

**Contoh Nilai:** 14.5 kg CO₂ dihemat

**Keterangan kecil:**
> Dibandingkan pembakaran terbuka (≈2.9 kg CO₂/kg plastik)

---

#### Kartu: Total Sampah Diolah

**Label:** Total Sampah Diolah

**Deskripsi:**
> Akumulasi seluruh sampah plastik yang telah berhasil diproses melalui pirolisis.

**Contoh Nilai:** 127.5 kg

---

## 5. B — Halaman Dashboard Monitoring

### 5.1. Indikator Utama

| Label | Contoh Nilai | Keterangan |
|---|---|---|
| Suhu Saat Ini | 325.0°C | Dalam ambang / Di luar ambang! |
| Status Proses | IDLE / HEATING | — |
| Durasi Batch | 01:23:45 | Format HH:MM:SS |
| Suhu Maksimum | 442.1°C | Suhu tertinggi batch ini |
| Sampel Data | 600 | n data terbaru |

### 5.2. Status Proses

| Status | Label Tampil | Keterangan |
|---|---|---|
| IDLE | IDLE | Alat tidak aktif |
| HEATING | HEATING | Pemanasan berlangsung |
| PYROLYSIS | HEATING | Proses pirolisis utama |
| COOLING | IDLE | Pendinginan |

### 5.3. Grafik Realtime

**Judul:** Grafik Real-time Suhu (°C)

**Sumbu X:** Waktu (HH:MM)  
**Sumbu Y:** Suhu (°C)  
**Garis:** Suhu

---

### 5.4. Kontrol Buzzer

**Judul Seksi:** Kontrol Buzzer

| Label | Keterangan |
|---|---|
| Buzzer | On / Off |
| Threshold Buzzer | Suhu pemicu buzzer otomatis |

**Keterangan:**
> Buzzer akan berbunyi otomatis jika suhu melewati threshold yang ditentukan.

---

### 5.5. Kontrol Aktuator

**Judul Seksi:** Kontrol Aktuator

| Aktuator | Status | Keterangan |
|---|---|---|
| Heater | On / Off | Pemanas utama reaktor |
| Valve | Open / Close | Katup saluran uap |
| Fan Pendingin | On / Off | Kipas / pompa pendingin kondensor |

---

### 5.6. Pengaturan Threshold

**Judul Seksi:** Pengaturan Threshold

**Ambang Suhu:**

| Label | Keterangan |
|---|---|
| Suhu Minimum (°C) | Batas bawah suhu aman |
| Suhu Maksimum (°C) | Batas atas suhu aman |

**Threshold Aktuator Otomatis:**

| Aturan | Keterangan |
|---|---|
| Heater auto OFF jika suhu > ... °C | Matikan heater otomatis saat suhu terlalu tinggi |
| Fan auto ON jika suhu > ... °C | Nyalakan pendingin otomatis saat suhu terlalu tinggi |

**Tombol:** Simpan / Menyimpan…

**Pesan Sukses:**
> Konfigurasi tersimpan.

---

### 5.7. Notifikasi & Peringatan

**Judul Seksi:** Notifikasi

**Pengaturan:**

| Label | Keterangan |
|---|---|
| Notifikasi Push (FCM) | Aktif / Nonaktif |
| Notifikasi Email | Aktif / Nonaktif |
| Warning di ... % | Persentase dari threshold maks untuk peringatan awal |

**Level Peringatan:**

| Level | Label | Keterangan |
|---|---|---|
| ⚠️ | Warning | Suhu mendekati batas aman |
| 🚨 | Critical | Suhu melewati batas aman — buzzer & notifikasi aktif |

---

## 6. C — Halaman Log Activity

**Judul:** Log Aktivitas Pengolahan

**Deskripsi:**
> Riwayat lengkap setiap sesi pengolahan sampah plastik.

### Kolom Tabel

| Kolom | Keterangan |
|---|---|
| Waktu | Tanggal dan jam spesifik pengolahan |
| Berat Sampah (kg) | Berat plastik yang dimasukkan |
| Hasil BBM (liter) | Volume bahan bakar cair yang dihasilkan |
| Data Suhu (°C) | Suhu rata-rata / maksimum selama proses |
| Status | Selesai / Dibatalkan |
| Durasi | Lama proses (HH:MM:SS) |

### Filter

| Label | Keterangan |
|---|---|
| Dari | Tanggal awal |
| Sampai | Tanggal akhir |
| Cari | Pencarian kata kunci |

**Tombol Export:** Export CSV

**Tabel Kosong:**
> Belum ada data aktivitas.

---

## 7. Halaman Publik (Konten Lama — Tetap Dipakai)

### 7.1. Panduan (`/panduan`)

**Judul:**
> Panduan Penggunaan **Alat PiRoTech**

**Deskripsi:**
> Halaman ini menjelaskan aturan bahan, langkah penggunaan alat, dan pertanyaan umum, dengan bahasa sederhana untuk publik.

---

#### ⚠️ Pemberitahuan Penting

> **Dilarang menggunakan plastik/kemasan yang ada lapisan *metalized film* atau aluminium foil di dalamnya.**
> Contoh: bungkus kopi instan, sachet bumbu, kemasan keripik yang mengkilap di bagian dalam.

**Mengapa Dilarang?**
- Tidak menghasilkan minyak, hanya jadi limbah padat.
- Menimbulkan kerak sangat keras & berisiko menyumbat.
- Menghambat perpindahan panas (proses jadi tidak efisien).

**Contoh yang Aman:**
- Botol PET, HDPE, PP yang bersih & kering.
- Plastik rumah tangga tanpa lapisan metal (bagian dalam tidak mengkilap).

---

#### Skema Alat

> Gambaran fungsi utama bagian alat, tanpa detail teknis.

1. **Reaktor Utama** — tabung silinder besar tempat plastik dipanaskan.
2. **Tutup Reaktor Kerucut** — penutup berbentuk kerucut dengan lubang keluarnya uap.
3. **Klem Pengunci** — mengunci tutup ke reaktor agar kedap udara.
4. **Pipa Penyalur Uap** — menghubungkan tutup reaktor dengan kondensor.
5. **Kondensor** — pendingin (koil di dalam) yang mengubah uap menjadi minyak cair.
6. **Keran/Saluran Keluaran Minyak** — ujung kondensor tempat minyak pirolisis keluar.
7. **Sumber Pemanas (Kompor)** — memberikan panas di bawah reaktor utama.
8. **Rangka Penyangga** — struktur yang menopang reaktor dan kondensor.

---

#### Cara Pakai Aman

1. **Sortir & bersihkan** plastik, pastikan kering.
2. **Masukkan plastik** ke reaktor sampai batas aman.
3. **Tutup & kunci** reaktor, cek semua sambungan rapat.
4. **Siapkan penampung** minyak di ujung kondensor.
5. **Panaskan bertahap** dan amati *alat ukur lokal* (termometer/manometer bila tersedia).
6. **Selesai** → matikan pemanas, biarkan dingin, baru buka & bersihkan residu.

**Lakukan:**
- Gunakan sarung tangan & masker, area berventilasi baik.
- Awali pemanasan perlahan, catat durasi & hasil.

**Hindari:**
- Membuka tutup saat alat masih panas/bertekanan.
- Memasukkan kemasan berlapis aluminium atau bahan basah.
- Menjalankan kondensor tanpa pendinginan (jika tipe water-cooled).

---

#### FAQ

**Q: Apakah semua plastik bisa?**
> Tidak. Hindari yang berlapis aluminium (mengkilap di dalam). PET/HDPE/PP yang bersih & kering umumnya aman.

**Q: Apakah berbahaya?**
> Ikuti prosedur (kedap, ventilasi baik, pemanasan bertahap) dan gunakan APD dasar. Jangan tinggalkan alat tanpa pengawasan.

**Q: Butuh bantuan?**
> Kirim pertanyaan melalui halaman Hubungi Kami.

---

#### CTA Bawah

> Punya pertanyaan sebelum mencoba?  
> Tim kami siap bantu.

**Tombol:** Hubungi Kami

---

### 7.2. Hubungi Kami (`/hubungi`)

**Judul:** Hubungi Kami

**Deskripsi:**
> Kirim pertanyaan, keluhan, atau saran kamu di sini.

**Label Form:**

| Label | Placeholder | Wajib |
|---|---|---|
| Nama | Nama | ✅ |
| Email | Email | ✅ |
| Subjek | Subjek (opsional) | ❌ |
| Pesan | Pesan kamu… | ✅ |

**Tombol:** Kirim / *(loading):* Mengirim…

**Pesan Sukses:**
> Terima kasih! Pesanmu sudah terkirim.

**Pesan Error:**
> Gagal mengirim pesan

---

## 8. Pesan Sistem (Semua Halaman)

### Error & Validasi

| Konteks | Pesan |
|---|---|
| Login gagal | Gagal login |
| Akses ditolak | Akses ditolak. |
| Sedang memuat | Memuat… |
| Tanggal kosong | Tanggal tidak valid |
| Input bukan angka | Biaya harus angka |
| Form kontak gagal | Gagal mengirim pesan |
| Config gagal simpan | Gagal menyimpan: {detail error} |

### Sukses

| Konteks | Pesan |
|---|---|
| Log maintenance ditambah | ✅ Log berhasil ditambahkan |
| Config tersimpan | Konfigurasi tersimpan. |
| Pesan kontak terkirim | Terima kasih! Pesanmu sudah terkirim. |

### Konfirmasi

| Konteks | Pesan |
|---|---|
| Hapus pesan inbox | Hapus pesan ini? |

### Tabel Kosong

| Konteks | Pesan |
|---|---|
| Log Activity | Belum ada data aktivitas. |
| Inbox | Belum ada pesan. |
| Maintenance | Belum ada data. |
| Riwayat | Tidak ada data. |

---

## 9. Aset Gambar yang Sudah Ada

| File | Dipakai Untuk |
|---|---|
| `ilustrasi_pirotech.jpg` | Ilustrasi alat pirolisis |
| `pirotechlogo.png` | Logo utama PiRoTech |
| `pirotechlogo1.jpeg` | Logo alternatif |
| `skema_alat.png` | Diagram skematik alat pirolisis |
| `logo.svg` | Logo versi SVG |
| `logo1.png` | Logo alternatif |

---

> [!NOTE]
> Dokumen ini hanya berisi **copywriting / teks materi**. Desain UI, layout, warna, dan komponen visual akan ditentukan terpisah sesuai rencana fitur baru.
