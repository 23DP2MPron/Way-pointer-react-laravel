#!/bin/bash

echo "🚀 Deploying route points fix to Railway..."

# Коммитим изменения
git add .
git commit -m "Fix: Route points not saving - fixed validation and data loading"

# Пушим на Railway (предполагается, что Railway подключен к git)
git push origin main

echo "✅ Code pushed to repository"
echo ""
echo "📋 Next steps on Railway:"
echo "1. Wait for deployment to complete"
echo "2. Run migrations: php artisan migrate"
echo "3. Clear cache: php artisan config:clear && php artisan cache:clear"
echo "4. Check table structure: php artisan check:route-points"
echo "5. Test creating a route with points"
echo "6. Check debug endpoint: /api/debug/route-points/ROUTE_ID"
echo ""
echo "📝 Check logs at: storage/logs/laravel.log"
