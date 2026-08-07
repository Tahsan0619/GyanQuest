# GyanQuest API (Laravel) + Filament admin

## Setup

```bash
cd backend
cp .env.example .env
# set DB_* (MySQL) or switch to sqlite
# set ADMIN_EMAIL / ADMIN_PASSWORD

php ../composer.phar install   # if vendor missing
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

- API: `http://127.0.0.1:8000/api`
- Admin: `http://127.0.0.1:8000/admin` (admin user from seeder)

Default seeded admin (change immediately):

- email: `admin@gyanquest.local`
- password: `ChangeMeNow!123`

## Frontend

Keep `py -3 tools/groq_proxy.py` on port 5500. Use **Log in** on the landing page.
Token is stored in `sessionStorage` only. Without login, games stay fully offline.

## Auth flow

1. Student registers → `status=pending`
2. Admin approves in Filament → Pending Approvals
3. Student logs in → Sanctum token
4. Progress syncs via `POST /api/progress/sync` after each local save
