<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Настройка маппинга для полиморфных связей
        Relation::enforceMorphMap([
            'place' => 'App\Models\Place',
            'institution' => 'App\Models\Institution',
            'route' => 'App\Models\Route',
            'user' => 'App\Models\User',
        ]);
    }
}
