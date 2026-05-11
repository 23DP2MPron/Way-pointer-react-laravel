Write-Host "🚀 Deploying route points fix to Railway..." -ForegroundColor Green

# Коммитим изменения
git add .
git commit -m "Fix: Route points not saving - fixed validation and data loading"

# Пушим на Railway
git push origin main

Write-Host ""
Write-Host "✅ Code pushed to repository" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps on Railway:" -ForegroundColor Yellow
Write-Host "1. Wait for deployment to complete"
Write-Host "2. Run migrations: php artisan migrate"
Write-Host "3. Clear cache: php artisan config:clear && php artisan cache:clear"
Write-Host "4. Check table structure: php artisan check:route-points"
Write-Host "5. Test creating a route with points"
Write-Host "6. Check debug endpoint: /api/debug/route-points/ROUTE_ID"
Write-Host ""
Write-Host "📝 Check logs at: storage/logs/laravel.log" -ForegroundColor Cyan
