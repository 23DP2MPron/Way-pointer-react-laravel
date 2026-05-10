<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
    $query = Place::query();

    // 1. ЛОГИКА ДЛЯ ГЛАВНОЙ (Случайные 6 мест)
    if ($request->has('random')) {
        return response()->json([
            'data' => $query->inRandomOrder()->limit(6)->get()
        ]);
    }

    // 2. СТАНДАРТНЫЕ ФИЛЬТРЫ (Оставляем как было)
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('city', 'like', "%{$search}%")
              ->orWhere('country', 'like', "%{$search}%");
        });
    }

    if ($request->filled('type'))    $query->where('type', $request->type);
    if ($request->filled('country')) $query->where('country', $request->country);
    if ($request->filled('city'))    $query->where('city', $request->city);

    // 3. СОРТИРОВКА И ПАГИНАЦИЯ (Для страниц Places и Institutions)
    // Если параметров сортировки нет, по умолчанию ставим рейтинг (для ТОП-20)
    $sortBy  = in_array($request->sort_by, ['rating', 'name', 'created_at']) ? $request->sort_by : 'rating';
    $sortDir = $request->sort_dir === 'asc' ? 'asc' : 'desc';
    
    $query->orderBy($sortBy, $sortDir);

    // По умолчанию на страницах разделов теперь будет 20 элементов (как ты и просил)
    return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function show(Place $place): JsonResponse
    {
        $place->load(['reviews.user']);
        return response()->json($place);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['required', 'string'],
            'city'        => ['required', 'string'],
            'country'     => ['required', 'string'],
            'location'    => ['nullable', 'string'],
            'latitude'    => ['nullable', 'numeric'],
            'longitude'   => ['nullable', 'numeric'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('places', 'public');
        }

        return response()->json(Place::create($data), 201);
    }

    public function update(Request $request, Place $place): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['sometimes', 'string'],
            'city'        => ['sometimes', 'string'],
            'country'     => ['sometimes', 'string'],
            'location'    => ['nullable', 'string'],
            'latitude'    => ['nullable', 'numeric'],
            'longitude'   => ['nullable', 'numeric'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('places', 'public');
        }

        $place->update($data);
        return response()->json($place);
    }

    public function destroy(Place $place): JsonResponse
    {
        $place->delete();
        return response()->json(['message' => 'Place deleted']);
    }

    public function getRandomPlaces() {
    return Place::inRandomOrder()->limit(6)->get();
}

    // Для разделов: 20 лучших (по рейтингу)
    public function getTopPlaces(Request $request) {
        // Можно фильтровать по типу, если places и institutions в одной таблице
        $query = Place::query();
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return $query->orderBy('rating', 'desc')->limit(20)->get();
    }
}
