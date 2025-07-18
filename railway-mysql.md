# Railway MySQL Deployment Guide

## 🗄️ Database Import & Migration - OTOMATIS!

**TIDAK PERLU IMPORT MANUAL!**
Database akan dibuat otomatis saat deployment dengan:

- ✅ **Auto Migration**: Semua tabel akan dibuat otomatis dari migration files
- ✅ **Auto Seeding**: User admin akan dibuat otomatis
- ✅ **Production Ready**: Siap pakai tanpa setup manual

## Langkah-langkah Deploy dengan MySQL:

### 1. Di Railway Dashboard:

1. **Buat MySQL Database Service:**
   - Klik "New" → "Database" → "Add MySQL"
   - Railway akan generate MySQL instance otomatis

2. **Connect ke GitHub Repo:**
   - Klik "New" → "Deploy from GitHub repo"
   - Pilih repository: `ArielWebDev/berkas-app-01`

### 2. Environment Variables yang Diperlukan:

```bash
# App Settings
APP_NAME=Berkas App
APP_ENV=production
APP_KEY=base64:YourGeneratedKeyHere
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app

# Database (Railway akan auto-generate ini dari MySQL service)
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# File Storage
FILESYSTEM_DISK=public
```

### 3. Setelah Deploy:

1. Generate APP_KEY:

   ```bash
   php artisan key:generate --show
   ```

2. Run Migrations:

   ```bash
   php artisan migrate --force
   ```

3. Seed Data (optional):
   ```bash
   php artisan db:seed --force
   ```

### 4. Database Variables Reference:

Railway akan otomatis menyediakan variables ini dari MySQL service:

- `${{MySQL.MYSQL_HOST}}`
- `${{MySQL.MYSQL_PORT}}`
- `${{MySQL.MYSQL_DATABASE}}`
- `${{MySQL.MYSQL_USER}}`
- `${{MySQL.MYSQL_PASSWORD}}`

Gunakan reference ini di environment variables aplikasi Laravel Anda.
