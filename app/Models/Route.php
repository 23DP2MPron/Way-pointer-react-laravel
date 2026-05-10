<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'city',
        'country',
        'is_published',
        'duration_days',
        'difficulty_level',
        'total_distance'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'duration_days' => 'integer',
        'total_distance' => 'float'
    ];

    // Связь с пользователем
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Связь с местами в маршруте
    public function places()
    {
        return $this->belongsToMany(Place::class, 'route_places')
                    ->withPivot('order', 'notes')
                    ->orderBy('order');
    }

    // Связь с точками маршрута
    public function points()
    {
        return $this->hasMany(RoutePoint::class)->orderBy('order_index');
    }

    // Связь с отзывами
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    // Связь с избранным
    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'target');
    }
}
