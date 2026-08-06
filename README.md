# PiRoTech - Monitoring Alat Pirolisis

Aplikasi web Next.js untuk monitoring dan pengendalian alat pirolisis sampah plastik menjadi bahan bakar cair secara real-time.

## Cara Setup Environment

1. Salin file `.env.local.example` menjadi `.env.local`.
   ```bash
   cp .env.local.example .env.local
   ```
2. Isi nilai-nilai konfigurasi di dalam `.env.local` dengan kredensial dari project Firebase Anda (lihat di Project Settings > General > Your apps).

## Cara Menjalankan Development Server

```bash
npm run dev
```

## Setup Firebase Admin (Tools)

Untuk mengatur pengguna menjadi Admin (agar dapat mengkonfigurasi threshold dan aktuator):
1. Masuk ke Firebase Console > Project Settings > Service Accounts.
2. Generate new private key, lalu simpan file JSON tersebut dengan nama `service-account.json` ke dalam folder `tools/`.
3. Jalankan script CLI untuk memberikan akses Admin ke suatu UID:
   ```bash
   node tools/set-admin.js <UID_PENGGUNA>
   ```

## Deploy Cloud Functions

Cloud Function digunakan untuk mengirim notifikasi push (FCM) secara otomatis saat proses pirolisis baru (batch) dimulai.
Untuk men-deploy:
```bash
cd functions
npm install
npm run deploy
```
