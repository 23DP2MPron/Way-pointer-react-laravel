<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoutePoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id',
        'target_type',
        'target_id',
        'order_index',
        'notes'
    ];

    protected $casts = [
        'order_index' => 'integer'
    ];

    // Связь с маршрутом
    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    // Полиморфная связь с целью (Place или Institution)
    public function target()
    {
        return $this->morphTo();
    }

    // Получить детали цели
    public function getTargetDetailAttribute()
    {
        return $this->target;
    }
}
