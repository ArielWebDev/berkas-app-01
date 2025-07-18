# Railway Debug Commands

Jika ada error 500, jalankan perintah ini di Railway console untuk debugging:

## 1. Cek Environment Variables
```bash
env | grep -E "APP_|DB_"
```

## 2. Cek Database Connection
```bash
php artisan tinker
# Di dalam tinker:
DB::connection()->getPdo();
exit
```

## 3. Generate APP_KEY (WAJIB!)
```bash
php artisan key:generate --force
```

## 4. Clear dan Rebuild Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

## 5. Run Migrations
```bash
php artisan migrate --force
```

## 6. Create Admin User
```bash
php artisan db:seed --force --class=UserSeeder
```

## 7. Check Logs untuk Error Detail
```bash
tail -f storage/logs/laravel.log
```

## 8. Test Database Connection
```bash
php artisan migrate:status
```

## Environment Variables yang HARUS diset di Railway:

```bash
# WAJIB - App Configuration
APP_KEY=base64:YourGeneratedKeyFromStep3
APP_ENV=production
APP_DEBUG=true (untuk debugging, ubah ke false setelah fix)

# WAJIB - Database (dari MySQL service Railway)
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# Optional - Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

## Troubleshooting Error 500:

1. **APP_KEY tidak ada** - Jalankan step 3
2. **Database connection gagal** - Cek environment variables MySQL
3. **Migration belum jalan** - Jalankan step 5 & 6
4. **Permission error** - Railway otomatis handle ini
5. **Cache corruption** - Jalankan step 4
