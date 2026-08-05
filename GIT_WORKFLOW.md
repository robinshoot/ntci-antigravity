# 🚀 Panduan Workflow Git & Deployment Update Google Cloud VPS

Dokumen ini berisi panduan praktis untuk melakukan **Upload (Push)** perubahan kode dari laptop ke GitHub, serta melakukan **Update (Pull)** di server **Google Cloud VPS**.

---

## 💻 Bagian 1: Upload Perubahan dari Laptop ke GitHub

Jalankan perintah ini di **Terminal / PowerShell VS Code** di laptop Anda:

```powershell
# 1. Simpan semua perubahan file terbaru
git add .

# 2. Buat catatan perubahan (commit)
git commit -m "Deskripsi singkat perubahan Anda"

# 3. Kirim kode ke repository GitHub
git push origin main
```

---

## ☁️ Bagian 2: Update Server Google Cloud VPS

Jalankan perintah ini di **Terminal SSH Google Cloud VPS**:

```bash
# 1. Masuk ke direktori project di VPS
cd ~/ntci-antigravity

# 2. Tarik kode terbaru dari GitHub
git pull origin main

# 3. Install paket (jika ada dependensi npm baru)
npm install

# 4. Generate Prisma & Build ulang Next.js
npx prisma generate
npm run build

# 5. Restart aplikasi PM2 agar perubahan langsung aktif
pm2 restart ntci-app
```

---

## ⚡ Perintah Cepat (One-Liner Shortcut)

### Di Server VPS (Cukup Copy-Paste Perintah Ini):
```bash
cd ~/ntci-antigravity && git pull origin main && npm run build && pm2 restart ntci-app
```

---

## 🛠️ Perintah Monitoring & Maintenance VPS

| Kebutuhan | Perintah Terminal VPS |
| :--- | :--- |
| **Cek Status Aplikasi** | `pm2 status` |
| **Melihat Log Server Live** | `pm2 logs ntci-app` |
| **Melihat Penggunaan CPU/RAM** | `pm2 monit` |
| **Restart Aplikasi** | `pm2 restart ntci-app` |
| **Stop Aplikasi** | `pm2 stop ntci-app` |

---

## 🌐 Informasi IP & Akses Server

- **IP Public VPS**: `34.123.228.220`
- **Akses Langsung HTTP**: `http://34.123.228.220:3000`
- **Akses Cloudflare Tunnel (HTTPS Kamera Ready)**: Gunakan perintah `npx cloudflared tunnel --url http://localhost:3000` di VPS.
