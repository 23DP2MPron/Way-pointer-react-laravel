<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
    Schema::create('places', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->enum('type', ['park', 'museum', 'landmark', 'nature']);
        $table->string('image')->nullable();
        $table->string('city');
        $table->string('country');
        $table->decimal('rating', 3, 2)->default(0);
        $table->timestamps();
    });

    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->morphs('reviewable'); // target_type & target_id
        $table->integer('rating');
        $table->text('comment');
        $table->timestamps();
    });

    Schema::create('routes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->boolean('is_published')->default(false);
        $table->timestamps();
    });
    }

    public function down()
    {
        Schema::dropIfExists('routes');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('places');
    }
};