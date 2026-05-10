<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'target_type',
        'target_id'
    ];

    // Полиморфная связь с целью (Place или Route)
    public function target()
    {
        return $this->morphTo();
    }

    // Связь с пользователем
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Получить детали цели
    public function getTargetDetailAttribute()
    {
        return $this->target;
    }
}
