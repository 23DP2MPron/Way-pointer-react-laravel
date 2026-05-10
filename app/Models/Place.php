<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'country',
        'latitude',
        'longitude',
        'category',
        'image_url',
        'rating',
        'user_id'
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'rating' => 'float'
    ];

    // Связь с пользователем
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Связь с маршрутами
    public function routes()
    {
        return $this->belongsToMany(Route::class, 'route_places')
                    ->withPivot('order', 'notes')
                    ->orderBy('order');
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
