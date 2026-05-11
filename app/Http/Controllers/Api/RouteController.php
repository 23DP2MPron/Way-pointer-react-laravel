<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\RoutePoint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Route::with('user')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if (!auth()->check() || auth()->user()->role !== 'admin') {
            // Guests and regular users see only published or their own
            if (auth()->check()) {
                $query->where(function($q) {
                    $q->where('is_published', true)
                      ->orWhere('user_id', auth()->id());
                });
            } else {
                $query->where('is_published', true);
            }
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Исправленная сортировка: сначала по рейтингу, потом самые новые
        $query->orderByDesc('created_at');

        // Берем per_page из запроса (на главной это 3, в поиске 12)
        $perPage = $request->get('per_page', 12);

        return response()->json($query->paginate($perPage));
    }

    public function myRoutes(Request $request): JsonResponse
    {
        $routes = Route::with(['points.target'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(12);

        return response()->json($routes);
    }

    public function show(Route $route): JsonResponse
    {
        if (!$route->is_published && auth()->id() !== $route->user_id && auth()->user()?->role !== 'admin') {
            abort(403);
        }

        // Загружаем связи, включая полиморфную связь target для точек
        $route->load(['user', 'points.target', 'reviews.user']);

        return response()->json($route);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
        'title'         => ['required', 'string', 'max:255'],
        'description'   => ['nullable', 'string'],
        'country'       => ['nullable', 'string'],
        'city'          => ['nullable', 'string'],
        'duration_days' => ['nullable', 'integer', 'min:1'],
        'is_published'  => ['boolean'],
        'points'        => ['nullable', 'array'],
        'points.*.target_type' => ['required_with:points.*', 'in:place,institution'],
        'points.*.target_id'   => ['required_with:points.*', 'integer'],
        'points.*.notes'       => ['nullable', 'string'],
    ]);

    $data['user_id'] = $request->user()->id;

    if ($request->hasFile('cover_image')) {
        $data['cover_image'] = $request->file('cover_image')->store('routes', 'public');
    }

    // Извлекаем точки перед созданием маршрута
    $pointsData = $data['points'] ?? [];
    unset($data['points']);
    
    // Создаем маршрут
    $route = Route::create($data);

    // Сохраняем точки маршрута
    if (!empty($pointsData)) {
        foreach ($pointsData as $index => $point) {
            $route->points()->create([
                'target_type' => $point['target_type'],
                'target_id'   => (int)$point['target_id'],
                'order_index' => $index,
                'notes'       => $point['notes'] ?? null,
            ]);
        }
    }

    return response()->json($route->load('points.target'), 201);
    }
    public function update(Request $request, Route $route): JsonResponse
    {
        if ($request->user()->id !== $route->user_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'title'         => ['sometimes', 'string', 'max:255'],
            'description'   => ['nullable', 'string'],
            'country'       => ['nullable', 'string'],
            'city'          => ['nullable', 'string'],
            'duration_days' => ['nullable', 'integer'],
            'is_published'  => ['boolean'],
            'points'        => ['nullable', 'array'],
            'points.*.target_type' => ['required_with:points', 'in:place,institution'],
            'points.*.target_id'   => ['required_with:points', 'integer'],
            'points.*.notes'       => ['nullable', 'string'],
        ]);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('routes', 'public');
        }

        $points = $data['points'] ?? null;
        unset($data['points']);

        $route->update($data);

        if ($points !== null) {
            $route->points()->delete();
            foreach ($points as $index => $point) {
                $route->points()->create([
                    'target_type' => $point['target_type'],
                    'target_id'   => $point['target_id'],
                    'order_index' => $index,
                    'notes'       => $point['notes'] ?? null,
                ]);
            }
        }

        return response()->json($route->load('points.target'));
    }

    public function destroy(Request $request, Route $route): JsonResponse
    {
        if ($request->user()->id !== $route->user_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $route->delete();
        return response()->json(['message' => 'Route deleted']);
    }

    // Добавить отзыв к маршруту
    public function addReview(Request $request, Route $route): JsonResponse
    {
        // Проверяем, что маршрут опубликован
        if (!$route->is_published) {
            abort(403, 'Cannot review unpublished route');
        }

        // Проверяем, что пользователь не оставляет отзыв на свой маршрут
        if ($request->user()->id === $route->user_id) {
            abort(403, 'Cannot review your own route');
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        // Проверяем, не оставлял ли пользователь уже отзыв
        $existingReview = $route->reviews()
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            // Обновляем существующий отзыв
            $existingReview->update($data);
            return response()->json($existingReview->load('user'));
        }

        // Создаем новый отзыв
        $review = $route->reviews()->create([
            'user_id' => $request->user()->id,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
        ]);

        return response()->json($review->load('user'), 201);
    }

    // Получить отзывы маршрута
    public function getReviews(Route $route): JsonResponse
    {
        if (!$route->is_published && auth()->id() !== $route->user_id && auth()->user()?->role !== 'admin') {
            abort(403);
        }

        $reviews = $route->reviews()
            ->with('user')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }
}